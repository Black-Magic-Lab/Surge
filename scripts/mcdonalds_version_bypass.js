const version = '3.3.1';
const ua = 'Mcdonalds/3.3.1';

$request.headers['version'] = version;

if ($request.headers['appversion']) {
	$request.headers['appversion'] = version; //HTTP2
	$request.headers['user-agent'] = $request.headers['user-agent'].replace(new RegExp('Mcdonalds/3.[0-9].[0-9]'), ua);
}
else {
	$request.headers['appVersion'] = version;
	$request.headers['User-Agent'] = $request.headers['User-Agent'].replace(new RegExp('Mcdonalds/3.[0-9].[0-9]'), ua);
}

$done($request);
