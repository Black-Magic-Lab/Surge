const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};

let request = {
  url: '',
  headers: shopeeHeaders,
  body: { actionKey: '' },
};

let missions = [];

// if (new Date().getHours() < 12) {
  
// }
// else {
//   missions.push({
//     actionKey: 'act_claim_water_in_shop',
//     missionName: '🍤 前往賣場領取水滴'
//   });
// }

missions.push({
  actionKey: 'act_playrcmdgame',
  missionName: '🍤 玩商城遊戲'
});
missions.push({
  actionKey: 'act_play_candy_game',
  missionName: '🍤 玩蝦皮消消樂任務'
});
missions.push({
  actionKey: 'act_play_claw_game',
  missionName: '🍤 玩蝦皮夾夾樂任務'
});
missions.push({
  actionKey: 'act_play_knife_throw_game',
  missionName: '🍤 玩蝦蝦飛刀任務'
});
missions.push({
  actionKey: 'act_play_pet_game',
  missionName: '🍤 玩蝦蝦寵物村'
});
missions.push({
  actionKey: 'act_play_bubble_game',
  missionName: '🍤 玩蝦皮泡泡王任務'
});

for (let i = 0; i < 10; i++) {
  missions.push({
    actionKey: 'act_Receive_Water',
    missionName: '🍤 收到站內朋友助水任務'
  });
}

for (let i = 0; i < 10; i++) {
  missions.push({
    actionKey: 'act_Help_Watering',
    missionName: '🍤 幫站內朋友澆水任務'
  });
}

function waterMission(index) {
  sleep(0.5);
  const now = new Date().getTime();
  const missionName = missions[index].missionName;
  const actionKey = missions[index].actionKey;
  request.url = url = 'https://games.shopee.tw/farm/api/task/action?t=' + now;
  request.body.actionKey = actionKey;

  $httpClient.post(request, function (error, response, data) {
    if (error) {
      $notification.post(missionName + '失敗',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            console.log(missions[index].missionName + '成功 ✅');
            // $notification.post('🍤 蝦皮水滴任務', 
            //   missions[index].missionName, 
            //   '任務成功 ✅',
            // );
          } else if (obj.msg === 'lock failed.') {
            $notification.post('🍤 蝦皮水滴任務錯誤',
              missionName,
              '連線請求過於頻繁',
            );
          } else {
            $notification.post('🍤 蝦皮水滴任務錯誤',
              missionName + '錯誤',
              obj.msg
            );
          }
        } catch (error) {
          $notification.post('🍤 蝦皮水滴任務錯誤',
            missionName + '錯誤',
            error
          );
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
          '',
          '請重新更新 Cookie 重試 🔓'
        );
      }
    }
    if (index < missions.length - 1) {
      waterMission(index + 1);
    }
    else {
      $notification.post('🍤 蝦皮水滴任務完成 ✅', '', '');
      $done();
    }
  });
}

function sleep(seconds) {
  const waitUntil = new Date().getTime() + seconds * 1000;
  while (new Date().getTime() < waitUntil) true;
}

waterMission(0);