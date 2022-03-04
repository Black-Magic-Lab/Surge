const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};

const luckyDrawBasicUrl = 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/';
const coinLuckyRrawGetIdRequest = {
  url: 'https://games.shopee.tw/gameplatform/api/v1/game/activity/e37b7dec5976a29c/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false',
  headers: shopeeHeaders,
};

let coinLuckyRrawRequest = {
  url: '',
  headers: shopeeHeaders,
  body: {
    request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
    app_id: 'E9VFyxwmtgjnCR8uhL',
    activity_code: 'e37b7dec5976a29c',
    source: 0,
  },
};

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

coinLuckyDrawGetId();