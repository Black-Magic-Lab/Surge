<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>Surge Modules</title>
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
                <p id="name">Surge Modules</p>
                <p id="latest">iOS Surge 4 專用模組列表</p>
            </div>
        </div>
    </panel>
    <panel>
        <block style="font-size: 12px;">
            <p>部份模組為網路上收集而來，並由本人重新上傳，用意為避免原作者因為被喝茶而撤掉，或者在更新版本中加入其他與功能無關之行為（例如收集使用者資料），此類模組已標上原作者與原始網址。</p>
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
                    <span class="description">阻擋第三方 App 的 Facebook SDK，但不影響 Facebook App 本身。iOS 15 以上無法將 Facebook 自家 App 加入白名單，會全部擋掉。</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jimmyorz/Surge/master/YouTube.sgmodule')">
                    <label>
                        <p>YouTube 去廣告</p>
                    </label>
                    <span class="description">阻擋 YouTube 廣告，應該是失效了</span><br>
                    <span class="author">作者: Phowx</span><br>
                    <span class="url">來源: https://github.com/jimmyorz/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jkgtw/Surge/master/Modules/Ecosia-to-Whoogle.sgmodule')">
                    <label>
                        <p>Ecosia to Whoogle (軒姐)</p>
                    </label>
                    <span class="description">把 Ecosia 搜尋轉址到 whoogle.xuan2host.com</span><br>
                    <span class="author">作者: jkgtw</span><br>
                    <span class="url">來源: https://github.com/jkgtw/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jkgtw/Surge/master/Modules/Ecosia-to-futaWhoogle.sgmodule')">
                    <label>
                        <p>Ecosia to Whoogle (Futa)</p>
                    </label>
                    <span class="description">把 Ecosia 搜尋轉址到 whoogle.futa.gg</span><br>
                    <span class="author">作者: jkgtw</span><br>
                    <span class="url">來源: https://github.com/jkgtw/Surge</span>
                </div>
            </div>
            <!-- <div>
                <div onclick="copyToClipBoard('shopee_ad')">
                    <label>
                        <p>蝦皮 App 去廣告</p>
                    </label>
                    <span class="description">實驗性模組，部份廣告需刪除 App 重裝才會消失，若造成異常請回報</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
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
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('ptt_imgur_fix')">
                    <label>
                        <p>PTT Imgur 修正</p>
                    </label>
                    <span class="description">修正 PTT 網頁版無法顯示 Imgur 圖片的問題</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('netflix_rating')">
                    <label>
                        <p>Netflix IMDB 評分</p>
                    </label>
                    <span class="description">自己 hosting 把中華民國國旗找回來了！</span><br>
                    <span class="author">作者: yichahucha</span><br>
                    <span class="url">來源: https://github.com/yichahucha/surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/Neurogram-R/Surge/master/module/Netflix-Dualsub.sgmodule')">
                    <label>
                        <p>Netflix 雙語字幕</p>
                    </label>
                    <span class="description">如需更換語言請自行複製後修改 second_lang 參數，預設為英文。</span><br>
                    <span class="author">作者: Neurogram-R</span><br>
                    <span class="url">來源: https://github.com/Neurogram-R/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/Neurogram-R/Surge/master/module/DisneyPlus-Dualsub.sgmodule')">
                    <label>
                        <p>Disney+ 雙語字幕</p>
                    </label>
                    <span class="description">如需更換語言請自行複製後修改 second_lang 參數，預設為英文。</span><br>
                    <span class="author">作者: Neurogram-R</span><br>
                    <span class="url">來源: https://github.com/Neurogram-R/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('twitter_image')">
                    <label>
                        <p>Twitter 圖片載入加速</p>
                    </label>
                    <span class="description">直接指定 IP，開圖就會變快。</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surgee</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('shopee_checkin')">
                    <label>
                        <p>蝦皮每日自動簽到 & 開寶箱</p>
                    </label>
                    <span class="description">自動簽到修改版，每天會自動更新 Cookie，第一次使用要去「我的」→「邀請我的朋友」儲存 token</span><br>
                    <span class="author">作者: hirakujira & jkgtw</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('shopee_auto_water')">
                    <label>
                        <p>蝦蝦果園自動做任務 & 自動領獎勵 & 自動澆水</p>
                    </label>
                    <span class="description">每天自動做水滴任務，接近隔天午夜會自動把今天任務的獎勵全部用掉。每三小時自動澆水，每次換作物後需先手動澆水一次，讓 Surge 紀錄目前的作物。需要同時開啟每日自動簽到以獲得 token。</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('mcdonalds')">
                    <label>
                        <p>麥當勞每日自動簽到 & 參加活動</p>
                    </label>
                    <span class="description">自動簽到，第一次使用先去個人資料那邊按修改，但什麼都不要改，直接儲存就可以獲得 token</span><br>
                    <span class="author">作者: hirakujira & jkgtw</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/jkgtw/Surge/master/Modules/BooksDailyCheckin.sgmodule')">
                    <label>
                        <p>博客來每日自動簽到</p>
                    </label>
                    <span class="description">博客來自動簽到，第一次使用先去 e-coupon 頁面取得 token</span><br>
                    <span class="author">作者: jkgtw</span><br>
                    <span class="url">來源: https://github.com/jkgtw/Surge</span>
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
            <div>
                <div onclick="copyToClipBoard('iphone_get_model')">
                    <label>
                        <p>iPhone 直營店庫存檢查 - 獲得機型代碼</p>
                    </label>
                    <span class="description">請用非 Safari 瀏覽器，在官網將您要的機型加入購物車，獲得機型代號後即可關閉此模組。</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('iphone_check_store')">
                    <label>
                        <p>iPhone 直營店庫存檢查</p>
                    </label>
                    <span class="description">每分鐘檢查一次直營店庫存。</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
                </div>
            </div>
        </fieldset>
        <label>資訊面板</label>
        <fieldset>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/Nebulosa-Cat/Surge/main/Panel/Network-Info/Network-Info.sgmodule')">
                    <label>
                        <p>網路詳情面板</p>
                    </label>
                    <span class="description">顯示 IP、ISP、地區等網路資訊</span><br>
                    <span class="author">作者: Nebulosa-Cat & hirakujira</span><br>
                    <span class="url">來源: https://github.com/Nebulosa-Cat/Surge</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('https://raw.githubusercontent.com/FutaGuard/FutaFilter/master/Surge/check_futadns.sgmodule')">
                    <label>
                        <p>FutaDNS 檢查面板</p>
                    </label>
                    <span class="description">顯示目前是否成功連上 FutaDNS</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/FutaGuard/FutaFilter</span>
                </div>
            </div>
            <div>
                <div onclick="copyToClipBoard('whosis_sayings')">
                    <label>
                        <p>「是誰在講幹話」資訊面板</p>
                    </label>
                    <span class="description">可以看到一堆幹話喔 :)</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
                </div>
            </div>
        </fieldset>
        <label>其他</label>
        <fieldset>
            <div>
                <div onclick="window.open('utils/mcdonalds_token')">
                    <label>
                        <p>麥當勞 Token 取得工具</p>
                    </label>
                    <span class="description">使用電腦取得麥當勞 App Token</span><br>
                    <span class="author">作者: hirakujira</span><br>
                    <span class="url">來源: https://github.com/Black-Magic-Lab/Surge</span>
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
            max-width: 400px;
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