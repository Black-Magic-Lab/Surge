const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};

const waterStoreItemListRequest = {
  url: 'https://games.shopee.tw/farm/api/prop/list?storeType=2&typeId=&isShowRevivalPotion=true&t=' + new Date().getTime(),
  headers: shopeeHeaders,
};

let buyFreeItemRequest = {
  url: 'https://games.shopee.tw/farm/api/prop/buy/v2?t=' + new Date().getTime(),
  headers: shopeeHeaders,
  body : {
    'propMetaId': 0,
  }
}

// 獲得特價商店道具列表
function getWaterStoreItem() {
  $httpClient.get(waterStoreItemListRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍤 蝦蝦果園特價道具查詢',
        '',
        '連線錯誤‼️' + error
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const props = obj.data.props;
            for (const prop of props) {
              if (prop.price === 0) {
                if (prop.buyNum < prop.buyLimit)
                {
                  buyFreeItemRequest.body.propMetaId = prop.propMetaId;
                  buyFreeItem(prop.name);
                }
                else {
                  console.log('🍤 本日已購買免費 ' + prop.name);
                }
              }
            }
          } else {
            $notification.post('🍤 蝦蝦果園特價道具查詢錯誤',
              '',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          $notification.post('🍤 蝦蝦果園特價道具查詢錯誤',
            '',
            error
          );
          $done();
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期‼️',
          '',
          '請重新抓取 🔓'
        );
        $done();
      }
    }
  });
}

function buyFreeItem(itemName) {
  $httpClient.post(buyFreeItemRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍤 蝦蝦果園購買免費道具',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            $notification.post('🍤 蝦蝦果園購買免費道具購買成功 ✅',
              '',
              '獲得 👉 ' + itemName
            );
          }
          else {
            $notification.post('🍤 蝦蝦果園購買免費道具失敗‼️',
              '',
              obj.msg
            );
          }
        }
        catch (error) {
          $notification.post('🍤 蝦蝦果園購買免費道具錯誤‼️',
            '',
            error
          );
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期‼️',
          '',
          '請重新抓取 🔓'
        );
      }
    }
  });
  $done();
}

getWaterStoreItem();