const COLORS={designer:['#81a6de','#456ab5'],healthcare:['#689139','#d8b152'],community:['#ca7487','#d8b152'],research:['#456ab5','#81a6de'],impact:['#d8b152','#ca7487']};
const CATEGORY_LABELS={designer:'Designer',healthcare:'Healthcare Innovator',community:'Community Advocate',research:'Biomedical Researcher',impact:'Impact Strategist'};

const DEFAULT_PROJECTS=[
  {id:'design-systems',title:'Monet UI System',category:'designer',year:'2025',blurb:'A modern design system inspired by watercolor textures and soft gradients.',
   description:'Describe the problem, your role, constraints, process, and results.\n\nAdd links and a file embed on the right.',
   embedSrc:'assets/sample.pdf',links:[{label:'Case Study',href:'#'},{label:'Figma',href:'#'}],height:'tall'},
  {id:'care-pathways',title:'Care Pathways Prototype',category:'healthcare',year:'2024',blurb:'A patient-centered workflow prototype for simplified onboarding and follow-ups.',
   description:'Explain the healthcare context, your research insights, and what you built.',embedSrc:'assets/sample.pdf',links:[{label:'Deck',href:'#'}],height:'medium'},
  {id:'community-program',title:'Community Outreach Program',category:'community',year:'2023',blurb:'A scalable initiative focused on access, inclusion, and engagement.',
   description:'Highlight how you built relationships, organized activities, and measured impact.',embedSrc:'assets/sample.pdf',links:[{label:'Write-up',href:'#'}],height:'short'},
  {id:'biomed-study',title:'Biomedical Study Snapshot',category:'research',year:'2025',blurb:'A research project summary with methods, visuals, and key findings.',
   description:'Summarize methods, hypothesis, and results. Include a poster or PDF on the right.',embedSrc:'assets/sample.pdf',links:[{label:'Poster',href:'#'}],height:'medium'},
  {id:'impact-strategy',title:'Impact Strategy Playbook',category:'impact',year:'2024',blurb:'A strategy framework for prioritizing interventions and tracking outcomes.',
   description:'Show how you set goals, built metrics, and aligned stakeholders.',embedSrc:'assets/sample.pdf',links:[{label:'Framework',href:'#'}],height:'tall'},
];

// -------- Projects persistence (local) --------
// If you add/edit projects via the Admin panel, they are saved to localStorage for THIS browser.
// To publish those changes for everyone, use "Export JSON" and commit the downloaded file,
// then set LOAD_PROJECTS_FROM_JSON = true and keep projects.json in your repo.
const STORAGE_KEY = "portfolioProjects.v1";
const PROJECTS_JSON_PATH = "projects.json"; // optional
const LOAD_PROJECTS_FROM_JSON = false;       // set true if you commit projects.json

let projects = null;

function safeJsonParse(text){
  try { return JSON.parse(text); } catch { return null; }
}

async function loadProjects(){
  // 1) optional JSON file
  if (LOAD_PROJECTS_FROM_JSON){
    try{
      const res = await fetch(PROJECTS_JSON_PATH, { cache: "no-store" });
      if(res.ok){
        const data = await res.json();
        if(Array.isArray(data)) return data;
      }
    }catch{}
  }

  // 2) localStorage override
  const saved = safeJsonParse(localStorage.getItem(STORAGE_KEY) || "");
  if (Array.isArray(saved) && saved.length) return saved;

  // 3) fallback default
  return DEFAULT_PROJECTS;
}

