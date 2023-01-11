function ozanNotify(subtitle = '', message = '') {
  $notification.post('Ozan 取得 UUID', subtitle, message);
};

function isLoon() {
  return 'undefined' !== typeof $loon;
}

const uuid = $request.headers['X-DEVICE-CODE'] || $request.headers['x-device-code'];
if (uuid) {
  let writeData = $persistentStore.write(uuid, 'OzanUUID');
  if (!writeData) {
    ozanNotify(
      '保存失敗 ‼️',
      '請稍後嘗試'
    );
  } else {
    if (isLoon()) {
      ozanNotify(
        'UUID 保存成功 ✅',
        '請到「腳本」→「數據持久化」→「讀取指定數據」，輸入 OzanUUID，然後複製所有內容'
      );
    } else {
      ozanNotify(
        'UUID 保存成功 ✅',
        '請打開腳本編輯器，選擇左下角齒輪 → $persistentStore → OzanUUID，然後複製所有內容'
      );
    }
  }
} else {
  ozanNotify(
    '保存失敗 ‼️',
    '請重新登入'
  );
}

$done($request);
