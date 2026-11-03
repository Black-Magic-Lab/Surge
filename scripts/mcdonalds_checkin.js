// prettier-ignore
!(function (t, r) { 'object' == typeof exports ? (module.exports = exports = r()) : 'function' == typeof define && define.amd ? define([], r) : (t.CryptoJS = r()); })(this, loadCryptoJS());

function mcdonaldsNotify(subtitle = '', message = '') {
  $notification.post('🍟 麥當勞每日簽到', subtitle, message, { 'url': 'mcdonalds.app://' });
};

// 2023 起 token 改存在 McdonaldsInfo，舊 key 留作相容
const mcdonaldsToken = JSON.parse($persistentStore.read('McdonaldsInfo') || '{}').token || $persistentStore.read('McdonaldsToken');
const aesKey = CryptoJS.enc.Utf8.parse('1s2unxaounk8zusv');
const aesConfig = { words: [0, 0, 0, 0], sigBytes: 16, mode: CryptoJS.mode.ECB, pad: CryptoJS.pad.Pkcs7 };
const checkInDetailRequest = {
  url: 'https://mcdapi.mcddailyapp.com.tw/McDonaldAPI/game/checkIn/detail',
  headers: {
    'accessToken': mcdonaldsToken,
    'Content-Type': 'application/json'
  },
}

let joinGameRequest = {
  url: 'https://mcdapi.mcddailyapp.com.tw/McDonaldAPI/game/joinGame',
  headers: {
    'accessToken': mcdonaldsToken,
    'Content-Type': 'application/json'
  },
  body: ''
}

$httpClient.post(checkInDetailRequest, function (error, response, data) {
  if (error) {
    mcdonaldsNotify(
      '取得簽到 ID 失敗 ‼️',
      '連線錯誤'
    );
    $done();
  } else {
    if (response.status == 200) {
      try {
        let obj = JSON.parse(data);
        if (obj.code === 0) {
          const returnData = JSON.parse(aesDecrypt(obj.data));
          const gameId = returnData.gameCheckInVo.gameId;

          joinGameRequest.body = aesEncrypt('{"gameId":' + gameId + '}');
          checkIn();
        } else if (obj.code !== 0) {
          mcdonaldsNotify(
            '取得簽到 ID 失敗 ‼️',
            obj.msg
          );
          $done();
        }
      } catch (error) {
        mcdonaldsNotify(
          '取得簽到 ID 失敗 ‼️',
          error
        );
        $done();
      }
    } else {
      mcdonaldsNotify(
        'Cookie 已過期 ‼️',
        '請重新登入'
      );
      $done();
    }
  }
});

function checkIn() {
  $httpClient.post(joinGameRequest, function (error, response, data) {
    if (error) {
      mcdonaldsNotify(
        '簽到失敗 ‼️',
        '連線錯誤'
      );
    } else {
      if (response.status == 200) {
        try {
          let obj = JSON.parse(data);
          if (obj.code === 0) {
            const returnData = JSON.parse(aesDecrypt(obj.data));
            const gameCheckPoint = returnData.point;
            mcdonaldsNotify(
              '簽到成功 ✅',
              '恭喜獲得 👉 ' + gameCheckPoint + ' 積分 🍔'
            );
          } else if (obj.code !== 0) {
            mcdonaldsNotify(
              '簽到失敗 ‼️',
              obj.msg
            );
          }
        } catch (error) {
          mcdonaldsNotify(
            '簽到失敗 ‼️',
            error
          );
        }
      } else {
        mcdonaldsNotify(
          'Cookie 已過期 ‼️',
          '請重新登入'
        );
      }
    }
    $done();
  });
}

function aesDecrypt(base64String) {
  const bytes = CryptoJS.AES.decrypt(base64String, aesKey, aesConfig);
  const decodedString = bytes.toString(CryptoJS.enc.Utf8);
  return decodedString;
}

function aesEncrypt(string) {
  return CryptoJS.AES.encrypt(string, aesKey, aesConfig).toString();
}

