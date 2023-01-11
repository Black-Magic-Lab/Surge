const sheinHeaders = {
  'Token': $persistentStore.read('SheinToken'),
  'Language': 'zh-tw',
};

function sheinNotify(subtitle = '', message = '') {
  $notification.post('SHEIN 簽到', subtitle, message, {
    'url': ''
  });
};

const checkinRequest = {
  url: 'https://api-shein.shein.com/h5/check_in/check',
  headers: {
    'token': $persistentStore.read('SheinToken'),
    'siteuid': 'iosshtw',
  }
};

const historyRequest = {
  url: 'https://api-shein.shein.com/h5/check_in/check_history?sw_site=iosshtw&sw_lang=zh-tw&activityType=&checkFrom=app&timezone=Asia%2FTaipei&siteUID=iosshtw&currency=TWD&language=zh-tw',
  headers: {
    'Token': $persistentStore.read('SheinToken'),
    'Language': 'zh-tw',
  }
};

function checkin() {
  $httpClient.get(checkinRequest, function (error, response, data) {
    if (error) {
      sheinNotify(
        '簽到失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        if (response.status === 200) {
          const obj = JSON.parse(data);
          try {
            if (obj.info.check_success === 1) {
              sheinNotify(
                '簽到成功 ✅',
                '獲得 ' + obj.info.daily_reward + ' 積分'
              );
            } else if (obj.info.check_success === 2) {
              sheinNotify(
                '簽到失敗 ‼️',
                '今日已簽到'
              );
            } else {
              sheinNotify(
                '簽到失敗 ‼️',
                'Error: ' + obj.info.check_success
              );
            }
          } catch (e) {
            sheinNotify(
              '簽到失敗 ‼️',
              e
            );
          }
        }
        // checkinHistory();
      } else {
        sheinNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
        $done();
      }
    }
    $done();
  });
}

function checkinHistory() {
  $httpClient.get(historyRequest, function (error, response, data) {
    if (error) {
      sheinNotify(
        '檢查簽到紀錄失敗 ‼️',
        '連線錯誤' + e
      );
    } else {
      if (response.status === 200) {
        const obj = JSON.parse(data);
        try {
          const historyList = obj.body.info.check_history_list;
          const today = new Date().toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).replaceAll('/', '-');
          for (const history of historyList) {
            if (history.check_date == today) {
              if (history.is_check) {
                sheinNotify(
                  '簽到成功，獲得 ' + history.reward + '積分',
                  '連線錯誤'
                );
              } else {
                sheinNotify(
                  '檢查簽到紀錄失敗 ‼️',
                  '今日未能成功簽到'
                );
              }
              break;
            }
          }
        } catch (e) {
          sheinNotify(
            '檢查簽到紀錄失敗 ‼️',
            e
          );
          $done();
        }
      } else {
        sheinNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
      }
    }
    $done();
  });
}

checkin();
