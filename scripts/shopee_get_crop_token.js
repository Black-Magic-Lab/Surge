function shopeeNotify(subtitle = '', message = '') {
  $notification.post('ð¤ è¦è¦æåä½ç© token', subtitle, message, { 'url': 'shopeetw://' });
};

const body = JSON.parse($request.body);
if (body && body.s) {
  const saveCropToken = $persistentStore.write(body.s, 'ShopeeCropToken');
  if (!saveCropToken) {
    shopeeNotify(
      'ä¿å­å¤±æ â¼ï¸',
      'è«ç¨å¾åè©¦'
    );
  } else {
    shopeeNotify(
      'ä¿å­æå ð±',
      'æ­¤åä½åªéå·è¡ä¸æ¬¡ï¼æ´æ¹ç®æ¨ä½ç©ä¸å¿éæ°ç²å¾ tokenã'
    );
  }
} else {
  shopeeNotify(
    'Cookie å·²éæ â¼ï¸',
    'è«éæ°ç»å¥'
  );
}
$done({});
