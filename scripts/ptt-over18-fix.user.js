// ==UserScript==
// @name        Ptt.cc: I am over 18
// @namespace   UserScripts
// @match       https://www.ptt.cc/*
// @grant       none
// @version     0.1.14
// @author      CY Fung
// @license     MIT
// @description 9/28/2023, 12:26:04 PM
// @require     https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @inject-into page
// @run-at      document-start
// ==/UserScript==
(() => {
  function getURL() {
    let p = location.href;
    if (p.includes("ask/over18?")) {
      let q = new URL(p);
      let from = q.searchParams.get("from");
      if (from && typeof from === "string" && !from.includes("://"))
        return `${q.origin}${q.searchParams.get("from")}`;
    }
    return p;
  }

  let p1 = Cookies.get("over18", { domain: "" });
  Cookies.set("over18", "1", { expires: 36135, domain: "" });
  let p2 = Cookies.get("over18", { domain: "" });

  let redirection = "";
  if (p1 !== p2) {
    let url = getURL();
    redirection = url;
  } else if (p1 === "1" && p2 === "1") {
    let url = getURL();
    if (url !== location.href) {
      redirection = url;
    }
  }

  if (redirection) {
    let url = redirection;
    if (url.includes("?")) {
      url += "&" + Date.now();
    } else {
      url += "?" + Date.now();
    }
    location.replace(url);
  }
})();
