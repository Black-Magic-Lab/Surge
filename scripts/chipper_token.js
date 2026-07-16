function chipperNotify(subtitle = "", message = "") {
  $notification.post("Chipper 取得 token", subtitle, message);
}

const authorization =
  $request.headers["Authorization"] || $request.headers["authorization"];
if (authorization) {
  let writeData = $persistentStore.write(authorization, "ChipperToken");
  if (!writeData) {
    chipperNotify("保存失敗 ‼️", "請稍後嘗試");
  } else {
    chipperNotify("token 保存成功 ✅", "請手動執行「[Chipper]取得 USDT 入金地址」腳本");
  }
} else {
  chipperNotify("保存失敗 ‼️", "請重新登入");
}

$done($request);
