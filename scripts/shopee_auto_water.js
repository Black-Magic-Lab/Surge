const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園自動澆水', subtitle, message, { 'url': 'shopeetw://' });
};

const waterRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/crop/water?t=' + new Date().getTime(),
  headers: shopeeHeaders,
  body: $persistentStore.read('ShopeeCrop'),
};

$httpClient.post(waterRequest, function (error, response, data) {
  if (error) {
    shopeeNotify(
      '澆水失敗 ‼️',
      '連線錯誤'
    );
  } else {
    if (response.status === 200) {
      try {
        const obj = JSON.parse(data);
        if (obj.msg === 'success') {
          const useNumber = obj.data.useNumber;
          const state = obj.data.crop.state;
          const exp = obj.data.crop.exp;
          const levelExp = obj.data.crop.meta.config.levelConfig[state.toString()].exp;
          const remain = levelExp - exp;
          if (remain === 0) {
            shopeeNotify(
              '澆水成功 ✅',
              '種植完畢，作物可以收成啦 🌳'
            );
          }
          else if (remain < 50) {
            shopeeNotify(
              '澆水成功 ✅',
              '本次澆了：' + useNumber + ' 滴水 💧\n' + '剩餘 ' + remain + ' 滴水收成'
            );
          }
          else {
            console.log('本次澆了：' + useNumber + ' 滴水 💧\n' + '剩餘 ' + remain + ' 滴水成長至下一階段');
            // shopeeNotify(
            //   '澆水成功 ✅',
            //   '本次澆了：' + useNumber + ' 滴水 💧\n' + '剩餘 ' + remain + ' 滴水成長至下一階段'
            // );
          }
        } else if (obj.msg === 'resource not enough') {
          shopeeNotify(
            '澆水失敗 ‼️',
            '水壺目前沒水'
          );
        } else if (obj.msg === 'invalid param') {
          shopeeNotify(
            '澆水失敗 ‼️',
            '作物狀態錯誤，請先手動澆水一次'
          );
        } else if (obj.msg === 'invalid crop state') {
          const cropState = parseInt($persistentStore.read('ShopeeCropState'));
          if (cropState < 3) {
            $persistentStore.write((cropState + 1).toString(), 'ShopeeCropState');
            shopeeNotify(
              '澆水失敗 ‼️',
              '作物狀態錯誤，請檢查是否已收成'
            );
          }
        } else {
          shopeeNotify(
            '澆水失敗 ‼️',
            obj.msg
          );
        }
      } catch (error) {
        shopeeNotify(
          '澆水失敗 ‼️',
          error
        );
      }
    } else {
      shopeeNotify(
        'Cookie 已過期 ‼️',
        '請重新登入'
      );
    }
  }
  $done();
});
