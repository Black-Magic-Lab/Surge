let showNotification = true;
let config = null;

function surgeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦皮更新 token', subtitle, message, { 'url': 'shopeetw://' });
};

function handleError(error) {
  if (Array.isArray(error)) {
    console.log(`❌ ${error[0]} ${error[1]}`);
    if (showNotification) {
      surgeNotify(error[0], error[1]);
    }
  } else {
    console.log(`❌ ${error}`);
    if (showNotification) {
      surgeNotify(error);
    }
  }
}

function getSaveObject(key) {
  const string = $persistentStore.read(key);
  return !string || string.length === 0 ? {} : JSON.parse(string);
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object ? true : false;
}

function parseCookie(cookieString) {
  return cookieString
    .split(';')
    .map(v => v.split('='))
    .filter((v) => v.length > 1)
    .reduce((acc, v) => {
      let value = decodeURIComponent(v[1].trim());
      for (let index = 2; index < v.length; index++) {
        if (v[index] === '') {
          value += '=';
        }
      }
      acc[decodeURIComponent(v[0].trim())] = value;
      return acc;
    }, {});
}

function cookieToString(cookieObject) {
  let string = '';
  for (const [key, value] of Object.entries(cookieObject)) {
    // SPC_EC 另外加入
    if (key !== 'SPC_EC') {
      string += `${key}=${value};`
    }
  }
  return string;
}

async function updateSpcEc() {
  return new Promise((resolve, reject) => {
    let shopeeInfo = getSaveObject('ShopeeInfo');
    let shopeeToken;
    if (isEmptyObject(shopeeInfo)) {
      // 可能沒有新版資料，用舊的試試
      shopeeToken = $persistentStore.read('ShopeeToken');
      console.log('⚠️ 找不到新版 token，使用舊版 token');
      // return reject(['取得 token 失敗 ‼️', '找不到儲存的 token']);
    } else {
      shopeeToken = shopeeInfo.shopeeToken;
      console.log('✅ 找到新版 token，使用新版 token');
    }

    const request = {
      url: 'https://mall.shopee.tw/api/v4/client/refresh',
      headers: {
        'Cookie': `shopee_token=${shopeeToken};`,
        'Content-Type': 'application/json',
      },
    };

    try {
      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['更新 SPC_EC 失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status == 200) {
            const obj = JSON.parse(data);
            if (obj.error) {
              return reject(['更新 SPC_EC 失敗 ‼️', '請重新取得 token']);
            }
            const cookie = response.headers['Set-Cookie'] || response.headers['set-cookie'];
            if (cookie) {
              const filteredCookie = cookie.replaceAll('HttpOnly;', '').replaceAll('Secure,', '');
              const cookieObject = parseCookie(filteredCookie);

              // 舊方法，2/1 之後廢棄
              const spcEc = cookieObject.SPC_EC;
              const saveSpcEc = $persistentStore.write(spcEc, 'SPC_EC');

              if (!(saveSpcEc)) {
                return reject(['更新 SPC_EC 失敗 ‼️', '無法儲存舊版 SPC_EC']);
              } else {
                console.log('⚠️ 儲存舊版 SPC_EC 成功');
              }
              return resolve(spcEc);
            } else {
              return reject(['更新 SPC_EC 失敗 ‼️', '找不到回應的 token']);
            }
          } else {
            return reject(['更新 SPC_EC 失敗 ‼️', response.status]);
          }
        }
      });
    } catch (error) {
      return reject(['更新 SPC_EC 失敗 ‼️', error]);
    }
  });
}

async function updateCookie(spcEc) {
  return new Promise((resolve, reject) => {
    try {
      let shopeeInfo = getSaveObject('ShopeeInfo');
      let shopeeToken;
      if (isEmptyObject(shopeeInfo)) {
        // 可能沒有新版資料，用舊的試試
        shopeeToken = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';shopee_token=' + $persistentStore.read('ShopeeToken');
        console.log('⚠️ 找不到新版 token，使用舊版 token');
        // return reject(['取得 token 失敗 ‼️', '找不到儲存的 token']);
      } else {
        shopeeToken = `${cookieToString(shopeeInfo.token)}SPC_EC=${spcEc};shopee_token=${shopeeInfo.shopeeToken};`;
        console.log('✅ 找到新版 token，使用新版 token');
      }

      const request = {
        url: 'https://shopee.tw/api/v2/user/account_info?from_wallet=false&skip_address=1&need_cart=1',
        headers: {
          'Cookie': shopeeToken,
        },
      };

      $httpClient.get(request, function (error, response, data) {
        if (error) {
          return reject(['更新 token 失敗 ‼️', '連線錯誤']);
        } else {
          if (response.status == 200) {
            const obj = JSON.parse(data);
            if (obj.error) {
              return reject(['更新 token 失敗 ‼️', '請重新取得 token']);
            }
            const cookie = response.headers['Set-Cookie'] || response.headers['set-cookie'];
            if (cookie) {
              const filteredCookie = cookie.replaceAll('HttpOnly;', '').replaceAll('Secure,', '');
              const cookieObject = parseCookie(filteredCookie);

              // 舊方法，2/1 之後廢棄
              const saveCookie = $persistentStore.write(filteredCookie, 'CookieSP');
              if (!(saveCookie)) {
                return reject(['更新 token 失敗 ‼️', '無法儲存舊版 token']);
              } else {
                console.log('⚠️ 儲存舊版 token 成功');
              }

              const tokenInfo = {
                SPC_EC: spcEc,
                SPC_R_T_ID: cookieObject.SPC_R_T_ID,
                SPC_R_T_IV: cookieObject.SPC_R_T_IV,
                SPC_SI: cookieObject.SPC_SI,
                SPC_ST: cookieObject.SPC_ST,
                SPC_T_ID: cookieObject.SPC_T_ID,
                SPC_T_IV: cookieObject.SPC_T_IV,
                SPC_U: cookieObject.SPC_U,
              }

              if (isEmptyObject(shopeeInfo)) {
                const oldShopeeToken = $persistentStore.read('ShopeeToken');
                if (!oldShopeeToken || oldShopeeToken.length === 0) {
                  return reject(['保存失敗', '無法儲存新版 token，請重新取得 token']);
                }
                shopeeInfo.shopeeToken = oldShopeeToken;
                shopeeInfo.userName = obj.data.username;
                console.log('✅ 建立新版 token');
              }

              shopeeInfo.token = tokenInfo;
              const save = $persistentStore.write(JSON.stringify(shopeeInfo, null, 4), 'ShopeeInfo');
              if (!save) {
                return reject(['保存失敗 ‼️', '無法儲存 token']);
              } else {
                return resolve();
              }
            } else {
              return reject(['更新 token 失敗 ‼️', '找不到回傳的 token']);
            }
          } else {
            return reject(['更新 token 失敗 ‼️', response.status])
          }
        }
      });
    } catch (error) {
      return reject(['更新 token 失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦皮更新 token v20230115.1');
  try {
    const spcEc = await updateSpcEc();
    console.log('✅ SPC_EC 更新成功');
    await updateCookie(spcEc);
    console.log('✅ token 更新成功');
    $done();
  } catch (error) {
    handleError(error);
  }
  $done();
})();
