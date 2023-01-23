(() => {
  console.log('ℹ️ Surge 功能檢查 v20230115.1');
  console.log('⚠️ 請勿手動執行此腳本');
  if ('undefined' !== typeof $response) {
    let body = $response.body;
    $response.body = body.replace('id="mitm-resule">Failed ❌', 'id="mitm-resule">Success ✅');

    if ('undefined' !== typeof $loon) {
      body = $response.body;
      $response.body = body.replace('<h1>Surge Check</h1>', '<h1>Loon Check</h1>');
    }
    $done($response);

  } else if ('undefined' !== typeof $request) {
    $request.headers['X-Hiraku-Script'] = '1';
    $done($request);
  } else {
    $done({});
  }
})();
