let showNotification = true;
let token = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('SHEIN 簽到', subtitle, message, {
    'url': ''
  });
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

async function preCheck() {
  return new Promise((resolve, reject) => {
    const sheinToken = $persistentStore.read('SheinToken');
    if (!sheinToken || sheinToken.length === 0) {
      return reject(['檢查失敗 ‼️', '找不到 token']);
    }
    token = sheinToken;
    return resolve();
  });
}

async function checkIn() {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://api-shein.shein.com/h5/check_in/check',
        headers: {
          'token': token,
          'siteuid': 'iosshtw',
        }
      };
      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['簽到失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.info.check_success === 1) {
              return resolve(obj.info.daily_reward);
            } else if (obj.info.check_success === 2) {
              showNotification = false;
              return reject(['簽到失敗 ‼️', '今日已簽到']);
            } else {
              return reject(['簽到失敗 ‼️', 'Error: ' + obj.info.check_success]);
            }
          } else {
            return reject(['簽到失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['簽到失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ SHEIN 自動簽到 v20230115.1');
  try {
    await preCheck();
    console.log('✅ 檢查成功');
    await checkIn();
    console.log('✅ 簽到成功');

    surgeNotify('簽到成功 ✅', '');
  } catch (error) {
    handleError(error);
  }
  $done();
})();
