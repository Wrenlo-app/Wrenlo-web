const SUPABASE_URL = "https://lihkrrmmtzoqjxthewzr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_gSalxqCkFI3UwoPVIWvyJw_pyH4slR8";

let wrenloSelectedCta = "Website CTA";

function wrenloNormalize(text) {
  return String(text || "")
    .replace("→", "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function wrenloIsPilotCta(text) {
  const clean = wrenloNormalize(text);

  return (
    clean.includes("start 14-day") ||
    clean.includes("14-day free pilot") ||
    clean.includes("start free pilot") ||
    clean.includes("start your free pilot") ||
    clean.includes("book a free pilot call") ||
    clean.includes("book pilot call") ||
    clean.includes("free audit") ||
    clean.includes("free missed-call audit") ||
    clean.includes("get free missed-call audit") ||
    clean.includes("get started") ||
    clean.includes("talk to us")
  );
}

function wrenloOpenPopup(ctaText) {
  wrenloSelectedCta = ctaText || "Website CTA";
  const overlay = document.getElementById("wrenloPopupOverlay");
  if (overlay) overlay.classList.add("active");
}

function wrenloClosePopup() {
  const overlay = document.getElementById("wrenloPopupOverlay");
  if (overlay) overlay.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {
  const popupHtml = `
    <div class="wrenlo-popup-overlay" id="wrenloPopupOverlay">
      <div class="wrenlo-popup">
        <button class="wrenlo-popup-close" type="button" id="wrenloPopupClose">×</button>

        <h3>Start your Wrenlo pilot</h3>
        <p>Share your details, and we’ll help you recover missed calls and after-hours leads.</p>

        <form id="wrenloPopupForm">
          <div class="wrenlo-field">
            <label for="wrenloLeadName">Name</label>
            <input id="wrenloLeadName" name="name" type="text" required>
          </div>

          <div class="wrenlo-field">
            <label for="wrenloBusinessName">Business Name</label>
            <input id="wrenloBusinessName" name="business_name" type="text" required>
          </div>

          <div class="wrenlo-field">
            <label for="wrenloBusinessEmail">Business Email</label>
            <input id="wrenloBusinessEmail" name="business_email" type="email" required>
          </div>

          <div class="wrenlo-field">
            <label for="wrenloPhoneNumber">Phone Number</label>
            <input id="wrenloPhoneNumber" name="phone_number" type="tel" required>
          </div>

          <button class="wrenlo-popup-submit" id="wrenloPopupSubmit" type="submit">Submit</button>
          <div class="wrenlo-popup-message" id="wrenloPopupMessage"></div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", popupHtml);

  const overlay = document.getElementById("wrenloPopupOverlay");
  const closeBtn = document.getElementById("wrenloPopupClose");
  const form = document.getElementById("wrenloPopupForm");
  const submitBtn = document.getElementById("wrenloPopupSubmit");
  const message = document.getElementById("wrenloPopupMessage");

  document.querySelectorAll("a, button").forEach(function (element) {
    const text = element.innerText || element.textContent || "";

    if (wrenloIsPilotCta(text)) {
      element.addEventListener("click", function (event) {
        event.preventDefault();
        wrenloOpenPopup(text.trim());
      });
    }
  });

  closeBtn.addEventListener("click", wrenloClosePopup);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      wrenloClosePopup();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      wrenloClosePopup();
    }
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const payload = {
      name: form.name.value.trim(),
      business_name: form.business_name.value.trim(),
      business_email: form.business_email.value.trim(),
      phone_number: form.phone_number.value.trim(),
      cta: wrenloSelectedCta,
      page_url: window.location.href
    };

    if (!payload.name || !payload.business_name || !payload.business_email || !payload.phone_number) {
      message.textContent = "Please fill all fields.";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    message.textContent = "";

    try {
      const response = await fetch(SUPABASE_URL + "/rest/v1/pilot_leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + SUPABASE_ANON_KEY,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Supabase insert failed");
      }

      form.reset();
      message.textContent = "Thanks — our team will get in touch with you shortly.";
      submitBtn.textContent = "Submitted";

      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
        message.textContent = "";
        wrenloClosePopup();
      }, 1800);
    } catch (error) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      message.textContent = "Something went wrong. Please try again.";
      console.error("Wrenlo popup error:", error);
    }
  });
});
