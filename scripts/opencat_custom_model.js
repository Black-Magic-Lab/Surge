let arg;

if (typeof $argument != "undefined") {
  arg = Object.fromEntries($argument.split("&").map((item) => item.split("=")));

  const userAgent =
    $request.headers["User-Agent"] || $request.headers["user-agent"];

  if (userAgent && userAgent.includes("OpenCat/") && $request.body) {
    const url = $request.url;
    if (url.includes("openai") && arg.openai_model) {
      let obj = JSON.parse($request.body);
      if (obj.model === "gpt-3.5-turbo-0613") {
        obj.model = arg.openai_model;
        $request.body = JSON.stringify(obj);
      }
    } else if (url.includes("anthropic") && arg.claude_model) {
      let obj = JSON.parse($request.body);
      if (obj.model === "claude-2") {
        obj.model = arg.claude_model;
        $request.body = JSON.stringify(obj);
      }
    }
  }

  $done($request);
} else {
  $done({});
}
