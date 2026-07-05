// Kubestronaut quiz app logic: renders an exam picker, per-exam section tabs
// and pages, scores answers, and reveals the official doc reference only
// after the user answers.

(function () {
  const examTabsEl = document.getElementById("examTabs");
  const tabsEl = document.getElementById("tabs");
  const pagesEl = document.getElementById("pages");

  // Assemble the five Kubestronaut exams. Each question bank file defines its
  // own global; guard each so a missing file degrades to a skipped exam
  // instead of breaking the whole app.
  const EXAMS = [
    {
      id: "cka",
      label: "CKA",
      name: "Certified Kubernetes Administrator",
      curriculum: typeof CKA_CURRICULUM !== "undefined" ? CKA_CURRICULUM : null
    },
    {
      id: "ckad",
      label: "CKAD",
      name: "Certified Kubernetes Application Developer",
      curriculum: typeof CURRICULUM !== "undefined" ? CURRICULUM : null
    },
    {
      id: "cks",
      label: "CKS",
      name: "Certified Kubernetes Security Specialist",
      curriculum: typeof CKS_CURRICULUM !== "undefined" ? CKS_CURRICULUM : null
    },
    {
      id: "kcna",
      label: "KCNA",
      name: "Kubernetes and Cloud Native Associate",
      curriculum: typeof KCNA_CURRICULUM !== "undefined" ? KCNA_CURRICULUM : null
    },
    {
      id: "kcsa",
      label: "KCSA",
      name: "Kubernetes and Cloud Native Security Associate",
      curriculum: typeof KCSA_CURRICULUM !== "undefined" ? KCSA_CURRICULUM : null
    }
  ].filter((e) => Array.isArray(e.curriculum) && e.curriculum.length > 0);

  const EXAM_STORAGE_KEY = "kubestronaut-exam";

  // Track per-domain state: { [domainId]: { answers: {qIndex: chosenIndex}, total } }
  const state = {};
  // Domain ids are globally unique across exams; map them back to their data.
  const domainById = {};
  // Remember the last-open section per exam so switching exams feels sticky.
  const lastDomainByExam = {};

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

  function buildExamTab(exam) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.exam = exam.id;
    btn.textContent = exam.label;
    btn.title = exam.name;
    btn.addEventListener("click", () => setExam(exam.id));
    examTabsEl.appendChild(btn);
  }

  function buildTab(exam, domain) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.id = domain.id;
    btn.dataset.exam = exam.id;
    btn.innerHTML = `${escapeHtml(domain.title)} <span class="weight">${domain.weight}</span>`;
    btn.addEventListener("click", () => setActive(domain.id));
    tabsEl.appendChild(btn);
  }

  function buildPage(exam, domain) {
    const page = document.createElement("section");
    page.className = "page";
    page.dataset.id = domain.id;
    page.dataset.exam = exam.id;

    const head = document.createElement("div");
    head.className = "domain-head";
    head.innerHTML = `
      <div class="exam-tag">${escapeHtml(exam.label)} · ${escapeHtml(exam.name)}</div>
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
    domainById[domain.id] = domain;
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
      const q = domainById[domainId].questions[qi];
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

  function setExam(examId) {
    const exam = EXAMS.find((e) => e.id === examId) || EXAMS[0];
    if (!exam) return;

    examTabsEl.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("active", b.dataset.exam === exam.id);
    });
    // Show only this exam's section tabs.
    tabsEl.querySelectorAll("button").forEach((b) => {
      b.style.display = b.dataset.exam === exam.id ? "" : "none";
    });

    try { localStorage.setItem(EXAM_STORAGE_KEY, exam.id); } catch (_) {}

    const domainId = lastDomainByExam[exam.id] || exam.curriculum[0].id;
    setActive(domainId);
  }

  function setActive(id) {
    const domain = domainById[id];
    if (!domain) return;

    tabsEl.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("active", b.dataset.id === id);
    });
    pagesEl.querySelectorAll(".page").forEach((p) => {
      p.classList.toggle("active", p.dataset.id === id);
    });

    const examId = pagesEl.querySelector(`.page[data-id="${id}"]`).dataset.exam;
    lastDomainByExam[examId] = id;

    // On narrow screens, close the drawer after picking a section
    closeSidebar();
    // Scroll smoothly to top of main content
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Theme switcher: apply saved theme, wire up swatches, persist selection.
  const THEMES = ["pink", "blue", "forest", "amber", "midnight"];
  const THEME_STORAGE_KEY = "ckad-theme";

  function currentTheme() {
    const attr = document.documentElement.getAttribute("data-theme");
    return THEMES.indexOf(attr) >= 0 ? attr : "pink";
  }

  function applyTheme(name) {
    if (THEMES.indexOf(name) < 0) name = "pink";
    document.documentElement.setAttribute("data-theme", name);
    try { localStorage.setItem(THEME_STORAGE_KEY, name); } catch (_) {}
    document.querySelectorAll(".theme-swatch").forEach((s) => {
      const active = s.dataset.swatch === name;
      s.classList.toggle("active", active);
      s.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  // Sync switcher UI with whatever the inline <head> script already applied,
  // then wire up clicks.
  applyTheme(currentTheme());
  document.querySelectorAll(".theme-swatch").forEach((s) => {
    s.addEventListener("click", () => applyTheme(s.dataset.swatch));
  });

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
  if (EXAMS.length === 0) {
    pagesEl.innerHTML = '<p style="color:var(--bad)">Failed to load any question banks.</p>';
    return;
  }
  EXAMS.forEach((exam) => {
    buildExamTab(exam);
    exam.curriculum.forEach((domain) => {
      buildTab(exam, domain);
      buildPage(exam, domain);
    });
  });

  let initialExam = EXAMS[0].id;
  try {
    const saved = localStorage.getItem(EXAM_STORAGE_KEY);
    if (saved && EXAMS.some((e) => e.id === saved)) initialExam = saved;
  } catch (_) {}
  setExam(initialExam);
})();
