const token = '改掉這一行';

//================================================================
let showNotification = true;

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

async function saveToken() {
  return new Promise((resolve, reject) => {
    try {
      if (token.length === 0 || token === '改掉這一行') {
        return reject(['保存失敗 ‼️', '請先設定 token']);
      }
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
  console.log('ℹ️ 麥當勞設定 token v20230125.1');
  try {
    await saveToken();
    console.log('✅ token 保存成功');
    surgeNotify('保存成功 ✅', '');
  } catch (error) {
    handleError(error);
  }
  $done({});
})();
