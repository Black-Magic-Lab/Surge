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

$httpClient.post(request, function (error, response, data) {
  if (error) {
    $notification.post('🍤 蝦蝦果園水滴任務打卡', 
      '', 
      '連線錯誤‼️'
    );
  } else {
    if (response.status === 200) {
      const obj = JSON.parse(data);
      if (obj.msg === 'success') {
        $notification.post('🍤 蝦蝦果園', 
          '', 
          '水滴任務打卡成功 ✅'
        );
      } else if (obj.msg === 'false') {
        $notification.post('🍤 蝦蝦果園水滴任務錯誤', 
          '', 
          '今日已經完成所有水滴任務打卡，每日只能打卡三次‼️'
        );
      } else if (obj.msg === 'task check in invalid time') {
        $notification.post('🍤 蝦皮果園水滴任務錯誤', 
          '', 
          '打卡間隔少於三小時‼️'
        );
      } else {
        $notification.post('🍤 蝦皮果園水滴任務錯誤', 
          '', 
          '錯誤訊息' + obj.msg
        );
      }
    } else {
      $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️', 
        '', 
        '請重新更新 Cookie 重試 🔓'
      );
    }
  }
  $done();
});