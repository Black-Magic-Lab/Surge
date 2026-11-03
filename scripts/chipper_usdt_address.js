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

function getAddresses(chain) {
  return new Promise((resolve, reject) => {
    const request = {
      url: 'https://api.chippercash.com/v1/crypto/deposit/address?asset=USDT&chain=' + chain,
      headers: {
        'Authorization': token,
      }
    };
    $httpClient.get(request, function (error, response, data) {
      if (error) {
        return reject(['取得地址失敗 ‼️', '連線錯誤']);
      }
      if (response.status !== 200) {
        return reject(['取得地址失敗 ‼️', 'Error: ' + response.status]);
      }
      try {
        const obj = JSON.parse(data);
        return obj.address ? resolve(obj.address) : reject(['取得地址失敗 ‼️', 'Error: ' + obj.error]);
      } catch (error) {
        return reject(['取得地址失敗 ‼️', 'Error: ' + error]);
      }
    });
  });
}

(async () => {
  console.log('ℹ️ Chipper 取得 USDT 入金地址 v20240702.1');
  try {
    await preCheck();
    console.log('✅ Token 取得成功');
    const [ethereumAddress, polygonAddress, tronAddress, solanaAddress] = await Promise.all(
      ['ETHEREUM', 'POLYGON', 'TRON', 'SOLANA_MAINNET_BETA'].map(getAddresses)
    );
    console.log('\n\nEthereum: ' + ethereumAddress + '\nPolygon: ' + polygonAddress + '\nTron: ' + tronAddress + '\nSolana: ' + solanaAddress + '\n\n');
  } catch (error) {
    handleError(error);
  }
  $done();
})();
