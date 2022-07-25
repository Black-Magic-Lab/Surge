const body = JSON.parse($request.body);
if (body && body.S) {
  const shopeeGroceryStoreToken = $persistentStore.write(body.S, 'ShopeeGroceryStoreToken');
  if (!shopeeGroceryStoreToken) {
    $notification.post('蝦蝦果園商店水滴 token 保存失敗‼️',
      '',
      '請稍後嘗試'
    );
  } else {
    $notification.post('蝦蝦果園商店水滴 token 保存成功🌱',
      '',
      ''
    );
  }
} else {
  $notification.post('蝦蝦果園商店水滴 token 保存失敗‼️',
    '',
    '請重新登入'
  );
}
$done({});