let showNotification = true;
let config = null;
let rewards = [];

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園領取任務獎勵', subtitle, message, { 'url': 'shopeetw://' });
};

function handleError(error) {
  if (Array.isArray(error)) {
    console.log(`❌ ${error[0]} ${error[1]}`);
    if (showNotification) {
      surgeNotify(error[0], error[1]);
    }
  } else {
    console.log(`❌ ${error}`);
    if (showNotification) {
      surgeNotify(error);
    }
  }
}

function getSaveObject(key) {
  const string = $persistentStore.read(key);
  return !string || string.length === 0 ? {} : JSON.parse(string);
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false;
}

function cookieToString(cookieObject) {
  let string = '';
  for (const [key, value] of Object.entries(cookieObject)) {
    string += `${key}=${value};`
  }
  return string;
}

async function delay(seconds) {
  console.log(`⏰ 等待 ${seconds} 秒`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

async function preCheck() {
  return new Promise((resolve, reject) => {
    const shopeeInfo = getSaveObject('ShopeeInfo');
    if (isEmptyObject(shopeeInfo)) {
      return reject(['檢查失敗 ‼️', '沒有新版 token']);
    }
    const shopeeHeaders = {
      'Cookie': cookieToString(shopeeInfo.token),
      'Content-Type': 'application/json',
    }
    config = {
      shopeeInfo: shopeeInfo,
      shopeeHeaders: shopeeHeaders,
    }
    return resolve();
  });
}

async function getRewardList() {
  return new Promise((resolve, reject) => {
    try {
      const getListRequest = {
        url: `https://games.shopee.tw/farm/api/task/listV2?t=${new Date().getTime()}`,
        headers: config.shopeeHeaders,
      };
      $httpClient.get(getListRequest, function (error, response, data) {
        if (error) {
          return reject(['取得列表失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            const taskGroups = obj.data.userTasks;
            for (let i = 0; i < taskGroups.length; i++) {
              const taskList = taskGroups[i];
              for (let j = 0; j < taskList.length; j++) {
                const task = taskList[j];
                const taskId = task.taskInfo.Id;
                const taskName = task.taskInfo.taskName;
                if (task.canReward === true) {
                  rewards.push({
                    taskId: taskId,
                    taskName: taskName
                  });
                }
              }
            }
            if (rewards.length) {
              console.log(`✅ 取得列表成功，總共有 ${rewards.length} 個任務可領取獎勵`);
              return resolve();
            }
            else {
              return reject(['取得列表失敗 ‼️', '沒有可領取的獎勵']);
            }
          } else {
            return reject(['取得列表失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['取得列表失敗 ‼️', error]);
    }
  });
}

async function claimReward(reward) {
  return new Promise((resolve, reject) => {
    try {
      const taskId = reward.taskId;
      const taskName = reward.taskName;

      const claimRewardRequest = {
        url: `https://games.shopee.tw/farm/api/task/reward/claim?t=${new Date().getTime()}`,
        headers: config.shopeeHeaders,
        body: {
          taskId: taskId,
          taskFinishNum: 1,
          isNewUserTask: false,
          forceClaim: false,
        },
      };

      $httpClient.post(claimRewardRequest, function (error, response, data) {
        if (error) {
          return reject(['領取失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.code === 0) {
              console.log(`✅ 領取「${taskName}」成功`);
              return resolve();
            } else if (obj.code === 409004) {
              return reject(['領取失敗 ‼️', `無法領取「${taskName}」。作物狀態錯誤，請檢查是否已收成`]);
            } else {
              return reject(['領取失敗 ‼️', `無法領取「${taskName}」，錯誤代號：${obj.code}，訊息：${obj.msg}`]);
            }
          } else {
            return reject(['領取失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['領取失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園領取任務獎勵 v20230119.1');
  try {
    await preCheck();
    await getRewardList();

    for (let i = 0; i < rewards.length; i++) {
      await delay(0.5);
      await claimReward(rewards[i]);
    }
    console.log('✅ 領取所有獎勵')
    surgeNotify('已領取所有獎勵 ✅', '');
  } catch (error) {
    handleError(error);
  }
  $done();
})();
