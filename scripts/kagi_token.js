if (typeof $argument != "undefined") {
  $request.headers["cookie"] =
    "kagi_session=" + $argument.replace("https://kagi.com/search?token=", "");

  $done($request);
} else {
  $done({});
}
