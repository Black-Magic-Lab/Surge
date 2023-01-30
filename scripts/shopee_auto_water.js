let showNotification = true;
let config = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園自動澆水', subtitle, message, { 'url': 'shopeetw://' });
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

async function preCheck() {
  return new Promise((resolve, reject) => {
    const shopeeInfo = getSaveObject('ShopeeInfo');
    if (isEmptyObject(shopeeInfo)) {
      return reject(['檢查失敗 ‼️', '沒有新版 token']);
    }
    const shopeeHeaders = {
      'Cookie': cookieToString(shopeeInfo.token),
      'Content-Type': 'application/json',
    }
    config = {
      shopeeInfo: shopeeInfo,
      shopeeHeaders: shopeeHeaders,
    }
    return resolve();
  });
}

async function water() {
  return new Promise((resolve, reject) => {
    try {
      const waterRequest = {
        url: 'https://games.shopee.tw/farm/api/orchard/crop/water?t=' + new Date().getTime(),
        headers: config.shopeeHeaders,
        body: $persistentStore.read('ShopeeCrop'),
      };

      $httpClient.post(waterRequest, function (error, response, data) {
        if (error) {
          return reject(['澆水失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.code === 0) {
              const useNumber = obj.data.useNumber;
              const state = obj.data.crop.state;
              const exp = obj.data.crop.exp;
              const levelExp = obj.data.crop.meta.config.levelConfig[state.toString()].exp;
              const remain = levelExp - exp;
              return resolve({
                state: state,
                useNumber: useNumber,
                remain: remain,
              });
            } else if (obj.code === 409000) {
              showNotification = false;
              return reject(['澆水失敗 ‼️', '水壺目前沒水']);
            } else if (obj.code === 403005) {
              return reject(['澆水失敗 ‼️', '作物狀態錯誤，請先手動澆水一次']);
            } else if (obj.code === 409004) {
              return reject(['澆水失敗 ‼️', '作物狀態錯誤，請檢查是否已收成']);
              // 出錯三次之後才跳警告
              // const cropState = parseInt($persistentStore.read('ShopeeCropState'));
              // if (cropState < 3) {
              //   $persistentStore.write((cropState + 1).toString(), 'ShopeeCropState');
              //   surgeNotify(
              //     '澆水失敗 ‼️',
              //     '作物狀態錯誤，請檢查是否已收成'
              //   );
              // }
            } else {
              return reject(['澆水失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['澆水失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['澆水失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園自動澆水 v20230115.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    const result = await water();
    console.log('✅ 澆水成功');

    if (result.state === 3) {
      console.log(`本次澆了： ${result.useNumber} 滴水 💧，剩餘 ${result.remain} 滴水收成`);
    } else {
      console.log(`本次澆了： ${result.useNumber} 滴水 💧，剩餘 ${result.remain} 滴水成長至下一階段`);
    }

    if (result.remain === 0) {
      surgeNotify(
        '澆水成功 ✅',
        '種植完畢，作物可以收成啦 🌳'
      );
    }
  } catch (error) {
    handleError(error);
  }
  $done();
})();
