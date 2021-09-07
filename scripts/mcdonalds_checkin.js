var joinCheckUrl = {
    url: 'https://mcdapi.mcddailyapp.com.tw/McDonaldAPI/game/joinGame',
    headers: {
        'accessToken': $persistentStore.read("McdonaldsToken"),
        'Content-Type': 'application/json'
    },
    body: "xRfoFYXVNqGsFMFVp9jHUkOX+O50Y5E8dXiv5xsS3pI="
}
$httpClient.post(joinCheckUrl, function (error, response, data) {
    if (error) {
        $notification.post("麥當勞簽到", "", "連線錯誤‼️")
        $done();
    } else {
        if (response.status == 200) {
            let obj = JSON.parse(data);
            if (obj["code"] === 0) {
                $notification.post("麥當勞本日簽到成功🎉", "", "");
                $done();
            }
            else if (obj["code"] !== 0) {
                $notification.post("麥當勞本日簽到失敗‼️", "", obj["msg"]);
                $done();
            }

            $done();
        } else {
            $notification.post("麥當勞 Token 已過期‼️", "", "請重新登入 🔓");
            $done();
        }
    }
});