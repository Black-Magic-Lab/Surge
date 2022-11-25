const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦幣寶箱', subtitle, message, { 'url': 'shopeetw://' });
};

const luckyDrawBasicUrl = 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/';
const eventListRequest = {
  url: 'https://mall.shopee.tw/api/v4/banner/batch_list',
  headers: shopeeHeaders,
  body: {
    'types': [{ 'type': 'coin_carousel' }, { 'type': 'coin_square' }]
  },
};

let coinLuckyRrawGetIdRequest = {
  url: '',
  headers: shopeeHeaders,
};

let coinLuckyRrawRequest = {
  url: '',
  headers: shopeeHeaders,
  body: {
    request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
    app_id: 'E9VFyxwmtgjnCR8uhL',
    activity_code: '',
    source: 0,
  },
};

function eventListGetActivity() {
  $httpClient.post(eventListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '無法取得活動列表 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status == 200) {
        const obj = JSON.parse(data);
        // console.log(data)
        const bannerSets = obj.data.banners;
        let foundId = false;
        for (const bannerSet of bannerSets) {
          for (const banner of bannerSet.banners) {
            try {
              const title = banner.navigate_params.navbar.title;
              const url = banner.navigate_params.url;
              // console.log(title + ': ' + url);
              if (title.includes('蝦幣寶箱') || title.includes('天天領蝦幣')) {
                const re = /activity\/(.*)\?/i;
                let found = url.match(re);
                if (!found) {
                  const re = /activity\/(.*)/i;
                  found = url.match(re);
                }
                const activityId = found[1];
                foundId = true;
                console.log('活動 ID:' + activityId);
                coinLuckyRrawGetIdRequest.url = 'https://games.shopee.tw/gameplatform/api/v1/game/activity/' + activityId + '/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false';
                coinLuckyRrawRequest.body.activity_code = activityId;
                coinLuckyDrawGetId();
              }
            }
            catch (error) {
              shopeeNotify(
                '無法取得活動列表 ‼️',
                error
              );
              $done();
            }
          }
        }
        if (foundId === false) {
          console.log('找不到蝦幣寶箱活動');
          $done();
        }
      } else {
        shopeeNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
        $done();
      }
    }
  });
}

// 獲得寶箱 ID
function coinLuckyDrawGetId() {
  $httpClient.get(coinLuckyRrawGetIdRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '網址查詢失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const eventUrl = obj.data.basic.event_code;;
            coinLuckyRrawRequest.url = luckyDrawBasicUrl + eventUrl;
            console.log('網址查詢成功： ' + coinLuckyRrawRequest.url);
            // shopeeNotify(
            //   '網址查詢成功 🔗',
            //   coinLuckyRrawRequest.url
            // );
            coinLuckyDraw();
          } else {
            shopeeNotify(
              '網址查詢失敗 ‼️',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          shopeeNotify(
            '網址查詢失敗 ‼️',
            error
          );
          $done();
        }
      } else {
        shopeeNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
        $done();
      }
    }
  });
}

function coinLuckyDraw() {
  $httpClient.post(coinLuckyRrawRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '領取失敗 ‼️',
        '連線錯誤'
      );
    } else {
      if (response.status == 200) {
        const obj = JSON.parse(data);
        if (obj.msg === 'success') {
          const packageName = obj.data.package_name;
          shopeeNotify(
            '領取成功 ✅',
            '獲得 👉 ' + packageName + ' 💎'
          );
        }
        else if (obj.msg === 'no chance') {
          shopeeNotify(
            '領取失敗 ‼️',
            '每日只能領一次'
          );
        } else if (obj.msg === 'expired' || obj.msg === 'event already end') {
          shopeeNotify(
            '領取失敗 ‼️',
            '活動已過期。請嘗試更新模組或腳本，或等待作者更新'
          );
        }
      } else {
        shopeeNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
      }
    }
    $done();
  });
}

eventListGetActivity();
