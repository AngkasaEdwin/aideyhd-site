// AideyHD site — the small interactive pieces. No dependencies.

// ---------- a #-linked <details> should open, not land on a closed row ----------
// The footer's "Beta" link points at an FAQ item. Without this, following it
// scrolls you to a shut accordion and asks you to figure out the second click.
(function () {
  function openTarget() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const d = el.closest("details");
    if (!d || d.open) return;
    d.open = true;
    d.scrollIntoView({ block: "center" }); // opening moves it; land on it anyway
  }
  openTarget();
  window.addEventListener("hashchange", openTarget);
})();

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

// ---------- sticky mobile CTA ----------
// Shows once the hero's own button has scrolled away, so it never double-asks.
// Dismissible, and the dismissal sticks for the visit.
(function () {
  const bar = document.getElementById("stickycta");
  const heroCta = document.querySelector(".hero .cta");
  if (!bar || !heroCta) return;

  let dismissed = false;
  try { dismissed = !!sessionStorage.getItem("ctaDismissed"); } catch (_) {}
  if (dismissed) return;

  function update() {
    // Past the hero button's bottom edge? Then there's no CTA on screen.
    const gone = heroCta.getBoundingClientRect().bottom < 0;
    bar.hidden = !gone;
  }
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();

  document.getElementById("stickyx").addEventListener("click", () => {
    bar.hidden = true;
    removeEventListener("scroll", update);
    removeEventListener("resize", update);
    try { sessionStorage.setItem("ctaDismissed", "1"); } catch (_) {}
  });
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