// prettier-ignore
// crypto-js 4.2.0 (MIT)，只打包 AES-ECB 需要的 core、enc-base64、cipher-core、aes、mode-ecb
function loadCryptoJS() {
  return function () {
    var CryptoJS=(()=>{var Q=(m=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(m,{get:(c,S)=>(typeof require!="undefined"?require:c)[S]}):m)(function(m){if(typeof require!="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+m+'" is not supported')});var I=(m,c)=>()=>{try{return c||m((c={exports:{}}).exports,c),c.exports}catch(S){throw c=0,S}};var N=I((O,X)=>{(function(m,c){typeof O=="object"?X.exports=O=c():typeof define=="function"&&define.amd?define([],c):m.CryptoJS=c()})(O,function(){var m=m||(function(c,S){var z;if(typeof window!="undefined"&&window.crypto&&(z=window.crypto),typeof self!="undefined"&&self.crypto&&(z=self.crypto),typeof globalThis!="undefined"&&globalThis.crypto&&(z=globalThis.crypto),!z&&typeof window!="undefined"&&window.msCrypto&&(z=window.msCrypto),!z&&typeof global!="undefined"&&global.crypto&&(z=global.crypto),!z&&typeof Q=="function")try{z=Q("crypto")}catch(e){}var K=function(){if(z){if(typeof z.getRandomValues=="function")try{return z.getRandomValues(new Uint32Array(1))[0]}catch(e){}if(typeof z.randomBytes=="function")try{return z.randomBytes(4).readInt32LE()}catch(e){}}throw new Error("Native crypto module could not be used to get secure random number.")},D=Object.create||(function(){function e(){}return function(r){var d;return e.prototype=r,d=new e,e.prototype=null,d}})(),P={},n=P.lib={},C=n.Base=(function(){return{extend:function(e){var r=D(this);return e&&r.mixIn(e),(!r.hasOwnProperty("init")||this.init===r.init)&&(r.init=function(){r.$super.init.apply(this,arguments)}),r.init.prototype=r,r.$super=this,r},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var r in e)e.hasOwnProperty(r)&&(this[r]=e[r]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}}})(),_=n.WordArray=C.extend({init:function(e,r){e=this.words=e||[],r!=S?this.sigBytes=r:this.sigBytes=e.length*4},toString:function(e){return(e||x).stringify(this)},concat:function(e){var r=this.words,d=e.words,u=this.sigBytes,b=e.sigBytes;if(this.clamp(),u%4)for(var w=0;w<b;w++){var F=d[w>>>2]>>>24-w%4*8&255;r[u+w>>>2]|=F<<24-(u+w)%4*8}else for(var B=0;B<b;B+=4)r[u+B>>>2]=d[B>>>2];return this.sigBytes+=b,this},clamp:function(){var e=this.words,r=this.sigBytes;e[r>>>2]&=4294967295<<32-r%4*8,e.length=c.ceil(r/4)},clone:function(){var e=C.clone.call(this);return e.words=this.words.slice(0),e},random:function(e){for(var r=[],d=0;d<e;d+=4)r.push(K());return new _.init(r,e)}}),h=P.enc={},x=h.Hex={stringify:function(e){for(var r=e.words,d=e.sigBytes,u=[],b=0;b<d;b++){var w=r[b>>>2]>>>24-b%4*8&255;u.push((w>>>4).toString(16)),u.push((w&15).toString(16))}return u.join("")},parse:function(e){for(var r=e.length,d=[],u=0;u<r;u+=2)d[u>>>3]|=parseInt(e.substr(u,2),16)<<24-u%8*4;return new _.init(d,r/2)}},l=h.Latin1={stringify:function(e){for(var r=e.words,d=e.sigBytes,u=[],b=0;b<d;b++){var w=r[b>>>2]>>>24-b%4*8&255;u.push(String.fromCharCode(w))}return u.join("")},parse:function(e){for(var r=e.length,d=[],u=0;u<r;u++)d[u>>>2]|=(e.charCodeAt(u)&255)<<24-u%4*8;return new _.init(d,r)}},p=h.Utf8={stringify:function(e){try{return decodeURIComponent(escape(l.stringify(e)))}catch(r){throw new Error("Malformed UTF-8 data")}},parse:function(e){return l.parse(unescape(encodeURIComponent(e)))}},y=n.BufferedBlockAlgorithm=C.extend({reset:function(){this._data=new _.init,this._nDataBytes=0},_append:function(e){typeof e=="string"&&(e=p.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(e){var r,d=this._data,u=d.words,b=d.sigBytes,w=this.blockSize,F=w*4,B=b/F;e?B=c.ceil(B):B=c.max((B|0)-this._minBufferSize,0);var W=B*w,q=c.min(W*4,b);if(W){for(var t=0;t<W;t+=w)this._doProcessBlock(u,t);r=u.splice(0,W),d.sigBytes-=q}return new _.init(r,q)},clone:function(){var e=C.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0}),A=n.Hasher=y.extend({cfg:C.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){y.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){e&&this._append(e);var r=this._doFinalize();return r},blockSize:512/32,_createHelper:function(e){return function(r,d){return new e.init(d).finalize(r)}},_createHmacHelper:function(e){return function(r,d){return new k.HMAC.init(e,d).finalize(r)}}}),k=P.algo={};return P})(Math);return m})});var re=I((T,ee)=>{(function(m,c){typeof T=="object"?ee.exports=T=c(N()):typeof define=="function"&&define.amd?define(["./core"],c):c(m.CryptoJS)})(T,function(m){return(function(){var c=m,S=c.lib,z=S.WordArray,K=c.enc,D=K.Base64={stringify:function(n){var C=n.words,_=n.sigBytes,h=this._map;n.clamp();for(var x=[],l=0;l<_;l+=3)for(var p=C[l>>>2]>>>24-l%4*8&255,y=C[l+1>>>2]>>>24-(l+1)%4*8&255,A=C[l+2>>>2]>>>24-(l+2)%4*8&255,k=p<<16|y<<8|A,e=0;e<4&&l+e*.75<_;e++)x.push(h.charAt(k>>>6*(3-e)&63));var r=h.charAt(64);if(r)for(;x.length%4;)x.push(r);return x.join("")},parse:function(n){var C=n.length,_=this._map,h=this._reverseMap;if(!h){h=this._reverseMap=[];for(var x=0;x<_.length;x++)h[_.charCodeAt(x)]=x}var l=_.charAt(64);if(l){var p=n.indexOf(l);p!==-1&&(C=p)}return P(n,C,h)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="};function P(n,C,_){for(var h=[],x=0,l=0;l<C;l++)if(l%4){var p=_[n.charCodeAt(l-1)]<<l%4*2,y=_[n.charCodeAt(l)]>>>6-l%4*2,A=p|y;h[x>>>2]|=A<<24-x%4*8,x++}return z.create(h,x)}})(),m.enc.Base64})});var ne=I((V,te)=>{(function(m,c){typeof V=="object"?te.exports=V=c(N()):typeof define=="function"&&define.amd?define(["./core"],c):c(m.CryptoJS)})(V,function(m){return(function(c){var S=m,z=S.lib,K=z.WordArray,D=z.Hasher,P=S.algo,n=[];(function(){for(var p=0;p<64;p++)n[p]=c.abs(c.sin(p+1))*4294967296|0})();var C=P.MD5=D.extend({_doReset:function(){this._hash=new K.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(p,y){for(var A=0;A<16;A++){var k=y+A,e=p[k];p[k]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var r=this._hash.words,d=p[y+0],u=p[y+1],b=p[y+2],w=p[y+3],F=p[y+4],B=p[y+5],W=p[y+6],q=p[y+7],t=p[y+8],v=p[y+9],g=p[y+10],a=p[y+11],E=p[y+12],H=p[y+13],L=p[y+14],R=p[y+15],i=r[0],o=r[1],s=r[2],f=r[3];i=_(i,o,s,f,d,7,n[0]),f=_(f,i,o,s,u,12,n[1]),s=_(s,f,i,o,b,17,n[2]),o=_(o,s,f,i,w,22,n[3]),i=_(i,o,s,f,F,7,n[4]),f=_(f,i,o,s,B,12,n[5]),s=_(s,f,i,o,W,17,n[6]),o=_(o,s,f,i,q,22,n[7]),i=_(i,o,s,f,t,7,n[8]),f=_(f,i,o,s,v,12,n[9]),s=_(s,f,i,o,g,17,n[10]),o=_(o,s,f,i,a,22,n[11]),i=_(i,o,s,f,E,7,n[12]),f=_(f,i,o,s,H,12,n[13]),s=_(s,f,i,o,L,17,n[14]),o=_(o,s,f,i,R,22,n[15]),i=h(i,o,s,f,u,5,n[16]),f=h(f,i,o,s,W,9,n[17]),s=h(s,f,i,o,a,14,n[18]),o=h(o,s,f,i,d,20,n[19]),i=h(i,o,s,f,B,5,n[20]),f=h(f,i,o,s,g,9,n[21]),s=h(s,f,i,o,R,14,n[22]),o=h(o,s,f,i,F,20,n[23]),i=h(i,o,s,f,v,5,n[24]),f=h(f,i,o,s,L,9,n[25]),s=h(s,f,i,o,w,14,n[26]),o=h(o,s,f,i,t,20,n[27]),i=h(i,o,s,f,H,5,n[28]),f=h(f,i,o,s,b,9,n[29]),s=h(s,f,i,o,q,14,n[30]),o=h(o,s,f,i,E,20,n[31]),i=x(i,o,s,f,B,4,n[32]),f=x(f,i,o,s,t,11,n[33]),s=x(s,f,i,o,a,16,n[34]),o=x(o,s,f,i,L,23,n[35]),i=x(i,o,s,f,u,4,n[36]),f=x(f,i,o,s,F,11,n[37]),s=x(s,f,i,o,q,16,n[38]),o=x(o,s,f,i,g,23,n[39]),i=x(i,o,s,f,H,4,n[40]),f=x(f,i,o,s,d,11,n[41]),s=x(s,f,i,o,w,16,n[42]),o=x(o,s,f,i,W,23,n[43]),i=x(i,o,s,f,v,4,n[44]),f=x(f,i,o,s,E,11,n[45]),s=x(s,f,i,o,R,16,n[46]),o=x(o,s,f,i,b,23,n[47]),i=l(i,o,s,f,d,6,n[48]),f=l(f,i,o,s,q,10,n[49]),s=l(s,f,i,o,L,15,n[50]),o=l(o,s,f,i,B,21,n[51]),i=l(i,o,s,f,E,6,n[52]),f=l(f,i,o,s,w,10,n[53]),s=l(s,f,i,o,g,15,n[54]),o=l(o,s,f,i,u,21,n[55]),i=l(i,o,s,f,t,6,n[56]),f=l(f,i,o,s,R,10,n[57]),s=l(s,f,i,o,W,15,n[58]),o=l(o,s,f,i,H,21,n[59]),i=l(i,o,s,f,F,6,n[60]),f=l(f,i,o,s,a,10,n[61]),s=l(s,f,i,o,b,15,n[62]),o=l(o,s,f,i,v,21,n[63]),r[0]=r[0]+i|0,r[1]=r[1]+o|0,r[2]=r[2]+s|0,r[3]=r[3]+f|0},_doFinalize:function(){var p=this._data,y=p.words,A=this._nDataBytes*8,k=p.sigBytes*8;y[k>>>5]|=128<<24-k%32;var e=c.floor(A/4294967296),r=A;y[(k+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360,y[(k+64>>>9<<4)+14]=(r<<8|r>>>24)&16711935|(r<<24|r>>>8)&4278255360,p.sigBytes=(y.length+1)*4,this._process();for(var d=this._hash,u=d.words,b=0;b<4;b++){var w=u[b];u[b]=(w<<8|w>>>24)&16711935|(w<<24|w>>>8)&4278255360}return d},clone:function(){var p=D.clone.call(this);return p._hash=this._hash.clone(),p}});function _(p,y,A,k,e,r,d){var u=p+(y&A|~y&k)+e+d;return(u<<r|u>>>32-r)+y}function h(p,y,A,k,e,r,d){var u=p+(y&k|A&~k)+e+d;return(u<<r|u>>>32-r)+y}function x(p,y,A,k,e,r,d){var u=p+(y^A^k)+e+d;return(u<<r|u>>>32-r)+y}function l(p,y,A,k,e,r,d){var u=p+(A^(y|~k))+e+d;return(u<<r|u>>>32-r)+y}S.MD5=D._createHelper(C),S.HmacMD5=D._createHmacHelper(C)})(Math),m.MD5})});var ae=I((M,ie)=>{(function(m,c){typeof M=="object"?ie.exports=M=c(N()):typeof define=="function"&&define.amd?define(["./core"],c):c(m.CryptoJS)})(M,function(m){return(function(){var c=m,S=c.lib,z=S.WordArray,K=S.Hasher,D=c.algo,P=[],n=D.SHA1=K.extend({_doReset:function(){this._hash=new z.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(C,_){for(var h=this._hash.words,x=h[0],l=h[1],p=h[2],y=h[3],A=h[4],k=0;k<80;k++){if(k<16)P[k]=C[_+k]|0;else{var e=P[k-3]^P[k-8]^P[k-14]^P[k-16];P[k]=e<<1|e>>>31}var r=(x<<5|x>>>27)+A+P[k];k<20?r+=(l&p|~l&y)+1518500249:k<40?r+=(l^p^y)+1859775393:k<60?r+=(l&p|l&y|p&y)-1894007588:r+=(l^p^y)-899497514,A=y,y=p,p=l<<30|l>>>2,l=x,x=r}h[0]=h[0]+x|0,h[1]=h[1]+l|0,h[2]=h[2]+p|0,h[3]=h[3]+y|0,h[4]=h[4]+A|0},_doFinalize:function(){var C=this._data,_=C.words,h=this._nDataBytes*8,x=C.sigBytes*8;return _[x>>>5]|=128<<24-x%32,_[(x+64>>>9<<4)+14]=Math.floor(h/4294967296),_[(x+64>>>9<<4)+15]=h,C.sigBytes=_.length*4,this._process(),this._hash},clone:function(){var C=K.clone.call(this);return C._hash=this._hash.clone(),C}});c.SHA1=K._createHelper(n),c.HmacSHA1=K._createHmacHelper(n)})(),m.SHA1})});var se=I((j,oe)=>{(function(m,c){typeof j=="object"?oe.exports=j=c(N()):typeof define=="function"&&define.amd?define(["./core"],c):c(m.CryptoJS)})(j,function(m){(function(){var c=m,S=c.lib,z=S.Base,K=c.enc,D=K.Utf8,P=c.algo,n=P.HMAC=z.extend({init:function(C,_){C=this._hasher=new C.init,typeof _=="string"&&(_=D.parse(_));var h=C.blockSize,x=h*4;_.sigBytes>x&&(_=C.finalize(_)),_.clamp();for(var l=this._oKey=_.clone(),p=this._iKey=_.clone(),y=l.words,A=p.words,k=0;k<h;k++)y[k]^=1549556828,A[k]^=909522486;l.sigBytes=p.sigBytes=x,this.reset()},reset:function(){var C=this._hasher;C.reset(),C.update(this._iKey)},update:function(C){return this._hasher.update(C),this},finalize:function(C){var _=this._hasher,h=_.finalize(C);_.reset();var x=_.finalize(this._oKey.clone().concat(h));return x}})})()})});var Y=I((U,fe)=>{(function(m,c,S){typeof U=="object"?fe.exports=U=c(N(),ae(),se()):typeof define=="function"&&define.amd?define(["./core","./sha1","./hmac"],c):c(m.CryptoJS)})(U,function(m){return(function(){var c=m,S=c.lib,z=S.Base,K=S.WordArray,D=c.algo,P=D.MD5,n=D.EvpKDF=z.extend({cfg:z.extend({keySize:128/32,hasher:P,iterations:1}),init:function(C){this.cfg=this.cfg.extend(C)},compute:function(C,_){for(var h,x=this.cfg,l=x.hasher.create(),p=K.create(),y=p.words,A=x.keySize,k=x.iterations;y.length<A;){h&&l.update(h),h=l.update(C).finalize(_),l.reset();for(var e=1;e<k;e++)h=l.finalize(h),l.reset();p.concat(h)}return p.sigBytes=A*4,p}});c.EvpKDF=function(C,_,h){return n.create(h).compute(C,_)}})(),m.EvpKDF})});var Z=I((J,ce)=>{(function(m,c,S){typeof J=="object"?ce.exports=J=c(N(),Y()):typeof define=="function"&&define.amd?define(["./core","./evpkdf"],c):c(m.CryptoJS)})(J,function(m){m.lib.Cipher||(function(c){var S=m,z=S.lib,K=z.Base,D=z.WordArray,P=z.BufferedBlockAlgorithm,n=S.enc,C=n.Utf8,_=n.Base64,h=S.algo,x=h.EvpKDF,l=z.Cipher=P.extend({cfg:K.extend(),createEncryptor:function(t,v){return this.create(this._ENC_XFORM_MODE,t,v)},createDecryptor:function(t,v){return this.create(this._DEC_XFORM_MODE,t,v)},init:function(t,v,g){this.cfg=this.cfg.extend(g),this._xformMode=t,this._key=v,this.reset()},reset:function(){P.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){t&&this._append(t);var v=this._doFinalize();return v},keySize:128/32,ivSize:128/32,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:(function(){function t(v){return typeof v=="string"?q:F}return function(v){return{encrypt:function(g,a,E){return t(a).encrypt(v,g,a,E)},decrypt:function(g,a,E){return t(a).decrypt(v,g,a,E)}}}})()}),p=z.StreamCipher=l.extend({_doFinalize:function(){var t=this._process(!0);return t},blockSize:1}),y=S.mode={},A=z.BlockCipherMode=K.extend({createEncryptor:function(t,v){return this.Encryptor.create(t,v)},createDecryptor:function(t,v){return this.Decryptor.create(t,v)},init:function(t,v){this._cipher=t,this._iv=v}}),k=y.CBC=(function(){var t=A.extend();t.Encryptor=t.extend({processBlock:function(g,a){var E=this._cipher,H=E.blockSize;v.call(this,g,a,H),E.encryptBlock(g,a),this._prevBlock=g.slice(a,a+H)}}),t.Decryptor=t.extend({processBlock:function(g,a){var E=this._cipher,H=E.blockSize,L=g.slice(a,a+H);E.decryptBlock(g,a),v.call(this,g,a,H),this._prevBlock=L}});function v(g,a,E){var H,L=this._iv;L?(H=L,this._iv=c):H=this._prevBlock;for(var R=0;R<E;R++)g[a+R]^=H[R]}return t})(),e=S.pad={},r=e.Pkcs7={pad:function(t,v){for(var g=v*4,a=g-t.sigBytes%g,E=a<<24|a<<16|a<<8|a,H=[],L=0;L<a;L+=4)H.push(E);var R=D.create(H,a);t.concat(R)},unpad:function(t){var v=t.words[t.sigBytes-1>>>2]&255;t.sigBytes-=v}},d=z.BlockCipher=l.extend({cfg:l.cfg.extend({mode:k,padding:r}),reset:function(){var t;l.reset.call(this);var v=this.cfg,g=v.iv,a=v.mode;this._xformMode==this._ENC_XFORM_MODE?t=a.createEncryptor:(t=a.createDecryptor,this._minBufferSize=1),this._mode&&this._mode.__creator==t?this._mode.init(this,g&&g.words):(this._mode=t.call(a,this,g&&g.words),this._mode.__creator=t)},_doProcessBlock:function(t,v){this._mode.processBlock(t,v)},_doFinalize:function(){var t,v=this.cfg.padding;return this._xformMode==this._ENC_XFORM_MODE?(v.pad(this._data,this.blockSize),t=this._process(!0)):(t=this._process(!0),v.unpad(t)),t},blockSize:128/32}),u=z.CipherParams=K.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}}),b=S.format={},w=b.OpenSSL={stringify:function(t){var v,g=t.ciphertext,a=t.salt;return a?v=D.create([1398893684,1701076831]).concat(a).concat(g):v=g,v.toString(_)},parse:function(t){var v,g=_.parse(t),a=g.words;return a[0]==1398893684&&a[1]==1701076831&&(v=D.create(a.slice(2,4)),a.splice(0,4),g.sigBytes-=16),u.create({ciphertext:g,salt:v})}},F=z.SerializableCipher=K.extend({cfg:K.extend({format:w}),encrypt:function(t,v,g,a){a=this.cfg.extend(a);var E=t.createEncryptor(g,a),H=E.finalize(v),L=E.cfg;return u.create({ciphertext:H,key:g,iv:L.iv,algorithm:t,mode:L.mode,padding:L.padding,blockSize:t.blockSize,formatter:a.format})},decrypt:function(t,v,g,a){a=this.cfg.extend(a),v=this._parse(v,a.format);var E=t.createDecryptor(g,a).finalize(v.ciphertext);return E},_parse:function(t,v){return typeof t=="string"?v.parse(t,this):t}}),B=S.kdf={},W=B.OpenSSL={execute:function(t,v,g,a,E){if(a||(a=D.random(64/8)),E)var H=x.create({keySize:v+g,hasher:E}).compute(t,a);else var H=x.create({keySize:v+g}).compute(t,a);var L=D.create(H.words.slice(v),g*4);return H.sigBytes=v*4,u.create({key:H,iv:L,salt:a})}},q=z.PasswordBasedCipher=F.extend({cfg:F.cfg.extend({kdf:W}),encrypt:function(t,v,g,a){a=this.cfg.extend(a);var E=a.kdf.execute(g,t.keySize,t.ivSize,a.salt,a.hasher);a.iv=E.iv;var H=F.encrypt.call(this,t,v,E.key,a);return H.mixIn(E),H},decrypt:function(t,v,g,a){a=this.cfg.extend(a),v=this._parse(v,a.format);var E=a.kdf.execute(g,t.keySize,t.ivSize,v.salt,a.hasher);a.iv=E.iv;var H=F.decrypt.call(this,t,v,E.key,a);return H}})})()})});var de=I((G,ve)=>{(function(m,c,S){typeof G=="object"?ve.exports=G=c(N(),re(),ne(),Y(),Z()):typeof define=="function"&&define.amd?define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],c):c(m.CryptoJS)})(G,function(m){return(function(){var c=m,S=c.lib,z=S.BlockCipher,K=c.algo,D=[],P=[],n=[],C=[],_=[],h=[],x=[],l=[],p=[],y=[];(function(){for(var e=[],r=0;r<256;r++)r<128?e[r]=r<<1:e[r]=r<<1^283;for(var d=0,u=0,r=0;r<256;r++){var b=u^u<<1^u<<2^u<<3^u<<4;b=b>>>8^b&255^99,D[d]=b,P[b]=d;var w=e[d],F=e[w],B=e[F],W=e[b]*257^b*16843008;n[d]=W<<24|W>>>8,C[d]=W<<16|W>>>16,_[d]=W<<8|W>>>24,h[d]=W;var W=B*16843009^F*65537^w*257^d*16843008;x[b]=W<<24|W>>>8,l[b]=W<<16|W>>>16,p[b]=W<<8|W>>>24,y[b]=W,d?(d=w^e[e[e[B^w]]],u^=e[e[u]]):d=u=1}})();var A=[0,1,2,4,8,16,32,64,128,27,54],k=K.AES=z.extend({_doReset:function(){var e;if(!(this._nRounds&&this._keyPriorReset===this._key)){for(var r=this._keyPriorReset=this._key,d=r.words,u=r.sigBytes/4,b=this._nRounds=u+6,w=(b+1)*4,F=this._keySchedule=[],B=0;B<w;B++)B<u?F[B]=d[B]:(e=F[B-1],B%u?u>6&&B%u==4&&(e=D[e>>>24]<<24|D[e>>>16&255]<<16|D[e>>>8&255]<<8|D[e&255]):(e=e<<8|e>>>24,e=D[e>>>24]<<24|D[e>>>16&255]<<16|D[e>>>8&255]<<8|D[e&255],e^=A[B/u|0]<<24),F[B]=F[B-u]^e);for(var W=this._invKeySchedule=[],q=0;q<w;q++){var B=w-q;if(q%4)var e=F[B];else var e=F[B-4];q<4||B<=4?W[q]=e:W[q]=x[D[e>>>24]]^l[D[e>>>16&255]]^p[D[e>>>8&255]]^y[D[e&255]]}}},encryptBlock:function(e,r){this._doCryptBlock(e,r,this._keySchedule,n,C,_,h,D)},decryptBlock:function(e,r){var d=e[r+1];e[r+1]=e[r+3],e[r+3]=d,this._doCryptBlock(e,r,this._invKeySchedule,x,l,p,y,P);var d=e[r+1];e[r+1]=e[r+3],e[r+3]=d},_doCryptBlock:function(e,r,d,u,b,w,F,B){for(var W=this._nRounds,q=e[r]^d[0],t=e[r+1]^d[1],v=e[r+2]^d[2],g=e[r+3]^d[3],a=4,E=1;E<W;E++){var H=u[q>>>24]^b[t>>>16&255]^w[v>>>8&255]^F[g&255]^d[a++],L=u[t>>>24]^b[v>>>16&255]^w[g>>>8&255]^F[q&255]^d[a++],R=u[v>>>24]^b[g>>>16&255]^w[q>>>8&255]^F[t&255]^d[a++],i=u[g>>>24]^b[q>>>16&255]^w[t>>>8&255]^F[v&255]^d[a++];q=H,t=L,v=R,g=i}var H=(B[q>>>24]<<24|B[t>>>16&255]<<16|B[v>>>8&255]<<8|B[g&255])^d[a++],L=(B[t>>>24]<<24|B[v>>>16&255]<<16|B[g>>>8&255]<<8|B[q&255])^d[a++],R=(B[v>>>24]<<24|B[g>>>16&255]<<16|B[q>>>8&255]<<8|B[t&255])^d[a++],i=(B[g>>>24]<<24|B[q>>>16&255]<<16|B[t>>>8&255]<<8|B[v&255])^d[a++];e[r]=H,e[r+1]=L,e[r+2]=R,e[r+3]=i},keySize:256/32});c.AES=z._createHelper(k)})(),m.AES})});var he=I(($,ue)=>{(function(m,c,S){typeof $=="object"?ue.exports=$=c(N(),Z()):typeof define=="function"&&define.amd?define(["./core","./cipher-core"],c):c(m.CryptoJS)})($,function(m){return m.mode.ECB=(function(){var c=m.lib.BlockCipherMode.extend();return c.Encryptor=c.extend({processBlock:function(S,z){this._cipher.encryptBlock(S,z)}}),c.Decryptor=c.extend({processBlock:function(S,z){this._cipher.decryptBlock(S,z)}}),c})(),m.mode.ECB})});var _e=I((ge,le)=>{var pe=N();de();he();le.exports=pe});return _e();})();
    return CryptoJS;
  };
}
