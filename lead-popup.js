const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const WRENLO_CTA_TEXTS = [
 "Start 14-day pilot",
 "Free Audit",
 "Free Missed-Call Audit",
 "Get Free Missed-Call Audit",
 "Book pilot call",
 "Get Started",
 "Talk to Us",
 "Start free pilot",
 "Start your free pilot",
 "Book a free pilot call"
];

let selectedCta = "";

function normalizeText(text) {
 return text
 .replace("→", "")
 .replace(/\s+/g, " ")
 .trim()
 .toLowerCase();
}

function isTargetCta(elementText) {
 const cleanElementText = normalizeText(elementText);

 return WRENLO_CTA_TEXTS.some(function (cta) {
 const cleanCta = normalizeText(cta);
 return cleanElementText === cleanCta || cleanElementText.includes(cleanCta);
 });
}

function openWrenloModal(ctaText) {
 selectedCta = ctaText || "Website CTA";
 const modal = document.getElementById("wrenloLeadModal");
 if (modal) modal.classList.add("is-open");
}

function closeWrenloModal() {
 const modal = document.getElementById("wrenloLeadModal");
 if (modal) modal.classList.remove("is-open");
}

async function submitWrenloLead(event) {
 event.preventDefault();

 const form = event.target;
 const message = document.getElementById("wrenloFormMessage");
 const submitButton = document.getElementById("wrenloSubmitButton");

 const payload = {
 name: form.name.value.trim(),
 business_name: form.business_name.value.trim(),
 business_email: form.business_email.value.trim(),
 phone_number: form.phone_number.value.trim(),
 cta: selectedCta,
 page_url: window.location.href
 };

 if (!payload.name || !payload.business_name || !payload.business_email || !payload.phone_number) {
 message.textContent = "Please fill all fields.";
 return;
 }

 submitButton.disabled = true;
 submitButton.textContent = "Submitting...";
 message.textContent = "";

 try {
 const response = await fetch(`${SUPABASE_URL}/rest/v1/pilot_leads`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "apikey": SUPABASE_ANON_KEY,
 "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
 "Prefer": "return=minimal"
 },
 body: JSON.stringify(payload)
 });

 if (!response.ok) {
 throw new Error("Submission failed");
 }

 form.reset();
 message.textContent = "Thanks — we’ll reach out shortly to set up your pilot.";
 submitButton.textContent = "Submitted";

 setTimeout(function () {
 closeWrenloModal();
 submitButton.disabled = false;
 submitButton.textContent = "Submit";
 message.textContent = "";
 }, 1800);
 } catch (error) {
 submitButton.disabled = false;
 submitButton.textContent = "Submit";
 message.textContent = "Something went wrong. Please try again.";
 }
}

document.addEventListener("DOMContentLoaded", function () {
 const modalHtml = `
 <div class="wrenlo-modal-backdrop" id="wrenloLeadModal">
 <div class="wrenlo-modal">
 <button class="wrenlo-modal-close" type="button" onclick​="closeWrenloModal()">×</button>

 <h3>Start your Wrenlo pilot</h3>
 <p>Share your details and we’ll help you recover missed calls and after-hours leads.</p>

 <form id="wrenloLeadForm">
 <div class="wrenlo-form-group">
 <label for="wrenloName">Name</label>
 <input id="wrenloName" name="name" type="text" required>
 </div>

 <div class="wrenlo-form-group">
 <label for="wrenloBusinessName">Business Name</label>
 <input id="wrenloBusinessName" name="business_name" type="text" required>
 </div>

 <div class="wrenlo-form-group">
 <label for="wrenloBusinessEmail">Business Email</label>
 <input id="wrenloBusinessEmail" name="business_email" type="email" required>
 </div>

 <div class="wrenlo-form-group">
 <label for="wrenloPhone">Phone Number</label>
 <input id="wrenloPhone" name="phone_number" type="tel" required>
 </div>

 <button class="wrenlo-submit" id="wrenloSubmitButton" type="submit">Submit</button>
 <div class="wrenlo-form-message" id="wrenloFormMessage"></div>
 </form>
 </div>
 </div>
 `;

 document.body.insertAdjacentHTML("beforeend", modalHtml);

 document.querySelectorAll("a, button").forEach(function (element) {
 const text = element.textContent || "";

 if (isTargetCta(text)) {
 element.addEventListener("click", function (event) {
 event.preventDefault();
 openWrenloModal(text.trim());
 });
 }
 });

 document.getElementById("wrenloLeadForm").addEventListener("submit", submitWrenloLead);

 document.getElementById("wrenloLeadModal").addEventListener("click", function (event) {
 if (event.target.id === "wrenloLeadModal") {
 closeWrenloModal();
 }
 });
});
