let showNotification = true;
let config = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園自動收成', subtitle, message, { 'url': 'shopeetw://' });
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

async function harvest() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://games.shopee.tw/farm/api/orchard/crop/harvest',
        headers: config.shopeeHeaders,
        body: $persistentStore.read('ShopeeCrop'),
      };

      $httpClient.post(request, function (error, response, data) {
        if (error) {
          return reject(['收成失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.code === 0) {
              const cropName = obj.data.crop.meta.name;
              const ctaUrl = obj.data.reward.rewardItems[0].itemExtraData.ctaUrl;
              if (ctaUrl !== '') {
                return resolve(cropName);
              } else {
                showNotification = false;
                return reject(['收成失敗 ‼️', `已經收成過 ${cropName} 了`]);
              }
            }
            else if (obj.code === 409004) {
              showNotification = false;
              return reject(['收成失敗 ‼️', '作物尚未達到收成階段']);
            } else if (obj.code === 404000) {
              return reject(['收成失敗 ‼️', '找不到作物']);
            } else {
              return reject(['收成失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            response.status
          }
        }
      });
    } catch (error) {
      return reject(['收成失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園自動收成 v20230115.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    const cropName = await harvest();
    console.log('✅ 收成成功');
    console.log(`ℹ️ 獲得 ${cropName}`);
    surgeNotify(
      '收成成功 ✅',
      `獲得 ${cropName} 🌳`
    );
  } catch (error) {
    handleError(error);
  }
  $done();
})();
