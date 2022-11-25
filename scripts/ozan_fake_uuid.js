const uuid = $persistentStore.read('OzanFakeUUID');
const uuidRegex = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
if (uuid && uuid != '' && uuid != '取代這幾個字') {
  if ($request.headers['X-DEVICE-CODE']) {
    $request.headers['X-DEVICE-CODE'] = uuid;
    $request.headers['User-Agent'] = $request.headers['User-Agent'].replace(new RegExp(uuidRegex, 'g'), uuid);
  }
  else {
    $request.headers['x-device-code'] = uuid;
    $request.headers['user-agent'] = $request.headers['user-agent'].replace(new RegExp(uuidRegex, 'g'), uuid);
  }
}

$done($request);
