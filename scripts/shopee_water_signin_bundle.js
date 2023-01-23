let showNotification = true;
let config = null;
let claimSignInBundleRequest = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園每日簽到獎勵', subtitle, message, { 'url': 'shopeetw://' });
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
    }
    config = {
      shopeeInfo: shopeeInfo,
      shopeeHeaders: shopeeHeaders,
    }
    return resolve();
  });
}

async function getSignInBundleList() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: `https://games.shopee.tw/farm/api/sign_in_bundle/list?t=${new Date().getTime()}`,
        headers: config.shopeeHeaders,
      };
      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['取得列表失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            const day = obj.data.day;
            const claimed = obj.data.signInBundlePrizes[day - 1].claimed;
            if (claimed) {
              showNotification = false;
              return reject(['取得列表失敗 ‼️', '今日已簽到']);
            }

            claimSignInBundleRequest = {
              url: `https://games.shopee.tw/farm/api/sign_in_bundle/claim?t=${new Date().getTime()}`,
              headers: config.shopeeHeaders,
              body: {
                'day': day,
                'forceClaim': true
              }
            };

            return resolve();
          } else {
            return reject(['取得列表失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['取得列表失敗 ‼️', error]);
    }
  })
}

function claimSignInBundle() {
  return new Promise((resolve, reject) => {
    try {
      $httpClient.post(claimSignInBundleRequest, function (error, response, data) {
        if (error) {
          return reject(['簽到失敗 ‼️', '請重新登入']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.msg === 'success') {
              const day = obj.data.day;
              const prize = obj.data.signInBundlePrizes[day - 1];
              let prizeName = '';
              if (prize.prizeDetail) {
                prizeName = prize.prizeDetail.prizeName;
              }
              else {
                prizeName = prize.prizeNum + ' 滴水 💧';
              }
              return resolve(prizeName);
            }
            else {
              return reject(['簽到失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
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
  console.log('ℹ️ 蝦蝦果園每日簽到獎勵 v20230115.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    await getSignInBundleList();
    console.log('✅ 取得列表成功');
    const reward = await claimSignInBundle();
    console.log('✅ 領取簽到獎勵成功');
    console.log(`ℹ️ 獲得 ${reward}`);
    surgeNotify(
      '簽到成功 ✅',
      `獲得 ${reward}`
    );
  } catch (error) {
    handleError(error);
  }
  $done();
})();
