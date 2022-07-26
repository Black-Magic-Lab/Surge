function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園道具商店 token', subtitle, message, { 'url': 'shopeetw://' });
};

const body = JSON.parse($request.body);
if (body && body.S) {
  const shopeeGroceryStoreToken = $persistentStore.write(body.S, 'ShopeeGroceryStoreToken');
  if (!shopeeGroceryStoreToken) {
    shopeeNotify(
      '保存失敗 ‼️',
      '請稍後嘗試'
    );
  } else {
    shopeeNotify(
      '保存成功 🌱',
      ''
    );
  }
} else {
  shopeeNotify(
    'Cookie 已過期 ‼️',
    '請重新登入'
  );
}
$done({});
