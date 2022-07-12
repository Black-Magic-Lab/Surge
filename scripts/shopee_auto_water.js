const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};

const waterRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/crop/water?t=' + new Date().getTime(),
  headers: shopeeHeaders,
  body: $persistentStore.read('ShopeeCrop'),
};

$httpClient.post(waterRequest, function (error, response, data) {
  if (error) {
    $notification.post('🍤 蝦皮自動澆水',
      '',
      '連線錯誤‼️'
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
          if (remain < 50) {
            $notification.post('🍤 蝦皮自動澆水成功 ✅',
              '本次澆了：' + useNumber + ' 滴水💧',
              '剩餘 ' + remain + ' 滴水收成🌳'
            );
          }
          else {
            console.log('🍤 蝦皮自動澆水成功 ✅ \n本次澆了：' + useNumber + ' 滴水💧，剩餘 ' + remain + ' 滴水成長至下一階段🌳');
            // $notification.post('🍤 蝦皮自動澆水成功 ✅',
            //   '本次澆了：' + useNumber + ' 滴水💧',
            //   '剩餘 ' + remain + ' 滴水成長至下一階段🌳'
            // );
          }
        } else if (obj.msg === 'resource not enough') {
          $notification.post('🍤 蝦皮自動澆水',
            '',
            '水壺目前沒水‼️'
          );
        } else if (obj.msg === 'invalid param') {
          $notification.post('🍤 蝦皮自動澆水',
            '',
            '種植作物錯誤，請先手動澆水一次‼️'
          );
        } else if (obj.msg === 'invalid crop state') {
          const cropState = parseInt($persistentStore.read('ShopeeCropState'));
          if (cropState < 3) {
            $persistentStore.write((cropState + 1).toString(), 'ShopeeCropState');
            $notification.post('🍤 蝦皮自動澆水',
              '',
              '作物狀態錯誤，請看看是否已經收成‼️'
            );
          }
        } else {
          $notification.post('🍤 蝦皮自動澆水',
            '',
            obj.msg
          );
        }
      } catch (error) {
        $notification.post('🍤 蝦皮自動澆水',
          '',
          '澆水失敗‼️' + error
        );
      }
    } else {
      $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
        '',
        '請重新更新 Cookie 重試 🔓'
      );
    }
  }
  $done();
});