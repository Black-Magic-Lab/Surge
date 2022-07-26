function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園作物資料', subtitle, message, { 'url': 'shopeetw://' });
};

const body = JSON.parse($request.body);
if (body && body.cropId && body.resourceId && body.s) {
  const saveCrop = $persistentStore.write($request.body, 'ShopeeCrop');
  const saveCropState = $persistentStore.write('0', 'ShopeeCropState');
  if (!saveCrop || !saveCropState) {
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
