const debug = false;
const model = $persistentStore.read("iPhoneModel")

var checkRequest = {
    url: '',
    headers: {
        'x-ma-pcmh': 'REL-5.14.0',
        'X-DeviceConfiguration': 'ss=3.00;dim=1170x2532;m=iPhone;v=iPhone14,2;vv=5.14;sv=15.0.1'
    },
}


const stores = ['R713', 'R694'];

for (const store of stores) {
    checkStore(model, store);
}

function checkStore(model, store) {
    checkRequest['url'] = 'https://mobileapp.apple.com/merch/p/tw/pickup/quote/' + model + '?partNumber=' + model + '&store=' + store;
    $httpClient.get(checkRequest, function (error, response, data) {
        if (error) {
            $notification.post("🍎 直營店庫存檢查失敗 ❌", "", "連線錯誤‼️")
            $done();
        } else {
            if (response.status == 200) {
                let obj = JSON.parse(data);
                if (obj["availabilityStatus"] != 'NOT_AVAILABLE') {
                    $notification.post("📱 " + model + " 有貨", "", obj["pickupQuote"]);
                    $done();
                }
                else if (debug) {
                    $notification.post("📱 " + obj["pickupQuote"], "", "");
                }

                $done();
            } else {
                $notification.post("🍎 直營店庫存檢查失敗 ❌", "", "連線錯誤‼️");
                $done();
            }
        }
    });
}