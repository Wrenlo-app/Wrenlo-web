/* ═══════════════════════════════════════════════
   WRENLO AI — Shared JS (wrenlo.js)
   ═══════════════════════════════════════════════ */

/* CONFIG — swap before going live */
const SUPABASE_URL = 'https://lihkrrmmtzoqjxthewzr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gSalxqCkFI3UwoPVIWvyJw_pyH4slR8';
const TALLY_FORM_URL = 'https://tally.so/r/YOUR_FORM_ID';

/* ── MOBILE MENU ── */
function openMenu()  { document.getElementById('mobileMenu').classList.add('open') }
function closeMenu() { document.getElementById('mobileMenu').classList.remove('open') }

/* ── FAQ ACCORDION ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}

/* ── WHY-US SCENARIO TABS ── */
function showScenario(id, btn) {
  document.querySelectorAll('.scenario-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('sc-' + id);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}

/* ── SHARE / COPY LINK ── */
function copyLink(btn) {
  const url = btn.dataset.url || window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(() => {
    /* Fallback for older browsers */
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
}

/* ── SURVEY RADIO SELECTION ── */
function selectRadio(el, groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.radio-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  const input = el.querySelector('input[type="radio"]');
  if (input) input.checked = true;
  if (typeof updateProgress === 'function') updateProgress();
}

/* ── PRICING BILLING TOGGLE ── */
function toggleBilling() {
  const toggle = document.getElementById('billingToggle');
  if (!toggle) return;
  const annual = toggle.classList.toggle('on');
  document.querySelectorAll('.plan-price[data-monthly][data-annual]').forEach(el => {
    el.textContent = '$' + (annual ? el.dataset.annual : el.dataset.monthly);
  });
  const badge = document.getElementById('saveBadge');
  if (badge) badge.style.display = annual ? 'inline-block' : 'none';
}

/* ── SCROLL REVEAL ── */
document.addEventListener('DOMContentLoaded', () => {

  /* IntersectionObserver for .reveal elements */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* Active nav link — match pathname cleanly */
  const path = window.location.pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/';
  document.querySelectorAll('.nav-link[href]').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '').replace(/\.html$/, '') || '/';
    if (href === path) a.classList.add('active');
  });

  /* Init first scenario tab on why-us page if present */
  const firstStab = document.querySelector('.stab');
  if (firstStab) firstStab.click();

});

/* ── SMOOTH SCROLL (same-page anchors) ── */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
const href = a.getAttribute('href');
if (href === '#') return;
const target = document.querySelector(href);
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});

/* ── SURVEY FORM ── */
async function handleSurvey(btn) {
  const name  = document.getElementById('sf-name')?.value.trim();
  const email = document.getElementById('sf-email')?.value.trim();
  const biz   = document.getElementById('sf-biz')?.value.trim();
  const trade = document.getElementById('sf-trade')?.value;
  const size  = document.getElementById('sf-size')?.value;
  const pain  = document.getElementById('sf-pain')?.value.trim();

  if (!name || !email || !trade || !size) {
    const orig = btn.textContent;
    btn.textContent = 'Please fill all required fields';
    btn.style.background = '#c0392b';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2500);
    return;
  }

  btn.textContent = 'Saving…'; btn.disabled = true;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name, email, business_name: biz, trade,
        team_size: size, pain_point: pain, source: 'website_survey'
      })
    });
  } catch(err) {
    console.warn('Supabase save failed — continuing to Tally redirect', err);
  }

  /* Disable form fields */
  document.getElementById('surveyFormWrap')
    ?.querySelectorAll('input,select,textarea,button')
    .forEach(el => el.disabled = true);
  btn.style.display = 'none';
  document.getElementById('formSuccess')?.classList.add('show');

  /* Open Tally after short delay */
  setTimeout(() => {
    window.open(
      `${TALLY_FORM_URL}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&trade=${encodeURIComponent(trade)}&size=${encodeURIComponent(size)}`,
      '_blank'
    );
  }, 900);
}
