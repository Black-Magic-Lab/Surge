const luckyRrawGetIdRequest = {
    url: 'https://games.shopee.tw/gameplatform/api/v1/game/activity/e37b7dec5976a29c/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false',
    headers: {
        'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
        'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    },
};

let luckyRrawRequest = {
    url: 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/15d3b075799e64b2',
    headers: {
        'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
        'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    },
    body: {
        request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
        app_id: 'E9VFyxwmtgjnCR8uhL',
        activity_code: 'e37b7dec5976a29c',
        source: 0,
    },
};

// 獲得寶箱 ID
$httpClient.get(luckyRrawGetIdRequest, function(error, response, data) {
    if (error) {
        $notification.post('🍤 蝦幣寶箱網址查詢', '', '連線錯誤‼️');
    } else {
        if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj['msg'] !== 'success') {
                $notification.post('🍤 蝦幣寶箱網址查詢', '', '未知錯誤，請稍候再手動嘗試‼️');
            } else {
                const eventUrl = obj['data']['basic']['event_code'];
                luckyRrawRequest.url = 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/' + eventUrl;
                console.log('🍤 蝦幣寶箱新網址獲取成功： ' + luckyRrawRequest.url);
                // $notification.post('🍤 蝦幣寶箱新網址獲取成功： ', '', luckyRrawRequest.url);
                // 開寶箱
                $httpClient.post(luckyRrawRequest, function(error, response, data) {
                    if (error) {
                        $notification.post('🍤 蝦幣寶箱', '', '連線錯誤‼️');
                    } else {
                        if (response.status == 200) {
                            const obj = JSON.parse(data);
                            if (obj['msg'] == 'no chance') {
                                $notification.post('🍤 今日已領過蝦幣寶箱', '', '每日只能領一次‼️');
                            } else if (obj['msg'] == 'success') {
                                const packagename = obj['data']['package_name'];
                                $notification.post('🍤 蝦幣寶箱領取成功 ✅', '', '獲得 👉 ' + packagename + ' 💎');
                            } else if (obj['msg'] == 'expired' || obj['msg'] == 'event already end') {
                                $notification.post('🍤 蝦幣寶箱活動已過期 ❌', '', '請嘗試更新模組或腳本，或等待作者更新‼️');
                            }
                        } else {
                            $notification.post('🍤 蝦皮 Cookie 已過期‼️', '', '請重新抓取 🔓');
                        }
                    }
                });
                // 開寶箱結束
            }
        } else {
            $notification.post('🍤 蝦皮 Cookie 已過期‼️', '', '請重新抓取 🔓');
        }
    }
    $done();
});