function saveProjects(next){
  projects = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

// -------- Tile gradient opacity helpers --------
function hexToRgba(hex, a){
  const h = hex.replace("#","").trim();
  const full = h.length === 3 ? h.split("").map(c=>c+c).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}



// Cursor-reveal menu (near top-right)
const menuWrap=document.getElementById('menuWrap');
const menuBtn=document.getElementById('menuBtn');
const menu=document.getElementById('menu');
let menuOpen=false;
const setMenuOpen=(o)=>{menuOpen=o;menu.classList.toggle('open',o)};
menuBtn.addEventListener('click',(e)=>{e.stopPropagation();setMenuOpen(!menuOpen)});
document.addEventListener('click',()=>setMenuOpen(false));
document.addEventListener('mousemove',(e)=>{
  const t=140;const nearTop=e.clientY<t;const nearRight=(window.innerWidth-e.clientX)<t;
  menuWrap.classList.toggle('visible',nearTop&&nearRight);
});

// Button hover glow follows cursor
document.addEventListener('mousemove',(e)=>{
  const btn=e.target.closest?.('.btn');if(!btn) return;
  const r=btn.getBoundingClientRect();btn.style.setProperty('--mx',(((e.clientX-r.left)/r.width)*100)+'%');
  btn.style.setProperty('--my',(((e.clientY-r.top)/r.height)*100)+'%');
});

// Hero melt on scroll
const hero=document.querySelector('.hero');
const gallery=document.querySelector('.gallery');
const meltTargets=document.querySelectorAll('.melt-target');
const turbulence=document.getElementById('turbulence');
const displace=document.getElementById('displace');
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function updateMelt(){
  const rect=hero.getBoundingClientRect();const vh=window.innerHeight||1;
  const p=clamp((0-rect.top)/(vh*0.75),0,1);
  displace.setAttribute('scale',String(Math.round(p*55)));
  turbulence.setAttribute('baseFrequency',String(0.012+p*0.020));
  const op=1-p*1.10;const y=p*-10;
  meltTargets.forEach(el=>{el.style.opacity=String(clamp(op,0,1));el.style.transform=`translateY(${y}px)`;});
  if(p>0.25) gallery.classList.add('visible'); else gallery.classList.remove('visible');
  requestAnimationFrame(updateMelt);
}
requestAnimationFrame(updateMelt);

// Masonry tiles
const masonry=document.getElementById('masonry');
const gradientForCategory=(cat)=>{
  const pair=COLORS[cat]||['#81a6de','#ca7487'];
  // Higher-opacity gradients (less "glassy")
  const a1 = 0.78;
  const a2 = 0.72;
  const a3 = 0.22;
  return `radial-gradient(120% 90% at 25% 20%, ${hexToRgba(pair[0], a1)}, transparent 55%),
          radial-gradient(90% 70% at 70% 60%, ${hexToRgba(pair[1], a2)}, transparent 60%),
          radial-gradient(120% 90% at 40% 85%, ${hexToRgba('#ffffff', a3)}, transparent 60%)`;
};
const tileHeightClass=(h)=>h==='tall'?'tile--tall':h==='short'?'tile--short':'tile--medium';
const styleEl=document.createElement('style');
styleEl.textContent='.tile--short{min-height:170px}.tile--medium{min-height:220px}.tile--tall{min-height:300px}';
document.head.appendChild(styleEl);

function renderTiles(items){
  masonry.innerHTML='';
  items.forEach(p=>{
    const tile=document.createElement('article');
    tile.className=`tile ${tileHeightClass(p.height)}`;
    tile.setAttribute('role','button');tile.setAttribute('tabindex','0');tile.dataset.projectId=p.id;

    const grad=document.createElement('div');grad.className='tile-grad';grad.style.background=gradientForCategory(p.category);
    const inner=document.createElement('div');inner.className='tile-inner';

    const pill=document.createElement('div');pill.className='tile-pill';
    pill.innerHTML=`<span>${CATEGORY_LABELS[p.category]||'Project'}</span><span style="opacity:.65">•</span><span>${p.year||''}</span>`;

    const title=document.createElement('h3');title.className='tile-title';title.textContent=p.title;
    const desc=document.createElement('p');desc.className='tile-desc';desc.textContent=p.blurb;

    inner.appendChild(pill);inner.appendChild(title);inner.appendChild(desc);
    tile.appendChild(grad);tile.appendChild(inner);

    tile.addEventListener('click',()=>openDetail(p.id));
    tile.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(p.id);}});

    tile.addEventListener('mousemove',(e)=>{
      const r=tile.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width;const py=(e.clientY-r.top)/r.height;
      const tiltX=(py-0.5)*-10;const tiltY=(px-0.5)*12;
      tile.style.transform=`rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px) scale(1.01)`;
    });
    tile.addEventListener('mouseleave',()=>{tile.style.transform='';});

    masonry.appendChild(tile);
  });
}
(async function init(){
  projects = await loadProjects();
  renderTiles(projects);
})();

// Detail view
const detail=document.getElementById('detail');
const detailTitle=document.getElementById('detailTitle');
const detailMeta=document.getElementById('detailMeta');
const detailDesc=document.getElementById('detailDesc');
const detailLinks=document.getElementById('detailLinks');
const detailFrame=document.getElementById('detailFrame');
const backBtn=document.getElementById('backBtn');

function openDetail(projectId){
  const p=projects.find(x=>x.id===projectId); if(!p) return;
  document.querySelector('.gallery').classList.add('hidden');
  detail.classList.remove('hidden');
  detailTitle.textContent=p.title;
  detailMeta.textContent=`${CATEGORY_LABELS[p.category]||'Project'} • ${p.year||''}`;
  detailDesc.textContent=p.description;
  detailLinks.innerHTML='';
  (p.links||[]).forEach(l=>{
    const a=document.createElement('a');a.className='btn btn-pill';a.href=l.href;a.target='_blank';a.rel='noreferrer';a.textContent=l.label;
    detailLinks.appendChild(a);
  });
  detailFrame.src=p.embedSrc||'assets/sample.pdf';
  history.replaceState({},'',`#project-${p.id}`);
  window.scrollTo({top:0,behavior:'smooth'});
}
function closeDetail(){
  detail.classList.add('hidden');
  document.querySelector('.gallery').classList.remove('hidden');
  history.replaceState({},'','#projects');
  window.scrollTo({top:document.getElementById('projects').offsetTop-8,behavior:'smooth'});
}
backBtn.addEventListener('click',closeDetail);
(function bootRoute(){const h=(location.hash||'').trim();if(h.startsWith('#project-')) openDetail(h.replace('#project-',''));})();

