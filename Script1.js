// JavaScript source code
/* ===== CONFIG ===== */
const PASSCODE = "0826";
// Refresh only the demo phone/message data once for this update; wallpaper, notes and photos stay untouched.
try {
  if (localStorage.getItem("iphoneSeedVersion") !== "2") {
    ["threads", "recs", "cts"].forEach(key => localStorage.removeItem(key));
    localStorage.setItem("iphoneSeedVersion", "2");
  }
}
catch (e) { }
const WALL0 = "data:image/jpeg;base64,/wallpaper-pond.jpg"
const SPOTIFY_PLAYLIST = "6oblb2yXuNES3NzIrdqjmu"; // your playlist ID (open.spotify.com/playlist/ID)
/* ================== */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const store = { get(k, d) { try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  }
  catch (e) {
    return d;
  } }, set(k, v) { try {
    localStorage.setItem(k, JSON.stringify(v));
  }
  catch (e) { } } };
let baseH = innerHeight;
function fit() {
  const vv = window.visualViewport, w = Math.round(innerWidth), h0 = Math.round(vv ? vv.height : innerHeight), ae = document.activeElement;
  const typing = !!(ae && /INPUT|TEXTAREA/.test(ae.tagName) && w <= 820); // on phones, ignore the on-screen keyboard shrinking the viewport
  if (!typing || h0 > baseH)
    baseH = h0;
  const H = typing ? baseH : h0, small = w <= 520, k = small ? Math.min(w / 414, H / 868, 1.6) : Math.min(1.2, (H - 24) / 884, w / 450);
  $("#stage").style.transform = "scale(" + Math.max(.2, k) + ")";
  $("#stage").style.marginBottom = "0";
}
if (window.visualViewport)
  visualViewport.addEventListener("resize", () => fit());
addEventListener("orientationchange", () => setTimeout(fit, 250));
addEventListener("focusin", () => setTimeout(fit, 50));
addEventListener("focusout", () => setTimeout(fit, 300));
addEventListener("resize", fit);
fit();
function setWall() { $("#wall").style.background = `center/cover url(${WALL0})`; }
setWall();
function readImg(f, cb) { if (!f)
  return; const r = new FileReader(); r.onload = () => cb(r.result); r.readAsDataURL(f); }
const D = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], M = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], p2 = n => String(n).padStart(2, "0");
let lastT = "";
function fitTime() { const e = $("#lt"); e.style.fontSize = "100px"; const w = e.offsetWidth || 1; e.style.fontSize = Math.min(170, 100 * 340 / w) + "px"; }
function tick() {
  const n = new Date(), hm = p2(n.getHours()) + ":" + p2(n.getMinutes()), h12 = n.getHours() % 12 || 12, s = n.getSeconds();
  if (hm !== lastT) {
    lastT = hm;
    $("#lt").textContent = hm;
    $("#sbt").textContent = hm;
    fitTime();
  }
  $("#ld").textContent = D[n.getDay()].slice(0, 3) + " " + n.getDate() + " " + M[n.getMonth()].slice(0, 3);
  $("#cw").textContent = D[n.getDay()].slice(0, 3);
  $("#cd").textContent = n.getDate();
  const hr = (n.getHours() % 12 + n.getMinutes() / 60) * 30, mn = (n.getMinutes() + s / 60) * 6, sc = s * 6;
  [["#ih", hr], ["#im", mn], ["#is", sc]].forEach(([q, a]) => $(q).style.transform = `rotate(${a}deg)`);
}
tick();
setInterval(tick, 1000);
if (document.fonts)
  document.fonts.ready.then(fitTime);
$("#ticks").innerHTML = [...Array(12)].map((_, i) => `<line y1="-27" y2="-24" stroke="#999" stroke-width="1" transform="rotate(${i * 30})"/>`).join("");
// lock
let code = "", pbusy = false;
const pad = $("#pad");
"123456789".split("").forEach(n => pad.insertAdjacentHTML("beforeend", `<button class="k" type="button" data-n="${n}">${n}<small>${["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"][n - 1]}</small></button>`));
pad.insertAdjacentHTML("beforeend", `<button class="k z" type="button" data-n="0">0<small></small></button>`);
pad.insertAdjacentHTML("beforeend", `<button class="k del" type="button" id="kdelp" data-del aria-label="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.5h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-6-6.500z"/><path d="m12.500 9.500 5 5m0-5-5 5"/></svg></button>`);
function dots() { $$("#dots i").forEach((d, i) => d.classList.toggle("f", i < code.length)); $("#kdelp").style.visibility = code.length && !pbusy ? "visible" : "hidden"; }
function unlock() { $("#lock").classList.add("up"); $("#pass").classList.remove("on"); $("#phone").classList.remove("pass", "locked"); $("#hb").style.display = "block"; }
function wrongCode() {
  $("#dots").classList.add("shake", "err");
  $("#pad").classList.add("shake");
  if (navigator.vibrate)
    try {
      navigator.vibrate([60, 40, 60]);
    }
    catch (e) { }
  setTimeout(() => { $("#dots").classList.remove("shake", "err"); $("#pad").classList.remove("shake"); code = ""; pbusy = false; dots(); }, 480);
}
function pressDigit(n) {
  if (pbusy || code.length >= 4)
    return;
  code += n;
  dots();
  if (code.length === 4) {
    pbusy = true;
    dots();
    setTimeout(() => { if (code === PASSCODE) {
      pbusy = false;
      unlock();
    }
    else
      wrongCode(); }, 180);
  }
}
function pressDel() { if (pbusy || !code.length)
  return; code = code.slice(0, -1); dots(); }
pad.addEventListener("click", e => { if (e.target.closest("[data-del]")) {
  pressDel();
  return;
} const b = e.target.closest("[data-n]"); if (b)
  pressDigit(b.dataset.n); });
