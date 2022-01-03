var refreshURL = {
  url: 'https://mall.shopee.tw/api/v4/client/refresh',
  headers: {
    Cookie:
      'shopee_token=' + $persistentStore.read('ShopeeToken') + ';'
  },
};

var accountInfoURL = {
  url: 'https://shopee.tw/api/v2/user/account_info?from_wallet=false&skip_address=1&need_cart=1',
  headers: {
    Cookie:
      $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
  },
};

var checkinURL = {
  url: 'https://shopee.tw/mkt/coins/api/v2/checkin',
  headers: {
    'Cookie': $persistentStore.read("CookieSP") + ';SPC_EC=' + $persistentStore.read("SPC_EC") + ';',
    'X-CSRFToken': $persistentStore.read("CSRFTokenSP"),
  }
};

function updateSPC_EC() {
  $httpClient.get(refreshURL, function (error, response, data) {
    if (error) {
      $notification.post('蝦皮 SPC_EC Cookie', '', '連線錯誤‼️');
      $done();
    } else {
      if (response.status == 200) {
        let cookie = $persistentStore.write(response.headers['Set-Cookie'].split('SPC_EC=')[1].split(';')[0], 'SPC_EC');
        if (cookie) {
          // $notification.post('蝦皮 SPC_EC 保存成功🎉', '', '');
          updateCookie();
        } else {
          $notification.post('蝦皮 SPC_EC Cookie 保存失敗‼️', '', '請重新登入');
        }
        $done();
      } else {
        $notification.post('蝦皮 SPC_EC Cookie 保存失敗‼️', '', '請重新登入');
      }
    }
  });
}

function updateCookie() {
  $httpClient.get(accountInfoURL, function (error, response, data) {
    if (error) {
      $notification.post('蝦皮 Cookie 保存失敗‼️', '', '連線錯誤‼️');
      $done();
    } else {
      if (response.status == 200) {
        let cookie = $persistentStore.write(
          response.headers['Set-Cookie'],
          'CookieSP'
        );
        if (cookie) {
          checkin();
          // $notification.post('蝦皮 Cookie 保存成功🎉', '', '');
        } else {
          $notification.post('蝦皮 Cookie 保存失敗‼️', '', '請重新登入');
        }
        $done();
      } else {
        $notification.post('蝦皮 Cookie 保存失敗‼️', '', '請重新登入');
      }
    }
  });
}

function checkin() {
  $httpClient.post(checkinURL, function (error, response, data) {
    if (error) {
      $notification.post("蝦皮簽到失敗‼️", "", "連線錯誤‼️")
      $done();
    } else {
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj["data"]["success"]) {
          // var user = obj["data"]["username"];
          var coins = obj["data"]["increase_coins"];
          var checkinday = obj["data"]["check_in_day"];
          $notification.post("蝦皮已連續簽到 " + checkinday + " 天", "", "今日已領取 " + coins + "💰💰💰");
          $done();
        }
        else {
          $notification.post("蝦皮簽到失敗‼️", "", "本日已簽到‼️");
        }
        $done();
      } else {
        $notification.post("蝦皮 Cookie 已過期‼️", "", "請重新登入 🔓");
        $done();
      }
    }
  });
}

updateSPC_EC();
