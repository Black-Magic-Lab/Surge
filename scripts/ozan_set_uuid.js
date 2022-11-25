const uuid = '取代這幾個字'; // ← 把原本登入裝置取得的 OzanUUID 複製到這裡

//================================================================
function ozanNotify(subtitle='', message='') {
  $notification.post('Ozan 設定 UUID', subtitle, message);
};
$persistentStore.write(uuid, 'OzanFakeUUID');
ozanNotify(
  '偽造 UUID', 
  '成功設定 UUID: ' + uuid + ' ✅'
);
$done();