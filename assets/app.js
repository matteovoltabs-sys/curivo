// === CONFIG ===
// Incolla qui l'URL della tua Google Apps Script Web App (termina con /exec)
const WEB_APP_URL = "INCOLLA_QUI_LA_TUA_WEB_APP_URL";

// --- Before/After sliders ---
document.querySelectorAll(".ba").forEach((wrap) => {
  const range = wrap.querySelector(".ba-range");
  const after = wrap.querySelector(".ba-after");
  const handle = wrap.querySelector(".ba-handle");

  const set = (v) => {
    after.style.clipPath = `inset(0 0 0 ${v}%)`;
    handle.style.left = `${v}%`;
  };

  set(range.value);
  range.addEventListener("input", (e) => set(e.target.value));
});

// --- Lead form ---
const form = document.getElementById("quoteForm");
const msg = document.getElementById("formMsg");

function setMsg(type, text){
  msg.className = "form-msg " + (type === "ok" ? "ok" : "err");
  msg.textContent = text;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!WEB_APP_URL || WEB_APP_URL.includes("INCOLLA_QUI")) {
    setMsg("err", "Configurazione mancante: inserisci la WEB_APP_URL in assets/app.js");
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        page: location.pathname,
        ts: new Date().toISOString()
      })
    });

    if (!res.ok) throw new Error("HTTP " + res.status);

    setMsg("ok", "Richiesta inviata! Ti contattiamo a breve.");
    form.reset();
  } catch (err) {
    setMsg("err", "Errore nell'invio. Riprova o scrivici su WhatsApp.");
  }

  setTimeout(function(){
document.getElementById("popup").style.display="block";
},15000);

document.getElementById("closePopup").onclick=function(){
document.getElementById("popup").style.display="none";
};

});
