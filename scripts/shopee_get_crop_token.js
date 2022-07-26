function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園作物 token', subtitle, message, { 'url': 'shopeetw://' });
};

const body = JSON.parse($request.body);
if (body && body.s) {
  const saveCropToken = $persistentStore.write(body.s, 'ShopeeCropToken');
  if (!saveCropToken) {
    shopeeNotify(
      '保存失敗 ‼️',
      '請稍後嘗試'
    );
  } else {
    shopeeNotify(
      '保存成功 🌱',
      '此動作只需執行一次，更改目標作物不必重新獲得 token。'
    );
  }
} else {
  shopeeNotify(
    'Cookie 已過期 ‼️',
    '請重新登入'
  );
}
$done({});