function askPass() { code = ""; pbusy = false; $("#dots").classList.remove("shake", "err"); $("#pad").classList.remove("shake"); dots(); $("#pass").classList.add("on"); $("#phone").classList.add("pass"); }
$("#cancel").onclick = () => { $("#pass").classList.remove("on"); $("#phone").classList.remove("pass"); };
$("#lh").onclick = askPass;
// desktop keyboard: digits, Backspace, Escape (passcode) / Arrow Up or Enter (lockscreen)
addEventListener("keydown", e => {
  if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName))
    return;
  if ($("#pass").classList.contains("on")) {
    if (/^[0-9]$/.test(e.key)) {
      pressDigit(e.key);
      e.preventDefault();
    }
    else if (e.key === "Backspace" || e.key === "Delete") {
      pressDel();
      e.preventDefault();
    }
    else if (e.key === "Escape")
      $("#cancel").onclick();
  }
  else if ($("#phone").classList.contains("locked") && (e.key === "ArrowUp" || e.key === "Enter")) {
    askPass();
    e.preventDefault();
  }
});
// swipe up on the lockscreen (pointer events = mouse + touch + pen)
const lk = $("#lock");
let sw0 = null;
const phoneK = () => ($("#phone").getBoundingClientRect().height || 864) / 864;
lk.addEventListener("pointerdown", e => { if (e.target.closest(".lbtn") || (e.pointerType === "mouse" && e.button !== 0))
  return; sw0 = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now(), drag: false }; });
lk.addEventListener("pointermove", e => {
  if (!sw0 || e.pointerId !== sw0.id)
    return;
  const dy = sw0.y - e.clientY, dx = Math.abs(e.clientX - sw0.x);
  if (!sw0.drag) {
    if (Math.abs(dy) > 8 * phoneK() && Math.abs(dy) > dx) {
      sw0.drag = true;
      try {
        lk.setPointerCapture(e.pointerId);
      }
      catch (_) { }
      lk.style.transition = "none";
    }
    else
      return;
  }
  const up = Math.max(0, dy) / phoneK();
  lk.style.transform = `translateY(${-up * .7}px)`;
  lk.style.opacity = String(Math.max(.25, 1 - up / 380));
});
function endSwipe(e) {
  if (!sw0 || e.pointerId !== sw0.id)
    return;
  const s = sw0;
  sw0 = null;
  if (!s.drag)
    return;
  const dy = (s.y - e.clientY) / phoneK(), go = e.type === "pointerup" && (dy > 70 || (dy > 28 && Date.now() - s.t < 300));
  if (go)
    askPass();
  requestAnimationFrame(() => { lk.style.transition = ""; lk.style.transform = ""; lk.style.opacity = ""; });
}
lk.addEventListener("pointerup", endSwipe);
lk.addEventListener("pointercancel", endSwipe);
lk.addEventListener("wheel", e => { if (e.deltaY > 30 && !$("#pass").classList.contains("on"))
  askPass(); }, { passive: true });
$("#fl").onclick = function () { this.classList.toggle("on"); };
$("#hb").onclick = () => { if ($(".ap.on"))
  closeApp();
else {
  $("#lock").classList.remove("up");
  $("#phone").classList.add("locked");
  $("#hb").style.display = "none";
} };
function closeApp() { $$(".ap.on").forEach(a => a.classList.remove("on")); $("#big").style.display = "none"; $("#bigbar").style.display = "none"; $("#phone").classList.remove("light"); }
$$("[data-open]").forEach(a => a.onclick = () => { $("#ap-" + a.dataset.open).classList.add("on"); $("#phone").classList.add("light"); (window.openApp || {})[a.dataset.open] && window.openApp[a.dataset.open](); if (a.dataset.open === "spot" && !$("#sf").src)
  $("#sf").src = "https://open.spotify.com/embed/playlist/" + SPOTIFY_PLAYLIST + "?utm_source=generator"; });
