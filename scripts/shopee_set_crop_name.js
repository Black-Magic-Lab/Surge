const cropName = '大布丁'; // ← 把大布丁改成想要的種子關鍵字，改完之後按「執行」即可。例如：大布丁、口香糖、養樂多、豆漿、牛奶糖、4蝦幣...


$persistentStore.write(cropName, "ShopeeCropName");
$notification.post("蝦皮作物設定", "", cropName +  " 手動設定完成 ✅");
$done({})