import * as zip from '../node_modules/@zip.js/zip.js/index.js';
const bplist = require("bplistParser.js");
let reader;

const checkHasFile = () => {
  if (document.getElementById('fileInput').value) {
    document.getElementById('submitButton').removeAttribute('disabled');
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();

  if (document.getElementById('result')) {
    let element = document.getElementById("result");
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  const targetFile = await getTargetFile(
    document.getElementById('fileInput').files
  );
  if (!targetFile) {
    alert('失敗：找不到 tw.com.mcddaily.plist！');
    return;
  }
  const buffer = await unzipFileData(targetFile);
  const plist = await bplist.parseBuffer(buffer);
  const token = decryptData(plist);
  showToken(token);
};

const getTargetFile = async (files) => {
  const file = files[0];
  reader = new zip.ZipReader(new zip.BlobReader(file));
  const entries = await reader.getEntries();

  let targetFile;
  if (entries.length) {
    for (const entry of entries) {
      if (
        entry.filename === 'Container/Library/Preferences/tw.com.mcddaily.plist'
      ) {
        targetFile = entry;
        break;
      }
    }
  }
  return targetFile;
};

const unzipFileData = async (file) => {
  try {
    const blob = await file.getData(new zip.BlobWriter());
    return (await blob.arrayBuffer());
  } catch (error) {
    alert('失敗：解壓縮失敗，檔案可能已損毀');
    return;
  }
};

const decryptData = (jsonData) => {
  try {
    const aesKey = CryptoJS.enc.Utf8.parse('1s2unxaounk8zusv');
    const aesConfig = { words: [0, 0, 0, 0], sigBytes: 16, mode: CryptoJS.mode.ECB, pad: CryptoJS.pad.Pkcs7 };
    const bytes = CryptoJS.AES.decrypt(jsonData[0].MCDUser, aesKey, aesConfig);
    const decodedString = bytes.toString(CryptoJS.enc.Utf8);
    const userData = JSON.parse(decodedString);
    return userData.accessToken;
  } catch (error) {
    alert('失敗：無法找到 Token，可能檔案有誤');
    return;
  }
}

const showToken = (token) => {
  const description = document.createElement("p");
  const code = document.createElement("pre");
  description.textContent = '請將 mcdonalds_set_token.js 的第一行換成以下內容，之後執行：';
  code.textContent = 'const token = \'' + token + '\';';

  document.getElementById('result').appendChild(description);
  document.getElementById('result').appendChild(code);
}

document.getElementById('fileInput').addEventListener('change', checkHasFile);
document.getElementById('fileForm').addEventListener('submit', handleSubmit);