$$("[data-close]").forEach(b => b.onclick = closeApp);
// Locket: static display only
const locket = $("#locket");
const profile = $("#lpp");
locket.style.backgroundImage = "url('photos_phone/hallway.jpg')";
locket.style.backgroundSize = "cover";
locket.style.backgroundPosition = "center";
profile.style.backgroundImage = "url('photos_phone/locket2.jpg')";
profile.style.backgroundSize = "cover";
profile.style.backgroundPosition = "center";
profile.style.backgroundRepeat = "no-repeat";
profile.textContent = "";
locket.onclick = null;
profile.onclick = null;
// ---------- NOTES ----------
function dAgo(days, hours, minutes) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}
const SEED = [
  { t: dAgo(0, 20, 12), x: "november duty sched tentative\n\n\n- 16 - 18 2p 10p\n- 19 - 20 6p 6a\n- 21 - 22 off" },
  { t: dAgo(0, 9, 40), x: "doc pogi fav coffee\n\nvietnamese cafe, iced americano large, spanish latte" },
  { t: dAgo(2, 21, 5), x: "mga gagawin paguwi ☑\n\n☐ sagot qbanks archer / bootcamp\n☐ cardio lecture\n☐ onco lecture\n☐ check updated sched\n☐ bebe time with doc pogi\n☐ sana kayanin ko pa" },
  { t: dAgo(23, 12, 0), x: "grocery\n\n\n• milk, bread, oil, calamansi, bawang, sibuyas\n• biogesic 10pcs\n• kremils s 3pcs\n• sinupret forte 5pcs" }
];
let notes = store.get("notes3", null) || SEED.map((n, i) => ({ id: i + 1, ...n }));
let nid = null;
const DD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function fdate(t) { const d = new Date(t), a = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(t).setHours(0, 0, 0, 0)) / 864e5); return a === 1 ? "Yesterday" : a < 1 ? p2(d.getHours()) + ":" + p2(d.getMinutes()) : a < 7 ? DD[d.getDay()] : p2(d.getDate()) + "/" + p2(d.getMonth() + 1) + "/" + d.getFullYear(); }
function nsplit(x) { const l = x.split("\n"); return [l[0] || "New Note", (l.slice(1).join(" ").trim()) || "No additional text"]; }
function rnotes() {
  const q = $("#nq").value.toLowerCase();
  const L = [...notes].sort((a, b) => b.t - a.t).filter(n => n.x.toLowerCase().includes(q));
  const g = [["Today", []], ["Previous 7 Days", []], ["Previous 30 Days", []], ["Older", []]], t0 = new Date().setHours(0, 0, 0, 0);
  L.forEach(n => { const a = Math.floor((t0 - new Date(n.t).setHours(0, 0, 0, 0)) / 864e5); g[a < 1 ? 0 : a < 7 ? 1 : a < 30 ? 2 : 3][1].push(n); });
  $("#ncount").textContent = notes.length + " Notes";
  $("#nsc").innerHTML = g.filter(x => x[1].length).map(([h, a]) => `<div class="sg">${h}</div><div class="card">${a.map(n => { const [s, b] = nsplit(n.x); return `<div class="row" data-i="${n.id}"><b></b><span></span><em>🗀 Notes</em></div>`; }).join("")}</div>`).join("");
  const rows = $$("#nsc .row");
  let k = 0;
  g.forEach(([h, a]) => a.forEach(n => { const [s, b] = nsplit(n.x), r = rows[k++]; r.querySelector("b").textContent = s; r.querySelector("span").textContent = fdate(n.t) + "  " + b; }));
}
$("#nq").oninput = rnotes;
$("#nsc").onclick = e => { const r = e.target.closest(".row"); if (r) {
  nid = +r.dataset.i;
  $("#ntxt").value = notes.find(n => n.id === nid).x;
  $("#ned").classList.add("on");
} };
$("#nnew").onclick = () => { nid = Math.max(0, ...notes.map(n => n.id)) + 1; notes.push({ id: nid, t: Date.now(), x: "" }); $("#ntxt").value = ""; $("#ned").classList.add("on"); $("#ntxt").focus(); };
$("#ntxt").oninput = () => { const n = notes.find(n => n.id === nid); if (n) {
  n.x = $("#ntxt").value;
  n.t = Date.now();
  store.set("notes3", notes);
} };
function nclose() { $("#ned").classList.remove("on"); notes = notes.filter(n => n.x.trim()); store.set("notes3", notes); rnotes(); }
$("#nback").onclick = nclose;
$("#ndel").onclick = () => { notes = notes.filter(n => n.id !== nid); $("#ntxt").value = ""; nclose(); };
rnotes();
// ---------- CALENDAR ----------
const NOW = new Date();
const openApp = {};
const Y = NOW.getFullYear(), MA = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const HOL = { "01-01": "New Year’s Day", "02-17": "Chinese New Year", "02-25": "EDSA Revolution", "04-02": "Maundy Thursday", "04-03": "Good Friday", "04-04": "Black Saturday", "04-09": "Araw ng Kagitingan", "05-01": "Labor Day", "06-12": "Independence Day", "08-21": "Ninoy Aquino Day", "08-31": "National Heroes Day", "10-31": "Halloween", "11-01": "All Saints’ Day", "11-02": "All Souls’ Day", "11-30": "Bonifacio Day", "12-08": "Immaculate Conception", "12-24": "Christmas Eve", "12-25": "Christmas Day", "12-30": "Rizal Day", "12-31": "New Year’s Eve" };
if (Y === 2026) {
  HOL["03-20"] = "Eid’l Fitr";
  HOL["05-27"] = "Eid’l Adha";
}
else {
  ["02-17", "02-25", "04-02", "04-03", "04-04", "08-31"].forEach(k => delete HOL[k]);
}
let evs = store.get("evs", {}), sel = null;
const key = (m, d) => p2(m + 1) + "-" + p2(d), ykey = (m, d) => Y + "-" + key(m, d);
function rcal() {
  let h = "";
  for (let m = 0; m < 12; m++) {
    const f = (new Date(Y, m, 1).getDay() + 6) % 7, n = new Date(Y, m + 1, 0).getDate();
    h += `<div class="cm ${m === NOW.getMonth() ? "" : "o"}" data-m="${m}" style="padding-left:${f / 7 * 100}%">${MA[m]}</div>`;
    for (let w = 0; w < Math.ceil((f + n) / 7); w++) {
      h += '<div class="wkr">';
      for (let c = 0; c < 7; c++) {
        const d = w * 7 + c - f + 1;
        if (d < 1 || d > n) {
          h += "<div></div>";
          continue;
        }
        const td = m === NOW.getMonth() && d === NOW.getDate(), k = ykey(m, d), ho = HOL[key(m, d)], ev = (evs[k] || []);
        h += `<div class="dc ${c > 4 ? "we" : ""} ${td ? "td" : ""} ${sel === k ? "sel" : ""}" data-k="${k}"><span class="n">${d}</span>${ho ? `<span class="ev">★ ${ho}</span>` : ""}${ev.map((e, i) => `<span class="ev u" data-e="${i}"></span>`).join("")}</div>`;
      }
      h += "</div>";
    }
  }
  $("#cs").innerHTML = h;
  $$("#cs .dc").forEach(dc => $$("#" + "cs" + " [data-k='" + dc.dataset.k + "'] .ev.u").forEach((s, i) => s.textContent = evs[dc.dataset.k][i]));
}
function ctitle() { const st = $("#cs").scrollTop, ms = $$("#cs .cm"); let c = 0; ms.forEach((e, i) => { if (e.offsetTop - ms[0].offsetTop <= st + 40)
  c = i; }); $("#cmt").textContent = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][c]; }
