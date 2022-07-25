const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeGroceryStoreToken = $persistentStore.read('ShopeeGroceryStoreToken') || '';
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};

const claimGroceryStoreWaterRequest = {
  url: 'https://games.shopee.tw/farm/api/grocery_store/claim',
  headers: shopeeHeaders,
  body: {
    'S': shopeeGroceryStoreToken
  }
};

function claimGroceryStoreWater() {
  if (!shopeeGroceryStoreToken.length) {
    $notification.post('🍤 蝦蝦果園領取商店水滴錯誤‼️',
        '',
        '無法取得 token，請先在特價商店領取一次水滴以儲存 token'
      );
    $done();
    return;
  }
  $httpClient.post(claimGroceryStoreWaterRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍤 蝦蝦果園領取商店水滴錯誤‼️',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            $notification.post('🍤 蝦蝦果園領取商店水滴成功 ✅',
              '',
              '',
            );
          }
          else if (obj.msg === 'has claimed') {
            $notification.post('🍤 蝦蝦果園領取商店水滴錯誤‼️',
              '',
              '已經領過本日水滴',
            );
          }
          else {
            $notification.post('🍤 蝦蝦果園領取商店水滴錯誤‼️',
              '',
              obj.msg,
            );
          }
        } catch (error) {
          $notification.post('🍤 蝦蝦果園領取商店水滴錯誤‼️',
            '',
            error,
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
}

claimGroceryStoreWater();