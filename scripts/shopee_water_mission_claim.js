const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};

const getListRequest = {
  url: 'https://games.shopee.tw/farm/api/task/listV2?t=' + new Date().getTime(),
  headers: shopeeHeaders,
};

let claimRewardRequest = {
  url: 'https://games.shopee.tw/farm/api/task/reward/claim?t=' + new Date().getTime(),
  headers: shopeeHeaders,
  body: {
    "taskId": null,
    "taskFinishNum": 1,
    "isNewUserTask": false,
    "forceClaim": false,
  },
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園領取任務獎勵', subtitle, message, { 'url': 'shopeetw://' });
};

let claims = [];

function getRewardList() {
  $httpClient.get(getListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '取得列表失敗 ‼️',
        '連線錯誤'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          const taskGroups = obj.data.userTasks;
          for (let i = 0; i < taskGroups.length; i++) {
            const taskList = taskGroups[i];
            for (let j = 0; j < taskList.length; j++) {
              const task = taskList[j];
              const taskId = task.taskInfo.Id;
              const taskName = task.taskInfo.taskName;
              claimRewardRequest.body.taskId = taskId;
              if (task.canReward === true) {
                claims.push({
                  taskId: taskId,
                  taskName: taskName
                });
              }
            }
          }
          // 獲得列表完畢，執行領取
          if (claims.length) {
            claimReward(0);
          }
          else {
            console.log('沒有可領取的任務獎勵');
            shopeeNotify(
              '取得列表失敗 ‼️',
              '沒有可領取的任務獎勵'
            );
            $done();
          }
        } catch (error) {
          shopeeNotify(
            '取得列表失敗 ‼️',
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

function claimReward(index) {
  sleep(0.5);
  const taskId = claims[index].taskId;
  const taskName = claims[index].taskName;
  claimRewardRequest.body.taskId = taskId;
  $httpClient.post(claimRewardRequest, function (error, response, data) {
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
            console.log('領取 ' + taskName + ' 成功 💧');
            // shopeeNotify(
            //   '領取成功 💧',
            //   '已領取 ' + taskName
            // );
          } else {
            shopeeNotify(
              '領取失敗 ‼️',
              taskName + '\n' + obj.msg
            );
          }
        } catch (error) {
          shopeeNotify(
            '領取失敗 ‼️',
            taskName + '\n' + error
          );
        }
      } else {
        shopeeNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
      }
    }
    if (index < claims.length - 1) {
      claimReward(index + 1);
    }
    else {
      shopeeNotify(
        '領取獎勵完成 ✅',
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

getRewardList();