function cgo(m) { const e = $$("#cs .cm")[m]; $("#cs").scrollTop = e.offsetTop - 4; ctitle(); }
$("#cs").onscroll = ctitle;
$("#cyr").textContent = Y;
$("#cs").onclick = e => {
  const d = e.target.closest(".dc");
  if (!d)
    return;
  sel = d.dataset.k;
  const [y, mo, da] = sel.split("-"), st = $("#cs").scrollTop;
  rcal();
  $("#cs").scrollTop = st;
  $("#csd").textContent = new Date(y, mo - 1, da).toDateString();
  const ho = HOL[mo + "-" + da];
  $("#cev").innerHTML = "";
  [ho && "★ " + ho, ...(evs[sel] || [])].filter(Boolean).forEach(t => { const x = document.createElement("div"); x.style.padding = "4px 0"; x.textContent = t; $("#cev").appendChild(x); });
  $("#csheet").classList.add("on");
};
$("#cok").onclick = () => { const v = $("#cin").value.trim(); if (v && sel) {
  (evs[sel] = evs[sel] || []).push(v);
  store.set("evs", evs);
  $("#cin").value = "";
  const st = $("#cs").scrollTop;
  rcal();
  $("#cs").scrollTop = st;
  $("#csheet").classList.remove("on");
} };
$("#cadd").onclick = () => { if (!sel)
  sel = ykey(NOW.getMonth(), NOW.getDate()); $("#csd").textContent = sel; $("#cev").innerHTML = ""; $("#csheet").classList.add("on"); $("#cin").focus(); };