document.querySelectorAll('.taglink').forEach(a=>{
  a.addEventListener('click',()=>setTimeout(()=>document.getElementById('projects').scrollIntoView({behavior:'smooth'}),60));
});



// ---------------- Admin panel (client-side) ----------------
// IMPORTANT: On a static GitHub Pages site, this is NOT real security.
// It only hides the UI and stores edits in localStorage for your browser.
// For real security + write access, use a backend/CMS (Netlify CMS, Decap CMS, etc.).
const ADMIN_SESSION_KEY = "portfolioAdmin.authed";
const ADMIN_PASSWORD_HASH = "REPLACE_WITH_YOUR_SHA256_HASH"; 
// How to set:
// 1) Open your site, press F12 -> Console
// 2) Run:  await window.__hash("your-new-password")
// 3) Copy the printed hash string into ADMIN_PASSWORD_HASH above.

window.__hash = async (pw) => {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  const hex = arr.map(b=>b.toString(16).padStart(2,"0")).join("");
  console.log(hex);
  return hex;
};

const adminFab = document.getElementById("adminFab");
const adminOverlay = document.getElementById("adminOverlay");
const adminClose = document.getElementById("adminClose");
const adminLoginOverlay = document.getElementById("adminLoginOverlay");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPw = document.getElementById("adminPw");
const adminLoginMsg = document.getElementById("adminLoginMsg");

const form = {
  id: document.getElementById("p_id"),
  title: document.getElementById("p_title"),
  category: document.getElementById("p_category"),
  year: document.getElementById("p_year"),
  blurb: document.getElementById("p_blurb"),
  description: document.getElementById("p_description"),
  embedSrc: document.getElementById("p_embedSrc"),
  links: document.getElementById("p_links"),
  height: document.getElementById("p_height"),
};

const adminList = document.getElementById("adminList");
const adminSaveBtn = document.getElementById("adminSave");
const adminResetBtn = document.getElementById("adminReset");
const adminDeleteBtn = document.getElementById("adminDelete");
const adminExportBtn = document.getElementById("adminExport");
const adminImportBtn = document.getElementById("adminImport");
const adminImportFile = document.getElementById("adminImportFile");
const adminClearLocalBtn = document.getElementById("adminClearLocal");

let editingId = null;

function isAuthed(){
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}
function setAuthed(v){
  if(v) sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  else sessionStorage.removeItem(ADMIN_SESSION_KEY);
  adminFab.classList.toggle("visible", isAuthed());
}

async function checkPassword(pw){
  if (!ADMIN_PASSWORD_HASH || ADMIN_PASSWORD_HASH === "REPLACE_WITH_YOUR_SHA256_HASH") return false;
  const hash = await window.__hash(pw);
  return hash === ADMIN_PASSWORD_HASH;
}

function openAdmin(){
  if(!isAuthed()){
    adminLoginOverlay.classList.add("open");
    adminPw.value = "";
    adminPw.focus();
    adminLoginMsg.textContent = "";
    return;
  }
  adminOverlay.classList.add("open");
  renderAdminList();
}

function closeAdmin(){
  adminOverlay.classList.remove("open");
}
function closeLogin(){
  adminLoginOverlay.classList.remove("open");
}

adminFab?.addEventListener("click", openAdmin);
adminClose?.addEventListener("click", closeAdmin);
adminOverlay?.addEventListener("click", (e)=>{ if(e.target === adminOverlay) closeAdmin(); });

adminLoginOverlay?.addEventListener("click", (e)=>{ if(e.target === adminLoginOverlay) closeLogin(); });

adminLoginForm?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const pw = adminPw.value || "";
  const ok = await checkPassword(pw);
  if(ok){
    setAuthed(true);
    closeLogin();
    openAdmin();
  }else{
    adminLoginMsg.textContent = "Incorrect password.";
  }
});

// Secret shortcut: Ctrl/⌘ + Shift + A
document.addEventListener("keydown", (e)=>{
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const mod = isMac ? e.metaKey : e.ctrlKey;
  if(mod && e.shiftKey && (e.key.toLowerCase() === "a")){
    e.preventDefault();
    openAdmin();
  }
});

