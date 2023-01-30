let showNotification = true;
const fakeAppVersion = '3.9.9';

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍟 麥當勞 token', subtitle, message, { 'url': 'mcdonalds.app://' });
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
      const token = $request.headers['accessToken'] || $request.headers['accesstoken'];
      let mcdonaldsInfo = getSaveObject('McdonaldsInfo');
      mcdonaldsInfo.token = token;
      const save = $persistentStore.write(JSON.stringify(mcdonaldsInfo, null, 4), 'McdonaldsInfo');
      if (!save) {
        return reject(['保存失敗 ‼️', '無法儲存 token']);
      } else {
        return resolve();
      }
    } catch (error) {
      return reject(['保存失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 麥當勞自動儲存 token v20230125.1');
  try {
    if (isManualRun(true, false)) {
      throw '請勿手動執行此腳本';
    }
    await getToken();
    console.log('✅ token 保存成功');
    surgeNotify('保存成功 ✅', '');
  } catch (error) {
    handleError(error);
  }
  $request.headers['version'] = fakeAppVersion;
  $request.headers['appVersion'] = fakeAppVersion;
  $done($request);
})();
