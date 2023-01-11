if ('undefined' !== typeof $response) {
    let body = $response.body;
    $response.body = body.replace('id="mitm-resule">Failed ❌', 'id="mitm-resule">Success ✅');

    if ('undefined' !== typeof $loon) {
        body = $response.body;
        $response.body = body.replace('<h1>Surge Check</h1>', '<h1>Loon Check</h1>');
    }
    $done($response);

} else if ('undefined' !== typeof $request) {
    $request.headers['X-Surge-Script'] = '1';
    $done($request);
} else {
    $done({});
}