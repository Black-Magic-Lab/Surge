const token = '改掉這一行';


$persistentStore.write(token, "McdonaldsToken");
$notification.post("麥當勞 token", "", "手動設定完成");
$done({})