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
    if (isEmptyObject(shopeeInfo)) {
      return reject(['取得 token 失敗 ‼️', '找不到儲存的 token']);
    }

    const request = {
      url: 'https://mall.shopee.tw/api/v4/client/refresh',
      headers: {
        'Cookie': `shopee_token=${shopeeInfo.shopeeToken};`,
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
              return resolve(cookieObject.SPC_EC);
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
      if (isEmptyObject(shopeeInfo)) {
        return reject(['取得 token 失敗 ‼️', '找不到儲存的 token']);
      }

      const request = {
        url: 'https://shopee.tw/api/v2/user/account_info?from_wallet=false&skip_address=1&need_cart=1',
        headers: {
          'Cookie': `${cookieToString(shopeeInfo.token)}SPC_EC=${spcEc};shopee_token=${shopeeInfo.shopeeToken};`,
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
              const tokenInfo = {
                SPC_EC: spcEc,
                SPC_R_T_ID: cookieObject.SPC_R_T_ID,
                SPC_R_T_IV: cookieObject.SPC_R_T_IV,
                SPC_SI: cookieObject.SPC_SI,
                SPC_ST: cookieObject.SPC_ST,
                SPC_T_ID: cookieObject.SPC_T_ID,
                SPC_T_IV: cookieObject.SPC_T_IV,
                SPC_F: cookieObject.SPC_F,
                SPC_U: cookieObject.SPC_U,
              };
              if (shopeeInfo.token.SPC_EC === tokenInfo.SPC_EC) {
                console.log('⚠️ SPC_EC 新舊內容一致，並未更新');
              }
              if (shopeeInfo.token.SPC_R_T_ID === tokenInfo.SPC_R_T_ID) {
                console.log('⚠️ SPC_R_T_ID 新舊內容一致，並未更新');
              }
              if (shopeeInfo.token.SPC_R_T_IV === tokenInfo.SPC_R_T_IV) {
                console.log('⚠️ SPC_R_T_IV 新舊內容一致，並未更新');
              }
              if (shopeeInfo.token.SPC_SI === tokenInfo.SPC_SI) {
                console.log('⚠️ SPC_SI 新舊內容一致，並未更新');
              }
              if (shopeeInfo.token.SPC_ST === tokenInfo.SPC_ST) {
                console.log('⚠️ SPC_ST 新舊內容一致，並未更新');
              }
              if (shopeeInfo.token.SPC_T_ID === tokenInfo.SPC_T_ID) {
                console.log('⚠️ SPC_T_ID 新舊內容一致，並未更新');
              }
              if (shopeeInfo.token.SPC_T_IV === tokenInfo.SPC_T_IV) {
                console.log('⚠️ SPC_T_IV 新舊內容一致，並未更新');
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

async function deleteOldKeys() {
  return new Promise((resolve, reject) => {
    try {
      $persistentStore.write(null, 'CSRFTokenSP');
      $persistentStore.write(null, 'CookieSP');
      $persistentStore.write(null, 'SPC_EC');
      $persistentStore.write(null, 'ShopeeToken');
      $persistentStore.write(null, 'Shopee_SPC_U');
      return resolve();
    } catch (error) {
      return reject(['刪除舊的 key 失敗 ‼️', error]);
    }
  });
}

(async () => {
  console.log('ℹ️ 蝦皮更新 token v20230131.1');
  try {
    await deleteOldKeys();
    console.log('✅ 刪除舊的 key 成功');
    const spcEc = await updateSpcEc();
    console.log('✅ SPC_EC 更新成功');
    await updateCookie(spcEc);
    console.log('✅ token 更新成功');
  } catch (error) {
    handleError(error);
  }
  $done();
})();
