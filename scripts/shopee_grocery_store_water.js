const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeGroceryStoreToken = $persistentStore.read('ShopeeGroceryStoreToken') || '';
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園道具商店水滴', subtitle, message, { 'url': 'shopeetw://' });
};

const claimGroceryStoreWaterRequest = {
  url: 'https://games.shopee.tw/farm/api/grocery_store/claim',
  headers: shopeeHeaders,
  body: {
    'S': shopeeGroceryStoreToken
  }
};

function claimGroceryStoreWater() {
  $httpClient.post(claimGroceryStoreWaterRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '領取失敗 ‼️',
        '連線錯誤'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            shopeeNotify(
              '領取成功 ✅',
              ''
            );
          }
          else if (obj.msg === 'has claimed') {
            shopeeNotify(
              '領取失敗 ‼️',
              '每日只能領一次'
            );
          }
          else {
            shopeeNotify(
              '領取失敗 ‼️',
              obj.msg
            );
          }
        } catch (error) {
          shopeeNotify(
            '領取失敗 ‼️',
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
}

if (!shopeeGroceryStoreToken.length) {
  shopeeNotify(
    '領取失敗 ‼️',
    '請先在道具商店領取一次水滴，以儲存 token'
  );
  $done();
}
else {
  claimGroceryStoreWater();
}
