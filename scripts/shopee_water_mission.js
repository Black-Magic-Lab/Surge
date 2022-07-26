const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園執行任務', subtitle, message, { 'url': 'shopeetw://' });
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
//     missionName: '前往賣場領取水滴'
//   });
// }

missions.push({
  actionKey: 'act_playrcmdgame',
  missionName: '玩商城遊戲'
});
missions.push({
  actionKey: 'act_play_candy_game',
  missionName: '玩蝦皮消消樂'
});
missions.push({
  actionKey: 'act_play_claw_game',
  missionName: '玩蝦皮夾夾樂'
});
missions.push({
  actionKey: 'act_play_knife_throw_game',
  missionName: '玩蝦蝦飛刀'
});
missions.push({
  actionKey: 'act_play_pet_game',
  missionName: '玩蝦蝦寵物村'
});
missions.push({
  actionKey: 'act_play_bubble_game',
  missionName: '玩蝦皮泡泡王'
});

for (let i = 0; i < 10; i++) {
  missions.push({
    actionKey: 'act_Receive_Water',
    missionName: '收到站內朋友助水'
  });
}

for (let i = 0; i < 10; i++) {
  missions.push({
    actionKey: 'act_Help_Watering',
    missionName: '幫站內朋友澆水'
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
      shopeeNotify(
        '執行 ' + missionName + ' 失敗 ‼️',
        '連線錯誤'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            console.log(missions[index].missionName + '成功 ✅');
            // shopeeNotify(
            //   '執行成功 ✅',
            //   '已完成 ' + missions[index].missionName
            // );
          } else if (obj.msg === 'lock failed.') {
            shopeeNotify(
              '執行 ' + missionName + ' 失敗 ‼️',
              '連線請求過於頻繁'
            );
          } else {
            shopeeNotify(
              '執行 ' + missionName + ' 失敗 ‼️',
              obj.msg
            );
          }
        } catch (error) {
          shopeeNotify(
            '執行 ' + missionName + ' 失敗 ‼️',
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
    if (index < missions.length - 1) {
      waterMission(index + 1);
    }
    else {
      shopeeNotify(
        '已完成所有任務 ✅',
        ''
      );
      $done();
    }
  });
}

function sleep(seconds) {
  const waitUntil = new Date().getTime() + seconds * 1000;
  while (new Date().getTime() < waitUntil) true;
}

waterMission(0);
