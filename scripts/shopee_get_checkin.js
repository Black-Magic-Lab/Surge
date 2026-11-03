let showNotification = true;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦皮簽到 token', subtitle, message, { 'url': 'shopeetw://' });
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

async function getCheckinPayload() {
  return new Promise((resolve, reject) => {
    try {
      const payload = JSON.parse($request.body);
      if (payload) {
        let shopeeInfo = getSaveObject('ShopeeInfo');
        shopeeInfo.checkinPayload = payload;
        const save = $persistentStore.write(JSON.stringify(shopeeInfo, null, 4), 'ShopeeInfo');
        if (!save) {
          return reject(['保存失敗 ‼️', '無法儲存簽到資料']);
        } else {
          return resolve();
        }
      } else {
        return reject(['保存失敗 ‼️', '請重新登入']);
      }
    } catch (error) {
      return reject(['保存失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦皮取得簽到資料 v20230608.1');
  try {
    if (isManualRun(true, false)) {
      throw '請勿手動執行此腳本';
    }

    await getCheckinPayload();
    console.log('✅ 簽到資料保存成功');
    surgeNotify('保存成功 🍪', '');
  } catch (error) {
    handleError(error);
  }
  $done({});
})();
