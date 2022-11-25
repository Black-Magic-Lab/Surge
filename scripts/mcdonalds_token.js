function mcdonaldsNotify(subtitle = '', message = '') {
  $notification.post('🍟 麥當勞 token', subtitle, message, { 'url': 'mcdonalds.app://' });
};

const accessToken = $request.headers['accessToken'] || $request.headers['accesstoken'];
if (accessToken) {
  let cookie = $persistentStore.write(accessToken, "McdonaldsToken");
  if (!cookie) {
    mcdonaldsNotify(
      '保存失敗 ‼️',
      '請稍後嘗試'
    );
  } else {
    mcdonaldsNotify(
      '保存成功 🍪',
      ''
    );
  }
} else {
  mcdonaldsNotify(
    '保存失敗 ‼️',
    '請重新登入'
  );
}

$request.headers['version'] = '3.9.9';
$request.headers['appVersion'] = '3.9.9';
$done($request);
