function shopeeNotify(subtitle = '', message = '') {
  $notification.post('π€ θ¦θ¦ζεδ½η©θ³ζ', subtitle, message, { 'url': 'shopeetw://' });
};

const body = JSON.parse($request.body);
if (body && body.cropId && body.resourceId && body.s) {
  const saveCrop = $persistentStore.write($request.body, 'ShopeeCrop');
  const saveCropState = $persistentStore.write('0', 'ShopeeCropState');
  if (!saveCrop || !saveCropState) {
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