$("#ctod").onclick = () => { $("#csheet").classList.remove("on"); cgo(NOW.getMonth()); };
rcal();
openApp.cal = () => setTimeout(() => cgo(NOW.getMonth()), 50);
// ---------- CLOCK ----------
let alarms = store.get("alarms", [["04:00", 0], ["04:30", 1], ["05:00", 0], ["05:20", 1], ["05:45", 0]].map(([t, o], i) => ({ id: i, t, o }))), tab = "a";
let sw = { run: 0, t0: 0, acc: 0, laps: [] }, tm = { run: 0, end: 0, left: 0, iv: null };
const fmt = (ms) => { const c = Math.floor(ms / 10) % 100, s = Math.floor(ms / 1000) % 60, m = Math.floor(ms / 6e4); return p2(m) + ":" + p2(s) + "." + p2(c); }, swms = () => sw.acc + (sw.run ? Date.now() - sw.t0 : 0);
function rclock() {
  const b = $("#cl-body");
  $$(".tabs button").forEach(x => x.classList.toggle("on", x.dataset.t === tab));
  $("#ctitle").textContent = "";
  $("#alp").style.visibility = tab === "a" ? "visible" : "hidden";
  if (tab === "a") {
    b.innerHTML = `<div class="big" style="font-size:36px">Alarms</div><div style="font-size:20px;font-weight:700;margin:14px 0">🛏 Sleep | Wake Up</div><div class="al" style="color:#8e8e93;font-size:18px">No Alarm<button class="pill" style="background:#f2f2f7;color:#ff9f0a;font-size:14px">SET UP</button></div><div class="big" style="margin-top:34px">Other</div>` + alarms.sort((a, b) => a.t < b.t ? -1 : 1).map(a => `<div class="al ${a.o ? "on" : ""}"><div><b>${a.t}</b><small>Alarm</small></div><div class="tg ${a.o ? "on" : ""}" data-id="${a.id}"></div></div>`).join("");
  }
  else if (tab === "w") {
    b.innerHTML = `<div class="big" style="font-size:36px">World Clock</div>` + [["Manila", "Asia/Manila"], ["Auckland", "Pacific/Auckland"]].map(([n, z]) => `<div class="wr"><div><div style="font-size:20px;font-weight:600">${n}</div><small style="color:#8e8e93">${z.split("/")[0]}</small></div><b data-z="${z}"></b></div>`).join("");
    wtick();
  }
  else if (tab === "s") {
    b.innerHTML = `<div class="sw" id="swd">${fmt(swms())}</div><div class="bts"><button class="cb" id="swl">${sw.run ? "Lap" : "Reset"}</button><button class="cb ${sw.run ? "r" : "g"}" id="sws">${sw.run ? "Stop" : "Start"}</button></div><div id="lps">${sw.laps.map((l, i) => `<div class="wr" style="padding:10px 0"><span>Lap ${sw.laps.length - i}</span><span>${fmt(l)}</span></div>`).join("")}</div>`;
  }
  else {
    const L = tm.run ? tm.left : 0;
    b.innerHTML = tm.run || tm.left ? `<div class="sw" id="tmd">${hms(tm.run ? tm.end - Date.now() : tm.left)}</div><div class="bts"><button class="cb" id="tmc">Cancel</button><button class="cb ${tm.run ? "" : "g"}" id="tms">${tm.run ? "Pause" : "Resume"}</button></div>` : `<div class="big" style="font-size:36px">Timers</div><div class="tm">${["h", "m", "s"].map((u, i) => `<select id="t${u}">${[...Array(i ? 60 : 24).keys()].map(v => `<option value="${v}" ${u === "m" && v === 5 ? "selected" : ""}>${v} ${u}</option>`).join("")}</select>`).join("")}</div><div style="text-align:center"><button class="cb g" id="tmg">Start</button></div>`;
  }
}
const hms = ms => { ms = Math.max(0, Math.ceil(ms / 1e3)); return p2(Math.floor(ms / 3600)) + ":" + p2(Math.floor(ms / 60) % 60) + ":" + p2(ms % 60); };
function wtick() { $$("[data-z]").forEach(e => e.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: e.dataset.z, hour: "2-digit", minute: "2-digit" })); }
$("#cl-body").onclick = e => {
  const t = e.target, id = t.dataset.id;
  if (id !== undefined) {
    const a = alarms.find(a => a.id == id);
    a.o = a.o ? 0 : 1;
    store.set("alarms", alarms);
    rclock();
  }
  if (t.id === "sws") {
    if (sw.run) {
      sw.acc = swms();
      sw.run = 0;
    }
    else {
      sw.t0 = Date.now();
      sw.run = 1;
    }
    rclock();
  }
  if (t.id === "swl") {
    if (sw.run)
      sw.laps.unshift(swms());
    else {
      sw = { run: 0, t0: 0, acc: 0, laps: [] };
    }
    rclock();
  }
  if (t.id === "tmg") {
    const s = +$("#th").value * 3600 + +$("#tm").value * 60 + +$("#ts").value;
    if (s) {
      tm = { run: 1, end: Date.now() + s * 1e3, left: s * 1e3 };
    }
    rclock();
  }
  if (t.id === "tms") {
    if (tm.run) {
      tm.left = tm.end - Date.now();
      tm.run = 0;
    }
    else {
      tm.end = Date.now() + tm.left;
      tm.run = 1;
    }
    rclock();
  }
  if (t.id === "tmc") {
    tm = { run: 0, end: 0, left: 0 };
    rclock();
  }
};
$$(".tabs button").forEach(b => b.onclick = () => { tab = b.dataset.t; rclock(); });
$("#alp").onclick = () => { const v = prompt("New alarm time (24h, e.g. 05:30)", "05:30"); if (/^\d{1,2}:\d{2}$/.test(v || "")) {
  alarms.push({ id: Date.now(), t: v.padStart(5, "0"), o: 1 });
  store.set("alarms", alarms);
  rclock();
} };
$("#rst").onclick = () => $("#ring").classList.remove("on");
setInterval(() => {
  const n = new Date(), hm = p2(n.getHours()) + ":" + p2(n.getMinutes());
  if (n.getSeconds() === 0 && alarms.some(a => a.o && a.t === hm)) {
    $("#ring").firstChild.textContent = "⏰ " + hm;
    $("#ring").classList.add("on");
  }
  if ($("#swd"))
    $("#swd").textContent = fmt(swms());
  if ($("#tmd") && tm.run) {
    const l = tm.end - Date.now();
    $("#tmd").textContent = hms(l);
    if (l <= 0) {
      tm = { run: 0, end: 0, left: 0 };
      $("#ring").firstChild.textContent = "⏲ Timer done";
      $("#ring").classList.add("on");
      rclock();
    }
  }
  if (tab === "w")
    wtick();
}, 100);
rclock();
openApp.clock = rclock;
// ---------- PHOTOS ----------*/
const PHOTO_LIST = [
  { src: "photos_phone/118ab8f95c12d8e182bd4374714f0f1b.jpg", date: "2025-03-12" },
  { src: "photos_phone/178d20f4d2c422c56f3713a0be88d4ca.jpg", date: "2025-04-27" },
  { src: "photos_phone/2f2bf8229d49c8ca49570dc88276ddc3.jpg", date: "2025-05-09" },
  { src: "photos_phone/331ccd096073fb1173826d9d3c41ae89.jpg", date: "2025-06-18" },
  { src: "photos_phone/6c582ad2d4de521f874aee9d0b79685c.jpg", date: "2025-07-02" },
  { src: "photos_phone/7f7e86a79b738cdd7a63fb0f0a467b63.jpg", date: "2025-07-25" },
  { src: "photos_phone/a97991af946de3cd504038de0289b318.jpg", date: "2025-08-11" },
  { src: "photos_phone/aaea5dfd9f809828e024ea8cb98343ac.jpg", date: "2025-08-29" },
  { src: "photos_phone/ccbddcd888df5ba0e4c052e9e8ed70b8.jpg", date: "2025-09-06" },
  { src: "photos_phone/e60ef01d575815dfcd5e50b6fb8fd30f.jpg", date: "2025-09-23" },
];
let photos = PHOTO_LIST.map((p, i) => ({ id: i + 1, s: p.src, t: p.date ? +new Date(p.date + "T12:00") : Date.now() - (PHOTO_LIST.length - i) * 864e5 })), pv = "a";
function shrink(f, cb) { const r = new FileReader(); r.onload = () => { const i = new Image(); i.onload = () => { const k = Math.min(1, 700 / Math.max(i.width, i.height)), c = document.createElement("canvas"); c.width = i.width * k; c.height = i.height * k; c.getContext("2d").drawImage(i, 0, 0, c.width, c.height); cb(c.toDataURL("image/jpeg", .72)); }; i.src = r.result; }; r.readAsDataURL(f); }
function pdate(t) { const d = new Date(t); return d.getDate() + " " + MA[d.getMonth()] + " " + d.getFullYear(); }
function rphotos(bottom) {
  const P = [...photos].sort((a, b) => a.t - b.t), w = $("#pgw");
  if (!P.length) {
    w.innerHTML = '<div class="empty">No photos yet.</div>';
    $("#pdt").textContent = "";
    return;
  }
  if (pv === "a")
    w.innerHTML = '<div class="pg">' + P.map(p => `<img data-id="${p.id}" data-t="${p.t}" src="${p.s}">`).join("") + "</div>";
  else {
    const G = {};
    P.forEach(p => { const d = new Date(p.t), k = pv === "y" ? d.getFullYear() : d.getFullYear() * 100 + d.getMonth(); (G[k] = G[k] || []).push(p); });
    w.innerHTML = '<div class="pgy">' + Object.keys(G).sort().reverse().map(k => { const l = G[k]; return `<div class="yr" data-t="${l[0].t}"><img src="${l[l.length - 1].s}"><b>${pv === "y" ? k : MA[k % 100] + " " + Math.floor(k / 100)}</b></div>`; }).join("") + "</div>";
  }
  if (bottom) {
    const s = $("#pgw");
    s.scrollTop = s.scrollHeight;
  }
  pscroll();
}
function pscroll() { const s = $("#pgw"), I = $$("#pgw img[data-t]"); let t = null; I.forEach(i => { if (i.offsetTop - s.scrollTop <= 130)
  t = i.dataset.t; }); if (!t && I[0])
  t = I[0].dataset.t; $("#pdt").textContent = t ? pdate(+t) : ""; }
$("#pgw").onscroll = pscroll;
$("#pseg").onclick = e => { const v = e.target.dataset.v; if (!v)
  return; pv = v; $$("#pseg span").forEach(x => x.classList.toggle("on", x.dataset.v === v)); rphotos(v === "a"); };
