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
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園免費道具', subtitle, message, { 'url': 'shopeetw://' });
};

// 獲得特價商店道具列表
function getWaterStoreItem() {
  $httpClient.get(waterStoreItemListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '取得道具列表失敗 ‼️',
        '連線錯誤'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const props = obj.data.props;
            let found = false;
            for (const prop of props) {
              if (prop.price === 0) {
                found = true;
                if (prop.buyNum < prop.buyLimit) {
                  buyFreeItemRequest.body.propMetaId = prop.propMetaId;
                  buyFreeItem(prop.name);
                }
                else {
                  console.log('本日已購買免費 ' + prop.name);
                }
              }
            }
            if (!found) {
              console.log('本日無免費道具');
              $done();
            }
          } else {
            shopeeNotify(
              '取得道具列表失敗 ‼️',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          shopeeNotify(
            '取得道具列表失敗 ‼️',
            error
          );
          $done();
        }
      } else {
        shopeeNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
        $done();
      }
    }
  });
}

function buyFreeItem(itemName) {
  $httpClient.post(buyFreeItemRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '購買道具失敗 ‼️',
        '連線錯誤'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            shopeeNotify(
              '購買道具成功 ‼️',
              '獲得 👉 ' + itemName
            );
          }
          else {
            shopeeNotify(
              '購買道具失敗 ‼️',
              obj.msg
            );
          }
        }
        catch (error) {
          shopeeNotify(
            '購買道具失敗 ‼️',
            error
          );
        }
      } else {
        shopeeNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
      }
    }
  });
  $done();
}

getWaterStoreItem();
