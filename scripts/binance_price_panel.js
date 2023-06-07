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

async function fetchPrice(symbol) {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`,
      };
      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject([`無法取得 ${symbol}/USDT 交易對`, error]);
        } else {
          if (response.status === 200) {
            const price = JSON.parse(data).price;
            message.content = `${message.content}${symbol}: $${Number(price).toFixed(2)}\n`;
          }
          return resolve();
        }
      });
    } catch (error) {
      return reject([`無法取得 ${symbol}/USDT 交易對`, error]);
    }
  })
}

(async() => {
  try {
    console.log('ℹ️ 幣安報價資訊面板 v20230130.1');
    await getSymbols();
    for (const symbol of symbols) {
      await fetchPrice(symbol);
    }
    message.content = message.content.slice(0, -1);
    $done(message);
  } catch (error) {
    $done(handleError(error));
  }
  $done(handleError('未知錯誤'));
  fetchPrice(0);
})();