let cur = null;
$("#pgw").onclick = e => {
  const group = e.target.closest(".yr");
  if (group) {
    pv = "a";
    $$("#pseg span").forEach(x => x.classList.toggle("on", x.dataset.v === "a"));
    rphotos();
    const targetTime = Number(group.dataset.t);
    const target = [...$$("#pgw img[data-t]")].find(img => Number(img.dataset.t) >= targetTime);
    if (target) {
      $("#pgw").scrollTop = target.offsetTop - 120;
    }
    return;
  }
  const img = e.target.closest("img[data-id]");
  if (!img)
    return;
  cur = photos.find(p => p.id === Number(img.dataset.id));
  if (!cur)
    return;
  $("#big").style.backgroundImage = `url("${cur.s}")`;
  $("#big").style.display = "block";
  $("#bigbar").style.display = "flex";
  $("#bdate").textContent = pdate(cur.t);
};
$("#bback").onclick = () => { $("#big").style.display = "none"; $("#bigbar").style.display = "none"; };
$("#big").onclick = null;
rphotos(1);
openApp.photos = () => rphotos(1);
// ---------- PHONE ----------
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const AVC = ["#7d8bd6", "#d67db0", "#59a8d4", "#58b97a", "#e39a5a", "#c96a6a", "#9b78d3"];
let avs = {};
function getFixedAvatar(n) {
  const name = String(n).toLowerCase();
  if (name.includes("winter")) {
    return "photos_phone/winter aespa.jpg";
  }
  if (name.includes("kween yasmin")) {
    return "photos_phone/kweenyasmin.jpg";
  }
  return null;
}
function av(n, sz) {
  const st = `width:${sz}px;height:${sz}px;font-size:${Math.round(sz * .42)}px`;
  const d = `data-n="${esc(n)}"`;
  const photo = getFixedAvatar(n);
  if (photo) {
    return `<div class="avt" ${d} style="${st};background-image:url('${photo}');background-size:cover;background-position:center;background-repeat:no-repeat"></div>`;
  }
  const L = /[A-Za-z]/.test(n[0]) ? n[0].toUpperCase() : "👤";
  const h = [...n].reduce((x, y) => x + y.charCodeAt(0), 0) % AVC.length;
  return `<div class="avt" ${d} style="${st};background:${AVC[h]}">${L}</div>`;
}
// recents
let recs = store.get("recs", null) || [{ n: "Winter ❄️", k: "mobile", o: 1, t: dAgo(0, 18, 20) }, { n: "Coach Flores", k: "mobile", o: 0, t: dAgo(1, 17, 5) }, { n: "Coach Amo", k: "mobile", o: 1, t: dAgo(3, 15, 40) }, { n: "Ningning", k: "FaceTime Audio", o: 0, t: dAgo(5, 22, 10) }, { n: "Kween Yasmin Signing Event", k: "FaceTime Audio (Group)", o: 0, t: dAgo(8, 19, 30) }], rf = "a";
function rrec() {
  const q = $("#rq").value.toLowerCase(), L = rf === "m" ? [] : recs.filter(r => r.n.toLowerCase().includes(q));
  $("#rlist").innerHTML = L.length ? L.map(r => `<div class="pr" data-n="${esc(r.n)}">${av(r.n, 52)}<div><b>${esc(r.n)}</b><small>${r.o ? "↗" : "↙"} ${esc(r.k)}</small></div><span class="dt">${fdate(r.t)}</span><span class="inf">ⓘ</span></div>`).join("") : '<div class="empty">' + (rf === "m" ? "No Missed Calls" : "No Recents") + "</div>";
}
$("#rq").oninput = rrec;
$("#rseg").onclick = e => { const f = e.target.dataset.f; if (!f)
  return; rf = f; $$("#rseg span").forEach(x => x.classList.toggle("on", x.dataset.f === f)); rrec(); };
// contacts
let cts = store.get("cts", null) || ["Aeri", "Ate Liza", "Chaeryeong", "Coach Amo", "Coach Flores", "Daddy", "Dr. Angela", "Dr. Lopez", "Hannah", "Hyewon", "Isa", "Jeno", "Lia", "Mark", "Marco", "Minju", "Mommy", "Ningning", "Ryujin", "Winter ❄️", "Wonbin", "Yeji", "Yuna", "Kween Yasmin Signing Event"];
function rcts() {
  const q = $("#cq").value.toLowerCase(), key = x => x.replace(/[^A-Za-z ]/g, "").trim(), L = cts.filter(n => n.toLowerCase().includes(q)).sort((a, b) => key(a).localeCompare(key(b), "en", { sensitivity: "base" }));
  let h = q ? "" : `<div class="pr" data-n="Karina Tuazon" style="padding:12px 0">${av("Karina Tuazon", 60)}<div style="border:0"><b style="font-size:20px">Karina Tuazon</b><small>My Card</small></div></div>`, last = "", ls = [];
  L.forEach(n => { const l = /[A-Za-z]/.test(n[0]) ? n[0].toUpperCase() : "#"; if (l !== last) {
    h += `<div class="sl" data-l="${l}">${l}</div>`;
    last = l;
    ls.push(l);
  } h += `<div class="pr" data-n="${esc(n)}">${av(n, 46)}<div><b style="font-weight:500">${esc(n)}</b></div></div>`; });
  $("#clist").innerHTML = h;
  $("#cidx").innerHTML = ls.map(l => `<span>${l}</span>`).join("");
}
$("#cq").oninput = rcts;
$("#cidx").onclick = e => { const l = e.target.textContent, t = $(`#clist [data-l="${l}"]`); if (t && e.target.tagName === "SPAN")
  $("#clist").scrollTop = t.offsetTop - 4; };