// Also: triple click your name
const heroName = document.querySelector(".hero-name");
heroName?.addEventListener("click", (e)=>{
  if(e.detail === 3) openAdmin();
});

// ---------- Admin CRUD ----------
function clearForm(){
  editingId = null;
  form.id.value = "";
  form.title.value = "";
  form.category.value = "designer";
  form.year.value = "";
  form.blurb.value = "";
  form.description.value = "";
  form.embedSrc.value = "";
  form.links.value = "";
  form.height.value = "medium";
  adminDeleteBtn.disabled = true;
}

function parseLinks(text){
  // One per line: Label | https://...
  const lines = (text || "").split("\n").map(s=>s.trim()).filter(Boolean);
  return lines.map(line=>{
    const [label, href] = line.split("|").map(s=>s.trim());
    if(!href) return null;
    return { label: label || "Link", href };
  }).filter(Boolean);
}

function toSlug(text){
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || ("p-" + Math.random().toString(16).slice(2,8));
}

function upsertProject(){
  const id = (editingId || form.id.value || toSlug(form.title.value));
  const next = {
    id,
    title: form.title.value.trim() || "Untitled Project",
    category: form.category.value,
    year: form.year.value.trim(),
    blurb: form.blurb.value.trim(),
    description: form.description.value.trim(),
    embedSrc: form.embedSrc.value.trim(),
    links: parseLinks(form.links.value),
    height: form.height.value,
  };

  // Update or insert
  const idx = projects.findIndex(p=>p.id===id);
  const updated = [...projects];
  if(idx >= 0) updated[idx] = next;
  else updated.unshift(next);

  saveProjects(updated);
  renderTiles(updated);
  renderAdminList();
  clearForm();
}

function deleteProject(){
  if(!editingId) return;
  const updated = projects.filter(p=>p.id !== editingId);
  saveProjects(updated);
  renderTiles(updated);
  renderAdminList();
  clearForm();
}

function editProject(id){
  const p = projects.find(x=>x.id===id);
  if(!p) return;
  editingId = id;
  form.id.value = p.id || "";
  form.title.value = p.title || "";
  form.category.value = p.category || "designer";
  form.year.value = p.year || "";
  form.blurb.value = p.blurb || "";
  form.description.value = p.description || "";
  form.embedSrc.value = p.embedSrc || "";
  form.links.value = (p.links||[]).map(l=>`${l.label} | ${l.href}`).join("\n");
  form.height.value = p.height || "medium";
  adminDeleteBtn.disabled = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAdminList(){
  if(!adminList) return;
  adminList.innerHTML = "";
  const items = projects || [];
  items.forEach(p=>{
    const row = document.createElement("div");
    row.className = "admin-item";
    row.innerHTML = `
      <div>
        <strong>${p.title || "Untitled"}</strong>
        <small>${(CATEGORY_LABELS[p.category]||"Project")} • ${p.year || ""} • id: ${p.id}</small>
      </div>
      <div class="admin-actions">
        <button class="btn btn-pill" data-act="edit" data-id="${p.id}">Edit</button>
        <button class="btn btn-pill" data-act="open" data-id="${p.id}">Open</button>
      </div>
    `;
    row.addEventListener("click",(e)=>{
      const btn = e.target.closest("button[data-act]");
      if(!btn) return;
      const act = btn.dataset.act;
      const id = btn.dataset.id;
      if(act==="edit") editProject(id);
      if(act==="open") openDetail(id);
    });
    adminList.appendChild(row);
  });
}

adminSaveBtn?.addEventListener("click", upsertProject);
adminResetBtn?.addEventListener("click", clearForm);
adminDeleteBtn?.addEventListener("click", deleteProject);

adminExportBtn?.addEventListener("click", ()=>{
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "projects.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

adminImportBtn?.addEventListener("click", ()=> adminImportFile.click());
adminImportFile?.addEventListener("change", async ()=>{
  const file = adminImportFile.files?.[0];
  if(!file) return;
  const text = await file.text();
  const data = safeJsonParse(text);
  if(Array.isArray(data)){
    saveProjects(data);
    renderTiles(data);
    renderAdminList();
    clearForm();
  }else{
    alert("That file doesn't look like a projects JSON array.");
  }
  adminImportFile.value = "";
});

adminClearLocalBtn?.addEventListener("click", ()=>{
  if(!confirm("Clear locally saved projects for this browser and revert to defaults?")) return;
  localStorage.removeItem(STORAGE_KEY);
  (async ()=>{
    projects = await loadProjects();
    renderTiles(projects);
    renderAdminList();
    clearForm();
  })();
});

// Set initial auth state (session-based)
setAuthed(isAuthed());

document.getElementById('year').textContent=String(new Date().getFullYear());
