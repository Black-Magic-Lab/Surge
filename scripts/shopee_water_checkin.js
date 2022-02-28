const now = new Date().getTime();
const request = {
  url: 'https://games.shopee.tw/farm/api/task/action?t=' + now,
  headers: {
    'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
  body: { actionKey: 'act_Check_In' },
};

$httpClient.post(request, function (error, response, data) {
  if (error) {
    $notification.post('🍤 蝦皮果園水滴任務打卡', '', '連線錯誤‼️');
  } else {
    if (response.status === 200) {
      let obj = JSON.parse(data);
      if (obj['msg'] === 'success') {
        $notification.post('🍤 蝦皮果園', '', '水滴任務打卡成功 ✅');
      } else if (obj['msg'] === 'false') {
        $notification.post('🍤 今日已經完成所有水滴任務打卡', '', '每日只能打卡三次‼️');
      } else {
        $notification.post('🍤 蝦皮果園水滴任務錯誤', '', '錯誤訊息' + obj['msg']);
      }
    } else {
      $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️', '', '請重新更新 Cookie 重試 🔓');
    }
  }
  $done();
});