<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">

<head>
    <title>Hiraku's Surge Modules</title>
</head>
<base target="_top" />
<link rel="stylesheet" type="text/css" href="./style.css" />
<script type="text/javascript" src="./style.js"></script>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="Content-Type" content="text/html; charset=utf8">
<meta property="og:image" content="icon.png">

<body class="pinstripe">
    <panel>
        <div id="header">
            <div id="icon">
                <div>
                    <span><img src="icon.png" style="width:100%"></span>
                </div>
            </div>
            <div id="content">
                <p id="name">Hiraku's Surge Modules</p>
                <p id="latest">Surge 4 專用模組列表</p>
            </div>
        </div>
    </panel>
    <panel>
        <block style="font-size: 12px;">
            <p>部份模組為網路上收集而來，並由本人重新上傳，用意為避免原作者因為被喝茶而撤掉，或者在更新版本中加入其他與功能無關之行為（例如收集使用者資料），此類模組已標上原作者與原始網址。</p><br>
            <p>請點擊想安裝的模組，網址會自動複製到剪貼簿。</p>
        </block>
        <label>廣告阻擋與個資保護</label>
        <fieldset>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jkgtw/Surge/master/Modules/ADList.sgmodule')">
                    <label>
                        <p>ADList</p>
                    </label>
                    <span class="description">把 NEOHOSTS 的 basic 廣告清單轉成 Surge 新的 domain set，部份阻擋列表可能跟其他阻擋用模組重複，請留意</span><br>
                    <span class="author">作者: jkgtw</span><br>
                    <span class="url">來源: https://github.com/jkgtw/Surge</span>
                </div>
            </div>
             <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jkgtw/Surge/master/Modules/LINE-ADs.sgmodule')">
                    <label>
                        <p>LINE 去廣告</p>
                    </label>
                    <span class="description">部份阻擋列表可能跟其他阻擋用模組重複，請留意</span><br>
                    <span class="author">作者: jkgtw</span><br>
                    <span class="url">來源: https://github.com/jkgtw/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/FutaGuard/FutaFilter/master/Surge/filters.txt')">
                    <label>
                        <p>FutaFilter</p>
                    </label>
                    <span class="description">部份阻擋列表可能跟其他阻擋用模組重複，請留意</span><br>
                    <span class="author">作者: 踢低吸</span><br>
                    <span class="url">來源: https://github.com/FutaGuard/FutaFilter</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('facebook_block_sdk')">
                    <label>
                        <p>Facebook SDK 阻擋</p>
                    </label>
                    <span class="description">阻擋第三方 App 的 Facebook SDK，但不影響 Facebook App 本身</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://kinta.ma/surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jimmyorz/Surge/master/YouTube.sgmodule')">
                    <label>
                        <p>YouTube 去廣告</p>
                    </label>
                    <span class="description">阻擋 YouTube 廣告</span><br>
                    <span class="author">作者: Phowx</span><br>
                    <span class="url">來源: https://github.com/jimmyorz</span>
                </div>
            </div>
            <!-- <div>
                <div onclick="copyToClipBoard('shopee_ad')">
                    <label>
                        <p>蝦皮 App 去廣告</p>
                    </label>
                    <span class="description">實驗性模組，部份廣告需刪除 App 重裝才會消失，若造成異常請回報</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://kinta.ma/surge</span>
                </div>
            </div> -->
        </fieldset>
        <label>功能增強</label>
        <fieldset>
            <div>
                <div onclick="copyToClipBoard('ptt')">
                    <label>
                        <p>PTT 跳過年齡驗證</p>
                    </label>
                    <span class="description">連確認畫面都不會出現了，直接跳轉</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://kinta.ma/surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('ptt_imgur_fix')">
                    <label>
                        <p>PTT Imgur 修正</p>
                    </label>
                    <span class="description">修正 PTT 網頁版無法顯示 Imgur 圖片的問題</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://kinta.ma/surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('netflix_rating')">
                    <label>
                        <p>Netflix IMDB 評分</p>
                    </label>
                    <span class="description">自己 hosting 把中華民國國旗找回來了！</span><br>
                    <span class="author">作者: yichahucha</span><br>
                    <span class="url">來源: https://github.com/yichahucha/surge/blob/master/nf_rating.js</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jimmyorz/Surge/master/TwitterImage.sgmodule')">
                    <label>
                        <p>Twitter 圖片載入加速</p>
                    </label>
                    <span class="description">直接指定 IP，開圖就會變快。找到方法的是我，但 jimmyorz 幫忙寫成了模組</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://raw.githubusercontent.com/jimmyorz/Surge/master/TwitterImage.sgmodule</span>
                </div>
            </div>
             <div>
                <div onclick="copyToClipBoard('shopee_token')">
                    <label>
                        <p>蝦皮拿 Token</p>
                    </label>
                    <span class="description">蝦皮自動簽到拿 Token，只需要做一次。</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://kinta.ma/surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('shopee_checkin')">
                    <label>
                        <p>蝦皮每日自動簽到 & 開寶箱</p>
                    </label>
                    <span class="description">自動簽到修改版，每天會自動更新 Cookie</span><br>
                    <span class="author">作者: hirakujira & jkgtw</span><br>
                    <span class="url">來源: https://kinta.ma/surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('mcdonalds')">
                    <label>
                        <p>麥當勞每日自動簽到</p>
                    </label>
                    <span class="description">自動簽到，第一次使用先去個人資料那邊按修改，但什麼都不要改，直接儲存就可以獲得 token</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://kinta.ma/surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jkgtw/Surge/master/Modules/boostbandwidth.sgmodule')">
                    <label>
                        <p>OO 電信限速破解 - 全時段</p>
                    </label>
                    <span class="description">利用固定戳 SpeedTest 來解除限速，每兩分鐘執行一次，請勿重複安裝類似功能模組</span><br>
                    <span class="author">作者: jkgtw</span><br>
                    <span class="url">來源: https://github.com/jkgtw/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jkgtw/Surge/master/Modules/boostbandwidth-nightonly.sgmodule')">
                    <label>
                        <p>OO 電信限速破解 - 夜間時段</p>
                    </label>
                    <span class="description">利用固定戳 SpeedTest 來解除限速，在「晚上八點到凌晨兩點」每兩分鐘執行一次，請勿重複安裝類似功能模組</span><br>
                    <span class="author">作者: jkgtw</span><br>
                    <span class="url">來源: https://github.com/jkgtw/Surge</span>
                </div>
            </div>
        </fieldset>
    </panel>
    <panel>
        <block style="border: none; background-color: transparent;">
            <p style="font-size: 10px; color: #666; margin: 0;">所有商標之所有權歸於該商標的所有者。</p>
            <p style="font-size: 10px; color: #ddd; text-decoration: line-through; margin: 0;">這裡沒有黑魔法 (´・ω・｀)</p>
            <!-- blackmagic.php -->
        </block>
    </panel>
    <style>
    #icon {
        display: inline-block;
        vertical-align: top;
        height: 64px;
        width: 64px;
        padding-left: 5px;
        padding-top: 5px;
    }

    #content {
        display: inline-block;
        padding: 6px;
        height: 64px;
        width: 233px;
        position: relative;
    }

    #name {
        margin-bottom: 8px;
        font-weight: bold;
        font-size: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .description {
        color: #555;
        font-size: 11px;
    }

    .url,
    .author {
        color: #888;
        font-size: 11px;
        /* These are technically the same, but use both */
        overflow-wrap: break-word;
        word-wrap: break-word;

        -ms-word-break: break-all;
        /* This is the dangerous one in WebKit, as it breaks things wherever */
        word-break: break-all;
        /* Instead use this non-standard one: */
        word-break: break-word;

        /* Adds a hyphen where the word breaks, if supported (No Blink) */
        -ms-hyphens: auto;
        -moz-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
    }
    </style>
</body>
<script>
function copyToClipBoard(module_name) {
    /* Get the text field */
    var copyText = "https://kinta.ma/surge/modules/" + module_name + ".sgmodule";
    if (module_name.includes('http')) {
        copyText = module_name;
    }
    var dummy = document.createElement("textarea");
    dummy.type = "hidden";
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = copyText;
    dummy.select();
    dummy.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
    dummy.style.display = 'none';

    /* Alert the copied text */
    alert("網址已複製：" + dummy.value);
}
</script>

</html>