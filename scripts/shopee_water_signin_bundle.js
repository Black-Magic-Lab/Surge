const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園每日簽到獎勵', subtitle, message, { 'url': 'shopeetw://' });
};

const getSignInBundleListRequest = {
  url: 'https://games.shopee.tw/farm/api/sign_in_bundle/list?t=' + new Date().getTime(),
  headers: shopeeHeaders,
};

let claimSignInBundleRequest = {
  url: 'https://games.shopee.tw/farm/api/sign_in_bundle/claim?t=' + new Date().getTime(),
  headers: shopeeHeaders,
  body: {
    'day': 0,
    'forceClaim': true
  }
};

function getSignInBundleList() {
  $httpClient.get(getSignInBundleListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '取得列表失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          const day = obj.data.day;
          const claimed = obj.data.signInBundlePrizes[day - 1].claimed;
          if (claimed) {
            console.log('今日已簽到');
            // shopeeNotify(
            //   '取得列表失敗 ‼️',
            //   '今日已簽到'
            // );
            $done();
            return;
          }
          claimSignInBundleRequest.body.day = day;
          claimSignInBundle(day);
        } catch (error) {
          shopeeNotify(
            '取得列表失敗 ‼️',
            error
          );
          $done();
        }
      } else {
        shopeeNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
        $done();
      }
    }
  });
}

function claimSignInBundle() {
  $httpClient.post(claimSignInBundleRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '簽到失敗 ‼️',
        '請重新登入'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const day = obj.data.day;
            const prize = obj.data.signInBundlePrizes[day - 1];
            let prizeName = '';
            if (prize.prizeDetail)
            {
              prizeName = prize.prizeDetail.prizeName;
            }
            else {
              prizeName = prize.prizeNum + ' 滴水 💧';
            }
            shopeeNotify(
              '簽到成功 ✅',
              '獲得 ' + prizeName
            );
          }
          else {
            shopeeNotify(
              '簽到失敗 ‼️',
              obj.msg
            );
          }
        } catch (error) {
          shopeeNotify(
            '簽到失敗 ‼️',
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

getSignInBundleList();
