const debug = false;
const model = $persistentStore.read("iPhoneModel");

var checkRequest = {
  url: "",
  headers: {
    "X-Ma-Pcmh": "REL-6.9",
    "X-Deviceconfiguration":
      "ss=3.00;dim=0x0;m=iPhone;v=iPhone18,2;vv=6.9;sv=27.0.1",
  },
};

const stores = ["R713", "R694"];

function checkStore(model, index) {
  const store = stores[index];
  checkRequest["url"] =
    "https://mobileapp.apple.com/fulfillment/p/tw/pickup/quote/" +
    model +
    "?partNumber=" +
    model +
    "&store=" +
    store;
  $httpClient.get(checkRequest, function (error, response, data) {
    if (error) {
      $notification.post("🍎 直營店庫存檢查失敗 ❌", "", "連線錯誤‼️");
      $done();
    } else {
      if (response.status == 200) {
        let obj = JSON.parse(data);
        if (obj.availabilityStatus != "NOT_AVAILABLE") {
          $notification.post(`📱 ${model} 有貨`, "", obj.pickupQuote);
        } else {
          console.log("📱 " + obj.storeNumber + " " + obj.pickupQuote);
        }
        if (index < stores.length - 1) {
          checkStore(model, index + 1);
        } else {
          $done();
        }
      } else {
        $notification.post("🍎 直營店庫存檢查失敗 ❌", "", "連線錯誤‼️");
        $done();
      }
    }
  });
}

if (!model) {
  console.log("尚未設定機型，請先用「獲得機型代碼」模組取得");
  $done();
} else if (Date.now() < 1758225600000) {
  console.log("還沒開賣");
  $done();
} else if (new Date().getHours() < 6 || new Date().getHours() > 21) {
  console.log("不在營業時間");
  $done();
} else {
  checkStore(model, 0);
}
