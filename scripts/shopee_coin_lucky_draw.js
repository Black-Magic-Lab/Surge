const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};

const luckyDrawBasicUrl = 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/';

const eventListRequest = {
  url: 'https://mall.shopee.tw/api/v4/banner/batch_list',
  headers: shopeeHeaders,
  body: {
    "types": [
      {
        "type": "coin_carousel"
      },
      {
        "type": "coin_square"
      }
    ]
  }
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
      $notification.post('🍤 蝦幣寶箱',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status == 200) {
        const obj = JSON.parse(data);
        // console.log(data)
        const bannerSets = obj.data.banners;
        for (const bannerSet of bannerSets) {
          for (const banner of bannerSet.banners) {
            try {
              const title = banner.navigate_params.navbar.title;
              if (title.includes('蝦幣寶箱')) {
                const re = /activity\/(.*)\?/i;
                const found = banner.navigate_params.url.match(re);
                const activityId = found[1];
                console.log('活動 ID:' + activityId);
                coinLuckyRrawGetIdRequest.url = 'https://games.shopee.tw/gameplatform/api/v1/game/activity/' + activityId + '/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false';
                coinLuckyRrawRequest.body.activity_code = activityId;
                coinLuckyDrawGetId();
              }
            } 
            catch (e) {

            }
          }
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期‼️',
          '',
          '請重新抓取 🔓'
        );
      }
    }
    $done();
  });
}

// 獲得寶箱 ID
function coinLuckyDrawGetId() {
  $httpClient.get(coinLuckyRrawGetIdRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍤 蝦幣寶箱網址查詢',
        '',
        '連線錯誤‼️'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const eventUrl = obj.data.basic.event_code;;
            coinLuckyRrawRequest.url = luckyDrawBasicUrl + eventUrl;
            console.log('🍤 蝦幣寶箱新網址獲取成功： ' + coinLuckyRrawRequest.url);
            // $notification.post('🍤 蝦幣寶箱新網址獲取成功： ', 
            //   '', 
            //   luckyRrawRequest.url
            // );
            coinLuckyDraw();
          } else {
            $notification.post('🍤 蝦幣寶箱網址查詢錯誤',
              '',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          $notification.post('🍤 蝦幣寶箱網址查詢錯誤',
            '',
            error
          );
          $done();
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期‼️',
          '',
          '請重新抓取 🔓'
        );
        $done();
      }
    }
  });
}

function coinLuckyDraw() {
  $httpClient.post(coinLuckyRrawRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍤 蝦幣寶箱',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status == 200) {
        const obj = JSON.parse(data);
        if (obj.msg === 'no chance') {
          $notification.post('🍤 今日已領過蝦幣寶箱',
            '',
            '每日只能領一次‼️'
          );
        } else if (obj.msg === 'success') {
          const packageName = obj.data.package_name;
          $notification.post('🍤 蝦幣寶箱領取成功 ✅',
            '',
            '獲得 👉 ' + packageName + ' 💎'
          );
        } else if (obj.msg === 'expired' || obj.msg === 'event already end') {
          $notification.post('🍤 蝦幣寶箱活動已過期 ❌',
            '',
            '請嘗試更新模組或腳本，或等待作者更新‼️'
          );
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期‼️',
          '',
          '請重新抓取 🔓'
        );
      }
    }
    $done();
  });
}

eventListGetActivity();
// coinLuckyDrawGetId();