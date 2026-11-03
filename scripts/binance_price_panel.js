let symbols = null;
let message = {
  'title': '最新幣價',
  'content': '',
  'icon': 'bitcoinsign.circle',
  'icon-color': '#EF8F1C',
};

function handleError(error) {
  if (Array.isArray(error)) {
    console.log(`❌ ${error[0]} ${error[1]}`);
    return {
      title: '最新幣價',
      content: `❌ ${error[0]} ${error[1]}`,
      icon: 'simcard',
      'icon-color': '#CB1B45',
    }
  } else {
    console.log(`❌ ${error}`);
    return {
      title: '最新幣價',
      content: `❌ ${error}`,
      icon: 'simcard',
      'icon-color': '#CB1B45',
    }
  }
}

async function getSymbols() {
  return new Promise((resolve, reject) => {
    try {
      symbols = JSON.parse($persistentStore.read('BinancePriceSymbols') || JSON.stringify(['BTC', 'ETH']));
      return resolve();
    } catch (error) {
      return reject(['無法解析幣種', error]);
    }
  })
}

function fetchPrice(symbol) {
  return new Promise((resolve, reject) => {
    const request = {
      url: `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`,
    };
    $httpClient.get(request, function (error, response, data) {
      try {
        if (error) throw error;
        resolve(response.status === 200 ? `${symbol}: $${Number(JSON.parse(data).price).toFixed(2)}` : null);
      } catch (error) {
        reject([`無法取得 ${symbol}/USDT 交易對`, error]);
      }
    });
  })
}

(async() => {
  try {
    console.log('ℹ️ 幣安報價資訊面板 v20230130.1');
    await getSymbols();
    const lines = await Promise.all(symbols.map(fetchPrice));
    message.content = lines.filter(Boolean).join('\n');
    $done(message);
  } catch (error) {
    $done(handleError(error));
  }
})();
