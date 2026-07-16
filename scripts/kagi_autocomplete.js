const _url = new URL($request.url);
const qValue = _url.searchParams.get("q");
let url = "https://kagi.com/autosuggest/?q=" + qValue;
let headers = {
  Accept: "*/*",
  "User-Agent":
    "Mozilla/5.0 (iPad; CPU iPhone OS 18.1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1",
  Connection: "keep-alive",
  Host: "kagi.com",
  "Accept-Encoding": "gzip, deflate, br",
  Cookie:
    "kagi_session=" + $argument.replace("https://kagi.com/search?token=", ""),
};

var params = {
  url: url,
  timeout: 5000,
  headers: headers,
};

$httpClient.get(params, function (errormsg, response, data) {
  if (errormsg) {
    console.log(errormsg);
  } else {
    const suggestions = JSON.parse(data).map((item) => item.t);
    const result = [qValue, suggestions];
    const modifiedBody = JSON.stringify(result);
    $done({ body: modifiedBody });
  }
});
