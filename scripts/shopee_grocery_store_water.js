let showNotification = true;
let config = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園道具商店水滴', subtitle, message, { 'url': 'shopeetw://' });
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
    if (isEmptyObject(shopeeFarmInfo) || !shopeeFarmInfo.groceryStoreToken?.length) {
      return reject(['檢查失敗 ‼️', '請先在道具商店領取一次水滴，以儲存 token']);
    }
    const shopeeGroceryStoreToken = shopeeFarmInfo?.groceryStoreToken;

    const shopeeHeaders = {
      'Cookie': cookieToString(shopeeInfo.token),
      'Content-Type': 'application/json',
    };

    config = {
      shopeeInfo: shopeeInfo,
      shopeeHeaders: shopeeHeaders,
      groceryStoreToken: shopeeGroceryStoreToken
    }
    return resolve();
  });
}

async function claimGroceryStoreWater() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://games.shopee.tw/farm/api/grocery_store/rn_claim',
        headers: config.shopeeHeaders,
        body: {
          s: config.groceryStoreToken
        }
      };
      $httpClient.post(request, function (error, response, data) {
        if (error) {
          return reject(['領取失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.msg === 'success') {
              return resolve();
            }
            else if (obj.code === 430007) {
              return reject(['領取失敗 ‼️', '超過每日領取上限']);
            }
            else if (obj.code === 409004) {
              return reject(['領取失敗 ‼️', '請檢查作物是否已經收成']);
            }
            else {
              return reject(['領取失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['Cookie 已過期 ‼️', '請重新登入']);
          }
        }
      });
    } catch (error) {
      return reject(['領取失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園道具商店水滴 v20230807.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    await claimGroceryStoreWater();
    console.log('✅ 領取成功');
    surgeNotify(
      '領取成功 ✅',
      ''
    );
  } catch (error) {
    handleError(error);
  }
  $done();
})();
