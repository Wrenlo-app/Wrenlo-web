// wrenlo-popup.js — CTA Form Popup
// Include this script in every HTML page before </body>

(function () {
  // ── Inject styles ──────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Overlay */
    #wrenlo-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(10, 18, 40, 0.65);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    #wrenlo-overlay.open { display: flex; }

    /* Modal box */
    #wrenlo-modal {
      background: #ffffff;
      border-radius: 16px;
      padding: 40px 36px 36px;
      width: 100%;
      max-width: 480px;
      position: relative;
      box-shadow: 0 24px 64px rgba(10,18,40,0.22);
      animation: wrenlo-slide-in 0.25s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes wrenlo-slide-in {
      from { opacity: 0; transform: translateY(24px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0)   scale(1); }
    }

    /* Close button */
    #wrenlo-close {
      position: absolute;
      top: 14px; right: 16px;
      background: none; border: none;
      font-size: 22px; line-height: 1;
      color: #8892a4; cursor: pointer;
      padding: 4px 8px; border-radius: 6px;
      transition: color 0.15s, background 0.15s;
    }
    #wrenlo-close:hover { color: #1a2540; background: #f3f4f8; }

    /* Header */
    #wrenlo-modal .wm-logo {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 6px;
    }
    #wrenlo-modal .wm-logo img {
      height: 32px; width: auto;
    }
    #wrenlo-modal h2 {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      font-size: 22px; font-weight: 700;
      color: #0f1f45; margin: 0 0 4px;
      line-height: 1.25;
    }
    #wrenlo-modal .wm-sub {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 14px; color: #5a6578;
      margin: 0 0 24px;
    }

    /* Form fields */
    .wm-field { margin-bottom: 16px; }
    .wm-field label {
      display: block;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px; font-weight: 600;
      color: #1a2540; margin-bottom: 6px;
    }
    .wm-field input {
      width: 100%;
      padding: 11px 14px;
      border: 1.5px solid #dde1ea;
      border-radius: 8px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px; color: #0f1f45;
      background: #fafbfc;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .wm-field input:focus {
      border-color: #e85b1e;
      box-shadow: 0 0 0 3px rgba(232,91,30,0.12);
      background: #fff;
    }
    .wm-field input.wm-error {
      border-color: #d32f2f;
      box-shadow: 0 0 0 3px rgba(211,47,47,0.1);
    }
    .wm-err-msg {
      font-size: 12px; color: #d32f2f;
      margin-top: 4px; display: none;
    }
    .wm-field.has-error .wm-err-msg { display: block; }

    /* Submit button */
    #wrenlo-modal .wm-submit {
      width: 100%;
      padding: 14px;
      background: #e85b1e;
      color: #fff;
      border: none; border-radius: 8px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 16px; font-weight: 700;
      cursor: pointer;
      margin-top: 6px;
      transition: background 0.15s, transform 0.1s;
    }
    #wrenlo-modal .wm-submit:hover { background: #d04e15; }
    #wrenlo-modal .wm-submit:active { transform: scale(0.985); }
    #wrenlo-modal .wm-submit:disabled {
      background: #f0a07a; cursor: not-allowed;
    }

    /* Thank-you state */
    #wrenlo-thankyou {
      display: none;
      text-align: center;
      padding: 16px 0 8px;
    }
    #wrenlo-thankyou .wm-check {
      font-size: 52px; line-height: 1;
      margin-bottom: 16px;
    }
    #wrenlo-thankyou h3 {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 22px; font-weight: 700;
      color: #0f1f45; margin: 0 0 10px;
    }
    #wrenlo-thankyou p {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 15px; color: #5a6578;
      margin: 0;
    }

    /* Privacy line */
    .wm-privacy {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 12px; color: #a0a9ba;
      text-align: center; margin-top: 14px;
    }

    @media (max-width: 520px) {
      #wrenlo-modal { padding: 28px 20px 24px; }
      #wrenlo-modal h2 { font-size: 19px; }
    }
  `;
  document.head.appendChild(style);

  // ── Inject HTML ────────────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'wrenlo-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'wm-title');
  overlay.innerHTML = `
    <div id="wrenlo-modal">
      <button id="wrenlo-close" aria-label="Close">✕</button>

      <div id="wrenlo-form-wrap">
        <div class="wm-logo">
          <img src="https://www.wrenlo.co/wrenlo-logo.png"
               onerror="this.style.display='none'"
               alt="Wrenlo">
        </div>
        <h2 id="wm-title">Book Your Free 14-Day Pilot</h2>
        <p class="wm-sub">Tell us a bit about your business — we'll reach out within one business day.</p>

        <div class="wm-field" id="wm-f-name">
          <label for="wm-name">Your Name *</label>
          <input type="text" id="wm-name" placeholder="John Smith" autocomplete="name">
          <div class="wm-err-msg">Please enter your name.</div>
        </div>

        <div class="wm-field" id="wm-f-biz">
          <label for="wm-biz">Business Name *</label>
          <input type="text" id="wm-biz" placeholder="Smith Plumbing LLC" autocomplete="organization">
          <div class="wm-err-msg">Please enter your business name.</div>
        </div>

        <div class="wm-field" id="wm-f-email">
          <label for="wm-email">Business Email *</label>
          <input type="email" id="wm-email" placeholder="john@smithplumbing.com" autocomplete="email">
          <div class="wm-err-msg">Please enter a valid email address.</div>
        </div>

        <div class="wm-field" id="wm-f-phone">
          <label for="wm-phone">Phone Number *</label>
          <input type="tel" id="wm-phone" placeholder="(555) 000-0000" autocomplete="tel">
          <div class="wm-err-msg">Please enter your phone number.</div>
        </div>

        <button class="wm-submit" id="wm-submit">Get Started →</button>
        <p class="wm-privacy">🔒 No spam, ever. We'll only contact you about your pilot.</p>
      </div>

      <div id="wrenlo-thankyou">
        <div class="wm-check">✅</div>
        <h3>You're all set!</h3>
        <p>Thanks for reaching out — our team will contact you within one business day to set up your free pilot.</p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);

  function openModal(label) {
    // Update heading based on which CTA was clicked
    const headings = {
      'free audit':        'Get Your Free Missed-Call Audit',
      'audit':             'Get Your Free Missed-Call Audit',
      'talk to us':        'Let's Talk — Book a Call',
      'get started':       'Get Started with Wrenlo',
      'start free pilot':  'Start Your Free 14-Day Pilot',
      'book a free pilot call': 'Book Your Free Pilot Call',
      'book pilot call':   'Book Your Free Pilot Call',
    };
    const key = (label || '').toLowerCase();
    let heading = 'Book Your Free 14-Day Pilot';
    for (const [k, v] of Object.entries(headings)) {
      if (key.includes(k)) { heading = v; break; }
    }
    $('wm-title').textContent = heading;

    // Reset form
    $('wrenlo-form-wrap').style.display = '';
    $('wrenlo-thankyou').style.display = 'none';
    $('wm-submit').disabled = false;
    $('wm-submit').textContent = 'Get Started →';
    ['wm-name','wm-biz','wm-email','wm-phone'].forEach(id => {
      $(id).value = '';
      $(id).classList.remove('wm-error');
    });
    ['wm-f-name','wm-f-biz','wm-f-email','wm-f-phone'].forEach(id => {
      $(id).classList.remove('has-error');
    });

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('wm-name').focus(), 100);
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function validate() {
    let ok = true;
    const checks = [
      { field: 'wm-f-name',  input: 'wm-name',  test: v => v.trim().length > 1 },
      { field: 'wm-f-biz',   input: 'wm-biz',   test: v => v.trim().length > 1 },
      { field: 'wm-f-email', input: 'wm-email',  test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { field: 'wm-f-phone', input: 'wm-phone',  test: v => v.replace(/\D/g,'').length >= 7 },
    ];
    checks.forEach(({ field, input, test }) => {
      const val = $(input).value;
      if (!test(val)) {
        $(field).classList.add('has-error');
        $(input).classList.add('wm-error');
        ok = false;
      } else {
        $(field).classList.remove('has-error');
        $(input).classList.remove('wm-error');
      }
    });
    return ok;
  }

  async function submitForm() {
    if (!validate()) return;

    const btn = $('wm-submit');
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    const payload = {
      name:          $('wm-name').value.trim(),
      business_name: $('wm-biz').value.trim(),
      email:         $('wm-email').value.trim(),
      phone:         $('wm-phone').value.trim(),
      submitted_at:  new Date().toISOString(),
      source:        window.location.href,
    };

    // ── Supabase insert ────────────────────────────────────────────────────
    // Replace SUPABASE_URL and SUPABASE_ANON_KEY with your actual values
    const SUPABASE_URL  = 'https://YOUR_PROJECT.supabase.co';
    const SUPABASE_KEY  = 'YOUR_ANON_KEY';

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/pilot_leads`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Log but don't block the user — still show thank-you
        console.error('Supabase error:', res.status, await res.text());
      }
    } catch (err) {
      console.error('Submit error:', err);
      // Still show thank-you so the user isn't stuck
    }

    // ── Show thank-you ─────────────────────────────────────────────────────
    $('wrenlo-form-wrap').style.display = 'none';
    $('wrenlo-thankyou').style.display  = 'block';

    // Auto-close after 4 s
    setTimeout(closeModal, 4000);
  }

  // ── Event listeners ────────────────────────────────────────────────────────
  $('wrenlo-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  $('wm-submit').addEventListener('click', submitForm);

  // Allow Enter key inside form
  ['wm-name','wm-biz','wm-email','wm-phone'].forEach(id => {
    $(id).addEventListener('keydown', e => { if (e.key === 'Enter') submitForm(); });
  });

  // ── Intercept all CTA links ────────────────────────────────────────────────
  const CTA_KEYWORDS = [
    '14-day pilot', 'pilot request', 'free audit', 'book pilot',
    'starter plan', 'growth plan', 'pro plan', 'pricing question',
    'talk to us', 'get started',
  ];

  function isCTA(el) {
    const href  = (el.getAttribute('href') || '').toLowerCase();
    const text  = (el.textContent || '').toLowerCase().trim();
    // Match mailto CTAs or button-like text
    if (href.startsWith('mailto:hello@wrenlo.co')) return true;
    return CTA_KEYWORDS.some(k => text.includes(k) || href.includes(k));
  }

  function attachToLinks() {
    document.querySelectorAll('a, button').forEach(el => {
      if (el.dataset.wrenloAttached) return;
      if (isCTA(el)) {
        el.dataset.wrenloAttached = '1';
        el.addEventListener('click', e => {
          e.preventDefault();
          openModal(el.textContent.trim());
        });
      }
    });
  }

  // Run on load + observe for dynamically added elements
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachToLinks);
  } else {
    attachToLinks();
  }

  const obs = new MutationObserver(attachToLinks);
  obs.observe(document.body, { childList: true, subtree: true });

  // Expose globally so you can trigger manually: wrenloPopup.open('Custom label')
  window.wrenloPopup = { open: openModal, close: closeModal };
})();
