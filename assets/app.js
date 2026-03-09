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

  if (fieldId === "attachments") {
    const dropzone = document.getElementById("uploadDropzone");
    if (dropzone) dropzone.classList.add("input-error");
  } else if (field) {
    field.classList.add("input-error");
  }

  if (error) {
    error.textContent = message;
    error.classList.add("show");
  }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(`error-${fieldId}`);

  if (fieldId === "attachments") {
    const dropzone = document.getElementById("uploadDropzone");
    if (dropzone) dropzone.classList.remove("input-error");
  } else if (field) {
    field.classList.remove("input-error");
  }

  if (error) {
    error.textContent = "";
    error.classList.remove("show");
  }
}

function clearAllErrors() {
  ["name", "phone", "email", "treatment", "attachments"].forEach(clearFieldError);

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

function validateAttachments(files) {
  if (!files) return true;
  if (files.length > 3) return "Puoi caricare massimo 3 file.";

  const allowed = [
    "image/jpeg",
    "image/png",
    "application/pdf"
  ];

  const maxSize = 8 * 1024 * 1024;

  for (const file of files) {
    if (!allowed.includes(file.type)) {
      return "Sono consentiti solo file JPG, PNG o PDF.";
    }
    if (file.size > maxSize) {
      return "Ogni file deve essere inferiore a 8 MB.";
    }
  }

  return true;
}

function validateForm() {
  clearAllErrors();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const treatment = document.getElementById("treatment").value;
  const attachments = document.getElementById("attachments").files;

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

  const filesCheck = validateAttachments(attachments);
  if (filesCheck !== true) {
    showFieldError("attachments", filesCheck);
    isValid = false;
  }

  if (!validatePrivacy()) {
    isValid = false;
  }

  return isValid;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function renderSelectedFiles() {
  const input = document.getElementById("attachments");
  const list = document.getElementById("uploadFileList");
  const dropzone = document.getElementById("uploadDropzone");

  if (!input || !list || !dropzone) return;

  list.innerHTML = "";

  if (!input.files || input.files.length === 0) {
    dropzone.classList.remove("has-files");
    return;
  }

  dropzone.classList.add("has-files");

  Array.from(input.files).forEach((file) => {
    const item = document.createElement("div");
    item.className = "upload-file-item";

    const name = document.createElement("span");
    name.textContent = file.name;

    const meta = document.createElement("span");
    meta.className = "upload-file-meta";
    meta.textContent = formatFileSize(file.size);

    item.appendChild(name);
    item.appendChild(meta);
    list.appendChild(item);
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result || "";
      const base64 = String(result).split(",")[1];
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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

  const attachmentsField = document.getElementById("attachments");
  const uploadDropzone = document.getElementById("uploadDropzone");

  if (attachmentsField) {
    attachmentsField.addEventListener("change", () => {
      renderSelectedFiles();
      const filesCheck = validateAttachments(attachmentsField.files);
      if (filesCheck === true) {
        clearFieldError("attachments");
      }
    });
  }

  if (uploadDropzone && attachmentsField) {
    ["dragenter", "dragover"].forEach((eventName) => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadDropzone.classList.remove("dragover");
      });
    });

    uploadDropzone.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      attachmentsField.files = files;
      renderSelectedFiles();

      const filesCheck = validateAttachments(attachmentsField.files);
      if (filesCheck === true) {
        clearFieldError("attachments");
      } else {
        showFieldError("attachments", filesCheck);
      }
    });
  }

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

      const files = Array.from(document.getElementById("attachments").files || []);
      const encodedFiles = await Promise.all(files.map(fileToBase64));

      const payload = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        treatment: document.getElementById("treatment").value.trim(),
        notes: document.getElementById("notes").value.trim(),
        files: encodedFiles
      };

      await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      form.reset();
      clearAllErrors();
      renderSelectedFiles();
      setMsg("ok", "Richiesta inviata! Ti contatteremo a breve.");
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
