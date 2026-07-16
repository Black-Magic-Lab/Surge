let showNotification = true;
let config = null;
let getIdRequest = null;
let luckyDrawRequest = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦幣寶箱', subtitle, message, { 'url': 'shopeetw://' });
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
      'User-Agent': 'iOS appp iPhone Shopee appver=31109 language=zh-Hant app_type=1 Cronet/102.0.5005.61',
    }
    config = {
      shopeeInfo: shopeeInfo,
      shopeeHeaders: shopeeHeaders,
    }
    return resolve();
  });
}

async function eventListGetActivity() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://mall.shopee.tw/api/v4/banner/batch_list',
        headers: config.shopeeHeaders,
        body: {
          types: [{ 'type': 'coin_carousel' }, { 'type': 'coin_square' }],
        },
      };

      $httpClient.post(request, function (error, response, data) {
        if (error) {
          return reject(['無法取得活動列表 ‼️', '連線錯誤']);
        } else {
          if (response.status == 200) {
            const obj = JSON.parse(data);
            const bannerSets = obj.data.banners;
            let foundId = false;
            for (const bannerSet of bannerSets) {
              for (const banner of bannerSet.banners) {
                const title = banner.navigate_params.navbar.title;
                const url = banner.navigate_params.url;
                // console.log(`活動名稱: ${title}，網址: ${url}`);
                if (title.includes('蝦幣寶箱') || title.includes('天天領蝦幣')) {
                  const re = /activity\/(.*)\??/i;
                  const found = url.match(re);
                  const activityId = found[1];
                  foundId = true;
                  console.log(`✅ 找到蝦幣寶箱活動，活動名稱: ${title}，活動頁面 ID: ${activityId}`);

                  // 取得活動代碼
                  getIdRequest = {
                    url: `https://games.shopee.tw/gameplatform/api/v1/game/activity/${activityId}/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false`,
                    headers: config.shopeeHeaders,
                  };

                  // 真正領取蝦幣
                  luckyDrawRequest = {
                    url: '',
                    headers: config.shopeeHeaders,
                    body: {
                      request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
                      app_id: 'E9VFyxwmtgjnCR8uhL',
                      activity_code: activityId,
                      source: 0,
                    },
                  };
                  return resolve();
                }
              }
            }
            if (!foundId) {
              return resolve();
            }
          } else {
            return reject(['無法取得活動列表 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['無法取得活動列表 ‼️', error]);
    }
  });
}

async function iframeListGetActivity() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://mall.shopee.tw/api/v4/market_coin/get_iframe_list?region=TW&offset=0&limit=10',
        headers: config.shopeeHeaders,
      };
      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['無法取得活動列表 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            let foundEvent = false;
            const iframeList = obj.data.iframe_list;
            for (const iframe of iframeList) {
              // console.log(`活動名稱: ${iframe.title}，網址: ${iframe.url}`);
              if ((iframe.title.includes('蝦幣')) && iframe.url.includes('luckydraw')) {
                foundEvent = true;
                const re = /activity\/(.*)\??/i;
                let found = iframe.url.match(re);
                if (!found) {
                  const re = /activity=(.*)&/i;
                  found = iframe.url.match(re);
                }
                const activityId = found[1];
                console.log(`ℹ️ 在 iframe 找到蝦幣寶箱活動，活動名稱: ${iframe.title}，活動頁面 ID: ${activityId}`);

                // 取得活動代碼
                getIdRequest = {
                  url: `https://games.shopee.tw/gameplatform/api/v1/game/activity/${activityId}/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false`,
                  headers: config.shopeeHeaders,
                };

                // 真正領取蝦幣寶箱
                luckyDrawRequest = {
                  url: '',
                  headers: config.shopeeHeaders,
                  body: {
                    request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
                    app_id: 'E9VFyxwmtgjnCR8uhL',
                    activity_code: activityId,
                    source: 0,
                  },
                };

                return resolve();
              }
            }
            if (!foundEvent) {
              return reject(['無法取得活動列表 ‼️', '找不到免運寶箱活動']);
            }
          } else {
            return reject(['無法取得活動列表 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['無法取得活動列表 ‼️', error]);
    }
  });
}

async function coinLuckyDrawGetId() {
  return new Promise((resolve, reject) => {
    try {
      $httpClient.get(getIdRequest, function (error, response, data) {
        if (error) {
          return reject(['活動代碼查詢失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.msg === 'success') {
              const code = obj.data.basic.event_code;
              console.log(`✅ 活動代碼: ${code}`);
              luckyDrawRequest.url = `https://games.shopee.tw/api-gateway/luckydraw/api/v1/lucky/event/${code}`;
              return resolve();
            } else {
              return reject(['活動代碼查詢失敗 ‼️', obj.msg]);
            }
          } else {
            return reject(['活動代碼查詢失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['活動代碼查詢失敗 ‼️', error]);
    }
  });
}

async function coinLuckyDraw() {
  return new Promise((resolve, reject) => {
    try {
      $httpClient.post(luckyDrawRequest, function (error, response, data) {
        if (error) {
          return reject(['領取失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status == 200) {
            const obj = JSON.parse(data);
            if (obj.msg === 'success') {
              const packageName = obj.data.package_name;
              return resolve(packageName);
            }
            else if (obj.code === 102000) {
              showNotification = false;
              return reject(['領取失敗 ‼️', '每日只能領一次']);
            } else if (obj.msg === 'expired' || obj.msg === 'event already end') {
              return reject(['領取失敗 ‼️', '活動已過期。請嘗試更新模組或腳本，或等待作者更新。']);
            } else {
              return reject(['領取失敗 ‼️', `錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['領取失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['領取失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦幣寶箱 v20231023.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    await eventListGetActivity();
    console.log('✅ banner 取得活動列表');
    if (!getIdRequest) {
      console.log('⚠️ 在 banner 找不到蝦幣寶箱活動，繼續嘗試搜尋 iframe');
      await iframeListGetActivity();
      console.log('✅ iframe 取得活動列表');
    }
    await coinLuckyDrawGetId();
    console.log('✅ 取得活動代碼');
    const reward = await coinLuckyDraw();
    console.log('✅ 領取成功');
    console.log(`ℹ️ 獲得 👉 ${reward} 💎`);
    surgeNotify(
      '領取成功 ✅',
      `獲得 👉 ${reward} 💎`
    );
  } catch (error) {
    handleError(error);
  }
  $done();
})();
