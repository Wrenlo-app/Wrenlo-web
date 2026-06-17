/* nav.js — injects nav + footer into every page */
(function() {
  const NAV_HTML = `
<div class="announce-bar">
  <span>🎁 Win a <strong>$100 Amazon gift card</strong> — take our 5-min contractor survey</span>
  <a href="/#survey">Enter now →</a>
</div>
<nav class="nav">
  <div class="container">
    <div class="nav__inner">
      <a href="/" class="nav__logo">
        <div class="nav__logo-icon">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 8C2 4.686 4.686 2 8 2s6 2.686 6 6" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M8 8l3-3" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
            <circle cx="8" cy="8" r="1.4" fill="white"/>
          </svg>
        </div>
        `<a href="/" class="nav-logo-link">
  <img src="/wrenlo-logo.png" alt="Wrenlo" class="nav-logo-img">
</a>`
      </a>
      <div class="nav__links">
        <a class="nav__link" href="/">Home</a>
        <a class="nav__link" href="/solution.html">Solution</a>
        <a class="nav__link" href="/pricing.html">Pricing</a>
      </div>
      <div class="nav__actions">
        <a class="btn btn--outline" href="/#survey">Free Survey</a>
        <a class="btn btn--primary" href="/solution.html#pilot">Start Pilot</a>
      </div>
    </div>
  </div>
</nav>`;

  const FOOTER_HTML = `
<footer>
  <div class="container">
    <div class="footer__grid">
      <div>
        <div class="footer__brand">Wrenlo AI</div>
        <p class="footer__desc">AI front desk and lead-recovery for U.S. home service contractors. Built to protect the revenue that walks out the door after hours.</p>
        <p style="font-size:12px;color:rgba(255,255,255,.25);margin-top:14px;font-family:var(--mono)">hello@wrenlo.co</p>
      </div>
      <div>
        <div class="footer__col-title">Product</div>
        <div class="footer__links">
          <a class="footer__link" href="/solution.html">How it works</a>
          <a class="footer__link" href="/pricing.html">Pricing</a>
          <a class="footer__link" href="/solution.html#pilot">14-day pilot</a>
          <a class="footer__link" href="/solution.html#integrations">Integrations</a>
        </div>
      </div>
      <div>
        <div class="footer__col-title">Trades</div>
        <div class="footer__links">
          <a class="footer__link" href="/solution.html#trades">HVAC</a>
          <a class="footer__link" href="/solution.html#trades">Plumbing</a>
          <a class="footer__link" href="/solution.html#trades">Electrical</a>
          <a class="footer__link" href="/solution.html#trades">Roofing</a>
          <a class="footer__link" href="/solution.html#trades">More trades</a>
        </div>
      </div>
      <div>
        <div class="footer__col-title">Company</div>
        <div class="footer__links">
          <a class="footer__link" href="/">About</a>
          <a class="footer__link" href="/privacy.html">Privacy Policy</a>
          <a class="footer__link" href="/terms.html">Terms of Service</a>
          <a class="footer__link" href="mailto:hello@wrenlo.co">Contact</a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <span class="footer__copy">© 2026 Wrenlo AI · wrenlo.co</span>
      <span class="footer__copy">Built for contractors who are done missing jobs</span>
    </div>
  </div>
</footer>`;

  // Inject nav before first element in body
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

  // Mark active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === '/' && path === '/') link.classList.add('active');
    else if (href !== '/' && path.startsWith(href.replace('.html',''))) link.classList.add('active');
  });

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); } });
  }, { threshold: 0.08 });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  });
})();
