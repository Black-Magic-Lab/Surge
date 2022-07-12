const { v4, v6 } = $network;

const displayName = {
  'Shawn_N': '$踢低吸 八嘎 NONO 麻ㄙㄟ麻ㄙㄟ',
  'hirakujira': 'Hiraku',
  'bill85101': '森喵',
};

if (!v4.primaryAddress && !v6.primaryAddress) {
  $done({
    title: '沒有網路',
    content: '尚未連接網際網路\n請檢查網際網路狀態後重試',
    icon: 'wifi.exclamationmark',
    'icon-color': '#CB1B45',
  });
} else {
  $httpClient.get('https://raw.githubusercontent.com/tasi788/Whosis-Sayings/master/public/saying.txt', function (error, response, data) {
    if (error) {
      $done({
        title: '發生錯誤',
        content: '無法成功獲得資料\n請檢查網際網路狀態後重試',
        icon: 'wifi.exclamationmark',
        'icon-color': '#CB1B45',
      });
    }

    const saying = data.split(';').slice(0, -1).map(x => x.trim());
    const idx = Math.floor(Math.random() * saying.length);
    const selectedSaying = saying[idx].split(',');
    const title = displayName[selectedSaying[0]] ? displayName[selectedSaying[0]] : selectedSaying[0];
    $done({
      title: title + '：',
      content: selectedSaying[1],
      icon: 'quote.bubble',
      'icon-color': '#28cd41',
    });
  });
}