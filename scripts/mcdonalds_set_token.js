const token = '改掉這一行';

//================================================================
function mcdonaldsNotify(subtitle = '', message = '') {
  $notification.post('🍟 麥當勞 token', subtitle, message, { 'url': 'mcdonalds.app://' });
};
$persistentStore.write(token, "McdonaldsToken");
mcdonaldsNotify(
  '設定完成 ✅',
  ''
)
$done({})
