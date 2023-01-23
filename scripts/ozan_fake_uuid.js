let fakeUuid = '';

function surgeNotify(subtitle = '', message = '') {
  $notification.post('Ozan 偽造 UUID', subtitle, message, { 'url': '' });
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

async function preCheck() {
  return new Promise((resolve, reject) => {
    fakeUuid = $persistentStore.read('OzanFakeUUID') || '';
    if (!fakeUuid.length || fakeUuid === '取代這幾個字') {
      return reject(['檢查失敗 ‼️', '找不到 OzanFakeUUID']);
    }
    return resolve();
  });
}

async function replaceUuid() {
  return new Promise((resolve, reject) => {
    try {
      const regex = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
      if ($request.headers['X-DEVICE-CODE']) {
        $request.headers['X-DEVICE-CODE'] = fakeUuid;
        $request.headers['User-Agent'] = $request.headers['User-Agent'].replace(new RegExp(regex, 'g'), fakeUuid);
      }
      else {
        $request.headers['x-device-code'] = fakeUuid;
        $request.headers['user-agent'] = $request.headers['user-agent'].replace(new RegExp(regex, 'g'), fakeUuid);
      }
      return resolve();
    } catch (error) {
      return reject(['偽造 UUID 失敗 ‼️', error]);
    }
  });
}

(async () => {
  if (isManualRun(true, false)) {
    const error = '❌ 請勿手動執行此腳本';
    console.log(error);
    $done($request);
    return;
  }
  try {
    await preCheck();
    await replaceUuid();
  } catch (error) {
    handleError(error);
  }
  $done($request);
})();
