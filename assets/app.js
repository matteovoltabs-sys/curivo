const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwxfhgCmhJO_vpWTbG2jbMH6VWs1_FPotMyBCohhJO5Y8ZK2wIWjNNmMUiJjK16fw/exec";

const form = document.getElementById("quoteForm");
const msg = document.getElementById("formMsg");

function setMsg(type, text) {
if (!msg) return;
msg.className = "form-msg " + (type === "ok" ? "ok" : "err");
msg.textContent = text;
}

function clearGlobalMsg() {
if (!msg) return;
msg.className = "form-msg";
msg.textContent = "";
}

function showFieldError(fieldId, message) {
const field = document.getElementById(fieldId);
const error = document.getElementById(`error-${fieldId}`);

if (field) field.classList.add("input-error");

if (error) {
error.textContent = message;
error.classList.add("show");
}
}

function clearFieldError(fieldId) {
const field = document.getElementById(fieldId);
const error = document.getElementById(`error-${fieldId}`);

if (field) field.classList.remove("input-error");

if (error) {
error.textContent = "";
error.classList.remove("show");
}
}

function clearAllErrors() {
["name", "phone", "email", "treatment"].forEach(clearFieldError);

const privacyError = document.getElementById("privacyError");
const privacyConsent = document.getElementById("privacyConsent");

if (privacyError) privacyError.classList.remove("show");
if (privacyConsent) privacyConsent.classList.remove("error");

clearGlobalMsg();
}

function validateName(value) {
return value.trim().length >= 2;
}

function validatePhone(value) {
const cleaned = value.replace(/\s+/g, "");
return /^[+]?[0-9]{8,15}$/.test(cleaned);
}

function validateEmail(value) {
return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function validateTreatment(value) {
return value.trim() !== "";
}

function validatePrivacy() {
const privacy = document.getElementById("privacyCheck");
const privacyError = document.getElementById("privacyError");
const privacyConsent = document.getElementById("privacyConsent");

if (!privacy.checked) {
privacyError.classList.add("show");
privacyConsent.classList.add("error");
return false;
}

privacyError.classList.remove("show");
privacyConsent.classList.remove("error");
return true;
}

function validateForm() {
clearAllErrors();

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const email = document.getElementById("email").value;
const treatment = document.getElementById("treatment").value;

let isValid = true;

if (!validateName(name)) {
showFieldError("name", "Inserisci un nome valido.");
isValid = false;
}

if (!validatePhone(phone)) {
showFieldError("phone", "Inserisci un numero di telefono valido.");
isValid = false;
}

if (!validateEmail(email)) {
showFieldError("email", "Inserisci un indirizzo email valido.");
isValid = false;
}

if (!validateTreatment(treatment)) {
showFieldError("treatment", "Seleziona un trattamento.");
isValid = false;
}

if (!validatePrivacy()) {
isValid = false;
}

return isValid;
}

if (form) {
const liveFields = ["name", "phone", "email", "treatment"];

liveFields.forEach((fieldId) => {
const field = document.getElementById(fieldId);
if (!field) return;

field.addEventListener("input", () => {
if (fieldId === "name" && validateName(field.value)) clearFieldError("name");
if (fieldId === "phone" && validatePhone(field.value)) clearFieldError("phone");
if (fieldId === "email" && validateEmail(field.value)) clearFieldError("email");
if (fieldId === "treatment" && validateTreatment(field.value)) clearFieldError("treatment");
});

field.addEventListener("change", () => {
if (fieldId === "treatment" && validateTreatment(field.value)) clearFieldError("treatment");
});
});

const privacy = document.getElementById("privacyCheck");
if (privacy) {
privacy.addEventListener("change", () => {
if (privacy.checked) {
document.getElementById("privacyError").classList.remove("show");
document.getElementById("privacyConsent").classList.remove("error");
}
});
}

form.addEventListener("submit", async function (e) {
e.preventDefault();

if (!validateForm()) {
setMsg("err", "Controlla i campi evidenziati prima di inviare la richiesta.");
return;
}

const submitButton = form.querySelector('button[type="submit"]');
const originalButtonText = submitButton ? submitButton.textContent : "";

try {
if (submitButton) {
submitButton.disabled = true;
submitButton.textContent = "Invio in corso...";
}

const formData = new FormData(form);

await fetch(WEB_APP_URL, {
method: "POST",
body: new URLSearchParams(formData),
mode: "no-cors"
});

form.reset();
clearAllErrors();
setMsg("ok", "Il tuo preventivo è in arrivo.");
} catch (error) {
setMsg("err", "Errore nell'invio. Riprova oppure contattaci su WhatsApp.");
} finally {
if (submitButton) {
submitButton.disabled = false;
submitButton.textContent = originalButtonText;
}
}
});
}

/* ===== Before/After slider ===== */
document.querySelectorAll(".ba").forEach((wrap) => {
const range = wrap.querySelector(".ba-range");
const afterWrap = wrap.querySelector(".ba-after-wrap");
const handle = wrap.querySelector(".ba-handle");

if (!range || !afterWrap || !handle) return;

const set = (v) => {
afterWrap.style.clipPath = `inset(0 0 0 ${v}%)`;
handle.style.left = `${v}%`;
};

set(range.value);
range.addEventListener("input", (e) => set(e.target.value));
});

/* ===== Carousel navigation ===== */
(function () {
const track = document.getElementById("baTrack");
const dotsWrap = document.getElementById("baDots");
if (!track || !dotsWrap) return;

const slides = Array.from(track.querySelectorAll(".ba-slide"));
let index = 0;

slides.forEach((_, i) => {
const b = document.createElement("button");
b.className = "ba-dot" + (i === 0 ? " active" : "");
b.type = "button";
b.setAttribute("aria-label", `Vai alla slide ${i + 1}`);
b.addEventListener("click", () => goTo(i));
dotsWrap.appendChild(b);
});

const dots = Array.from(dotsWrap.querySelectorAll(".ba-dot"));

function goTo(i) {
index = Math.max(0, Math.min(i, slides.length - 1));
slides[index].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
dots.forEach((d, di) => d.classList.toggle("active", di === index));
}

document.querySelector(".ba-nav.prev")?.addEventListener("click", () => goTo(index - 1));
document.querySelector(".ba-nav.next")?.addEventListener("click", () => goTo(index + 1));

track.addEventListener("scroll", () => {
const left = track.scrollLeft;
let best = 0, bestDist = Infinity;
slides.forEach((s, i) => {
const dist = Math.abs(s.offsetLeft - left);
if (dist < bestDist) {
bestDist = dist;
best = i;
}
});
if (best !== index) {
index = best;
dots.forEach((d, di) => d.classList.toggle("active", di === index));
}
}, { passive: true });
})();

/* ===== Popup ===== */
setTimeout(function () {
const popup = document.getElementById("popup");
if (popup) popup.style.display = "block";
}, 15000);

document.getElementById("closePopup")?.addEventListener("click", function () {
const popup = document.getElementById("popup");
if (popup) popup.style.display = "none";
});

document.querySelectorAll(".popup-btn").forEach(btn => {
btn.addEventListener("click", () => {
const popup = document.getElementById("popup");
if (popup) popup.style.display = "none";
});
});










