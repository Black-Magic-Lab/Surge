const momoHeaders = {
  'Cookie': $persistentStore.read('momoCookie'),
  'Content-Type': 'application/json;charset=utf-8',
};
function momoNotify(subtitle = '', message = '') {
  $notification.post('🍑 Momo 每日簽到', subtitle, message, { 'url': 'momo.app://' });
};

const mainPageRequest = {
  url: 'https://app.momoshop.com.tw/api/moecapp/goods/getMainPageV5',
  headers: momoHeaders,
  body: {
    'ccsession': '',
    'custNo': '',
    'ccguid': '',
    'jsessionid': '',
    'isIphoneX': '1'
  }
}

let eventPageRequest = {
  url: '',
  headers: momoHeaders,
}

let jsCodeRequest = {
  url: '',
  headers: momoHeaders,
}

let checkinRequest = {
  url: 'https://event.momoshop.com.tw/punch.PROMO',
  headers: {
    'Cookie': $persistentStore.read('momoCookie'),
    'Content-Type': 'application/json;charset=utf-8',
    'User-Agent': 'momoshop',
    'Referer': '',
  },
  body: $persistentStore.read('momoBody'),
};

function getEventPageUrl() {
  $httpClient.post(mainPageRequest, function (error, response, data) {
    if (error) {
      momoNotify(
        '取得活動頁面失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.success === true) {
            const mainInfo = obj.mainInfo;
            let found = false;
            for (const info of mainInfo) {
              if (info.adInfo && info.columnType === "3") {
                const adInfo = info.adInfo[0];
                const actionUrl = adInfo.action.actionValue;
                console.log('Momo 簽到活動頁面 👉' + actionUrl);
                found = true;
                checkinRequest.headers.Referer = actionUrl;
                eventPageRequest.url = actionUrl;
                eventPageRequest.headers.cookie = '';
                getJavascriptUrl();
                break;
                // 舊版
                // for (const adInfo of info.adInfo) {
                //   if (adInfo.adTitle && adInfo.adTitle === '天天簽到') {
                //     const actionUrl = adInfo.action.actionValue;
                //     console.log('Momo 簽到活動頁面 👉' + actionUrl);
                //     found = true;
                //     eventPageRequest.url = actionUrl;
                //     eventPageRequest.headers.cookie = '';
                //     getJavascriptUrl();
                //   }
                // }
              }
            }
            if (!found) {
              console.log('找不到簽到活動頁面');
              $done();
            }
          } else {
            momoNotify(
              '取得活動頁面失敗 ‼️',
              obj.resultMessage
            );
            $done();
          }
        }
        catch (error) {
          momoNotify(
            '取得活動頁面失敗 ‼️',
            error
          );
          $done();
        }
      } else {
        momoNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
        $done();
      }
    }
  });
}

function getJavascriptUrl() {
  $httpClient.get(eventPageRequest, function (error, response, data) {
    if (error) {
      momoNotify(
        '取得 JS URL 失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const re = /https:\/\/(.*)\/promo-cloud-setPunch-v003\.js\?t=[0-9]{13}/i;
          const found = data.match(re);
          const url = found[0];
          jsCodeRequest.url = url;
          console.log('活動 JS URL 👉' + url);
          getPromoCloudConfig();
        }
        catch (error) {
          momoNotify(
            '取得 JS URL 失敗 ‼️',
            error
          );
          $done();
        }
      } else {
        momoNotify(
          '取得 JS URL 失敗 ‼️',
          response.status
        );
        $done();
      }
    }
  });
}

function getPromoCloudConfig() {
  $httpClient.get(jsCodeRequest, function (error, response, data) {
    if (error) {
      momoNotify(
        '取得活動 ID 失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const pNoRe = /punchConfig\.pNo(.*)"(.*)"/i;
          const pNo = data.match(pNoRe)[2];
          console.log('Momo 活動 ID 👉' + pNo);
          let body = JSON.parse(checkinRequest.body);
          body.pNo = pNo;
          checkinRequest.body = body;
          checkIn();
        }
        catch (error) {
          momoNotify(
            '取得活動 ID 失敗 ‼️',
            error
          );
          $done();
        }
      } else {
        momoNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
        $done();
      }
    }
  });
}

function checkIn() {
  $httpClient.post(checkinRequest, function (error, response, data) {
    if (error) {
      momoNotify(
        '簽到失敗 ‼️',
        '連線錯誤'
      );
    } else {
      if (response.status === 200) {
        const obj = JSON.parse(data);
        if (obj.data.status === 'OK') {
          momoNotify(
            '今日簽到成功 ✅',
            ''
          );
        } else if (obj.data.status === 'RA') {
          console.log('本日已簽到');
          // momoNotify(
          //   '簽到失敗 ‼️',
          //   '本日已簽到'
          // );
        } else if (obj.data.status === 'D') {
          momoNotify(
            '簽到失敗 ‼️',
            '活動已到期'
          );
        } else if (obj.data.status === 'MAX') {
          momoNotify(
            '簽到失敗 ‼️',
            '簽到人數達到上限'
          );
        } else if (obj.data.status === 'EPN2') {
          momoNotify(
            '簽到失敗 ‼️',
            '活動不存在'
          );
        } else {
          momoNotify(
            '簽到失敗 ‼️',
            obj.data.status
          );
        }
      } else {
        momoNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
      }
    }
    $done();
  });
}

getEventPageUrl();
