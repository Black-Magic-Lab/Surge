const body = JSON.parse($request.body);
if (body && body.s) {
  const saveCropToken = $persistentStore.write(body.s, 'ShopeeCropToken');
  if (!saveCropToken) {
    $notification.post('蝦蝦果園作物 token 保存失敗‼️',
      '',
      '請稍後嘗試'
    );
  } else {
    $notification.post('蝦蝦果園作物 token 保存成功🌱',
      '',
      '此動作只需執行一次，更改目標作物不必重新獲得 token。'
    );
  }
} else {
  $notification.post('蝦蝦果園作物 token 保存失敗‼️',
    '',
    '請重新登入'
  );
}
$done({});