$("#cplus").onclick = () => { const n = (prompt("New contact name") || "").trim(); if (n) {
  cts.push(n);
  store.set("cts", cts);
  rcts();
} };
$("#cback").onclick = () => ptab("r");
// calls
function call(n) {
  $("#calla").innerHTML = av(n, 110);
  $("#calln").textContent = n;
  $("#calls").textContent = "calling…";
  $("#calling").classList.add("on");
  recs.unshift({ n, k: "mobile", o: 1, t: Date.now() });
  store.set("recs", recs);
  rrec();
  setTimeout(() => { if ($("#calling").classList.contains("on"))
    $("#calls").textContent = "ringing…"; }, 1500);
}
$("#cend").onclick = () => $("#calling").classList.remove("on");
$("#pv-r").onclick = $("#pv-c").onclick = e => {
  const r = e.target.closest(".pr");
  if (r && r.dataset.n !== "Karina Tuazon")
    call(r.dataset.n);
};
// keypad
let kn = "";
const KL = { 1: "", 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ", "*": "", 0: "+", "#": "" };
$("#kg").innerHTML = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(k => `<button class="kk" data-k="${k}">${k === "*" ? "✱" : k}<small>${KL[k]}</small></button>`).join("");
function kshow() { $("#kdis").textContent = kn; $("#kdel").style.visibility = kn ? "visible" : "hidden"; }
$("#kg").onclick = e => { const b = e.target.closest("[data-k]"); if (b && kn.length < 15) {
  kn += b.dataset.k;
  kshow();
} };
$("#kdel").onclick = () => { kn = kn.slice(0, -1); kshow(); };
$("#kcall").onclick = () => { if (kn) {
  call(kn);
  kn = "";
  kshow();
} };
// voicemail
let vms = [{ n: "Fourth", t: dAgo(0, 16, 48), d: 12, x: "“absent ka teh?”", u: 1 }, { n: "HEAD NURSE Satang", t: dAgo(1, 10, 15), d: 21, x: "“Hello Phuwin. Pwede ka ba mag-12 hours bukas?”", u: 1 }], vo = null, vp = 0, vt = null;
function rvm() {
  $("#vlist").innerHTML = `<div style="background:#f2f2f7;border-radius:30px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;margin:4px 0 8px;font-weight:600;font-size:15px">Service Provider Voicemail<button class="pill" style="background:#dbe9ff;color:#0a84ff;font-size:14px;padding:8px 12px">Call Service Provider</button></div>` + vms.map((v, i) => `<div class="vr" data-i="${i}">${v.u ? '<i class="ud"></i>' : ""}<div class="tt"><b>${esc(v.n)}</b><span>${fdate(v.t)}<br>00:${p2(v.d)}</span></div><p>${esc(v.x)}</p>${vo === i ? `<div class="vb"><button class="vplay">${vt ? "❚❚" : "▶"}</button><div class="vtr"><i style="width:${vp / v.d * 100}%"></i></div><span>0:${p2(Math.floor(vp))}</span></div>` : ""}</div>`).join("");
  const u = vms.filter(v => v.u).length;
  $("#vbd").textContent = u;
  $("#vbd").style.display = u ? "grid" : "none";
}
$("#vlist").onclick = e => {
  const r = e.target.closest(".vr");
  if (!r)
    return;
  const i = +r.dataset.i;
  if (e.target.closest(".vplay")) {
    if (vt) {
      clearInterval(vt);
      vt = null;
    }
    else
      vt = setInterval(() => { vp += .1; if (vp >= vms[i].d) {
        clearInterval(vt);
        vt = null;
        vp = 0;
      } rvm(); }, 100);
    rvm();
    return;
  }
  clearInterval(vt);
  vt = null;
  vp = 0;
  vo = vo === i ? null : i;
  vms[i].u = 0;
  rvm();
};
function ptab(t) { $$("#ap-phone .pv").forEach(p => p.classList.toggle("on", p.id === "pv-" + t)); $$("#ptabs button").forEach(b => b.classList.toggle("on", b.dataset.t === t)); }
$("#ptabs").onclick = e => { const b = e.target.closest("button"); if (b)
  ptab(b.dataset.t); };
rrec();
rcts();
rvm();
openApp.phone = () => ptab("r");
// ---------- MESSAGES ----------
const Q = (n, u, a, gc) => ({ id: Math.random(), n, u, gc, m: a.map(([w, x, t]) => ({ me: w === 1, s: typeof w === "string" ? w : null, x, t })) });
let threads = store.get("threads", null) || [
  Q("doc pogi", 1, [
    // DAY 5
    [0, "baby duty po ikaw?", dAgo(8, 13, 12)],
    [1, "yes po, otw na me doc pogi", dAgo(8, 13, 14)],
    [0, "okay po. ingat baby. bought you matcha so you dont have to buy", dAgo(8, 13, 15)],
    [1, "okkkk i love you thank you!", dAgo(8, 13, 17)],
    // DAY 8
    [0, "you left your trodat here", dAgo(7, 16, 4)],
    [1, "HALA omg HSDHSFHSHA patabi muna doc hehe", dAgo(7, 16, 6)],
    [0, "hahaha ok got u", dAgo(7, 16, 7)],
    [1, "hehe THANK UUU will read transes po ngayon so i might not reply on time huhu LAB YOU DOKKIE", dAgo(7, 16, 8)],
    // DAY 10
    [1, "ME LAMBA NAMIMISS GUMAWA NG RESEARCH", dAgo(6, 8, 12)],
    [1, "also super proud ako sa research namin na yon kasi nilaban namin para mapublish sha sa indo huhu", dAgo(6, 8, 13)],
    [0, "hi baby! really? published research niyo? im so proud!", dAgo(6, 8, 16)],
    [1, "yes!! u wanna seeeeee", dAgo(6, 8, 17)],
    [0, "ok sure, send link baby", dAgo(6, 8, 18)],
    [1, "https://doi.org/10.70848/cnj.v1i2.13", dAgo(6, 8, 19)],
    // DAY 2
    [0, "give me an example of ace inhibitor", dAgo(4, 21, 5)],
    [0, "hahaha", dAgo(4, 21, 6)],
    [0, "baby where are you haha bawal mag-search", dAgo(4, 21, 7)],
    [1, "HOY DOKKIE HINDI AK NAGSESEARCH teka catopril", dAgo(4, 21, 9)],
    [0, "hahah good. before giving furosemide what should you check first?", dAgo(4, 21, 11)],
    [1, "blood pressure. loop diuretics kasi si furo so technically we cant give it if mababa bp ni pt", dAgo(4, 21, 12)],
    // DAY 3
    [1, "dokkie im at palpitate u want vietnamese?", dAgo(3, 14, 20)],
    [0, "yes pls baby thank u medyo marami pts ngayon i need energy hahaha", dAgo(3, 14, 22)],
    [1, "di nalang pala ako papasok dami pala pt", dAgo(3, 14, 23)],
    [1, "eme lang dokkie dadamayan kita syempre HAHAHAHAHAHA", dAgo(3, 14, 24)],
    // DAY 1
    [0, "nakauwi ka na po?", dAgo(1, 16, 20)],
    [1, "lapit na po. traffic so much T___T", dAgo(1, 16, 23)],
    [0, "kawawa ang baby ko na yan. get plenty of rest muna bago ka mag-review ha?", dAgo(1, 16, 25)],
    [1, "noted dokkie! enjoy night shift HAHAHAHA", dAgo(1, 16, 26)],
    // TODAYh
    [1, "doc pogiiiii", dAgo(0, 18, 10)],
    [0, "yes my love?", dAgo(0, 18, 12)],
    [1, "what are your thoughts sa jeolee hehehehe", dAgo(0, 18, 13)],
    [0, "who's that? hahaha", dAgo(0, 18, 15)],
    [1, "its a girl group anak CHAROT HAHAHAHAHA ship sa pbb!!", dAgo(0, 18, 17)],
    [0, "ay hahaha sorry idk them. you ike them?", dAgo(0, 18, 19)],
    [1, "saks lang. mas gusto ko parin love team natin (✿◡‿◡)", dAgo(0, 18, 20)],
    [0, "naman hahaha our love story is driven by 80% love and 20% duty hahaha", dAgo(0, 18, 22)],
    [1, "sa tunay lang doc pogi WAHAHAHSHA I MISS U KAINIS", dAgo(0, 18, 23)],
    [0, "sleepover later?", dAgo(0, 18, 25)],
    [1, "YAY OK SIGE help me review anatomy", dAgo(0, 18, 26)],
    [0, "sure hahaha", dAgo(0, 18, 27)],
    [0, "bring your notes nalang. see you later baby!", dAgo(0, 18, 28)]
  ]),
  Q("5TH FLR MAIN", 0, [["Fourth", "informing lang po di po ako makakapasok mamaya", dAgo(1, 10, 21)]], 1),
  Q("Est", 0, [[1, "kailan ba tayo magkikita bading", dAgo(1, 16, 25)]]),
  Q("Perth", 0, [[0, "streak natin oy", dAgo(0, 12, 10)]]),
  Q("Aa Mommy", 0, [[0, "Ingat sa duty, darling.", dAgo(0, 9, 10)]]),
  Q("Krit", 0, [[1, "nag-chat sakin teacher mo", dAgo(2, 11, 12)]]),
  Q("AUTOLOADMAX", 0, [[0, "You have been successfully loaded with GOPLUS99.", dAgo(1, 13, 10)]]),
  Q("8080", 0, [[0, "Your promo comes with FREE 4GB of 5G data.", dAgo(5, 10, 12)]])
], curT = null, asThem = false;
const save = () => store.set("threads", threads), last = t => t.m[t.m.length - 1];
  });
  $("#mhav").innerHTML = av(t.n, 64);
  $("#mhn").textContent = t.n + " ›";
  b.scrollTop = b.scrollHeight;
  $("#mwho").style.display = asThem ? "block" : "none";
  $("#mwho").textContent = "Adding messages as " + (t.gc ? "someone else" : t.n) + " · tap ＋ to switch back";
}
$("#mls").onclick = e => { const r = e.target.closest(".mrow"); if (!r || r.classList.contains("st"))
  return; curT = threads.find(t => t.id == r.dataset.id); curT.u = 0; asThem = false; save(); rthread(); rth(); $("#mthr").classList.add("on"); };
