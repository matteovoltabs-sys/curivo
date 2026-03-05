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
  // ===== Before/After slider (per ogni slide) =====
document.querySelectorAll(".ba").forEach((wrap) => {
  const range = wrap.querySelector(".ba-range");
  const afterWrap = wrap.querySelector(".ba-after-wrap");
  const handle = wrap.querySelector(".ba-handle");

  const set = (v) => {
    afterWrap.style.clipPath = `inset(0 0 0 ${v}%)`;
    handle.style.left = `${v}%`;
  };

  set(range.value);
  range.addEventListener("input", (e) => set(e.target.value));
});

// ===== Carousel navigation =====
(function(){
  const track = document.getElementById("baTrack");
  const dotsWrap = document.getElementById("baDots");
  if(!track || !dotsWrap) return;

  const slides = Array.from(track.querySelectorAll(".ba-slide"));
  let index = 0;

  // Create dots
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "ba-dot" + (i===0 ? " active" : "");
    b.type = "button";
    b.setAttribute("aria-label", `Vai alla slide ${i+1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".ba-dot"));

  function goTo(i){
    index = Math.max(0, Math.min(i, slides.length - 1));
    slides[index].scrollIntoView({ behavior:"smooth", inline:"start", block:"nearest" });
    dots.forEach((d, di) => d.classList.toggle("active", di === index));
  }

  document.querySelector(".ba-nav.prev")?.addEventListener("click", () => goTo(index - 1));
  document.querySelector(".ba-nav.next")?.addEventListener("click", () => goTo(index + 1));

  // Update index on scroll (best effort)
  track.addEventListener("scroll", () => {
    const left = track.scrollLeft;
    let best = 0, bestDist = Infinity;
    slides.forEach((s, i) => {
      const dist = Math.abs(s.offsetLeft - left);
      if(dist < bestDist){ bestDist = dist; best = i; }
    });
    if(best !== index){
      index = best;
      dots.forEach((d, di) => d.classList.toggle("active", di === index));
    }
  }, { passive:true });
})();

});

