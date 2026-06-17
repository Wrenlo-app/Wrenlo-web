function openMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) menu.classList.add("active");
}

function closeMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) menu.classList.remove("active");
}

function toggleFaq(button) {
  const item = button.closest(".faq-item");
  if (!item) return;
  item.classList.toggle("active");
  const arrow = button.querySelector(".faq-arrow");
  if (arrow) arrow.textContent = item.classList.contains("active") ? "−" : "+";
}

function toggleBilling() {
  const toggle = document.getElementById("billingToggle");
  if (!toggle) return;
  toggle.classList.toggle("annual");
  const isAnnual = toggle.classList.contains("annual");

  document.querySelectorAll(".plan-price").forEach(function (price) {
    const monthly = price.getAttribute("data-monthly");
    const annual = price.getAttribute("data-annual");
    if (monthly && annual) price.textContent = "$" + (isAnnual ? annual : monthly);
  });

  document.querySelectorAll(".period").forEach(function (period) {
    period.textContent = isAnnual ? "/mo, billed annually" : "/mo";
  });
}

function showScenario(id, button) {
  document.querySelectorAll(".scenario-panel").forEach(function (panel) {
    panel.classList.remove("active");
  });
  const selected = document.getElementById("sc-" + id);
  if (selected) selected.classList.add("active");

  document.querySelectorAll(".stab").forEach(function (tab) {
    tab.classList.remove("active");
  });
  if (button) button.classList.add("active");
}

function selectRadio(label, groupClass) {
  if (!label) return;
  const group = groupClass ? document.querySelector("." + groupClass) : label.parentElement;
  if (group) {
    group.querySelectorAll(".radio-opt").forEach(function (opt) {
      opt.classList.remove("selected");
    });
  }
  label.classList.add("selected");
  const input = label.querySelector("input[type='radio']");
  if (input) input.checked = true;
}

function handleSurvey(button) {
  const form = document.getElementById("surveyForm") || document.querySelector("form") || document.body;
  const required = form.querySelectorAll("input[required], select[required], textarea[required]");
  for (const field of required) {
    if (!field.value) {
      field.focus();
      return;
    }
  }

  if (button) {
    button.disabled = true;
    button.textContent = "Submitting...";
  }

  setTimeout(function () {
    window.location.href = "/thankyou";
  }, 400);
}

function copyLink(button) {
  const url = "https://www.wrenlo.co/survey";
  navigator.clipboard.writeText(url).then(function () {
    if (button) {
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(function () {
        button.textContent = original;
      }, 1500);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(function (el) {
    observer.observe(el);
  });
});
