const body = JSON.parse($request.body);
if (body && body.cropId && body.resourceId && body.s) {
  const saveCrop = $persistentStore.write($request.body, 'ShopeeCrop');
  const saveCropState = $persistentStore.write('0', 'ShopeeCropState');
  if (!saveCrop || !saveCropState) {
    $notification.post('蝦蝦果園作物資料保存失敗‼️',
      '',
      '請稍後嘗試'
    );
  } else {
    $notification.post('蝦蝦果園作物資料保存成功🌱',
      '',
      ''
    );
  }
} else {
  $notification.post('蝦蝦果園作物資料保存失敗‼️',
    '',
    '請重新登入'
  );
}
$done({});