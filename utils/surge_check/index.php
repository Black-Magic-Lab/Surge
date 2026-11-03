<!doctype html>
<html>

<head>
  <title>Surge Check</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</head>

<body class="d-flex h-100 text-center text-white bg-dark">
  <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
    <main class="px-3">
      <h1>Surge Check</h1>
      <div class="row" style="height: 30px;"></div>
      <div class="row" style="margin-top: 20px; margin-bottom: 20px;">
        <div class="card text-white bg-secondary" style="width: 18rem; margin-left:auto; margin-right:auto;">
          <div class="card-body">
            <h5 class="card-title">Header Rewrite</h5>
            <h6 class="card-text">
              <?php
              $rewrite_success = false;
              foreach (getallheaders() as $name => $value) {
                if ($name === "X-Hiraku-Rewrite") {
                  if ($value === "1") {
                    $rewrite_success = true;
                    break;
                  }
                }
              }
              echo $rewrite_success ? "Success ✅" : "Failed ❌";
              ?>
            </h6>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: 20px; margin-bottom: 20px;">
        <div class="card text-white bg-secondary" style="width: 18rem; margin-left:auto; margin-right:auto;">
          <div class="card-body">
            <h5 class="card-title">Script Execution</h5>
            <h6 class="card-text">
              <?php
              $script_success = false;
              foreach (getallheaders() as $name => $value) {
                if ($name === "X-Hiraku-Script") {
                  if ($value === "1") {
                    $script_success = true;
                    break;
                  }
                }
              }
              echo $script_success ? "Success ✅" : "Failed ❌";
              ?>
            </h6>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: 20px; margin-bottom: 20px;">
        <div class="card text-white bg-secondary" style="width: 18rem; margin-left:auto; margin-right:auto;">
          <div class="card-body">
            <h5 class="card-title">MitM Response</h5>
            <h6 class="card-text" id="mitm-resule">Failed ❌</h6>
          </div>
        </div>
      </div>
    </main>
   <div class="row" style="margin-top: 20px; margin-bottom: 20px;">
      <div style="margin-left:auto; margin-right:auto;">
        請先安裝檢測專用模組，以正確顯示本頁結果
      </div>
      <div>
        安裝連結：
        <span onclick="copyToClipBoard('surge_check')">Surge</span>
        、
        <span onclick="window.open('loon://import?plugin=https://kinta.ma/loon/plugins/loon_check.plugin')">Loon</span>
      </div>
    </div>
  </div>
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
