let showNotification = true;
let config = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園品牌商店水滴', subtitle, message, {
    'url': 'shopeetw://'
  });
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
      return reject(['檢查失敗 ‼️', '找不到 token']);
    }

    const shopeeFarmInfo = getSaveObject('ShopeeFarmInfo');
    if (isEmptyObject(shopeeFarmInfo)) {
      return reject(['檢查失敗 ‼️', '沒有蝦蝦果園資料']);
    }

    const shopeeHeaders = {
      'Cookie': cookieToString(shopeeInfo.token),
      'Content-Type': 'application/json',
    }
    config = {
      shopeeInfo: shopeeInfo,
      shopeeFarmInfo: shopeeFarmInfo,
      shopeeHeaders: shopeeHeaders,
    }
    return resolve();
  });
}

function getActivityId(url) {
  let activityId = '';
  const re = url.includes('taskId=') ? /taskId=(.*)&/i : /taskId%3D(.*)%26/i;
  const found = url.match(re);
  activityId = found[1];
  return activityId;
}

async function getBrandList() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://games.shopee.tw/farm/api/brands_ads/task/list',
        headers: config.shopeeHeaders,
      };

      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['取得品牌商店列表失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.code === 0) {
              let brandStores = [];
              const tasks = obj.data.userTasks.concat(obj.data.shopAdsTask);
              for (const store of tasks) {
                if (store.taskFinishStatus < 3) {
                  const storeInfo = store.taskInfo
                  const storeUserName = store.rcmd_shop_info ? store.rcmd_shop_info.shop_user_name : storeInfo.taskName;
                  const moduleId = store.taskInfo.moduleId.toString();
                  const taskId = getActivityId(storeInfo.ctaUrl);
                  brandStores.push({
                    'shop_id': store.shopAdsRcmdShopInfo ? store.shopAdsRcmdShopInfo.rcmdShopInfo.shopId : 0,
                    'storeName': storeInfo.taskName,
                    'task_id': taskId,
                    'module_id': moduleId,
                    'brandName': storeUserName,
                    'waterValue': storeInfo.prizeValue,
                  });
                }
              }
              if (!brandStores.length) {
                return reject(['取得品牌商店列表失敗 ‼️', '今天沒有品牌商店水滴活動']);
              } else {
                return resolve(brandStores);
              }
            } else {
              return reject(['取得品牌商店列表失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['取得品牌商店列表失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['取得品牌商店列表失敗 ‼️', error]);
    }
  });
}

async function toBrandWater() {
  const brandStores = await getBrandList();

  let totalClaimedWater = 0;
  if (brandStores.length > 0) {
    for (const store of brandStores) {
      const token = await getBrandToken(store);
      await delay(parseInt(config.brandDelay) + 0.1);
      let new_store = await componentReport(store, token);
      await delay(1);
      await claim(new_store);
      totalClaimedWater += parseInt(store.waterValue);
    }
    let new_water = await toBrandWater();
    return totalClaimedWater + new_water;
  } else {
    return 0;
  }
}

async function getBrandToken(store) {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: `https://games.shopee.tw/gameplatform/api/v3/task/browse/${store.task_id}?module_id=${store.module_id}`,
        headers: config.shopeeHeaders,
      };

      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject([`取得 ${store.brandName} token 失敗 ‼️`, '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.code === 0) {
              console.log(`ℹ️ 取得 ${store.brandName} token 成功`);
              const assetsConfig = JSON.parse(obj.data.user_task.task.assets_config);
              config.brandDelay = assetsConfig.completion_time;
              return resolve(obj.data.report_token);
            } else {
              return reject([`取得 ${store.brandName} token 失敗 ‼️`, `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject([`取得 ${store.brandName} token 失敗 ‼️`, response.status]);
          }
        }
      });
    } catch (error) {
      return reject([`取得 ${store.brandName} token 失敗 ‼️`, error]);
    }
  });
}

async function claim(store) {
  return new Promise((resolve, reject) => {
    try {
      const requestId = `__game_platform_task__${store.shop_id}_${config.shopeeInfo.token.SPC_U}_${Math.floor(new Date().getTime())}`;
      const claimPayload = {
        'task_id': store.task_id,
        'request_id': requestId,
        'module_id': store.module_id,
      };
      const request = {
        url: 'https://games.shopee.tw/farm/api/brands_ads/task/claim',
        headers: config.shopeeHeaders,
        body: JSON.stringify(claimPayload),
      };
      $httpClient.post(request, function (error, response, data) {
        if (error) {
          return reject([`取得品牌商店 ${store.brandName} 水滴失敗 ‼️`, '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.code === 0) {
              console.log(`ℹ️ 取得品牌商店 ${store.brandName} 水滴成功`);
              return resolve();
            } else if (obj.code === 409004) {
              return reject([`取得品牌商店 ${store.brandName} 水滴失敗 ‼️`, '作物狀態錯誤，請檢查是否已收成']);
            } else if (obj.code === 420101) {
              console.log(`❌ 取得品牌商店 ${store.brandName} 水滴失敗 ‼️ 今天已領過`);
              return resolve();
            } else {
              return reject([`取得 ${store.brandName} 水滴失敗 ‼️`, `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject([`取得品牌商店 ${store.brandName} 活動 ID 失敗 ‼️`, response.status]);
          }
        }
      });
    } catch (error) {
      return reject([`取得品牌商店 ${store.brandName} 活動 ID 失敗 ‼️`, error]);
    }
  });
}

async function componentReport(store, token) {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://games.shopee.tw/gameplatform/api/v3/task/component/report',
        headers: config.shopeeHeaders,
        body: JSON.stringify({
          'report_token': token,
        })
      };
      $httpClient.post(request, function (error, response, data) {
        if (error) {
          return reject([`取得品牌商店 ${store.brandName} 水滴失敗 ‼️`, '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.code === 150004) {
              return reject([`取得品牌商店 ${store.brandName} 水滴失敗 ‼️`, '無法解密 token']);
            }
            store.shop_id = store.shop_id !== 0 ? store.shop_id : obj.data.user_task.rcmd_shop_info ? obj.data.user_task.rcmd_shop_info.shop_id : 0;
            store.task_id = obj.data.user_task.task.id;
            store.module_id = obj.data.user_task.task.module_id;
            return resolve(store);
          } else {
            return reject([`取得品牌商店 ${store.brandName} 活動 ID 失敗 ‼️`, response.statusCode]);
          }
        }
      });
    } catch (error) {
      return reject([`取得品牌商店 ${store.brandName} 活動 ID 失敗 ‼️`, error]);
    }
  });
}

async function delay(seconds) {
  console.log(`⏰ 等待 ${seconds} 秒`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園自動澆水 v20230501.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');

    let totalClaimedWater = await toBrandWater();
    if (totalClaimedWater > 0) {
      surgeNotify(
        '領取成功 ✅',
        `本次共領取了 ${totalClaimedWater} 滴水 💧`
      );
    } else {
      handleError(['取得品牌商店列表失敗 ‼️', '今天沒有品牌商店水滴活動'])
    }
  } catch (error) {
    handleError(error);
  }
  $done();
})();