$("#mback").onclick = () => { $("#mthr").classList.remove("on"); curT = null; rth(); };
$("#pv-r").onclick = $("#pv-c").onclick = e => {
  const r = e.target.closest(".pr");
  if (r && r.dataset.n !== "Karina Tuazon")
    call(r.dataset.n);
};
$("#mbody").onclick = e => {
  const photo = e.target.closest(".message-photo");
  if (!photo)
    return;
  const viewer = document.createElement("div");
  viewer.style.cssText = `
    position:fixed;
    inset:0;
    z-index:99999;
    background:rgba(0,0,0,0.92);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:20px;
    cursor:zoom-out;
  `;
  const fullImage = document.createElement("img");
  fullImage.src = photo.src;
  fullImage.alt = photo.alt;
  fullImage.style.cssText = `
    max-width:100%;
    max-height:100%;
    width:auto;
    height:auto;
    object-fit:contain;
    border-radius:12px;
  `;
  viewer.appendChild(fullImage);
  document.body.appendChild(viewer);
  viewer.onclick = () => viewer.remove();
};
$("#mplus").onclick = () => { asThem = !asThem; rthread(); };
$("#min").oninput = () => $("#msend").style.display = $("#min").value.trim() ? "inline-flex" : "none";
function msend() {
  const v = $("#min").value.trim();
  if (!v || !curT)
    return;
  let s = null;
  if (asThem && curT.gc) {
    s = prompt("Pasabay kape", "okkk");
    if (!s)
      return;
  }
  curT.m.push({ me: !asThem, s, x: v, t: Date.now() });
  $("#min").value = "";
  $("#msend").style.display = "none";
  save();
  rthread();
}
$("#msend").onclick = msend;
$("#min").onkeydown = e => { if (e.key === "Enter")
  msend(); };
$("#mnew").onclick = () => { return; const n = (prompt("Message to (name)") || "").trim(); if (!n)
  return; let t = threads.find(t => t.n === n); if (!t) {
  t = Q(n, 0, []);
  threads.push(t);
  save();
} curT = t; asThem = false; rthread(); $("#mthr").classList.add("on"); };
rth();
openApp.msg = () => { $("#mthr").classList.remove("on"); curT = null; rth(); };
})();
