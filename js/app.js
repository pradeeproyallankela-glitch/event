// Shared helpers used by every page
function esc(s){ return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function toast(msg, type){
  let t = document.getElementById("toast");
  if(!t){ t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.className = type || "ok"; t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 3200);
}

// "14:30:00" -> "02:30 PM"
function fmtTime(t){
  if(!t) return "";
  const [h, m] = t.split(":"); const hh = +h;
  return String(hh % 12 || 12).padStart(2, "0") + ":" + m + " " + (hh >= 12 ? "PM" : "AM");
}
// "2026-11-05" -> "05 Nov 2026"
function fmtDate(d){
  if(!d) return "";
  const [y, m, day] = String(d).slice(0, 10).split("-");
  return day + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m - 1] + " " + y;
}

// Fall back to the gradient if a remote photo cannot load (offline etc.)
document.querySelectorAll("[data-img]").forEach(el => {
  const url = el.dataset.img, i = new Image();
  i.onload = () => { el.style.backgroundImage = `url('${url}')`; };
  i.src = url;
});

// Reads response; throws Error(message) on HTTP errors
function check(r){ return r.ok ? r.text() : r.text().then(m => { throw new Error(m || "Request failed"); }); }
