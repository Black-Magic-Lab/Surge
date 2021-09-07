if ($request.headers['accessToken']) {
    var cookie = $persistentStore.write($request.headers['accessToken'], "McdonaldsToken");
    if (!cookie) {
        $notification.post("麥當勞 Token 保存錯誤‼️", "", "請重新登入")
    } else {
        $notification.post("麥當勞 Token 保存成功🎉", "", "")
    }
} else {
    $notification.post("麥當勞 Token 保存失敗‼️", "", "請重新登入")
}
$done({})