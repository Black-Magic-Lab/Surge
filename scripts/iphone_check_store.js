const debug = false;
const model = $persistentStore.read('iPhoneModel');

var checkRequest = {
  url: '',
  headers: {
    'x-ma-pcmh': 'REL-5.17.0',
    'X-DeviceConfiguration': 'ss=3.00;dim=1170x2532;m=iPhone;v=iPhone14,2;vv=5.17;sv=15.3'
  },
}


const stores = ['R713', 'R694'];

function checkStore(model, index) {
  const store = stores[index];
  checkRequest['url'] = 'https://mobileapp.apple.com/merch/p/tw/pickup/quote/' + model + '?partNumber=' + model + '&store=' + store;
  $httpClient.get(checkRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍎 直營店庫存檢查失敗 ❌', '', '連線錯誤‼️')
    } else {
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj.availabilityStatus != 'NOT_AVAILABLE') {
          $notification.post('📱 ' + model + ' 有貨', '', obj.pickupQuote);
        } 
        else {
          console.log('📱 ' + obj.storeNumber + ' ' + obj.pickupQuote);
        }
        if (index < stores.length - 1) {
          checkStore(model, index + 1);
        }
        else {
          $done();
        }
      } else {
        $notification.post('🍎 直營店庫存檢查失敗 ❌', '', '連線錯誤‼️');
      }
    }
  });
}

if (Date.now() < 1663286400000) {
  console.log('還沒開賣');
  $done();
}
else if (new Date().getHours() < 8 || new Date().getHours() > 21) {
  console.log('不在營業時間');
  $done();
}
else {
  checkStore(model, 0);
}
