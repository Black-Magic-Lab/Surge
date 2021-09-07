var joinCheckUrl = {
    url: 'https://mcdapi.mcddailyapp.com.tw/McDonaldAPI/h5/game/joinGame',
    headers: {
        'accessToken': $persistentStore.read("McdonaldsToken"),
        'Content-Type': 'application/json'
    },
    body: {
        "gameId": "1435169784093523970"
    }
}
$httpClient.post(joinCheckUrl, function (error, response, data) {
    if (error) {
        $notification.post("麥當勞轉轉圈失敗‼️", "", "連線錯誤‼️")
        $done();
    } else {
        if (response.status == 200) {
            let obj = JSON.parse(data);
            if (obj["code"] === 0) {
                if (obj["data"]["name"]) {
                    $notification.post("麥當勞本日轉轉圈成功", "", "恭喜獲得 " + obj["data"]["name"]);
                }
                else {
                    $notification.post("麥當勞本日轉轉圈成功", "", "");
                }
                $done();
            }
            else if (obj["code"] !== 0) {
                $notification.post("麥當勞本日轉轉圈失敗‼️", "", obj["msg"]);
                $done();
            }

            $done();
        } else {
            $notification.post("麥當勞 Token 已過期‼️", "", "請重新登入 🔓");
            $done();
        }
    }
});