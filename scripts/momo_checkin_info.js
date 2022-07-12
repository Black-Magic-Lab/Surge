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
          $notification.post('Momo Cookie 保存錯誤‼️',
            '',
            '請重新登入');
        } else {
          $notification.post('Momo Cookie 保存成功🎉',
            '',
            '');
        }
      }
    } catch (error) {
      $notification.post('Momo Cookie 保存錯誤‼️',
        '',
        error);
    }
  } else {
    $notification.post('Momo Cookie 保存失敗‼️',
      '',
      '請重新登入');
  }
}
$done({})