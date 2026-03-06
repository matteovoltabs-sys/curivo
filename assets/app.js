const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwxfhgCmhJO_vpWTbG2jbMH6VWs1_FPotMyBCohhJO5Y8ZK2wIWjNNmMUiJjK16fw/exec";

const form = document.getElementById("quoteForm");
const msg = document.getElementById("formMsg");

function setMsg(type, text) {
  msg.className = "form-msg " + (type === "ok" ? "ok" : "err");
  msg.textContent = text;
}

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        body: new URLSearchParams(formData),
        mode: "no-cors"
      });

      form.reset();
      setMsg("ok", "Richiesta inviata! Ti contatteremo a breve.");
    } catch (error) {
      setMsg("err", "Errore nell'invio. Riprova oppure contattaci su WhatsApp.");
    }
  });
}

 

