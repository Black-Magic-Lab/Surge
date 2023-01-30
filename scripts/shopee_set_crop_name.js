const cropName = '改掉這一行'; // ← 把大布丁改成想要的種子關鍵字，改完之後按「執行」即可。例如：大布丁、口香糖、養樂多、豆漿、牛奶糖、4蝦幣...

//================================================================
let showNotification = true;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園', subtitle, message, { 'url': 'shopeetw://' });
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

async function saveAutoCropName() {
  return new Promise((resolve, reject) => {
    try {
      if (cropName.length === 0 || cropName === '改掉這一行') {
        return reject(['保存失敗 ‼️', '請先設定目標作物']);
      }
      let shopeeFarmInfo = getSaveObject('ShopeeFarmInfo');
      shopeeFarmInfo.autoCropSeedName = cropName;
      const save = $persistentStore.write(JSON.stringify(shopeeFarmInfo, null, 4), 'ShopeeFarmInfo');
      if (!save) {
        return reject(['保存失敗 ‼️', '無法儲存目標作物']);
      } else {
        return resolve();
      }
    } catch (error) {
      return reject(['保存失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦蝦果園設定自動種植作物 v20230125.1');
  try {
    await saveAutoCropName();
    console.log(`✅ 目標作物「${cropName}」保存成功`);
    surgeNotify('目標作物保存成功 ✅', `未來將自動種植「${cropName}」🌱`);
  } catch (error) {
    handleError(error);
  }
  $done({});
})();
