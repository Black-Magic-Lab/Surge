let showNotification = true;
let config = null;

function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦皮每日簽到', subtitle, message, { 'url': 'shopeetw://' });
};

function handleError(error) {
  if (Array.isArray(error)) {
    console.log(`❌ ${error[0]} ${error[1]}`);
    if (showNotification) {
      shopeeNotify(error[0], error[1]);
    }
  } else {
    console.log(`❌ ${error}`);
    if (showNotification) {
      shopeeNotify(error);
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

async function checkin() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://shopee.tw/mkt/coins/api/v2/checkin_new',
        headers: config.shopeeHeaders,
      };

      $httpClient.post(request, function (error, response, data) {
        if (error) {
          return reject(['簽到失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.data.success) {
              return resolve({
                checkInDay: obj.data.check_in_day,
                coins: obj.data.increase_coins,
              });
            } else {
              showNotification = false;
              return reject(['簽到失敗 ‼️', '本日已簽到']);
            }
          } else {
            return reject(['簽到失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['簽到失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦皮每日簽到 v20230116.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    const result = await checkin();
    console.log('✅ 簽到成功');
    console.log(`ℹ️ 目前已連續簽到 ${result.checkInDay} 天，今日已領取 ${result.coins}`);
    shopeeNotify(
      `簽到成功，目前已連續簽到 ${result.checkInDay} 天`,
      `今日已領取 ${result.coins} 💰💰💰`
    );
  } catch (error) {
    handleError(error);
  }
  $done();
})();
