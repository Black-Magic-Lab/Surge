let showNotification = true;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦皮 token', subtitle, message, { 'url': 'shopeetw://' });
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

function parseCookie(cookieString) {
  return cookieString
    .split(';')
    .map(v => v.split('='))
    .filter((v) => v.length > 1)
    .reduce((acc, v) => {
      let value = decodeURIComponent(v[1].trim());
      for (let index = 2; index < v.length; index++) {
        if (v[index] === '') {
          value += '=';
        }
      }
      acc[decodeURIComponent(v[0].trim())] = value;
      return acc;
    }, {});
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
      const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
      if (cookie) {
        const cookieObject = parseCookie(cookie);

        // 舊方法，2/1 之後廢棄
        const shopee_token = cookieObject.shopee_token;
        const SPC_EC = cookieObject.SPC_EC;

        const saveCookie = $persistentStore.write(cookie, 'CookieSP');
        const saveToken = $persistentStore.write(shopee_token, 'ShopeeToken');
        const saveSPC_EC = $persistentStore.write(SPC_EC, 'SPC_EC');

        if (!(saveCookie && saveToken && saveSPC_EC)) {
          return reject(['保存失敗 ‼️', '無法儲存 token']);
        }
        // -----------------

        let shopeeInfo = getSaveObject('ShopeeInfo');
        const tokenInfo = {
          SPC_EC: cookieObject.SPC_EC,
          SPC_R_T_ID: cookieObject.SPC_R_T_ID,
          SPC_R_T_IV: cookieObject.SPC_R_T_IV,
          SPC_SI: cookieObject.SPC_SI,
          SPC_ST: cookieObject.SPC_ST,
          SPC_T_ID: cookieObject.SPC_T_ID,
          SPC_T_IV: cookieObject.SPC_T_IV,
          SPC_U: cookieObject.SPC_U,
        }
        shopeeInfo.token = tokenInfo;
        shopeeInfo.userName = cookieObject.username;
        shopeeInfo.shopeeToken = cookieObject.shopee_token;

        const save = $persistentStore.write(JSON.stringify(shopeeInfo, null, 4), 'ShopeeInfo');
        if (!save) {
          return reject(['保存失敗 ‼️', '無法儲存 token']);
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
  console.log('ℹ️ 蝦皮取得 token v20230123.1');
  try {
    if (isManualRun(true, false)) {
      throw '請勿手動執行此腳本';
    }

    await getToken();
    console.log('✅ token 保存成功');
    surgeNotify('保存成功 🍪', '');
  } catch (error) {
    handleError(error);
  }
  $done({});
})();
