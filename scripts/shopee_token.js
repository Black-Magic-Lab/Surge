function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦皮 Cookie', subtitle, message, { 'url': 'shopeetw://' });
};

const cookie = $request.headers['Cookie'] || $request.headers['cookie'];
if (cookie) {
  const shopee_token = cookie.split('shopee_token=')[1].split(';')[0];
  const SPC_EC = cookie.split('SPC_EC=')[1].split(';')[0];
  const cstfToken = cookie.split('csrftoken=')[1].split(';')[0];

  const saveCookie = $persistentStore.write(cookie, 'CookieSP');
  const saveToken = $persistentStore.write(shopee_token, 'ShopeeToken');
  const saveSPC_EC = $persistentStore.write(SPC_EC, 'SPC_EC');
  const saveCsrf = $persistentStore.write(cstfToken, 'CSRFTokenSP');

  if (!(saveCookie && saveToken && saveCsrf && saveSPC_EC)) {
    shopeeNotify(
      '保存失敗 ‼️',
      '請稍後嘗試'
    );
  } else {
    shopeeNotify(
      '保存成功 🍪',
      ''
    );
  }
} else {
  shopeeNotify(
    '保存失敗 ‼️',
    '請重新登入'
  );
}
$done({});
