const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeCropToken = $persistentStore.read('ShopeeCropToken') || '';
let shopeeCropName = $persistentStore.read('ShopeeCropName') || '';
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};
function shopeeNotify(subtitle = '', message = '') {
  $notification.post('🍤 蝦蝦果園自動種植', subtitle, message, { 'url': 'shopeetw://' });
};

const getSeedListRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/crop/meta/get?t=' + new Date().getTime(),
  headers: shopeeHeaders,
};

let createCropRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/crop/create?t=' + new Date().getTime(),
  headers: shopeeHeaders,
  body: {
    'metaId': 0,
    's': shopeeCropToken
  }
}

function getSeedList() {
  $httpClient.get(getSeedListRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '取得種子列表失敗 ‼️',
        '請重新登入'
      );
      $done();
    }
    else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const cropMetas = obj.data.cropMetas;
            let found = false;
            for (const crop of cropMetas) {
              // console.log('找到 ' + crop.name + ' 種子')
              if (crop.name.includes(shopeeCropName)) {
                if (crop.config.startTime < new Date().getTime() && crop.config.endTime > new Date().getTime()) {
                  found = true;
                  if (crop.totalNum <= crop.curNum) {
                    shopeeNotify(
                      '取得種子失敗 ‼️',
                      crop.name + ' 已經被搶購一空！'
                    );
                  }
                  else {
                    console.log('嘗試種植 ' + crop.name);
                    createCropRequest.body.metaId = crop.id;
                    createCrop(crop.name);
                  }
                }
              }
            }
            if (found === false) {
              shopeeNotify(
                '取得種子失敗 ‼️',
                '今天沒有 ' + shopeeCropName + ' 的種子'
              );
            }
            $done();
          } else {
            shopeeNotify(
              '取得種子列表失敗 ‼️',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          shopeeNotify(
            '取得種子列表失敗 ‼️',
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

function createCrop(cropName) {
  $httpClient.post(createCropRequest, function (error, response, data) {
    if (error) {
      shopeeNotify(
        '自動種植失敗 ‼️',
        '連線錯誤'
      );
    }
    else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            shopeeNotify(
              '自動種植成功 🌱',
              '正在種植 ' + cropName
            );

            const user_id = shopeeCookie.split('SPC_U=')[1].split(';')[0];
            const cropId = obj.data.crop.id;
            const saveShopeeUid = $persistentStore.write(user_id, 'Shopee_SPC_U');
            let shopeeCrop = JSON.parse($persistentStore.read('ShopeeCrop'));
            if (shopeeCrop) {
              shopeeCrop.cropId = cropId;
            } else {
              shopeeCrop = {'cropId': cropId};
            }
            const saveShopeeCrop = $persistentStore.write(JSON.stringify(shopeeCrop), 'ShopeeCrop');
          } else if (obj.msg === 'crop exist') {
            shopeeNotify(
              '自動種植失敗 ‼️',
              '目前有正在種的作物 ' + obj.data.crop.meta.name
            );
          } else if (obj.msg === 'crop is waiting') {
            shopeeNotify(
              '自動種植失敗 ‼️',
              '尚未開放種植 ' + cropName,
            );
          } else {
            shopeeNotify(
              '自動種植失敗 ‼️',
              obj.msg
            );
          }
        } catch (error) {
          shopeeNotify(
            '自動種植失敗 ‼️',
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
    $done();
  });
}

function sleep(seconds) {
  const waitUntil = new Date().getTime() + seconds * 1000;
  while (new Date().getTime() < waitUntil) true;
}

if (shopeeCropToken.length < 64) {
  shopeeNotify(
    '發生錯誤 ‼️',
    '請先種植任意種子以取得 token'
  )
  $done();
}
else {
  if (!shopeeCropName.length) {
    console.log('沒有指定作物名稱，預設使用大布丁')
    shopeeCropName = '大布丁';
  }
  sleep(0.5);
  getSeedList();
}
