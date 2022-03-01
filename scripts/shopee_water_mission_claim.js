const getListRequest = {
  url: 'https://games.shopee.tw/farm/api/task/listV2?t=' + new Date().getTime(),
  headers: {
    'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
};

let claimRewardRequest = {
  url: 'https://games.shopee.tw/farm/api/task/reward/claim?t=' + new Date().getTime(),
  headers: {
    'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
  body: {
    "taskId": null,
    "taskFinishNum": 1,
    "isNewUserTask": false,
    "forceClaim": false,
  },
};

let claims = [];

function getRewardList() {
  $httpClient.get(getListRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍤 蝦蝦果園任務列表',
        '',
        '連線錯誤‼️'
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
            console.log('🍤 蝦蝦果園沒有可領取的任務獎勵‼️');
            // $notification.post('🍤 蝦蝦果園任務列表',
            //   '',
            //   '沒有可領取的任務獎勵‼️'
            // );
            $done();
          }
        } catch (error) {
          $notification.post('🍤 蝦蝦果園任務列表',
            '',
            '獲得任務錯誤‼️' + error
          );
          $done();
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
          '',
          '請重新更新 Cookie 重試 🔓'
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
      $notification.post('🍤 蝦蝦果園任務列表',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            console.log('🍤 蝦蝦果園任務 ' + taskName + ' 領取成功 ✅');
            // $notification.post('🍤 蝦蝦果園任務', 
            //   taskName, 
            //   '自動領取水滴成功',
            // );
          } else {
            $notification.post('🍤 蝦蝦果園任務 ',
              taskName,
              ' 自動領取錯誤' + obj.msg + '‼️'
            );
          }
        } catch (error) {
          $notification.post('🍤 蝦蝦果園任務 ',
            taskName,
            ' 自動領取錯誤‼️'
          );
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
          '',
          '請重新更新 Cookie 重試 🔓'
        );
      }
    }
    if (index < claims.length - 1) {
      claimReward(index + 1);
    }
    else {
      $notification.post('🍤 蝦蝦果園任務自動領取完成 ✅',
        '',
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