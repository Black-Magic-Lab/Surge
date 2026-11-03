let showNotification = true;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('SHEIN token', subtitle, message, { 'url': '' });
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

function isManualRun(checkRequest = false, checkResponse = false) {
  if (checkRequest) {
    return typeof $request === 'undefined' || ($request.body && JSON.parse($request.body).foo === 'bar');
  }
  if (checkResponse) {
    return typeof $response === 'undefined' || ($response.body && JSON.parse($response.body).foo === 'bar');
  }
  return false;
}

async function getToken() {
  return new Promise((resolve, reject) => {
    try {
      const token = $request.headers['token'] || $request.headers['Token'];
      if (token) {
        const save = $persistentStore.write(token, 'SheinToken');
        if (save) {
          return resolve();
        } else {
          return reject(['保存失敗 ‼️', '無法儲存 token']);
        }
      } else {
        return reject(['保存失敗 ‼️', '無法取得 token']);
      }
    } catch (error) {
      return reject(['保存失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ SHEIN 取得 token v20230115.1');
  try {
    if (isManualRun(true, false)) {
      const error = '❌ 請勿手動執行此腳本';
      console.log(error);
      surgeNotify(error, '');
      $done({});
      return;
    }

    await getToken();
    console.log('✅ token 保存成功');
    surgeNotify(
      '保存成功 🍪',
      ''
    );
  } catch (error) {
    handleError(error);
  }
  $done({});
})();
