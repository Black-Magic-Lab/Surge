let request = {
  url: '',
  headers: {
    'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
  body: { actionKey: '' },
};

function waterMission(actionKey, missionName) {
  sleep(0.5);
  const now = new Date().getTime();
  request.url = url = 'https://games.shopee.tw/farm/api/task/action?t=' + now;
  request.body.actionKey = actionKey;

  $httpClient.post(request, function(error, response, data) {
    if (error) {
      $notification.post(missionName, '', '連線錯誤‼️');
    } else {
      if (response.status == 200) {
        const obj = JSON.parse(data);
        if (obj['msg'] == 'success') {
          console.log(missionName + '任務成功 ✅');
        } else if (obj['msg'] == 'false') {
          $notification.post('🍤 今日已經完成過任務', '', '');
        } else {
          $notification.post('🍤 蝦皮任務錯誤', '', obj['msg']);
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️','','請重新更新 Cookie 重試 🔓');
      }
    }
  });
  $done();
}

function sleep(seconds) {
  const waitUntil = new Date().getTime() + seconds * 1000;
  while (new Date().getTime() < waitUntil) true;
}

// 執行任務
waterMission('act_play_bubble_game', '🍤 玩蝦皮泡泡王任務');
waterMission('act_play_candy_game', '🍤 玩蝦皮消消樂任務');
for (var i = 0; i < 10; i++) {
  waterMission('act_Help_Watering', '🍤 幫站內朋友澆水任務');
}
for (var i = 0; i < 10; i++) {
  waterMission('act_Receive_Water', '🍤 收到站內朋友助水任務');
}