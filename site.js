// AideyHD site — the three small interactive pieces. No dependencies.

// ---------- two-tap demo ----------
(function () {
  const chips = document.getElementById("demochips");
  const sheet = document.getElementById("demosheet");
  const log = document.getElementById("demolog");
  const empty = document.getElementById("demoempty");
  const pill = document.getElementById("undopill");
  const undoLabel = document.getElementById("undolabel");
  const tapCount = document.getElementById("tapcount");
  const reset = document.getElementById("demoreset");
  if (!chips) return;

  let taps = 0;
  let pending = null;
  let pillTimer = null;

  const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  function openSheet(title, detail) {
    pending = { title, detail };
    document.getElementById("sheetmeal").textContent = title;
    document.getElementById("sheetdetail").textContent = detail;
    document.getElementById("sheettime").textContent = timeNow();
    sheet.hidden = false;
    // let the browser paint the closed state before sliding in
    requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add("open")));
  }

  function closeSheet() {
    sheet.classList.remove("open");
    const motionOK = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => { sheet.hidden = true; }, motionOK ? 300 : 0);
  }

  function showPill(title) {
    undoLabel.textContent = "Logged " + title;
    pill.hidden = false;
    clearTimeout(pillTimer);
    pillTimer = setTimeout(() => { pill.hidden = true; }, 5000);
  }

  chips.addEventListener("click", (e) => {
    const chip = e.target.closest(".qchip");
    if (!chip) return;
    taps += 1;
    openSheet(chip.dataset.title, chip.dataset.detail);
  });

  document.getElementById("sheetlog").addEventListener("click", () => {
    taps += 1;
    const li = document.createElement("li");
    li.innerHTML =
      "<span></span><span class='when'></span>";
    li.firstChild.textContent = pending.title + " · " + pending.detail;
    li.lastChild.textContent = timeNow();
    log.prepend(li);
    empty.hidden = true;
    reset.hidden = false;
    closeSheet();
    showPill(pending.title);
    tapCount.textContent = taps + " taps. No typing.";
  });

  document.getElementById("sheetcancel").addEventListener("click", () => {
    taps = Math.max(0, taps - 1); // the tap that opened it shouldn't count against you
    closeSheet();
  });

  document.getElementById("undobtn").addEventListener("click", () => {
    if (log.firstChild) log.removeChild(log.firstChild);
    pill.hidden = true;
    if (!log.firstChild) { empty.hidden = false; reset.hidden = true; }
  });

  reset.addEventListener("click", () => {
    log.textContent = "";
    taps = 0;
    tapCount.textContent = "";
    empty.hidden = false;
    pill.hidden = true;
    reset.hidden = true;
  });
})();

// ---------- copy toggle ----------
(function () {
  const most = document.getElementById("tg-most");
  const aidey = document.getElementById("tg-aidey");
  const pairs = document.getElementById("pairs");
  if (!most) return;

  function set(mode) {
    const isAidey = mode === "aidey";
    pairs.classList.toggle("aidey", isAidey);
    most.setAttribute("aria-pressed", String(!isAidey));
    aidey.setAttribute("aria-pressed", String(isAidey));
    pairs.querySelectorAll(".line").forEach((el) => {
      el.textContent = isAidey ? el.dataset.aidey : el.dataset.most;
    });
  }
  most.addEventListener("click", () => set("most"));
  aidey.addEventListener("click", () => set("aidey"));
})();

// ---------- widget idle state, from the visitor's clock ----------
// Mirrors the app's WidgetIdleInvitation buckets: morning 5–11, midday 11–14,
// afternoon 14–17, evening 17–21, quiet 21–5.
(function () {
  const w = document.getElementById("idlewidget");
  if (!w) return;
  const hour = new Date().getHours();

  const glyphs = {
    meal: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'><path d='M7 3v7a2 2 0 0 0 2 2v9M7 3v4M11 3v7M15 3c2 0 3 2 3 5v3h-2v10'/></svg>",
    move: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'><path d='M4 12h2M18 12h2M6 8v8M18 8v8M6 12h12'/></svg>",
    moon: "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'><path d='M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z'/></svg>"
  };

  let state;
  if (hour >= 5 && hour < 11) {
    state = { label: "MORNING", title: "Ready to log breakfast?", sub: "", tint: "amber", glyph: "meal" };
  } else if (hour >= 11 && hour < 14) {
    state = { label: "MIDDAY", title: "Ready to log lunch?", sub: "", tint: "amber", glyph: "meal" };
  } else if (hour >= 14 && hour < 17) {
    state = { label: "AFTERNOON", title: "Time for a walk?", sub: "", tint: "coral", glyph: "move" };
  } else if (hour >= 17 && hour < 21) {
    state = { label: "EVENING", title: "Ready to log dinner?", sub: "", tint: "amber", glyph: "meal" };
  } else {
    state = { label: "QUIET HOURS", title: "Nothing from us.", sub: "Sleep well.", tint: "indigo", glyph: "moon" };
    const note = document.getElementById("widgetnote");
    if (note) note.textContent = "It's after 9 pm where you are, so this is all the widget has to say. No app should talk to you at midnight.";
  }

  const tint = "var(--" + state.tint + ")";
  document.getElementById("idlewash").style.background =
    "linear-gradient(160deg, color-mix(in srgb, " + tint + " 22%, transparent), transparent 70%)";
  const label = document.getElementById("idlelabel");
  label.textContent = state.label;
  label.style.color = tint;
  document.getElementById("idletitle").textContent = state.title;
  document.getElementById("idlesub").textContent = state.sub;
  const ico = document.getElementById("idleico");
  ico.innerHTML = glyphs[state.glyph];
  ico.style.color = tint;
})();
