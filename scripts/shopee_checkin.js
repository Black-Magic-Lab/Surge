const refershRequest = {
  url: 'https://mall.shopee.tw/api/v4/client/refresh',
  headers: {
    Cookie: 'shopee_token=' + $persistentStore.read('ShopeeToken') + ';'
  },
};

const accountInfoRequest = {
  url: 'https://shopee.tw/api/v2/user/account_info?from_wallet=false&skip_address=1&need_cart=1',
  headers: {
    Cookie: $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
  },
};

const checkinRequest = {
  url: 'https://shopee.tw/mkt/coins/api/v2/checkin',
  headers: {
    'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
  }
};

function updateSPC_EC() {
  $httpClient.get(refershRequest, function (error, response, data) {
    if (error) {
      $notification.post('蝦皮 SPC_EC Cookie',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status == 200) {
        const cookie = $persistentStore.write(response.headers['Set-Cookie'].split('SPC_EC=')[1].split(';')[0], 'SPC_EC');
        if (cookie) {
          // $notification.post('蝦皮 SPC_EC 保存成功🎉', '', '');
          updateCookie();
        } else {
          $notification.post('蝦皮 SPC_EC Cookie 保存失敗‼️',
            '',
            '請重新登入'
          );
        }
      } else {
        $notification.post('蝦皮 SPC_EC Cookie 保存失敗‼️',
          '',
          '請重新登入'
        );
      }
    }
    $done();
  });
}

function updateCookie() {
  $httpClient.get(accountInfoRequest, function (error, response, data) {
    if (error) {
      $notification.post('蝦皮 Cookie 保存失敗‼️',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status == 200) {
        const cookie = $persistentStore.write(
          response.headers['Set-Cookie'],
          'CookieSP'
        );
        if (cookie) {
          checkin();
          // $notification.post('蝦皮 Cookie 保存成功🎉', 
          // '', 
          // ''
          // );
        } else {
          $notification.post('蝦皮 Cookie 保存失敗‼️',
            '',
            '請重新登入'
          );
        }
      } else {
        $notification.post('蝦皮 Cookie 保存失敗‼️',
          '',
          '請重新登入'
        );
      }
      $done();
    }
  });
}

function checkin() {
  $httpClient.post(checkinRequest, function (error, response, data) {
    if (error) {
      $notification.post('蝦皮簽到失敗‼️',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status === 200) {
        const obj = JSON.parse(data);
        if (obj.data.success) {
          const coins = obj.data.increase_coins;
          const checkInDay = obj.data.check_in_day;
          $notification.post('蝦皮已連續簽到 ' + checkInDay + ' 天',
            '',
            '今日已領取 ' + coins + '💰💰💰'
          );
        } else {
          $notification.post('蝦皮簽到失敗‼️',
            '',
            '本日已簽到‼️'
          );
        }
      } else {
        $notification.post('蝦皮 Cookie 已過期‼️',
          '',
          '請重新登入 🔓'
        );
      }
    }
    $done();
  });
}

updateSPC_EC();