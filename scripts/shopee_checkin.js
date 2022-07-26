const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦皮簽到', subtitle, message, { 'url': 'shopeetw://' });
};

const refershRequest = {
  url: 'https://mall.shopee.tw/api/v4/client/refresh',
  headers: {
    Cookie: 'shopee_token=' + $persistentStore.read('ShopeeToken') + ';'
  },
};

const accountInfoRequest = {
  url: 'https://shopee.tw/api/v2/user/account_info?from_wallet=false&skip_address=1&need_cart=1',
  headers: shopeeHeaders,
};

const checkinRequest = {
  url: 'https://shopee.tw/mkt/coins/api/v2/checkin',
  headers: shopeeHeaders,
};

function updateSPC_EC() {
  $httpClient.get(refershRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'SPC_EC 保存失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status == 200) {
        const cookie = $persistentStore.write(response.headers['Set-Cookie'].split('SPC_EC=')[1].split(';')[0], 'SPC_EC');
        if (cookie) {
          // shopeeNotify(
          //   'SPC_EC 保存成功 🎉',
          //   ''
          // );
          updateCookie();
        } else {
          shopeeNotify(
            'SPC_EC 保存失敗 ‼️',
            '請重新登入'
          );
          $done();
        }
      } else {
        shopeeNotify(
          'SPC_EC 保存失敗 ‼️',
          '請重新登入'
        );
        $done();
      }
    }
  });
}

function updateCookie() {
  $httpClient.get(accountInfoRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        'Cookie 保存失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status == 200) {
        const cookie = $persistentStore.write(
          response.headers['Set-Cookie'],
          'CookieSP'
        );
        if (cookie) {
          checkin();
          // shopeeNotify(
          //   'Cookie 更新成功 🍪',
          //   ''
          // );
        } else {
          shopeeNotify(
            'Cookie 保存失敗 ‼️',
            '請重新登入'
          );
          $done();
        }
      } else {
        shopeeNotify(
          'Cookie 保存失敗 ‼️',
          '請重新登入'
        );
        $done();
      }
    }
  });
}

function checkin() {
  $httpClient.post(checkinRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '簽到失敗 ‼️',
        '連線錯誤'
      );
    } else {
      if (response.status === 200) {
        const obj = JSON.parse(data);
        if (obj.data.success) {
          const coins = obj.data.increase_coins;
          const checkInDay = obj.data.check_in_day;
          shopeeNotify(
            '簽到成功，目前已連續簽到 ' + checkInDay + ' 天',
            '今日已領取 ' + coins + '💰💰💰'
          );
        } else {
          console.log('本日已簽到 ‼️');
          shopeeNotify(
            '簽到失敗 ‼️',
            '本日已簽到'
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

updateSPC_EC();
