const model = $persistentStore.read("iPhoneModel")

var checkRequest = {
    url: '',
    headers: {
        'X-Ma-Pcmh': 'REL-5.13.0',
        'X-Deviceconfiguration': 'ss=3.00;dim=1125x2436;m=iPhone;v=iPhone10,6;vv=5.13;sv=13.5'
    },
}


const stores = ['R713', 'R694'];

for (const store of stores) {
    checkStore(model, store);
}

function checkStore(model, store) {
    checkRequest['url'] = 'https://mobileapp.apple.com/mnm/p/tw/pickup/quote/' + model + '?partNumber=' + model + '&store=' + store;
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
                // else {
                //     $notification.post("📱 " + obj["pickupQuote"], "", "");
                //     $done();
                // }

                $done();
            } else {
                $notification.post("🍎 直營店庫存檢查失敗 ❌", "", "連線錯誤‼️");
                $done();
            }
        }
    });
}