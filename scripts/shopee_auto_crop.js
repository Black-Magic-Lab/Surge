const shopeeCookie = $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';';
const shopeeCSRFToken = $persistentStore.read('CSRFTokenSP');
const shopeeCropToken = $persistentStore.read('ShopeeCropToken');
let shopeeCropName = $persistentStore.read('ShopeeCropName');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};

let createCropRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/crop/create?t=' + new Date().getTime(),
  headers: shopeeHeaders,
  body: {
    'metaId' : 0,
    's': shopeeCropToken
  }
}

let getSeedListRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/crop/meta/get?t=' + new Date().getTime(),
  headers: shopeeHeaders,
};


function getSeedList() {
  if (shopeeCropToken.length < 64) {
    $notification.post('🍤 蝦皮自動種植錯誤‼️',
      '',
      '請先種植任意種子以取得 token'
    );
    return;
  }
  if (!shopeeCropName.length) {
    console.log('沒有指定作物名稱，預設使用大布丁')
    shopeeCropName = '大布丁';
  }
  $httpClient.get(getSeedListRequest, function (error, response, data) {
    if (error) {
      $notification.post('🍤 蝦皮自動種植失敗‼️',
        '',
        '連線錯誤‼️'
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
                    $notification.post('🍤 蝦皮自動種植錯誤‼️',
                      '',
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
              $notification.post('🍤 蝦皮自動種植錯誤‼️',
                '',
                '今天沒有 ' + shopeeCropName + ' 的種子'
              );
            }
            $done();
          } else {
            $notification.post('🍤 蝦皮自動種植錯誤‼️',
              '',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          $notification.post('🍤 蝦皮自動種植錯誤‼️',
            '',
            error
          );
          $done();
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
          '',
          '請重新更新 Cookie 重試 🔓'
        );
        $done();
      }
    }
  });
}

function createCrop(cropName) {
  $httpClient.post(createCropRequest, function(error, response, data) {
    if (error) {
      $notification.post('🍤 蝦皮自動種植失敗‼️',
        '',
        '連線錯誤‼️'
      );
    } 
    else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            $notification.post('🍤 蝦皮自動種植成功 🌱',
              '',
              '正在種植 ' + cropName
            );
          } else if (obj.msg === 'crop exist') {
            $notification.post('🍤 蝦皮自動種植錯誤‼️',
              '',
              '目前有正在種的作物 ' + obj.data.crop.meta.name,
            );
          } else if (obj.msg === 'crop is waiting') {
            $notification.post('🍤 蝦皮自動種植錯誤‼️',
              '',
              '尚未開放種植 ' + cropName,
            );
          } else {
            $notification.post('🍤 蝦皮自動種植錯誤‼️',
              '',
              obj.msg
            );
          }
        } catch (error) {
          $notification.post('🍤 蝦皮自動種植錯誤‼️',
            '',
            error
          );
        }
      } else {
        $notification.post('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
          '',
          '請重新更新 Cookie 重試 🔓'
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

sleep(1.0);
getSeedList();