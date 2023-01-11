function sheinNotify(subtitle = '', message = '') {
  $notification.post('SHEIN token', subtitle, message, { 'url': '' });
};

const sheinToken = $request.headers['token'] || $request.headers['Token'];
if (sheinToken) {
  const saveToken = $persistentStore.write(sheinToken, 'SheinToken');

  if (!saveToken) {
    sheinNotify(
      '保存失敗 ‼️',
      '請稍後嘗試'
    );
  } else {
    sheinNotify(
      '保存成功 🍪',
      ''
    );
  }
} else {
  sheinNotify(
    '保存失敗 ‼️',
    '請重新登入'
  );
}
$done({});
