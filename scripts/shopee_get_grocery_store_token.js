function shopeeNotify(subtitle = '', message = '') {
  $notification.post('π€ θ¦θ¦ζειε·εεΊ token', subtitle, message, { 'url': 'shopeetw://' });
};

const body = JSON.parse($request.body);
if (body && body.S) {
  const shopeeGroceryStoreToken = $persistentStore.write(body.S, 'ShopeeGroceryStoreToken');
  if (!shopeeGroceryStoreToken) {
    shopeeNotify(
      'δΏε­ε€±ζ βΌοΈ',
      'θ«η¨εΎεθ©¦'
    );
  } else {
    shopeeNotify(
      'δΏε­ζε π±',
      ''
    );
  }
} else {
  shopeeNotify(
    'Cookie ε·²ιζ βΌοΈ',
    'θ«ιζ°η»ε₯'
  );
}
$done({});
