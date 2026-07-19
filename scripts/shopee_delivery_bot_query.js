const apiKey = $persistentStore.read('TaiwanDeliveryBotApiKey');

let showNotification = true;
let config = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('📦 蝦皮包裹自動登記', subtitle, message);
};

function handleError(error) {
  if (Array.isArray(error)) {
    console.log(`❌ ${error[0]} ${error[1]}`);
    if (showNotification) {
      surgeNotify(error[0], error[1]);
    }
  } else {
    console.log(`❌ ${error}`);
    if (showNotification) {
      surgeNotify(error);
    }
  }
}

function getSaveObject(key) {
  const string = $persistentStore.read(key);
  return !string || string.length === 0 ? {} : JSON.parse(string);
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false;
}

function cookieToString(cookieObject) {
  let string = '';
  for (const [key, value] of Object.entries(cookieObject)) {
    string += `${key}=${value};`
  }
  return string;
}

function isSurge() {
  return 'undefined' !== typeof $environment && $environment['surge-version'];
}

async function isModuleStateMatches(name, enabled) {
  return new Promise((resolve) => {
    $httpAPI('GET', 'v1/modules', null, (data) => {
      const enabledList = data.enabled;
      return enabled ? resolve(enabledList.includes(name)) : resolve(!enabledList.includes(name));
    });
  });
}

async function preCheck() {
  return new Promise((resolve, reject) => {
    const shopeeInfo = getSaveObject('ShopeeInfo');
    if (isEmptyObject(shopeeInfo)) {
      return reject(['檢查失敗 ‼️', '找不到 token']);
    }

    const shopeeHeaders = {
      'Cookie': cookieToString(shopeeInfo.token),
      'Content-Type': 'application/json',
    };

    config = {
      shopeeInfo: shopeeInfo,
      shopeeHeaders: shopeeHeaders
    }
    return resolve();
  });
}

async function fetchParcelList() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://mall.shopee.tw/api/v4/order/get_order_list?limit=10&list_type=8&offset=0',
        headers: config.shopeeHeaders
      }
      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['取得包裹列表失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.error === 0) {
              if (!obj.data?.details_list || obj.data.details_list.length === 0) {
                return resolve(null);
              }
              let orders = [];
              obj.data.details_list.forEach((element) => {
                const name = element.info_card?.order_list_cards[0]?.product_info?.item_groups[0]?.items[0]?.name;
                // console.log(`🔍 找到訂單「${name}」，ID：${element.info_card.order_id}`);
                orders.push({
                  name: name,
                  orderId: element.info_card.order_id
                });
              });
              return resolve(orders);
            } else if (obj.error === 19) {
              return reject(['取得包裹列表失敗 ‼️', `請重新取得蝦皮 token`]);
            } else {
              return reject(['取得包裹列表失敗 ‼️', `錯誤代號：${obj.error}`]);
            }
          } else {
            surgeNotify(
              'Cookie 已過期 ‼️',
              '請重新登入'
            );
          }
        }
      });
    } catch (error) {
      return reject(['取得包裹列表失敗 ‼️', error]);
    }
  });
}

async function getParcelDeliveryInfo(order) {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: `https://mall.shopee.tw/api/v4/order/buyer/get_logistics_info?order_id=${order.orderId}`,
        headers: config.shopeeHeaders
      }
      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['取得包裹資訊失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.error === 0) {
              let serviceName = '';
              const carrierName = obj.data.carrier_name;
              if (carrierName.includes('蝦皮店到店')) {
                serviceName = 'Shopeetw';
              } else if (carrierName.includes('7-11') || carrierName.includes('7-ELEVEN')) {
                serviceName = 'SevenEleven';
              } else if (carrierName.includes('全家')) {
                serviceName = 'FamiMart';
              } else if (carrierName.includes('萊爾富')) {
                serviceName = 'HiLife';
              } else if (carrierName.includes('OK')) {
                serviceName = 'Okmart';
              } else if (carrierName.includes('郵局') || carrierName.includes('郵政')) {
                serviceName = 'Ipost';
              } else if (carrierName.includes('宅配通')) {
                serviceName = 'Ecan';
              } else {
                console.log(`❌ 未知的物流公司：${carrierName}`);
              }

              return resolve({
                track_id: obj.data.tracking_number,
                service: serviceName,
                note: order.name
              });
            } else {
              return reject(['取得包裹資訊失敗 ‼️', `錯誤代號：${obj.error}`]);
            }
          } else {
            surgeNotify(
              'Cookie 已過期 ‼️',
              '請重新登入'
            );
          }
        }
      });
    } catch (error) {
      return reject(['取得包裹資訊失敗 ‼️', error]);
    }
  });
}

async function addToDeliveryBot(deliveryInfo) {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: `https://logistics.sudo.host/packages/query`,
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'user-agent': 'El Psy Kongroo',
        },
        body: JSON.stringify(deliveryInfo)
      }
      $httpClient.post(request, function (error, response, data) {
        if (error) {
          return reject(['包裹資料上傳失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 201) {
            console.log(`✅ 包裹「${deliveryInfo.note}」資料上傳成功`);
          } else {
            const obj = JSON.parse(data);
            if (obj.detail) {
              console.log(`❌ 包裹「${deliveryInfo.note}」資料上傳失敗。錯誤訊息：${obj.detail}`);
            } else {
              console.log(`❌ 包裹「${deliveryInfo.note}」資料上傳失敗。錯誤代號：${response.status}`);
            }
          }
          return resolve();
        }
      });
    } catch (error) {
      return reject(['包裹資料上傳失敗 ‼️', error]);
    }
  });
}


(async () => {
  console.log('ℹ️ 蝦皮包裹自動登記 v20230808.2');
  try {
    if (isSurge()) {
      const shopeeModuleEnabled = await isModuleStateMatches('蝦皮每日自動簽到', true);
      if (!shopeeModuleEnabled) {
        throw new Error('「蝦皮每日自動簽到」模組未啟用');
      }
    }
    await preCheck();
    console.log('✅ 檢查成功');
    const orders = await fetchParcelList();
    if (orders) {
      for (const order of orders) {
        const deliveryInfo = await getParcelDeliveryInfo(order);
        await addToDeliveryBot(deliveryInfo);
      }
      console.log('✅ 所有包裹資料已上傳完成')
      // surgeNotify(
      //   '所有包裹資料已上傳完成 ✅',
      //   ''
      // );
    } else {
      console.log('ℹ️ 目前沒有運送中的包裹');
    }
  } catch (error) {
    handleError(error);
  }
  $done();
})();
