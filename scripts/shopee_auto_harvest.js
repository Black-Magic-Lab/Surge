const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Content-Type': 'application/json',
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園自動收成', subtitle, message, { 'url': 'shopeetw://' });
};

const harvestRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/crop/harvest',
  headers: shopeeHeaders,
  body: $persistentStore.read('ShopeeCrop'),
};

$httpClient.post(harvestRequest, function (error, response, data) {
  if (error) {
    shopeeNotify(
      '收成失敗 ‼️',
      '連線錯誤'
    );
  } else {
    if (response.status === 200) {
      try {
        const obj = JSON.parse(data);
        if (obj.code === 0) {
          const cropName = obj.data.crop.meta.name;
          const ctaUrl = obj.data.reward.rewardItems[0].itemExtraData.ctaUrl;
          if (ctaUrl != '') {
            shopeeNotify(
              '收成成功 ✅',
              `獲得 ${cropName} 🌳`
            );
          } else {
            console.log(`已經收成過 ${cropName} 了`);
          }
        }
        else if (obj.code === 409004) {
          console.log('作物尚未達到收成階段');
        } else if (obj.code === 404000) {
          shopeeNotify(
            '收成失敗 ‼️',
            '找不到作物'
          );
        } else {
          shopeeNotify(
            '收成失敗 ‼️',
            obj.code + ' ' + obj.msg
          );
        }
      } catch (error) {
        shopeeNotify(
          '收成失敗 ‼️',
          error
        );
      }
    } else {
      shopeeNotify(
        '收成失敗 ‼️',
        response.status
      );
    }
  }
  $done();
});
