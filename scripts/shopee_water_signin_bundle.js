const getSignInBundleListRequest = {
  url: 'https://games.shopee.tw/farm/api/sign_in_bundle/list?t=' + new Date().getTime(),
  headers: {
    'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
};

let claimSignInBundleRequest = {
  url: 'https://games.shopee.tw/farm/api/sign_in_bundle/claim?t=' + new Date().getTime(),
  headers: {
    'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
    'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
  body: {
    'day': 0,
    'forceClaim': true
  }
};

function getSignInBundleList() {
  $httpClient.get(getSignInBundleListRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍤 蝦蝦果園獲得今日獎勵列表',
        '',
        '連線錯誤‼️'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          const day = obj.data.day;
          const claimed = obj.data.signInBundlePrizes[day - 1].claimed;
          if (claimed) {
            console.log('🍤 蝦蝦果園今日已簽到‼️');
            // $notification.post('🍤 蝦蝦果園今日簽到獎勵',
            //   '',
            //   '今日已簽到‼️'
            // );
            $done();
            return;
          }
          claimSignInBundleRequest.body.day = day;
          claimSignInBundle(day);
        } catch (error) {
          $notification.post('🍤 蝦蝦果園獲得今日簽到獎勵列表',
            '',
            '發生錯誤‼️' + error
          );
          $done();
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
          '',
          '請重新更新 Cookie 重試 🔓'
        );
        $done();
      }
    }
  });
}

function claimSignInBundle() {
  $httpClient.post(claimSignInBundleRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍤 蝦蝦果園今日簽到獎勵',
        '',
        '連線錯誤‼️'
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
            $notification.post('🍤 蝦蝦果園今日簽到成功 ✅',
            '',
            '獲得 ' + prizeName
          );
          }
        } catch (error) {
          $notification.post('🍤 蝦蝦果園今日簽到獎勵',
            '',
            '獲得獎勵錯誤‼️' + error
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

getSignInBundleList();