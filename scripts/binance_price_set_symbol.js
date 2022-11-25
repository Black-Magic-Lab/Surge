const symbols = ['BTC', 'ETH'];

// 腳本呼叫幣安 API，因此請輸入幣安有上架的幣種。

//================================================================
function binanceSymbolsNotify(subtitle = '', message = '') {
  $notification.post('最新幣價面板', subtitle, message);
};
$persistentStore.write(JSON.stringify(symbols), "BinancePriceSymbols");
binanceSymbolsNotify(
  '設定完成 ✅',
  ''
)
$done({});
