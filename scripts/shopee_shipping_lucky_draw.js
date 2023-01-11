const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦皮免運寶箱', subtitle, message, { 'url': 'shopeetw://' });
};

const eventListRequest = {
  url: 'https://mall.shopee.tw/api/v4/banner/batch_list',
  headers: shopeeHeaders,
  body: {
    'types': [{ 'type': 'coin_carousel' }, { 'type': 'coin_square' }]
  }
};

const iframeListRequest = {
  url: 'https://mall.shopee.tw/api/v4/market_coin/get_iframe_list?region=TW&offset=0&limit=10',
  headers: shopeeHeaders,
};

let shippingLuckyRrawGetIdRequest = {
  url: '',
  headers: shopeeHeaders,
};

let shippingLuckyRrawGetDailyChanceRequest = {
  url: '',
  headers: shopeeHeaders,
}

let shippingLuckyRrawRequest = {
  url: '',
  headers: shopeeHeaders,
  body: {
    // schedule_ldc_id: 0,
    request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
    app_id: 'E9VFyxwmtgjnCR8uhL',
    activity_code: '4b68412121aa9650',
    source: 0,
  },
};

function eventListGetActivity() {
  $httpClient.post(eventListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '無法獲得 banner 活動列表 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status == 200) {
        const obj = JSON.parse(data);
        let foundEvent = false;
        const bannerSets = obj.data.banners;
        for (const bannerSet of bannerSets) {
          for (const banner of bannerSet.banners) {
            try {
              const title = banner.navigate_params.navbar.title;
              const url = banner.navigate_params.url;
              // console.log(title + ': ' + url);
              if (title.includes('抽免運券')) {
                foundEvent = true;
                const re = /activity\/(.*)\?/i;
                let found = url.match(re);
                if (!found) {
                  const re = /activity\/(.*)/i;
                  found = url.match(re);
                }
                if (!found) {
                  const re = /activity=(.*)&/i;
                  found = url.match(re);
                }
                const activityId = found[1];
                console.log('在 banner 找到活動 ID:' + activityId);
                shippingLuckyRrawGetIdRequest.url = 'https://games.shopee.tw/gameplatform/api/v1/game/activity/' + activityId + '/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false';
                shippingLuckyRrawRequest.body.activity_code = activityId;
                shippingLuckyDrawGetId();
              }
            }
            catch (error) {
              shopeeNotify(
                '無法獲得 banner 活動列表 ‼️',
                error
              );
              $done();
            }
          }
        }
        if (!foundEvent) {
          console.log('在 banner 找不到免運寶箱活動，繼續嘗試搜尋 iframe');
          iframeListGetActivity();
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

function iframeListGetActivity() {
  $httpClient.get(iframeListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '無法獲得 iframe 活動列表 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        const obj = JSON.parse(data);
        let foundEvent = false;
        const iframeList = obj.data.iframe_list;
        for (const iframe of iframeList) {
          console.log(iframe.title + ': ' + iframe.url);
          if ((iframe.title.includes('免運') || iframe.title.includes('--活動名稱--')) && iframe.url.includes('luckydraw')) {
            foundEvent = true;
            const re = /activity\/(.*)\?/i;
            let found = iframe.url.match(re);
            if (!found) {
              const re = /activity\/(.*)/i;
              found = iframe.url.match(re);
            }
            if (!found) {
              const re = /activity=(.*)&/i;
              found = iframe.url.match(re);
            }
            const activityId = found[1];
            // console.log('在 iframe 找到活動 ID:' + activityId);
            shippingLuckyRrawGetIdRequest.url = 'https://games.shopee.tw/gameplatform/api/v1/game/activity/' + activityId + '/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false';
            shippingLuckyRrawRequest.body.activity_code = activityId;
            shippingLuckyDrawGetId();
          }
        }
        if (!foundEvent) {
          console.log('在 iframe 找不到免運寶箱活動，結束');
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

// 獲得免運寶箱 ID
function shippingLuckyDrawGetId() {
  $httpClient.get(shippingLuckyRrawGetIdRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '寶箱網址查詢失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const eventUrl = obj.data.basic.event_code;
            let module_id = 0;
            let found = false;
            for (const item of obj.data.modules) {
              if (item.module_name === 'Service.LUCKY_DRAW_COMPONENT') {
                module_id = item.module_id;
                found = true;
                break;
              }
            }
            if (found) {
              shippingLuckyRrawGetDailyChanceRequest.url = 'https://games.shopee.tw/gameplatform/api/v1/chance/35651/event/' + eventUrl + '/query?appid=E9VFyxwmtgjnCR8uhL&basic=false'
              shippingLuckyRrawRequest.url = 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/' + eventUrl;
              // shippingLuckyRrawRequest.body.schedule_ldc_id = module_id;
              console.log('🍤 蝦皮免運寶箱網址查詢成功： ' + shippingLuckyRrawRequest.url + ' Module Id: ' + module_id);
              // shopeeNotify(
              //   '蝦皮免運寶箱網址查詢成功',
              //   shippingLuckyRrawRequest.url + ' Module Id: ' + module_id
              // );
              shippingLuckyDrawGetChance();
            }
            else {
              shopeeNotify(
                '寶箱網址查詢失敗 ‼️',
                '找不到活動'
              );
              $done();
            }
          } else {
            shopeeNotify(
              '寶箱網址查詢失敗 ‼️',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          shopeeNotify(
            '寶箱網址查詢失敗 ‼️',
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

function shippingLuckyDrawGetChance() {
  $httpClient.get(shippingLuckyRrawGetDailyChanceRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '查詢剩餘次數失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.data.daily_chance > 0) {
            shippingLuckyDraw();
          }
          else {
            // 疑似不會跑到這邊
            shopeeNotify(
              '領取失敗 ‼️',
              '每日只能免費領一次'
            );
            $done();
          }
        }
        catch (error) {
          shopeeNotify(
            '查詢剩餘次數失敗 ‼️',
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

function shippingLuckyDraw() {
  $httpClient.post(shippingLuckyRrawRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '領取失敗 ‼️',
        '連線錯誤'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const packageName = obj.data.package_name;
            shopeeNotify(
              '領取成功 ✅',
              '獲得 👉 ' + packageName + ' 💎'
            );
          } else if (obj.msg === 'expired' || obj.msg === 'event already end') {
            shopeeNotify(
              '領取失敗 ‼️',
              '活動已過期。請嘗試更新模組或腳本，或等待作者更新'
            );
          } else if (obj.msg === 'no chance') {
            shopeeNotify(
              '領取失敗 ‼️',
              '每日只能免費領一次'
            );
          } else {
            shopeeNotify(
              '領取失敗 ‼️',
              obj.msg
            );
          }
        }
        catch (error) {
          shopeeNotify(
            '領取失敗 ‼️',
            error
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
