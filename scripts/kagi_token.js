let result = {};

try {
  const source = new URL($request.url);
  const session = new URL($argument.trim());
  const token = session.searchParams.get("token");

  if (
    source.origin === "https://www.ecosia.org" &&
    source.pathname === "/search" &&
    source.searchParams.has("q") &&
    session.origin === "https://kagi.com" &&
    session.pathname === "/search" &&
    token
  ) {
    const target = new URL("https://kagi.com/search");
    target.searchParams.set("token", token);
    target.searchParams.set("q", source.searchParams.get("q"));

    result = {
      response: {
        status: 302,
        headers: {
          Location: target.toString(),
          "Cache-Control": "no-store",
        },
        body: "",
      },
    };
  }
} catch (_) {
  // 設定無效時保留原請求，不輸出登入憑證。
}

$done(result);
