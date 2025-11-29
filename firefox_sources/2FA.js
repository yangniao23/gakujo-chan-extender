setTimeout(() => {
  //入力枠が表示されてから動くためのやつ
  const Timer = setInterval(() => {
    if (document.getElementById("google-authenticator-login-body") != null)
      clearInterval(Timer);
    if (!document.getElementById("portaltimerimg"))
      //入力枠が存在していたらmain関数起動
      main();
  }, 100); //100msごとに起動
}, 500);
const main = async () => {
  //2fa鍵保存部分のために画面にオブジェクト作る奴ら
  //文字追加1
  document
    .getElementsByName("form")[0]
    .appendChild(document.createElement("br"));
  const p1 = document.createElement("p");
  const text1 = document.createTextNode("学情拡張スクリプト動作中");
  p1.appendChild(text1);
  document.getElementsByName("form")[0].appendChild(p1);

  //文字追加2
  document
    .getElementsByName("form")[0]
    .appendChild(document.createElement("br"));
  const p2 = document.createElement("p");
  const text2 = document.createTextNode("拡張機能2FA鍵保存フォーム");
  p2.appendChild(text2);
  document.getElementsByName("form")[0].appendChild(p2);

  //秘密鍵入力フォーム
  const keyEntryForm = document.createElement("input");
  keyEntryForm.id = "keyEntryForm";
  keyEntryForm.setAttribute("type", "text");
  keyEntryForm.setAttribute("size", "50");
  document.getElementsByName("form")[0].appendChild(keyEntryForm);

  //秘密鍵保存ボタン
  const keySaveButton = document.createElement("button");
  keySaveButton.id = "keySaveButton";
  keySaveButton.textContent = "save";
  keySaveButton.addEventListener("click", function () {
    keySave();
  });
  document.getElementsByName("form")[0].appendChild(keySaveButton);

  //説明githubリンク
  const githubLink = document.createElement("a");
  githubLink.href =
    "https://github.com/koji-genba/gakujo-chan-extender#2%E6%AE%B5%E9%9A%8E%E8%AA%8D%E8%A8%BC%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97%E6%96%B9%E6%B3%95";
  githubLink.target = "_blank";
  githubLink.innerText = "二段階認証自動入力機能の使い方説明はこちら";
  document.getElementsByName("form")[0].appendChild(githubLink);

  await browser.storage.local.get("key", async (item) => {
    if (!item.key) {
      console.debug("[2FA] No stored key");
      return;
    }
    const rawBase32 = item.key;
    const cleanedBase32 = sanitizeBase32(rawBase32);
    if (!cleanedBase32) {
      console.warn("[2FA] Base32 key invalid after sanitize", rawBase32);
      return;
    }
    let hexKey;
    try {
      hexKey = Convert.base32toHex(cleanedBase32);
    } catch (e) {
      console.error("[2FA] base32->hex failed", e);
      return;
    }
    const counter = TOTP.getCurrentCounter();
    const countdown = TOTP.getCountdown();
    let token;
    try {
      token = await TOTP.otp(hexKey, 6, false, false, true); // debugフラグtrue
    } catch (e) {
      console.error("[2FA] TOTP generation failed", e);
      return;
    }
    const inputField = document.getElementsByName("ninshoCode")[0];
    if (!inputField) {
      console.warn("[2FA] ninshoCode field not found");
      return;
    }
    inputField.type = "text";
    inputField.value = token;
    inputField.focus();
    console.log("[2FA] 1.Raw:", rawBase32);
    console.log("[2FA] 2.Cleaned:", cleanedBase32);
    console.log("[2FA] 3.Hex:", hexKey);
    console.log("[2FA] 4.Counter:", counter, "Countdown:", countdown);
    console.log("[2FA] 5.Token:", token);
    if (token === "000000") {
      console.warn(
        "[2FA] Token 000000. Check key correctness, system clock, and HMAC debug output above."
      );
    }
  });
};

function keySave() {
  var str = document.getElementById("keyEntryForm").value;
  const cleaned = sanitizeBase32(str);
  if (!cleaned) {
    alert("Key形式が不正です (Base32 A-Z2-7)。");
    return;
  }
  browser.storage.local.set({ key: cleaned });
  alert("2FA鍵を保存しました");
}

function sanitizeBase32(raw) {
  if (!raw) return null;
  const cleaned = raw.replace(/[\s-]+/g, "").toUpperCase();
  return /^[A-Z2-7]+=*$/i.test(cleaned) ? cleaned : null;
}
