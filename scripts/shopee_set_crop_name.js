const cropName = '大布丁'; // ← 把大布丁改成想要的種子關鍵字，改完之後按「執行」即可。例如：大布丁、口香糖、養樂多、豆漿、牛奶糖、4蝦幣...

//================================================================
function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園', subtitle, message, { 'url': 'shopeetw://' });
};
$persistentStore.write(cropName, 'ShopeeCropName');
surgeNotify('目標作物設定', `成功設定「${cropName}」✅`);
$done();
