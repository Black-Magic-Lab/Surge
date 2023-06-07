let showNotification = true;
let config = null;
let createCropRequest = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園自動種植', subtitle, message, { 'url': 'shopeetw://' });
}

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

async function delay(seconds) {
  console.log(`⏰ 等待 ${seconds} 秒...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

async function preCheck() {
  return new Promise((resolve, reject) => {
    const shopeeInfo = getSaveObject('ShopeeInfo');
    if (isEmptyObject(shopeeInfo)) {
      return reject(['檢查失敗 ‼️', '找不到 token']);
    }

    const shopeeFarmInfo = getSaveObject('ShopeeFarmInfo');
    if (isEmptyObject(shopeeFarmInfo)) {
      return reject(['檢查失敗 ‼️', '找不到蝦蝦果園資料']);
    }

    const shopeeHeaders = {
      'Cookie': cookieToString(shopeeInfo.token),
      'Content-Type': 'application/json',
    }

    const autoCropSeedName = $persistentStore.read('ShopeeAutoCropSeedName') || '';

    if (!shopeeFarmInfo.currentCrop || !shopeeFarmInfo.currentCrop.s || shopeeFarmInfo.currentCrop.s.length < 64) {
      return reject(['檢查失敗 ‼️', '請先種植任意種子以取得 token']);
    }
    if (!autoCropSeedName || !autoCropSeedName.length) {
      return reject(['檢查失敗 ‼️', '沒有指定作物名稱']);
    }

    config = {
      shopeeInfo: shopeeInfo,
      shopeeFarmInfo: shopeeFarmInfo,
      shopeeHeaders: shopeeHeaders,
      autoCropSeedNames: autoCropSeedName.split(','),
    }
    return resolve();
  });
}

async function getSeedList() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: `https://games.shopee.tw/farm/api/orchard/crop/meta/get?t=${new Date().getTime()}`,
        headers: config.shopeeHeaders,
      };
      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['取得種子列表失敗 ‼️', '請重新登入']);
        }
        else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.msg === 'success') {
              const cropMetas = obj.data.cropMetas;
              let found = false;
              let haveSeed = true;
              for (const cropName of config.autoCropSeedNames) {
                for (const crop of cropMetas) {
                  // console.log(`🔍 找到「${crop.name}」種子`);
                  if (crop.name.includes(cropName)) {
                    if (crop.config.startTime < new Date().getTime() && crop.config.endTime > new Date().getTime()) {
                      found = true;
                      if (crop.totalNum <= crop.curNum) {
                        haveSeed = false;
                        console.log(`❌「${crop.name}」已經被搶購一空！`);
                      }
                      else {
                        createCropRequest = {
                          url: `https://games.shopee.tw/farm/api/orchard/crop/create?t=${new Date().getTime()}`,
                          headers: config.shopeeHeaders,
                          body: {
                            metaId: crop.id,
                            s: config.shopeeFarmInfo.currentCrop.s,
                          }
                        }
                        return resolve(crop.name);
                      }
                    }
                  }
                }
              }
              if (found === false) {
                return reject(['取得種子失敗 ‼️', `今天沒有${config.autoCropSeedNames.join('或')}的種子`]);
              }
              if (haveSeed === false) {
                return reject(['取得種子失敗 ‼️', `今天的${config.autoCropSeedNames.join('和')}種子已經被搶購一空！`]);
              }
            } else {
              return reject(['取得種子列表失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['取得種子列表失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['取得種子列表失敗 ‼️', error]);
    }
  });
}

async function createCrop() {
  return new Promise((resolve, reject) => {
    try {
      $httpClient.post(createCropRequest, function (error, response, data) {
        if (error) {
          return reject(['自動種植失敗 ‼️', '連線錯誤']);
        }
        else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.msg === 'success') {
              const cropId = obj.data.crop.id;
              let shopeeFarmInfo = getSaveObject('ShopeeFarmInfo');
              shopeeFarmInfo.currentCrop.cropId = cropId;
              const save = $persistentStore.write(JSON.stringify(shopeeFarmInfo, null, 4), 'ShopeeFarmInfo');
              if (!save) {
                return reject(['保存失敗 ‼️', '無法儲存作物資料']);
              }
              return resolve();
            } else if (obj.code === 409003) {
              return reject(['自動種植失敗 ‼️', `目前有正在種的作物「${obj.data.crop.meta.name}」`]);
            } else if (obj.code === 409009) {
              return reject(['自動種植失敗 ‼️', `尚未開放種植「${obj.data.crop.meta.name}」`]);
            } else {
              return reject(['自動種植失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['自動種植失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['自動種植失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園自動種植 v20230206.2');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    await delay(0.5);
    const cropName = await getSeedList();
    console.log('✅ 取得種子成功');
    await createCrop();
    surgeNotify(
      '自動種植成功 🌱',
      `正在種植「${cropName}」`
    );
  } catch (error) {
    handleError(error);
  }
  $done();
})();
