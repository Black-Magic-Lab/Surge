let showNotification = true;
let token = null;

function handleError(error) {
  if (Array.isArray(error)) {
    console.log(`❌ ${error[0]} ${error[1]}`);
  } else {
    console.log(`❌ ${error}`);
  }
}

async function preCheck() {
  return new Promise((resolve, reject) => {
    const chipperToken = $persistentStore.read('ChipperToken');
    if (!chipperToken || chipperToken.length === 0) {
      return reject(['檢查失敗 ‼️', '找不到 token']);
    }
    token = chipperToken;
    return resolve();
  });
}

async function getAddresses(chain) {
  return new Promise((resolve, reject) => {
    try {
      const request = {
        url: 'https://api.chippercash.com/v1/crypto/deposit/address?asset=USDT&chain=' + chain,
        headers: {
          'Authorization': token,
        }
      };
      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['取得地址失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status === 200) {
            const obj = JSON.parse(data);
            if (obj.address) {
              return resolve(obj.address);
            } else {
              return reject(['取得地址失敗 ‼️', 'Error: ' + obj.error]);
            }
          } else {
            return reject(['取得地址失敗 ‼️', 'Error: ' + obj.error]);
          }
        }
      });
    } catch (error) {
      return reject(['取得地址失敗 ‼️', 'Error: ' + error]);
    }
  });
}

(async () => {
  console.log('ℹ️ Chipper 取得 USDT 入金地址 v20240702.1');
  try {
    await preCheck();
    console.log('✅ Token 取得成功');
    const ethereumAddress = await getAddresses('ETHEREUM');
    const polygonAddress = await getAddresses('POLYGON');
    const tronAddress = await getAddresses('TRON');
    const solanaAddress = await getAddresses('SOLANA_MAINNET_BETA');
    console.log('\n\nEthereum: ' + ethereumAddress + '\nPolygon: ' + polygonAddress + '\nTron: ' + tronAddress + '\nSolana: ' + solanaAddress + '\n\n');
  } catch (error) {
    handleError(error);
  }
  $done();
})();
