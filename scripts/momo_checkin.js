const momoHeaders = {
  'Cookie': $persistentStore.read('momoCookie'),
  'Content-Type': 'application/json;charset=utf-8',
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
    'User-Agent': 'momoshop'
  },
  body: $persistentStore.read('momoBody'),
};

function getEventPageUrl() {
  $httpClient.post(mainPageRequest, function (error, response, data) {
    if (error) {
      $notification.post('Momo 獲得活動頁面失敗‼️',
        '',
        '連線錯誤‼️'
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
                eventPageRequest.url = actionUrl;
                eventPageRequest.headers.cookie = '';
                getJavascriptUrl();
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
              $done();
            }
          } else {
            $notification.post('Momo 獲得活動頁面失敗‼️',
              '',
              obj.resultMessage
            );
          }
        }
        catch (error) {
          $notification.post('Momo 獲得活動頁面失敗‼️',
            '',
            error
          );
          $done();
        }
      } else {
        $notification.post('Momo Cookie 已過期‼️',
          '',
          '請重新登入 🔓'
        );
        $done();
      }
    }
  });
}

function getJavascriptUrl() {
  $httpClient.get(eventPageRequest, function (error, response, data) {
    if (error) {
      $notification.post('Momo 獲得 JS URL 失敗‼️',
        '',
        '連線錯誤‼️'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const re = /https:\/\/(.*)\/promo-momo-punch\.js\?t=[0-9]{13}/i;
          const found = data.match(re);
          const url = found[0];
          jsCodeRequest.url = url;
          console.log('Momo 活動 JS URL 👉' + url);
          getPromoCloudConfig();
        }
        catch (error) {
          $notification.post('Momo 獲得 JS URL 失敗‼️',
            '',
            error
          );
          $done();
        }
      } else {
        $notification.post('Momo 獲得 JS URL 失敗‼️',
          '',
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
      $notification.post('Momo 獲得活動 ID 失敗‼️',
        '',
        '連線錯誤‼️'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const pNoRe = /promoCloudConfig\.pNo(.*)"(.*)"/i;
          const pNo = data.match(pNoRe)[2];
          console.log('Momo 活動 ID 👉' + pNo);
          let body = JSON.parse(checkinRequest.body);
          body.pNo = pNo;
          checkinRequest.body = body;
          checkIn();
        }
        catch (error) {
          $notification.post('Momo 獲得活動 ID 失敗‼️',
            '',
            error
          );
          $done();
        }
      } else {
        $notification.post('Momo Cookie 已過期‼️',
          '',
          '請重新登入 🔓'
        );
        $done();
      }
    }
  });
}

function checkIn() {
  $httpClient.post(checkinRequest, function (error, response, data) {
    if (error) {
      $notification.post('Momo 簽到失敗‼️',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status === 200) {
        const obj = JSON.parse(data);
        if (obj.data.status === 'OK') {
          $notification.post('Momo 今日簽到成功 ✅',
            '',
            ''
          );
        } else if (obj.data.status === 'RA') {
          console.log('Momo 簽到失敗‼️ 本日已簽到‼️');
          $notification.post('Momo 簽到失敗‼️',
            '',
            '本日已簽到‼️'
          );
        } else if (obj.data.status === 'D') {
          $notification.post('Momo 簽到失敗‼️',
            '',
            '活動已過期‼️'
          );
        } else if (obj.data.status === 'MAX') {
          $notification.post('Momo 簽到失敗‼️',
            '',
            '簽到已達上限‼️'
          );
        } else if (obj.data.status === 'EPN2') {
          $notification.post('Momo 簽到失敗‼️',
            '',
            '活動不存在‼️'
          );
        } else {
          // console.log('Momo 簽到失敗‼️ 本日已簽到‼️');
          $notification.post('Momo 簽到失敗‼️',
            '',
            obj.data.status
          );
        }
      } else {
        $notification.post('Momo Cookie 已過期‼️',
          '',
          '請重新登入 🔓'
        );
      }
    }
    $done();
  });
}

getEventPageUrl();