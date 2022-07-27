function momoNotify(subtitle = '', message = '') {
  $notification.post('🍑 Momo token', subtitle, message, { 'url': 'momo.app://' });
};

if ($request.method === 'POST') {
  const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
  if (cookie && $request.body) {
    try {
      let body = JSON.parse($request.body);
      if (body.doAction === 'list') {
        body.pNo = '';
        body.doAction = 'reg';
        const saveCookie = $persistentStore.write(cookie, 'momoCookie');
        const saveBody = $persistentStore.write(JSON.stringify(body), 'momoBody');
        if (!(saveCookie && saveBody)) {
          momoNotify(
            '保存失敗 ‼️',
            '請稍後嘗試'
          );
        } else {
          momoNotify(
            '保存成功 🍪',
            ''
          );
        }
      }
    } catch (error) {
      momoNotify(
        '保存失敗 ‼️',
        error
      );
    }
  } else {
    momoNotify(
      '保存失敗 ‼️',
      '請重新登入'
    );
  }
}
$done({})
