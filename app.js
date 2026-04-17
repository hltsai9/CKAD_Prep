// CKAD Quiz app logic: renders tabs and per-domain pages, scores answers,
// and reveals the official doc reference only after the user answers.

(function () {
  const tabsEl = document.getElementById("tabs");
  const pagesEl = document.getElementById("pages");

  // Track per-domain state: { [domainId]: { answers: {qIndex: chosenIndex}, score } }
  const state = {};

  function typeLabel(type) {
    switch (type) {
      case "mcq": return "Multiple choice";
      case "yaml": return "YAML fill-in-the-blank";
      case "tf": return "True / False";
      default: return "Question";
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Replace "______" (6 underscores) in YAML snippets with a highlighted blank.
  function renderYaml(yaml) {
    const safe = escapeHtml(yaml);
    return safe.replace(/______/g, '<span class="blank">______</span>');
  }

  function letter(i) {
    return String.fromCharCode(65 + i); // A, B, C, D
  }

  function buildTab(domain, idx) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.id = domain.id;
    btn.innerHTML = `${escapeHtml(domain.title)} <span class="weight">${domain.weight}</span>`;
    if (idx === 0) btn.classList.add("active");
    btn.addEventListener("click", () => setActive(domain.id));
    tabsEl.appendChild(btn);
  }

  function buildPage(domain, idx) {
    const page = document.createElement("section");
    page.className = "page" + (idx === 0 ? " active" : "");
    page.dataset.id = domain.id;

    const head = document.createElement("div");
    head.className = "domain-head";
    head.innerHTML = `
      <h2>${escapeHtml(domain.title)} <span style="color:var(--muted);font-weight:400;font-size:13px">(${domain.weight})</span></h2>
      <p>${escapeHtml(domain.description)}</p>
    `;
    page.appendChild(head);

    const progress = document.createElement("div");
    progress.className = "progress";
    progress.innerHTML = `
      <span>Progress</span>
      <div class="bar"><span data-bar></span></div>
      <span class="score" data-score>0 / ${domain.questions.length}</span>
    `;
    page.appendChild(progress);

    domain.questions.forEach((q, qi) => {
      page.appendChild(renderQuestion(domain.id, qi, q));
    });

    const footerActions = document.createElement("div");
    footerActions.className = "footer-actions";
    footerActions.innerHTML = `
      <button class="btn secondary" data-action="reset">Reset this section</button>
      <span style="color:var(--muted);font-size:13px">Tip: click any choice to check your answer.</span>
    `;
    footerActions.querySelector('[data-action="reset"]').addEventListener("click", () => resetDomain(domain.id));
    page.appendChild(footerActions);

    pagesEl.appendChild(page);
    state[domain.id] = { answers: {}, total: domain.questions.length };
  }

  function renderQuestion(domainId, qi, q) {
    const wrap = document.createElement("div");
    wrap.className = "question";
    wrap.dataset.domain = domainId;
    wrap.dataset.qi = String(qi);

    const tag = `<span class="type-tag">${typeLabel(q.type)}</span>`;
    const prompt = `<p class="prompt">${escapeHtml(q.prompt)}</p>`;
    const yaml = q.yaml ? `<pre class="yaml">${renderYaml(q.yaml)}</pre>` : "";

    const choicesHtml = q.choices.map((c, ci) =>
      `<button class="choice" data-ci="${ci}"><span class="letter">${letter(ci)}.</span>${escapeHtml(c)}</button>`
    ).join("");

    const feedback = `
      <div class="feedback" data-feedback>
        <div class="verdict" data-verdict></div>
        <div class="explain" data-explain></div>
        <a class="doc-link" data-doc target="_blank" rel="noopener"></a>
      </div>`;

    wrap.innerHTML = `${tag}${prompt}${yaml}<div class="choices">${choicesHtml}</div>${feedback}`;

    // Wire up clicks
    wrap.querySelectorAll(".choice").forEach((btn) => {
      btn.addEventListener("click", () => handleAnswer(wrap, q, parseInt(btn.dataset.ci, 10)));
    });

    return wrap;
  }

  function handleAnswer(wrap, q, chosen) {
    const domainId = wrap.dataset.domain;
    const qi = parseInt(wrap.dataset.qi, 10);
    const ds = state[domainId];
    if (ds.answers[qi] !== undefined) return; // already answered

    ds.answers[qi] = chosen;

    const buttons = wrap.querySelectorAll(".choice");
    buttons.forEach((b, i) => {
      b.setAttribute("disabled", "true");
      if (i === q.answer) b.classList.add("correct");
      if (i === chosen && chosen !== q.answer) b.classList.add("wrong");
    });

    const fb = wrap.querySelector("[data-feedback]");
    const verdict = wrap.querySelector("[data-verdict]");
    const explain = wrap.querySelector("[data-explain]");
    const doc = wrap.querySelector("[data-doc]");

    if (chosen === q.answer) {
      verdict.textContent = "✓ Correct";
      verdict.className = "verdict good";
    } else {
      verdict.textContent = `✗ Not quite — correct answer: ${letter(q.answer)}`;
      verdict.className = "verdict bad";
    }
    explain.textContent = q.explanation;
    doc.textContent = "📘 " + q.docs.label;
    doc.href = q.docs.url;
    fb.classList.add("show");

    updateProgress(domainId);
  }

  function updateProgress(domainId) {
    const ds = state[domainId];
    const page = pagesEl.querySelector(`.page[data-id="${domainId}"]`);
    const bar = page.querySelector("[data-bar]");
    const scoreEl = page.querySelector("[data-score]");

    const answered = Object.keys(ds.answers).length;
    const correct = Object.entries(ds.answers).reduce((n, [qi, chosen]) => {
      const q = CURRICULUM.find(d => d.id === domainId).questions[qi];
      return n + (chosen === q.answer ? 1 : 0);
    }, 0);

    bar.style.width = ((answered / ds.total) * 100).toFixed(1) + "%";
    scoreEl.textContent = `${correct} / ${ds.total} correct · ${answered} answered`;
  }

  function resetDomain(domainId) {
    const ds = state[domainId];
    ds.answers = {};
    const page = pagesEl.querySelector(`.page[data-id="${domainId}"]`);
    page.querySelectorAll(".question").forEach((wrap) => {
      wrap.querySelectorAll(".choice").forEach((b) => {
        b.removeAttribute("disabled");
        b.classList.remove("correct", "wrong");
      });
      const fb = wrap.querySelector("[data-feedback]");
      fb.classList.remove("show");
    });
    updateProgress(domainId);
  }

  function setActive(id) {
    tabsEl.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("active", b.dataset.id === id);
    });
    pagesEl.querySelectorAll(".page").forEach((p) => {
      p.classList.toggle("active", p.dataset.id === id);
    });
    // On narrow screens, close the drawer after picking a section
    closeSidebar();
    // Scroll smoothly to top of main content
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Sidebar drawer logic (mobile)
  const sidebarEl = document.getElementById("sidebar");
  const menuToggleEl = document.getElementById("menuToggle");
  const backdropEl = document.getElementById("sidebarBackdrop");

  function isDrawerMode() {
    return window.matchMedia("(max-width: 900px)").matches;
  }
  function openSidebar() {
    if (!sidebarEl) return;
    sidebarEl.classList.add("open");
    if (backdropEl) backdropEl.classList.add("show");
    if (menuToggleEl) menuToggleEl.setAttribute("aria-expanded", "true");
  }
  function closeSidebar() {
    if (!sidebarEl) return;
    sidebarEl.classList.remove("open");
    if (backdropEl) backdropEl.classList.remove("show");
    if (menuToggleEl) menuToggleEl.setAttribute("aria-expanded", "false");
  }
  function toggleSidebar() {
    if (!sidebarEl) return;
    if (sidebarEl.classList.contains("open")) closeSidebar();
    else openSidebar();
  }

  if (menuToggleEl) {
    menuToggleEl.addEventListener("click", toggleSidebar);
  }
  if (backdropEl) {
    backdropEl.addEventListener("click", closeSidebar);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isDrawerMode()) closeSidebar();
  });
  // If the viewport is resized back to desktop, ensure drawer state is reset
  window.addEventListener("resize", () => {
    if (!isDrawerMode()) closeSidebar();
  });

  // Bootstrap
  if (typeof CURRICULUM === "undefined") {
    pagesEl.innerHTML = '<p style="color:var(--bad)">Failed to load questions.js</p>';
    return;
  }
  CURRICULUM.forEach((d, i) => {
    buildTab(d, i);
    buildPage(d, i);
  });
})();
