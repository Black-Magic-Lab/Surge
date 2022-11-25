const baseUrl = 'https://api.binance.com/api/v3/ticker/price?symbol=';
const symbols = $persistentStore.read('BinancePriceSymbols') ? JSON.parse($persistentStore.read('BinancePriceSymbols')) : ['BTC', 'ETH'];
let count = 0;

let message = {
  title: '最新幣價',
  content: '',
  icon: 'bitcoinsign.circle',
  'icon-color': '#EF8F1C',
};

function fetchPrice(index) {
  if (index > symbols.length - 1) {
    return;
  }

  const symbol = symbols[index];
  $httpClient.get(baseUrl + symbol + 'USDT', function (error, response, data) {
    if (error) {
      return;
    }
    const price = JSON.parse(data).price;
    message.content = message.content + symbol + ': $' + Number(price).toFixed(2) + '\n';
    count += 1;
    showMessage();
    fetchPrice(index + 1);
  });
}

function showMessage() {
  if (count === symbols.length) {
    message.content = message.content.slice(0, -1);
    $done(message);
  }
}

(() => {
  fetchPrice(0);
})();