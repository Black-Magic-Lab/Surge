if ($request.url.includes('product=')) {
    const product = $request.url.split('product=')[1].split('&')[0];
    if (product.includes('/') && $persistentStore.write(product, "iPhoneModel"))
    {
        $notification.post("已儲存 iPhone 機型 " + product, "", "")
    }
}
$done({})