const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
const request = {
  url: 'https://games.shopee.tw/farm/api/task/action?t=' + new Date().getTime(),
  headers: shopeeHeaders,
  body: { actionKey: 'act_Check_In' },
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園水滴任務', subtitle, message, { 'url': 'shopeetw://' });
};

$httpClient.post(request, function (error, response, data) {
  if (error) {
    shopeeNotify(
      '打卡失敗 ‼️',
      '連線錯誤'
    );
  } else {
    if (response.status === 200) {
      try {
        const obj = JSON.parse(data);
        if (obj.msg === 'success') {
          shopeeNotify(
            '打卡成功 ✅',
            ''
          );
        } else if (obj.msg === 'false') {
          shopeeNotify(
            '打卡失敗 ‼️',
            '每日只能打卡三次，今日已完成打卡任務'
          );
        } else if (obj.msg === 'task check in invalid time') {
          shopeeNotify(
            '打卡失敗 ‼️',
            '打卡間隔少於三小時'
          );
        } else {
          shopeeNotify(
            '打卡失敗 ‼️',
            obj.msg
          );
        }
      } catch (error) {
        shopeeNotify(
          '打卡失敗 ‼️',
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
