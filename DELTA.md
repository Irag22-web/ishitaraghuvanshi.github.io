# Portfolio Admin Update — Delta (commented)

## What changed (high level)
- Split inline CSS/JS out of index.html into styles.css and script.js.
- Added an Admin panel (Ctrl/⌘+Shift+A or triple-click the name) with a password gate.
- Admin can add/edit/delete projects and set embedSrc/links from the frontend.
- Edits are stored in localStorage for *your browser* (static-sites can't truly "save to GitHub" without a backend).
- Added Import/Export so you can publish changes by committing projects.json.
- Increased tile color opacity / reduced glassy overlay.

## Security note
This is a *client-side privacy gate*, not real security. Anyone can view your repo and read files.
For true authentication + write access, you need a backend or CMS (e.g., Decap/Netlify CMS).

---

## index.html diff
--- index.html (before)+++ index.html (after)@@ -7,106 +7,10 @@   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,700&family=Inter:wght@300;400;600;800&family=Caveat:wght@400;600&display=swap" rel="stylesheet">
-  <style>
-    :root{--bg:#06060a;--fg:#f3f5ff;--muted:rgba(243,245,255,.68);--c1:#81a6de;--c2:#689139;--c3:#ca7487;--c4:#456ab5;--c5:#d8b152;--glass:rgba(255,255,255,.06);--glass2:rgba(255,255,255,.10);--stroke:rgba(255,255,255,.12);--shadow:0 20px 60px rgba(0,0,0,.55);--radius-xl:24px;--radius-lg:18px;--ease:cubic-bezier(.2,.8,.2,1);}
-    *{box-sizing:border-box} html,body{height:100%}
-    body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--fg);
-      background:radial-gradient(1400px 900px at 70% 20%, rgba(129,166,222,.18), transparent 60%),
-               radial-gradient(1100px 800px at 20% 25%, rgba(69,106,181,.16), transparent 60%),
-               radial-gradient(1100px 900px at 35% 75%, rgba(202,116,135,.15), transparent 62%),
-               radial-gradient(900px 700px at 72% 78%, rgba(104,145,57,.14), transparent 62%),
-               radial-gradient(1000px 700px at 40% 88%, rgba(216,177,82,.10), transparent 62%),
-               var(--bg);overflow-x:hidden;}
-    .visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
-    .bg-blobs{position:fixed;inset:0;z-index:-3;pointer-events:none;overflow:hidden}
-    .blob{position:absolute;filter:blur(48px);opacity:.52;mix-blend-mode:screen;border-radius:999px;animation:floaty 12s var(--ease) infinite alternate}
-    .b1{width:560px;height:560px;left:-160px;top:80px;background:radial-gradient(circle at 30% 30%, rgba(129,166,222,.95), rgba(69,106,181,0) 70%)}
-    .b2{width:620px;height:620px;right:-220px;top:140px;background:radial-gradient(circle at 40% 40%, rgba(202,116,135,.85), rgba(7,7,10,0) 70%);animation-delay:-2s}
-    .b3{width:700px;height:700px;left:8%;bottom:-320px;background:radial-gradient(circle at 45% 45%, rgba(104,145,57,.8), rgba(7,7,10,0) 70%);animation-delay:-4s}
-    .b4{width:580px;height:580px;right:12%;bottom:-260px;background:radial-gradient(circle at 45% 45%, rgba(129,166,222,.78), rgba(7,7,10,0) 70%);animation-delay:-1s}
-    @keyframes floaty{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(0,-18px,0) scale(1.03)}}
-    .paper-grain{position:absolute;inset:0;background-image:url("assets/grain.svg");opacity:.22;mix-blend-mode:overlay}
-    .pond{position:fixed;inset:0;z-index:-2;pointer-events:none;overflow:hidden}
-    .pond-item{position:absolute;width:var(--size,140px);height:auto;opacity:var(--op,.55);transform:translate3d(0,0,0) rotate(var(--rot,0deg));filter:drop-shadow(0 18px 40px rgba(0,0,0,.6));transition:transform 260ms var(--ease),opacity 260ms var(--ease);pointer-events:auto}
-    .pond-item:hover{opacity:min(0.95, calc(var(--op, .55) + 0.2));animation:wobble 900ms var(--ease) 1;transform:translate3d(0,-2px,0) rotate(calc(var(--rot,0deg) + 2deg)) scale(1.03)}
-    @keyframes wobble{0%{transform:translate3d(0,0,0) rotate(var(--rot,0deg))}25%{transform:translate3d(1px,-1px,0) rotate(calc(var(--rot,0deg) + 2.5deg))}55%{transform:translate3d(-1px,-2px,0) rotate(calc(var(--rot,0deg) - 2deg))}80%{transform:translate3d(0,-1px,0) rotate(calc(var(--rot,0deg) + 1.2deg))}100%{transform:translate3d(0,0,0) rotate(var(--rot,0deg))}}
-    .topbar{position:fixed;top:0;left:0;width:100%;padding:18px;display:flex;justify-content:flex-end;z-index:50;pointer-events:none}
-    .menu-wrap{pointer-events:auto;position:relative;opacity:0;transform:translateY(-8px);transition:opacity 240ms var(--ease),transform 240ms var(--ease)}
-    .menu-wrap.visible{opacity:1;transform:translateY(0)}
-    .menu{position:absolute;right:0;top:52px;display:flex;gap:10px;padding:12px;background:rgba(0,0,0,.35);border:1px solid var(--stroke);border-radius:999px;box-shadow:var(--shadow);backdrop-filter:blur(10px);opacity:0;transform:translateY(-6px) scale(.98);pointer-events:none;transition:opacity 220ms var(--ease),transform 220ms var(--ease)}
-    .menu.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
-    .btn{border:1px solid var(--stroke);background:var(--glass);color:var(--fg);padding:12px 14px;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;gap:10px;text-decoration:none;user-select:none;transition:transform 220ms var(--ease),background 220ms var(--ease),border-color 220ms var(--ease);position:relative;overflow:hidden;will-change:transform}
-    .btn::after{content:"";position:absolute;inset:-40%;background:radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.22), transparent 45%);transform:scale(.9);opacity:0;transition:opacity 220ms var(--ease),transform 220ms var(--ease)}
-    .btn:hover{transform:translateY(-1px) scale(1.035);background:var(--glass2);border-color:rgba(255,255,255,.22)}
-    .btn:hover::after{opacity:1;transform:scale(1)}
-    .btn:active{transform:translateY(0) scale(.99)}
-    .btn-ghost{padding:10px 12px}.btn-pill{padding:10px 14px}.menu-btn{padding:10px 14px}
-    .menu-icon{width:18px;height:12px;border-top:2px solid rgba(243,245,255,.9);border-bottom:2px solid rgba(243,245,255,.9);position:relative;display:inline-block}
-    .menu-icon::before{content:"";position:absolute;left:0;right:0;top:4px;border-top:2px solid rgba(243,245,255,.9)}
-    .menu-label{font-size:13px;letter-spacing:.04em;opacity:.9}
-    main{min-height:100vh}
-    .hero{min-height:100vh;display:grid;place-items:center;padding:0 18px}
-    .hero-inner{width:min(1000px,92vw);text-align:center}
-    .hero-name{font-family:Fraunces,ui-serif,Georgia,serif;font-size:clamp(44px,7vw,90px);font-weight:700;letter-spacing:-.02em;margin:0 0 14px;line-height:1.03;text-shadow:0 20px 70px rgba(0,0,0,.55);position:relative}
-    .hero-name::after{content:"";position:absolute;inset:-10px -20px;background:radial-gradient(70% 70% at 20% 30%, rgba(129,166,222,.55), transparent 60%),radial-gradient(70% 70% at 55% 40%, rgba(202,116,135,.42), transparent 60%),radial-gradient(70% 70% at 80% 55%, rgba(104,145,57,.28), transparent 60%);filter:blur(14px);opacity:.58;z-index:-1}
-    .hero-tags{margin:0 auto;width:min(980px,92vw);font-size:clamp(14px,1.7vw,18px);font-weight:400;color:var(--muted);line-height:1.6}
-    .dot{padding:0 8px;opacity:.7}
-    .taglink{color:rgba(243,245,255,.86);text-decoration:none;border-bottom:1px solid rgba(243,245,255,.2);transition:border-color 220ms var(--ease),color 220ms var(--ease)}
-    .taglink:hover{color:#fff;border-color:rgba(255,255,255,.5)}
-    .melt-target{filter:url(#meltFilter);will-change:opacity,transform,filter}
-    .hero-hint{margin-top:34px;display:grid;gap:12px;place-items:center;opacity:.75}
-    .hint-pill{font-size:12px;letter-spacing:.2em;text-transform:uppercase;border:1px solid rgba(255,255,255,.14);padding:10px 14px;border-radius:999px;background:rgba(255,255,255,.05)}
-    .hint-line{width:1px;height:50px;background:linear-gradient(to bottom, rgba(255,255,255,.55), rgba(255,255,255,0));border-radius:999px}
-    .gallery{padding:42px 18px 96px;opacity:0;transform:translateY(12px);transition:opacity 600ms var(--ease),transform 600ms var(--ease)}
-    .gallery.visible{opacity:1;transform:translateY(0)}
-    .gallery-head{width:min(1100px,92vw);margin:0 auto 22px}
-    .section-title{font-size:22px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 8px;opacity:.88}
-    .section-subtitle{margin:0;color:var(--muted)}
-    .masonry{width:min(1100px,92vw);margin:22px auto 0;column-count:1;column-gap:16px}
-    @media (min-width:720px){.masonry{column-count:2}} @media (min-width:1040px){.masonry{column-count:3}}
-    .tile{break-inside:avoid;margin:0 0 16px;border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);box-shadow:0 18px 60px rgba(0,0,0,.5);transform-style:preserve-3d;perspective:900px;cursor:pointer;overflow:hidden;position:relative;transition:transform 280ms var(--ease),border-color 280ms var(--ease),background 280ms var(--ease)}
-    .tile::before{content:"";position:absolute;inset:-40%;background:radial-gradient(circle at 25% 30%, rgba(255,255,255,.24), transparent 36%),radial-gradient(circle at 70% 55%, rgba(255,255,255,.18), transparent 40%),radial-gradient(circle at 40% 75%, rgba(255,255,255,.10), transparent 45%);opacity:.55;mix-blend-mode:overlay;transform:translateZ(30px);pointer-events:none}
-    .tile:hover{border-color:rgba(255,255,255,.24);background:rgba(255,255,255,.07)}
-    .tile-inner{padding:18px 18px 20px;transform:translateZ(40px)}
-    .tile-pill{display:inline-flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:8px 12px;border-radius:999px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(10px)}
-    .tile-title{margin:12px 0 8px;font-size:18px;letter-spacing:-.01em}
-    .tile-desc{margin:0;color:var(--muted);line-height:1.55}
-    .tile-grad{position:absolute;inset:0;opacity:.85;mix-blend-mode:screen;pointer-events:none}
-    .tile--short{min-height:170px}.tile--medium{min-height:220px}.tile--tall{min-height:300px}
-    .hidden{display:none}
-    .detail{padding:26px 18px 86px}
-    .detail-top{width:min(1100px,92vw);margin:0 auto 14px;display:flex}
-    .back-btn .back-arrow{font-size:18px;transform:translateY(-1px)}
-    .detail-grid{width:min(1100px,92vw);margin:0 auto;display:grid;gap:16px;grid-template-columns:1fr}
-    @media (min-width:980px){.detail-grid{grid-template-columns:.95fr 1.05fr;gap:18px}}
-    .detail-left,.detail-right{border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);box-shadow:var(--shadow);backdrop-filter:blur(10px)}
-    .detail-left{padding:20px 20px 24px}
-    .detail-title{margin:0 0 6px;font-size:30px;letter-spacing:-.02em}
-    .detail-meta{margin:0 0 14px;color:var(--muted)}
-    .detail-desc{margin:0 0 18px;color:rgba(243,245,255,.86);line-height:1.7;white-space:pre-wrap}
-    .detail-links{display:flex;flex-wrap:wrap;gap:10px}
-    .embed-card{padding:12px}
-    .embed-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 8px 12px}
-    .embed-pill{font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.88}
-    .embed-note{font-size:12px;color:var(--muted);text-align:right}
-    .embed-frame{width:100%;height:min(62vh,640px);border:1px solid rgba(255,255,255,.14);border-radius:var(--radius-lg);background:rgba(0,0,0,.35)}
-    .about{padding:18px 18px 64px}
-    .about-inner{width:min(1100px,92vw);margin:0 auto}
-    .about-card{display:grid;grid-template-columns:1fr;gap:16px;border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);box-shadow:var(--shadow);backdrop-filter:blur(10px);padding:18px}
-    @media (min-width:860px){.about-card{grid-template-columns:.8fr 1.2fr;gap:18px;padding:20px}}
-    .about-photo-wrap{border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.35);display:grid;place-items:center;padding:12px;overflow:hidden}
-    .about-photo{width:100%;max-width:420px;height:auto;opacity:.95;filter:grayscale(1) contrast(1.05)}
-    .handwritten{font-family:Caveat,cursive;font-size:clamp(20px,2.3vw,30px);line-height:1.25;margin:10px 0 6px;color:rgba(243,245,255,.92)}
-    .small{margin:0;color:var(--muted)}
-    .footer{margin-top:18px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;color:var(--muted)}
-    .footer-dot{opacity:.5}
-    .footer-link{color:rgba(243,245,255,.86);text-decoration:none;border-bottom:1px solid rgba(243,245,255,.2)}
-    .footer-link:hover{border-color:rgba(255,255,255,.55)}
-    @media (prefers-reduced-motion: reduce){*{animation:none !important; transition:none !important; scroll-behavior:auto !important;}}
-  </style>
+  <link rel="stylesheet" href="styles.css" />
 </head>
 <body>
-  <svg class="visually-hidden" aria-hidden="true">
+<svg class="visually-hidden" aria-hidden="true">
     <filter id="meltFilter">
       <feTurbulence id="turbulence" type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="8" result="noise"/>
       <feDisplacementMap id="displace" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G"/>
@@ -199,213 +103,129 @@       </div>
     </section>
   </main>
-
-  <script>
-    const COLORS={designer:['#81a6de','#456ab5'],healthcare:['#689139','#d8b152'],community:['#ca7487','#d8b152'],research:['#456ab5','#81a6de'],impact:['#d8b152','#ca7487']};
-    const CATEGORY_LABELS={designer:'Designer',healthcare:'Healthcare Innovator',community:'Community Advocate',research:'Biomedical Researcher',impact:'Impact Strategist'};
-    
-    // Lily wobble (cloud-style spring repel + gentle scroll drift)
-    // Inspired by your cloud snippet: nearby cursor repels, motion springs back.
-    const lilyItems = Array.from(document.querySelectorAll('.pond-item'));
-    const lilyState = new Map();
-
-    const springCfg = { stiffness: 0.12, damping: 0.82 }; // tuned for "soft watercolor"
-    const maxDist = 320; // px radius of influence
-    const maxForce = 28; // px max offset
-
-    function initLily(){
-      lilyItems.forEach((el)=>{
-        const rect = el.getBoundingClientRect();
-        // store base position via CSS left/top percent; offsets start at 0
-        lilyState.set(el, { x:0, y:0, vx:0, vy:0, tx:0, ty:0, cx: rect.left + rect.width/2, cy: rect.top + rect.height/2, speed: parseFloat(el.dataset.speed||'0.25') });
-      });
-    }
-    initLily();
-
-    function updateCenters(){
-      lilyItems.forEach((el)=>{
-        const rect = el.getBoundingClientRect();
-        const s = lilyState.get(el);
-        if(!s) return;
-        s.cx = rect.left + rect.width/2;
-        s.cy = rect.top + rect.height/2;
-      });
-    }
-
-    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
-    window.addEventListener('mousemove', (e)=>{ mouseX = e.clientX; mouseY = e.clientY; });
-
-    window.addEventListener('scroll', ()=>{
-      // no-op; scroll is read in RAF for smoothness
-    }, {passive:true});
-
-    function lilyTick(){
-      const scrollY = window.scrollY || 0;
-
-      lilyItems.forEach((el)=>{
-        const s = lilyState.get(el);
-        if(!s) return;
-
-        // cursor repel target
-        const dx = mouseX - s.cx;
-        const dy = mouseY - s.cy;
-        const dist = Math.sqrt(dx*dx + dy*dy);
-
-        if(dist < maxDist){
-          const force = (maxDist - dist) / maxDist; // 0..1
-          s.tx = (-dx) * force * (maxForce / maxDist) * maxDist * 0.1;
-          s.ty = (-dy) * force * (maxForce / maxDist) * maxDist * 0.1;
-        } else {
-          s.tx = 0;
-          s.ty = 0;
-        }
-
-        // gentle scroll drift (like clouds)
-        const driftY = -scrollY * s.speed * 0.06;
-        const targetX = s.tx;
-        const targetY = s.ty + driftY;
-
-        // spring integration (semi-implicit Euler)
-        const ax = (targetX - s.x) * springCfg.stiffness;
-        const ay = (targetY - s.y) * springCfg.stiffness;
-        s.vx = (s.vx + ax) * springCfg.damping;
-        s.vy = (s.vy + ay) * springCfg.damping;
-        s.x += s.vx;
-        s.y += s.vy;
-
-        el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${getComputedStyle(el).getPropertyValue('--rot') || '0deg'})`;
-      });
-
-      requestAnimationFrame(lilyTick);
-    }
-    // Keep centers fresh on resize (and once after fonts settle)
-    window.addEventListener('resize', ()=>{ updateCenters(); });
-    setTimeout(updateCenters, 400);
-    requestAnimationFrame(lilyTick);
-
-const PROJECTS=[
-      {id:'design-systems',title:'Monet UI System',category:'designer',year:'2025',blurb:'A modern design system inspired by watercolor textures and soft gradients.',
-       description:'Describe the problem, your role, constraints, process, and results.\n\nAdd links and a file embed on the right.',
-       embedSrc:'assets/sample.pdf',links:[{label:'Case Study',href:'#'},{label:'Figma',href:'#'}],height:'tall'},
-      {id:'care-pathways',title:'Care Pathways Prototype',category:'healthcare',year:'2024',blurb:'A patient-centered workflow prototype for simplified onboarding and follow-ups.',
-       description:'Explain the healthcare context, your research insights, and what you built.',embedSrc:'assets/sample.pdf',links:[{label:'Deck',href:'#'}],height:'medium'},
-      {id:'community-program',title:'Community Outreach Program',category:'community',year:'2023',blurb:'A scalable initiative focused on access, inclusion, and engagement.',
-       description:'Highlight how you built relationships, organized activities, and measured impact.',embedSrc:'assets/sample.pdf',links:[{label:'Write-up',href:'#'}],height:'short'},
-      {id:'biomed-study',title:'Biomedical Study Snapshot',category:'research',year:'2025',blurb:'A research project summary with methods, visuals, and key findings.',
-       description:'Summarize methods, hypothesis, and results. Include a poster or PDF on the right.',embedSrc:'assets/sample.pdf',links:[{label:'Poster',href:'#'}],height:'medium'},
-      {id:'impact-strategy',title:'Impact Strategy Playbook',category:'impact',year:'2024',blurb:'A strategy framework for prioritizing interventions and tracking outcomes.',
-       description:'Show how you set goals, built metrics, and aligned stakeholders.',embedSrc:'assets/sample.pdf',links:[{label:'Framework',href:'#'}],height:'tall'},
-    ];
-
-    const menuWrap=document.getElementById('menuWrap');
-    const menuBtn=document.getElementById('menuBtn');
-    const menu=document.getElementById('menu');
-    let menuOpen=false;
-    const setMenuOpen=(o)=>{menuOpen=o;menu.classList.toggle('open',o)};
-    menuBtn.addEventListener('click',(e)=>{e.stopPropagation();setMenuOpen(!menuOpen)});
-    document.addEventListener('click',()=>setMenuOpen(false));
-    document.addEventListener('mousemove',(e)=>{
-      const t=140; const nearTop=e.clientY<t; const nearRight=(window.innerWidth-e.clientX)<t;
-      menuWrap.classList.toggle('visible',nearTop&&nearRight);
-    });
-
-    document.addEventListener('mousemove',(e)=>{
-      const btn=e.target.closest?.('.btn'); if(!btn) return;
-      const r=btn.getBoundingClientRect();
-      btn.style.setProperty('--mx',(((e.clientX-r.left)/r.width)*100)+'%');
-      btn.style.setProperty('--my',(((e.clientY-r.top)/r.height)*100)+'%');
-    });
-
-    const hero=document.querySelector('.hero');
-    const gallery=document.querySelector('.gallery');
-    const meltTargets=document.querySelectorAll('.melt-target');
-    const turbulence=document.getElementById('turbulence');
-    const displace=document.getElementById('displace');
-    const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
-    function updateMelt(){
-      const rect=hero.getBoundingClientRect();
-      const vh=window.innerHeight||1;
-      const p=clamp((0-rect.top)/(vh*0.75),0,1);
-      displace.setAttribute('scale',String(Math.round(p*55)));
-      turbulence.setAttribute('baseFrequency',String(0.012+p*0.020));
-      const op=1-p*1.10; const y=p*-10;
-      meltTargets.forEach(el=>{el.style.opacity=String(clamp(op,0,1));el.style.transform=`translateY(${y}px)`;});
-      if(p>0.25) gallery.classList.add('visible'); else gallery.classList.remove('visible');
-      requestAnimationFrame(updateMelt);
-    }
-    requestAnimationFrame(updateMelt);
-
-    const masonry=document.getElementById('masonry');
-    const gradientForCategory=(cat)=>{
-      const pair=COLORS[cat]||['#81a6de','#ca7487'];
-      return `radial-gradient(120% 90% at 25% 20%, ${pair[0]}55, transparent 55%),
-              radial-gradient(90% 70% at 70% 60%, ${pair[1]}55, transparent 60%),
-              radial-gradient(120% 90% at 40% 85%, #ffffff16, transparent 60%)`;
-    };
-    const tileHeightClass=(h)=>h==='tall'?'tile--tall':h==='short'?'tile--short':'tile--medium';
-
-    function renderTiles(items){
-      masonry.innerHTML='';
-      items.forEach(p=>{
-        const tile=document.createElement('article');
-        tile.className=`tile ${tileHeightClass(p.height)}`;
-        tile.setAttribute('role','button'); tile.setAttribute('tabindex','0');
-        const grad=document.createElement('div'); grad.className='tile-grad'; grad.style.background=gradientForCategory(p.category);
-        const inner=document.createElement('div'); inner.className='tile-inner';
-        const pill=document.createElement('div'); pill.className='tile-pill';
-        pill.innerHTML=`<span>${CATEGORY_LABELS[p.category]||'Project'}</span><span style="opacity:.65">•</span><span>${p.year||''}</span>`;
-        const title=document.createElement('h3'); title.className='tile-title'; title.textContent=p.title;
-        const desc=document.createElement('p'); desc.className='tile-desc'; desc.textContent=p.blurb;
-        inner.appendChild(pill); inner.appendChild(title); inner.appendChild(desc);
-        tile.appendChild(grad); tile.appendChild(inner);
-
-        tile.addEventListener('mousemove',(e)=>{
-          const r=tile.getBoundingClientRect();
-          const px=(e.clientX-r.left)/r.width; const py=(e.clientY-r.top)/r.height;
-          const tiltX=(py-0.5)*-10; const tiltY=(px-0.5)*12;
-          tile.style.transform=`rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px) scale(1.01)`;
-        });
-        tile.addEventListener('mouseleave',()=>{tile.style.transform='';});
-        tile.addEventListener('click',()=>openDetail(p.id));
-        tile.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(p.id);}});
-        masonry.appendChild(tile);
-      });
-    }
-    renderTiles(PROJECTS);
-
-    const detail=document.getElementById('detail');
-    const detailTitle=document.getElementById('detailTitle');
-    const detailMeta=document.getElementById('detailMeta');
-    const detailDesc=document.getElementById('detailDesc');
-    const detailLinks=document.getElementById('detailLinks');
-    const detailFrame=document.getElementById('detailFrame');
-    const backBtn=document.getElementById('backBtn');
-
-    function openDetail(projectId){
-      const p=PROJECTS.find(x=>x.id===projectId); if(!p) return;
-      document.querySelector('.gallery').classList.add('hidden');
-      detail.classList.remove('hidden');
-      detailTitle.textContent=p.title;
-      detailMeta.textContent=`${CATEGORY_LABELS[p.category]||'Project'} • ${p.year||''}`;
-      detailDesc.textContent=p.description;
-      detailLinks.innerHTML='';
-      (p.links||[]).forEach(l=>{
-        const a=document.createElement('a'); a.className='btn btn-pill'; a.href=l.href; a.target='_blank'; a.rel='noreferrer'; a.textContent=l.label;
-        detailLinks.appendChild(a);
-      });
-      detailFrame.src=p.embedSrc || 'assets/sample.pdf';
-      history.replaceState({},'',`#project-${p.id}`);
-      window.scrollTo({top:0,behavior:'smooth'});
-    }
-    function closeDetail(){
-      detail.classList.add('hidden');
-      document.querySelector('.gallery').classList.remove('hidden');
-      history.replaceState({},'','#projects');
-      window.scrollTo({top:document.getElementById('projects').offsetTop-8,behavior:'smooth'});
-    }
-    backBtn.addEventListener('click',closeDetail);
-    (function(){const h=(location.hash||'').trim(); if(h.startsWith('#project-')) openDetail(h.replace('#project-',''));})();
-    document.getElementById('year').textContent=String(new Date().getFullYear());
-  </script>
+<!-- Admin (Ctrl/⌘ + Shift + A, or triple-click your name) -->
+  <div class="admin-fab" id="adminFab">
+    <button class="btn btn-pill" type="button" aria-label="Open admin">Admin</button>
+  </div>
+
+  <div class="admin-overlay" id="adminLoginOverlay" aria-hidden="true">
+    <div class="admin-modal" role="dialog" aria-modal="true" aria-label="Admin login">
+      <div class="admin-top">
+        <h2 class="admin-title">Admin Login</h2>
+        <button class="btn btn-ghost" type="button" onclick="document.getElementById('adminLoginOverlay').classList.remove('open')">Close</button>
+      </div>
+      <form id="adminLoginForm">
+        <label class="admin-label" for="adminPw">Password</label>
+        <input class="admin-input" id="adminPw" type="password" autocomplete="current-password" />
+        <div class="admin-actions">
+          <button class="btn btn-pill" type="submit">Unlock</button>
+        </div>
+        <p class="admin-note" id="adminLoginMsg"></p>
+        <p class="admin-note">
+          <strong>Important:</strong> this only hides the editor UI. On GitHub Pages there is no real server-side security.
+          Anyone can still view your public site files.
+        </p>
+      </form>
+    </div>
+  </div>
+
+  <div class="admin-overlay" id="adminOverlay" aria-hidden="true">
+    <div class="admin-modal" role="dialog" aria-modal="true" aria-label="Admin panel">
+      <div class="admin-top">
+        <h2 class="admin-title">Projects Admin</h2>
+        <button class="btn btn-ghost" id="adminClose" type="button">Close</button>
+      </div>
+
+      <div class="admin-grid">
+        <section class="admin-card">
+          <h3>Add / Edit Project</h3>
+
+          <div class="admin-row two">
+            <div>
+              <label class="admin-label" for="p_title">Title</label>
+              <input class="admin-input" id="p_title" placeholder="e.g., Monet UI System" />
+            </div>
+            <div>
+              <label class="admin-label" for="p_category">Category</label>
+              <select class="admin-select" id="p_category">
+                <option value="designer">Designer</option>
+                <option value="healthcare">Healthcare Innovator</option>
+                <option value="community">Community Advocate</option>
+                <option value="research">Biomedical Researcher</option>
+                <option value="impact">Impact Strategist</option>
+              </select>
+            </div>
+          </div>
+
+          <div class="admin-row three" style="margin-top:10px">
+            <div>
+              <label class="admin-label" for="p_year">Year</label>
+              <input class="admin-input" id="p_year" placeholder="2025" />
+            </div>
+            <div>
+              <label class="admin-label" for="p_height">Tile height</label>
+              <select class="admin-select" id="p_height">
+                <option value="short">Short</option>
+                <option value="medium" selected>Medium</option>
+                <option value="tall">Tall</option>
+              </select>
+            </div>
+            <div>
+              <label class="admin-label" for="p_id">ID (optional)</label>
+              <input class="admin-input" id="p_id" placeholder="auto-generated from title" />
+            </div>
+          </div>
+
+          <div style="margin-top:10px">
+            <label class="admin-label" for="p_blurb">Tile blurb</label>
+            <input class="admin-input" id="p_blurb" placeholder="One-line teaser that shows on the tile." />
+          </div>
+
+          <div style="margin-top:10px">
+            <label class="admin-label" for="p_description">Full description</label>
+            <textarea class="admin-textarea" id="p_description" placeholder="Write your full project description here..."></textarea>
+          </div>
+
+          <div style="margin-top:10px">
+            <label class="admin-label" for="p_embedSrc">Embed src</label>
+            <input class="admin-input" id="p_embedSrc" placeholder="assets/myfile.pdf  OR  https://..." />
+            <p class="admin-note">
+              Tip: For PDFs/images you want the public to see, upload them to <code>assets/</code> in GitHub, then use the path here.
+            </p>
+          </div>
+
+          <div style="margin-top:10px">
+            <label class="admin-label" for="p_links">Links (one per line)</label>
+            <textarea class="admin-textarea" id="p_links" placeholder="Case Study | https://...
+Figma | https://..."></textarea>
+          </div>
+
+          <div class="admin-actions">
+            <button class="btn btn-pill" id="adminSave" type="button">Save</button>
+            <button class="btn btn-pill" id="adminReset" type="button">Clear</button>
+            <button class="btn btn-pill" id="adminDelete" type="button" disabled>Delete</button>
+          </div>
+        </section>
+
+        <section class="admin-card">
+          <h3>Existing Projects</h3>
+          <div class="admin-actions">
+            <button class="btn btn-pill" id="adminExport" type="button">Export JSON</button>
+            <button class="btn btn-pill" id="adminImport" type="button">Import JSON</button>
+            <button class="btn btn-pill" id="adminClearLocal" type="button">Clear Local Edits</button>
+            <input id="adminImportFile" type="file" accept="application/json" style="display:none" />
+          </div>
+
+          <div class="admin-list" id="adminList" style="margin-top:10px"></div>
+
+          <p class="admin-note">
+            <strong>Publishing changes:</strong> Export JSON, commit it as <code>projects.json</code>, then set
+            <code>LOAD_PROJECTS_FROM_JSON = true</code> in <code>script.js</code>.
+          </p>
+        </section>
+      </div>
+    </div>
+  </div>
+  <script src="script.js"></script>
 </body>
 </html>


---

## styles.css diff
--- styles.css (before)+++ styles.css (after)@@ -1,126 +1,167 @@-:root{
-  --bg:#07070a;--fg:#f3f5ff;--muted:rgba(243,245,255,.68);
-  --c1:#81a6de;--c2:#689139;--c3:#ca7487;--c4:#456ab5;--c5:#d8b152;
-  --glass:rgba(255,255,255,.06);--glass2:rgba(255,255,255,.10);
-  --stroke:rgba(255,255,255,.12);--shadow:0 20px 60px rgba(0,0,0,.55);
-  --radius-xl:24px;--radius-lg:18px;--ease:cubic-bezier(.2,.8,.2,1);
+:root{--bg:#06060a;--fg:#f3f5ff;--muted:rgba(243,245,255,.68);--c1:#81a6de;--c2:#689139;--c3:#ca7487;--c4:#456ab5;--c5:#d8b152;--glass:rgba(255,255,255,.06);--glass2:rgba(255,255,255,.10);--stroke:rgba(255,255,255,.12);--shadow:0 20px 60px rgba(0,0,0,.55);--radius-xl:24px;--radius-lg:18px;--ease:cubic-bezier(.2,.8,.2,1);}
+    *{box-sizing:border-box} html,body{height:100%}
+    body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--fg);
+      background:radial-gradient(1400px 900px at 70% 20%, rgba(129,166,222,.18), transparent 60%),
+               radial-gradient(1100px 800px at 20% 25%, rgba(69,106,181,.16), transparent 60%),
+               radial-gradient(1100px 900px at 35% 75%, rgba(202,116,135,.15), transparent 62%),
+               radial-gradient(900px 700px at 72% 78%, rgba(104,145,57,.14), transparent 62%),
+               radial-gradient(1000px 700px at 40% 88%, rgba(216,177,82,.10), transparent 62%),
+               var(--bg);overflow-x:hidden;}
+    .visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
+    .bg-blobs{position:fixed;inset:0;z-index:-3;pointer-events:none;overflow:hidden}
+    .blob{position:absolute;filter:blur(48px);opacity:.52;mix-blend-mode:normal;border-radius:999px;animation:floaty 12s var(--ease) infinite alternate}
+    .b1{width:560px;height:560px;left:-160px;top:80px;background:radial-gradient(circle at 30% 30%, rgba(129,166,222,.95), rgba(69,106,181,0) 70%)}
+    .b2{width:620px;height:620px;right:-220px;top:140px;background:radial-gradient(circle at 40% 40%, rgba(202,116,135,.85), rgba(7,7,10,0) 70%);animation-delay:-2s}
+    .b3{width:700px;height:700px;left:8%;bottom:-320px;background:radial-gradient(circle at 45% 45%, rgba(104,145,57,.8), rgba(7,7,10,0) 70%);animation-delay:-4s}
+    .b4{width:580px;height:580px;right:12%;bottom:-260px;background:radial-gradient(circle at 45% 45%, rgba(129,166,222,.78), rgba(7,7,10,0) 70%);animation-delay:-1s}
+    @keyframes floaty{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(0,-18px,0) scale(1.03)}}
+    .paper-grain{position:absolute;inset:0;background-image:url("assets/grain.svg");opacity:.22;mix-blend-mode:overlay}
+    .pond{position:fixed;inset:0;z-index:-2;pointer-events:none;overflow:hidden}
+    .pond-item{position:absolute;width:var(--size,140px);height:auto;opacity:var(--op,.55);transform:translate3d(0,0,0) rotate(var(--rot,0deg));filter:drop-shadow(0 18px 40px rgba(0,0,0,.6));transition:transform 260ms var(--ease),opacity 260ms var(--ease);pointer-events:auto}
+    .pond-item:hover{opacity:min(0.95, calc(var(--op, .55) + 0.2));animation:wobble 900ms var(--ease) 1;transform:translate3d(0,-2px,0) rotate(calc(var(--rot,0deg) + 2deg)) scale(1.03)}
+    @keyframes wobble{0%{transform:translate3d(0,0,0) rotate(var(--rot,0deg))}25%{transform:translate3d(1px,-1px,0) rotate(calc(var(--rot,0deg) + 2.5deg))}55%{transform:translate3d(-1px,-2px,0) rotate(calc(var(--rot,0deg) - 2deg))}80%{transform:translate3d(0,-1px,0) rotate(calc(var(--rot,0deg) + 1.2deg))}100%{transform:translate3d(0,0,0) rotate(var(--rot,0deg))}}
+    .topbar{position:fixed;top:0;left:0;width:100%;padding:18px;display:flex;justify-content:flex-end;z-index:50;pointer-events:none}
+    .menu-wrap{pointer-events:auto;position:relative;opacity:0;transform:translateY(-8px);transition:opacity 240ms var(--ease),transform 240ms var(--ease)}
+    .menu-wrap.visible{opacity:1;transform:translateY(0)}
+    .menu{position:absolute;right:0;top:52px;display:flex;gap:10px;padding:12px;background:rgba(0,0,0,.35);border:1px solid var(--stroke);border-radius:999px;box-shadow:var(--shadow);backdrop-filter:blur(10px);opacity:0;transform:translateY(-6px) scale(.98);pointer-events:none;transition:opacity 220ms var(--ease),transform 220ms var(--ease)}
+    .menu.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
+    .btn{border:1px solid var(--stroke);background:var(--glass);color:var(--fg);padding:12px 14px;border-radius:999px;cursor:pointer;display:inline-flex;align-items:center;gap:10px;text-decoration:none;user-select:none;transition:transform 220ms var(--ease),background 220ms var(--ease),border-color 220ms var(--ease);position:relative;overflow:hidden;will-change:transform}
+    .btn::after{content:"";position:absolute;inset:-40%;background:radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.22), transparent 45%);transform:scale(.9);opacity:0;transition:opacity 220ms var(--ease),transform 220ms var(--ease)}
+    .btn:hover{transform:translateY(-1px) scale(1.035);background:var(--glass2);border-color:rgba(255,255,255,.22)}
+    .btn:hover::after{opacity:1;transform:scale(1)}
+    .btn:active{transform:translateY(0) scale(.99)}
+    .btn-ghost{padding:10px 12px}.btn-pill{padding:10px 14px}.menu-btn{padding:10px 14px}
+    .menu-icon{width:18px;height:12px;border-top:2px solid rgba(243,245,255,.9);border-bottom:2px solid rgba(243,245,255,.9);position:relative;display:inline-block}
+    .menu-icon::before{content:"";position:absolute;left:0;right:0;top:4px;border-top:2px solid rgba(243,245,255,.9)}
+    .menu-label{font-size:13px;letter-spacing:.04em;opacity:.9}
+    main{min-height:100vh}
+    .hero{min-height:100vh;display:grid;place-items:center;padding:0 18px}
+    .hero-inner{width:min(1000px,92vw);text-align:center}
+    .hero-name{font-family:Fraunces,ui-serif,Georgia,serif;font-size:clamp(44px,7vw,90px);font-weight:700;letter-spacing:-.02em;margin:0 0 14px;line-height:1.03;text-shadow:0 20px 70px rgba(0,0,0,.55);position:relative}
+    .hero-name::after{content:"";position:absolute;inset:-10px -20px;background:radial-gradient(70% 70% at 20% 30%, rgba(129,166,222,.55), transparent 60%),radial-gradient(70% 70% at 55% 40%, rgba(202,116,135,.42), transparent 60%),radial-gradient(70% 70% at 80% 55%, rgba(104,145,57,.28), transparent 60%);filter:blur(14px);opacity:.58;z-index:-1}
+    .hero-tags{margin:0 auto;width:min(980px,92vw);font-size:clamp(14px,1.7vw,18px);font-weight:400;color:var(--muted);line-height:1.6}
+    .dot{padding:0 8px;opacity:.7}
+    .taglink{color:rgba(243,245,255,.86);text-decoration:none;border-bottom:1px solid rgba(243,245,255,.2);transition:border-color 220ms var(--ease),color 220ms var(--ease)}
+    .taglink:hover{color:#fff;border-color:rgba(255,255,255,.5)}
+    .melt-target{filter:url(#meltFilter);will-change:opacity,transform,filter}
+    .hero-hint{margin-top:34px;display:grid;gap:12px;place-items:center;opacity:.75}
+    .hint-pill{font-size:12px;letter-spacing:.2em;text-transform:uppercase;border:1px solid rgba(255,255,255,.14);padding:10px 14px;border-radius:999px;background:rgba(255,255,255,.05)}
+    .hint-line{width:1px;height:50px;background:linear-gradient(to bottom, rgba(255,255,255,.55), rgba(255,255,255,0));border-radius:999px}
+    .gallery{padding:42px 18px 96px;opacity:0;transform:translateY(12px);transition:opacity 600ms var(--ease),transform 600ms var(--ease)}
+    .gallery.visible{opacity:1;transform:translateY(0)}
+    .gallery-head{width:min(1100px,92vw);margin:0 auto 22px}
+    .section-title{font-size:22px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 8px;opacity:.88}
+    .section-subtitle{margin:0;color:var(--muted)}
+    .masonry{width:min(1100px,92vw);margin:22px auto 0;column-count:1;column-gap:16px}
+    @media (min-width:720px){.masonry{column-count:2}} @media (min-width:1040px){.masonry{column-count:3}}
+    .tile{break-inside:avoid;margin:0 0 16px;border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.14);box-shadow:0 18px 60px rgba(0,0,0,.5);transform-style:preserve-3d;perspective:900px;cursor:pointer;overflow:hidden;position:relative;transition:transform 280ms var(--ease),border-color 280ms var(--ease),background 280ms var(--ease)}
+    .tile::before{content:"";position:absolute;inset:-40%;background:radial-gradient(circle at 25% 30%, rgba(255,255,255,.24), transparent 36%),radial-gradient(circle at 70% 55%, rgba(255,255,255,.18), transparent 40%),radial-gradient(circle at 40% 75%, rgba(255,255,255,.10), transparent 45%);opacity:.22;mix-blend-mode:overlay;transform:translateZ(30px);pointer-events:none}
+    .tile:hover{border-color:rgba(255,255,255,.34);background:rgba(255,255,255,.18)}
+    .tile-inner{padding:18px 18px 20px;transform:translateZ(40px)}
+    .tile-pill{display:inline-flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:8px 12px;border-radius:999px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(10px)}
+    .tile-title{margin:12px 0 8px;font-size:18px;letter-spacing:-.01em}
+    .tile-desc{margin:0;color:var(--muted);line-height:1.55}
+    .tile-grad{position:absolute;inset:0;opacity:1;mix-blend-mode:normal;pointer-events:none}
+    .tile--short{min-height:170px}.tile--medium{min-height:220px}.tile--tall{min-height:300px}
+    .hidden{display:none}
+    .detail{padding:26px 18px 86px}
+    .detail-top{width:min(1100px,92vw);margin:0 auto 14px;display:flex}
+    .back-btn .back-arrow{font-size:18px;transform:translateY(-1px)}
+    .detail-grid{width:min(1100px,92vw);margin:0 auto;display:grid;gap:16px;grid-template-columns:1fr}
+    @media (min-width:980px){.detail-grid{grid-template-columns:.95fr 1.05fr;gap:18px}}
+    .detail-left,.detail-right{border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);box-shadow:var(--shadow);backdrop-filter:blur(10px)}
+    .detail-left{padding:20px 20px 24px}
+    .detail-title{margin:0 0 6px;font-size:30px;letter-spacing:-.02em}
+    .detail-meta{margin:0 0 14px;color:var(--muted)}
+    .detail-desc{margin:0 0 18px;color:rgba(243,245,255,.86);line-height:1.7;white-space:pre-wrap}
+    .detail-links{display:flex;flex-wrap:wrap;gap:10px}
+    .embed-card{padding:12px}
+    .embed-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 8px 12px}
+    .embed-pill{font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.88}
+    .embed-note{font-size:12px;color:var(--muted);text-align:right}
+    .embed-frame{width:100%;height:min(62vh,640px);border:1px solid rgba(255,255,255,.14);border-radius:var(--radius-lg);background:rgba(0,0,0,.35)}
+    .about{padding:18px 18px 64px}
+    .about-inner{width:min(1100px,92vw);margin:0 auto}
+    .about-card{display:grid;grid-template-columns:1fr;gap:16px;border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);box-shadow:var(--shadow);backdrop-filter:blur(10px);padding:18px}
+    @media (min-width:860px){.about-card{grid-template-columns:.8fr 1.2fr;gap:18px;padding:20px}}
+    .about-photo-wrap{border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.35);display:grid;place-items:center;padding:12px;overflow:hidden}
+    .about-photo{width:100%;max-width:420px;height:auto;opacity:.95;filter:grayscale(1) contrast(1.05)}
+    .handwritten{font-family:Caveat,cursive;font-size:clamp(20px,2.3vw,30px);line-height:1.25;margin:10px 0 6px;color:rgba(243,245,255,.92)}
+    .small{margin:0;color:var(--muted)}
+    .footer{margin-top:18px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;color:var(--muted)}
+    .footer-dot{opacity:.5}
+    .footer-link{color:rgba(243,245,255,.86);text-decoration:none;border-bottom:1px solid rgba(243,245,255,.2)}
+    .footer-link:hover{border-color:rgba(255,255,255,.55)}
+    @media (prefers-reduced-motion: reduce){*{animation:none !important; transition:none !important; scroll-behavior:auto !important;}}
+/* ---------- Admin (client-side) ---------- */
+/* Note: this is "privacy gate", not real security on a static site. */
+.admin-fab{
+  position:fixed;right:18px;bottom:18px;z-index:80;
+  display:none;
 }
-*{box-sizing:border-box}html,body{height:100%}
-body{
-  margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
-  background:radial-gradient(1200px 800px at 70% 20%, rgba(129,166,222,.12), transparent 60%),
-             radial-gradient(900px 700px at 30% 30%, rgba(202,116,135,.11), transparent 60%),
-             radial-gradient(900px 700px at 40% 80%, rgba(216,177,82,.10), transparent 60%),
-             var(--bg);
-  color:var(--fg);overflow-x:hidden;
+.admin-fab.visible{display:block}
+
+.admin-overlay{
+  position:fixed;inset:0;z-index:90;
+  background:rgba(0,0,0,.6);
+  display:none;
 }
-.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
+.admin-overlay.open{display:grid;place-items:center}
 
-/* Background blobs */
-.bg-blobs{position:fixed;inset:0;z-index:-2;pointer-events:none;overflow:hidden}
-.blob{position:absolute;filter:blur(40px);opacity:.55;mix-blend-mode:screen;border-radius:999px;transform:translate3d(0,0,0);
-  animation:floaty 12s var(--ease) infinite alternate;}
-.b1{width:520px;height:520px;left:-120px;top:80px;background:radial-gradient(circle at 30% 30%, rgba(129,166,222,.8), rgba(69,106,181,0) 70%)}
-.b2{width:560px;height:560px;right:-160px;top:160px;background:radial-gradient(circle at 40% 40%, rgba(202,116,135,.75), rgba(7,7,10,0) 70%);animation-delay:-2s}
-.b3{width:620px;height:620px;left:10%;bottom:-250px;background:radial-gradient(circle at 45% 45%, rgba(216,177,82,.72), rgba(7,7,10,0) 70%);animation-delay:-4s}
-.b4{width:520px;height:520px;right:15%;bottom:-220px;background:radial-gradient(circle at 45% 45%, rgba(104,145,57,.70), rgba(7,7,10,0) 70%);animation-delay:-1s}
-.paper-grain{position:absolute;inset:0;opacity:.8;filter:url(#grainFilter)}
-@keyframes floaty{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(0,-16px,0) scale(1.02)}}
+.admin-modal{
+  width:min(980px,92vw);
+  max-height:min(86vh,860px);
+  overflow:auto;
+  border-radius:var(--radius-xl);
+  border:1px solid rgba(255,255,255,.16);
+  background:rgba(12,12,18,.82);
+  box-shadow:0 30px 90px rgba(0,0,0,.75);
+  backdrop-filter:blur(14px);
+  padding:16px;
+}
 
-/* Topbar + cursor reveal menu */
-.topbar{position:fixed;top:0;left:0;width:100%;padding:18px;display:flex;justify-content:flex-end;z-index:50;pointer-events:none}
-.menu-wrap{pointer-events:auto;position:relative;opacity:0;transform:translateY(-8px);transition:opacity 240ms var(--ease),transform 240ms var(--ease)}
-.menu-wrap.visible{opacity:1;transform:translateY(0)}
-.menu{position:absolute;right:0;top:52px;display:flex;gap:10px;padding:12px;background:rgba(0,0,0,.35);
-  border:1px solid var(--stroke);border-radius:999px;box-shadow:var(--shadow);backdrop-filter:blur(10px);
-  opacity:0;transform:translateY(-6px) scale(.98);pointer-events:none;transition:opacity 220ms var(--ease),transform 220ms var(--ease)}
-.menu.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
+.admin-top{
+  display:flex;align-items:center;justify-content:space-between;gap:10px;
+  position:sticky;top:0;background:rgba(12,12,18,.88);backdrop-filter:blur(12px);
+  padding:10px 10px 14px;margin:-16px -16px 12px;border-bottom:1px solid rgba(255,255,255,.10);
+}
+.admin-title{margin:0;font-size:14px;letter-spacing:.14em;text-transform:uppercase;opacity:.9}
+.admin-grid{display:grid;gap:14px;grid-template-columns:1fr}
+@media (min-width:980px){.admin-grid{grid-template-columns:1fr 1fr}}
 
-/* Buttons (expanding hover effect) */
-.btn{border:1px solid var(--stroke);background:var(--glass);color:var(--fg);padding:12px 14px;border-radius:999px;cursor:pointer;
-  display:inline-flex;align-items:center;gap:10px;text-decoration:none;user-select:none;transition:transform 220ms var(--ease),background 220ms var(--ease),border-color 220ms var(--ease);
-  position:relative;overflow:hidden;will-change:transform}
-.btn::after{content:"";position:absolute;inset:-40%;background:radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.22), transparent 45%);
-  transform:scale(.9);opacity:0;transition:opacity 220ms var(--ease),transform 220ms var(--ease)}
-.btn:hover{transform:translateY(-1px) scale(1.035);background:var(--glass2);border-color:rgba(255,255,255,.22)}
-.btn:hover::after{opacity:1;transform:scale(1)}
-.btn:active{transform:translateY(0) scale(.99)}
-.btn-ghost{padding:10px 12px}.btn-pill{padding:10px 14px}
-.menu-btn{padding:10px 14px}
-.menu-icon{width:18px;height:12px;border-top:2px solid rgba(243,245,255,.9);border-bottom:2px solid rgba(243,245,255,.9);position:relative;display:inline-block}
-.menu-icon::before{content:"";position:absolute;left:0;right:0;top:4px;border-top:2px solid rgba(243,245,255,.9)}
-.menu-label{font-size:13px;letter-spacing:.04em;opacity:.9}
+.admin-card{
+  border:1px solid rgba(255,255,255,.12);
+  border-radius:var(--radius-lg);
+  background:rgba(255,255,255,.06);
+  padding:12px;
+}
+.admin-card h3{margin:0 0 10px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;opacity:.85}
+.admin-row{display:grid;gap:10px;grid-template-columns:1fr}
+@media (min-width:720px){.admin-row.two{grid-template-columns:1fr 1fr}}
+.admin-row.three{grid-template-columns:1fr}
+@media (min-width:860px){.admin-row.three{grid-template-columns:1fr 1fr 1fr}}
 
-/* Hero */
-.hero{min-height:100vh;display:grid;place-items:center;padding:0 18px}
-.hero-inner{width:min(1000px,92vw);text-align:center}
-.hero-name{font-size:clamp(44px,7vw,84px);font-weight:800;letter-spacing:-.02em;margin:0 0 14px;line-height:1.03;text-shadow:0 20px 70px rgba(0,0,0,.55)}
-.hero-tags{margin:0 auto;width:min(980px,92vw);font-size:clamp(14px,1.7vw,18px);font-weight:400;color:var(--muted);line-height:1.6}
-.dot{padding:0 8px;opacity:.7}
-.taglink{color:rgba(243,245,255,.86);text-decoration:none;border-bottom:1px solid rgba(243,245,255,.2);transition:border-color 220ms var(--ease),color 220ms var(--ease)}
-.taglink:hover{color:#fff;border-color:rgba(255,255,255,.5)}
-.melt-target{filter:url(#meltFilter);will-change:filter,opacity,transform}
-.hero-hint{margin-top:34px;display:grid;gap:12px;place-items:center;opacity:.75}
-.hint-pill{font-size:12px;letter-spacing:.2em;text-transform:uppercase;border:1px solid rgba(255,255,255,.14);padding:10px 14px;border-radius:999px;background:rgba(255,255,255,.05)}
-.hint-line{width:1px;height:50px;background:linear-gradient(to bottom, rgba(255,255,255,.55), rgba(255,255,255,0));border-radius:999px}
-
-/* Gallery */
-.gallery{padding:42px 18px 96px;opacity:0;transform:translateY(12px);transition:opacity 600ms var(--ease),transform 600ms var(--ease)}
-.gallery.visible{opacity:1;transform:translateY(0)}
-.gallery-head{width:min(1100px,92vw);margin:0 auto 22px}
-.section-title{font-size:22px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 8px;opacity:.88}
-.section-subtitle{margin:0;color:var(--muted)}
-.masonry{width:min(1100px,92vw);margin:22px auto 0;column-count:1;column-gap:16px}
-@media (min-width:720px){.masonry{column-count:2}}
-@media (min-width:1040px){.masonry{column-count:3}}
-
-.tile{break-inside:avoid;margin:0 0 16px;border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);
-  box-shadow:0 18px 60px rgba(0,0,0,.5);transform-style:preserve-3d;perspective:900px;cursor:pointer;overflow:hidden;position:relative;
-  transition:transform 280ms var(--ease),border-color 280ms var(--ease),background 280ms var(--ease)}
-.tile::before{content:"";position:absolute;inset:-40%;background:
-  radial-gradient(circle at 25% 30%, rgba(255,255,255,.24), transparent 36%),
-  radial-gradient(circle at 70% 55%, rgba(255,255,255,.18), transparent 40%),
-  radial-gradient(circle at 40% 75%, rgba(255,255,255,.10), transparent 45%);
-  opacity:.55;mix-blend-mode:overlay;transform:translateZ(30px);pointer-events:none}
-.tile:hover{border-color:rgba(255,255,255,.24);background:rgba(255,255,255,.07)}
-.tile-inner{padding:18px 18px 20px;transform:translateZ(40px)}
-.tile-pill{display:inline-flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:8px 12px;border-radius:999px;
-  background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(10px)}
-.tile-title{margin:12px 0 8px;font-size:18px;letter-spacing:-.01em}
-.tile-desc{margin:0;color:var(--muted);line-height:1.55}
-.tile-grad{position:absolute;inset:0;opacity:.85;mix-blend-mode:screen;pointer-events:none}
-
-/* Detail */
-.hidden{display:none}
-.detail{padding:26px 18px 86px}
-.detail-top{width:min(1100px,92vw);margin:0 auto 14px;display:flex}
-.back-btn .back-arrow{font-size:18px;transform:translateY(-1px)}
-.detail-grid{width:min(1100px,92vw);margin:0 auto;display:grid;gap:16px;grid-template-columns:1fr}
-@media (min-width:980px){.detail-grid{grid-template-columns:.95fr 1.05fr;gap:18px}}
-.detail-left,.detail-right{border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);
-  box-shadow:var(--shadow);backdrop-filter:blur(10px)}
-.detail-left{padding:20px 20px 24px}
-.detail-title{margin:0 0 6px;font-size:30px;letter-spacing:-.02em}
-.detail-meta{margin:0 0 14px;color:var(--muted)}
-.detail-desc{margin:0 0 18px;color:rgba(243,245,255,.86);line-height:1.7}
-.detail-links{display:flex;flex-wrap:wrap;gap:10px}
-.embed-card{padding:12px}
-.embed-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 8px 12px}
-.embed-pill{font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.88}
-.embed-note{font-size:12px;color:var(--muted);text-align:right}
-.embed-frame{width:100%;height:min(62vh,640px);border:1px solid rgba(255,255,255,.14);border-radius:var(--radius-lg);background:rgba(0,0,0,.35)}
-
-/* About */
-.about{padding:18px 18px 64px}
-.about-inner{width:min(1100px,92vw);margin:0 auto}
-.about-card{display:grid;grid-template-columns:1fr;gap:16px;border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);
-  background:rgba(255,255,255,.05);box-shadow:var(--shadow);backdrop-filter:blur(10px);padding:18px}
-@media (min-width:860px){.about-card{grid-template-columns:.8fr 1.2fr;gap:18px;padding:20px}}
-.about-photo-wrap{border-radius:var(--radius-xl);border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.35);display:grid;place-items:center;padding:12px;overflow:hidden}
-.about-photo{width:100%;max-width:420px;height:auto;opacity:.95;filter:grayscale(1) contrast(1.05)}
-.handwritten{font-family:Caveat,cursive;font-size:clamp(20px,2.3vw,30px);line-height:1.25;margin:10px 0 6px;color:rgba(243,245,255,.92)}
-.small{margin:0;color:var(--muted)}
-.footer{margin-top:18px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;color:var(--muted)}
-.footer-dot{opacity:.5}
-.footer-link{color:rgba(243,245,255,.86);text-decoration:none;border-bottom:1px solid rgba(243,245,255,.2)}
-.footer-link:hover{border-color:rgba(255,255,255,.55)}
+.admin-label{font-size:12px;color:var(--muted);display:block;margin:0 0 6px}
+.admin-input,.admin-select,.admin-textarea{
+  width:100%;
+  border-radius:14px;
+  border:1px solid rgba(255,255,255,.14);
+  background:rgba(0,0,0,.32);
+  color:var(--fg);
+  padding:11px 12px;
+  outline:none;
+}
+.admin-textarea{min-height:110px;resize:vertical;line-height:1.5}
+.admin-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
+.admin-list{display:grid;gap:10px}
+.admin-item{
+  border:1px solid rgba(255,255,255,.12);
+  border-radius:16px;
+  background:rgba(0,0,0,.28);
+  padding:10px;
+  display:flex;gap:10px;align-items:flex-start;justify-content:space-between;
+}
+.admin-item strong{display:block}
+.admin-item small{color:var(--muted);display:block;margin-top:2px}
+.admin-item .admin-actions{margin:0}
+.admin-note{color:var(--muted);font-size:12px;line-height:1.4;margin-top:8px}


---

## script.js diff
--- script.js (before)+++ script.js (after)@@ -1,7 +1,7 @@ const COLORS={designer:['#81a6de','#456ab5'],healthcare:['#689139','#d8b152'],community:['#ca7487','#d8b152'],research:['#456ab5','#81a6de'],impact:['#d8b152','#ca7487']};
 const CATEGORY_LABELS={designer:'Designer',healthcare:'Healthcare Innovator',community:'Community Advocate',research:'Biomedical Researcher',impact:'Impact Strategist'};
 
-const PROJECTS=[
+const DEFAULT_PROJECTS=[
   {id:'design-systems',title:'Monet UI System',category:'designer',year:'2025',blurb:'A modern design system inspired by watercolor textures and soft gradients.',
    description:'Describe the problem, your role, constraints, process, and results.\n\nAdd links and a file embed on the right.',
    embedSrc:'assets/sample.pdf',links:[{label:'Case Study',href:'#'},{label:'Figma',href:'#'}],height:'tall'},
@@ -15,6 +15,58 @@    description:'Show how you set goals, built metrics, and aligned stakeholders.',embedSrc:'assets/sample.pdf',links:[{label:'Framework',href:'#'}],height:'tall'},
 ];
 
+// -------- Projects persistence (local) --------
+// If you add/edit projects via the Admin panel, they are saved to localStorage for THIS browser.
+// To publish those changes for everyone, use "Export JSON" and commit the downloaded file,
+// then set LOAD_PROJECTS_FROM_JSON = true and keep projects.json in your repo.
+const STORAGE_KEY = "portfolioProjects.v1";
+const PROJECTS_JSON_PATH = "projects.json"; // optional
+const LOAD_PROJECTS_FROM_JSON = false;       // set true if you commit projects.json
+
+let projects = null;
+
+function safeJsonParse(text){
+  try { return JSON.parse(text); } catch { return null; }
+}
+
+async function loadProjects(){
+  // 1) optional JSON file
+  if (LOAD_PROJECTS_FROM_JSON){
+    try{
+      const res = await fetch(PROJECTS_JSON_PATH, { cache: "no-store" });
+      if(res.ok){
+        const data = await res.json();
+        if(Array.isArray(data)) return data;
+      }
+    }catch{}
+  }
+
+  // 2) localStorage override
+  const saved = safeJsonParse(localStorage.getItem(STORAGE_KEY) || "");
+  if (Array.isArray(saved) && saved.length) return saved;
+
+  // 3) fallback default
+  return DEFAULT_PROJECTS;
+}
+
+function saveProjects(next){
+  projects = next;
+  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
+}
+
+// -------- Tile gradient opacity helpers --------
+function hexToRgba(hex, a){
+  const h = hex.replace("#","").trim();
+  const full = h.length === 3 ? h.split("").map(c=>c+c).join("") : h;
+  const n = parseInt(full, 16);
+  const r = (n >> 16) & 255;
+  const g = (n >> 8) & 255;
+  const b = n & 255;
+  return `rgba(${r},${g},${b},${a})`;
+}
+
+
+
 // Cursor-reveal menu (near top-right)
 const menuWrap=document.getElementById('menuWrap');
 const menuBtn=document.getElementById('menuBtn');
@@ -59,9 +111,13 @@ const masonry=document.getElementById('masonry');
 const gradientForCategory=(cat)=>{
   const pair=COLORS[cat]||['#81a6de','#ca7487'];
-  return `radial-gradient(120% 90% at 25% 20%, ${pair[0]}55, transparent 55%),
-          radial-gradient(90% 70% at 70% 60%, ${pair[1]}55, transparent 60%),
-          radial-gradient(120% 90% at 40% 85%, #ffffff16, transparent 60%)`;
+  // Higher-opacity gradients (less "glassy")
+  const a1 = 0.78;
+  const a2 = 0.72;
+  const a3 = 0.22;
+  return `radial-gradient(120% 90% at 25% 20%, ${hexToRgba(pair[0], a1)}, transparent 55%),
+          radial-gradient(90% 70% at 70% 60%, ${hexToRgba(pair[1], a2)}, transparent 60%),
+          radial-gradient(120% 90% at 40% 85%, ${hexToRgba('#ffffff', a3)}, transparent 60%)`;
 };
 const tileHeightClass=(h)=>h==='tall'?'tile--tall':h==='short'?'tile--short':'tile--medium';
 const styleEl=document.createElement('style');
@@ -101,7 +157,10 @@     masonry.appendChild(tile);
   });
 }
-renderTiles(PROJECTS);
+(async function init(){
+  projects = await loadProjects();
+  renderTiles(projects);
+})();
 
 // Detail view
 const detail=document.getElementById('detail');
@@ -113,7 +172,7 @@ const backBtn=document.getElementById('backBtn');
 
 function openDetail(projectId){
-  const p=PROJECTS.find(x=>x.id===projectId); if(!p) return;
+  const p=projects.find(x=>x.id===projectId); if(!p) return;
   document.querySelector('.gallery').classList.add('hidden');
   detail.classList.remove('hidden');
   detailTitle.textContent=p.title;
@@ -141,4 +200,287 @@   a.addEventListener('click',()=>setTimeout(()=>document.getElementById('projects').scrollIntoView({behavior:'smooth'}),60));
 });
 
+
+
+// ---------------- Admin panel (client-side) ----------------
+// IMPORTANT: On a static GitHub Pages site, this is NOT real security.
+// It only hides the UI and stores edits in localStorage for your browser.
+// For real security + write access, use a backend/CMS (Netlify CMS, Decap CMS, etc.).
+const ADMIN_SESSION_KEY = "portfolioAdmin.authed";
+const ADMIN_PASSWORD_HASH = "REPLACE_WITH_YOUR_SHA256_HASH"; 
+// How to set:
+// 1) Open your site, press F12 -> Console
+// 2) Run:  await window.__hash("your-new-password")
+// 3) Copy the printed hash string into ADMIN_PASSWORD_HASH above.
+
+window.__hash = async (pw) => {
+  const enc = new TextEncoder().encode(pw);
+  const buf = await crypto.subtle.digest("SHA-256", enc);
+  const arr = Array.from(new Uint8Array(buf));
+  const hex = arr.map(b=>b.toString(16).padStart(2,"0")).join("");
+  console.log(hex);
+  return hex;
+};
+
+const adminFab = document.getElementById("adminFab");
+const adminOverlay = document.getElementById("adminOverlay");
+const adminClose = document.getElementById("adminClose");
+const adminLoginOverlay = document.getElementById("adminLoginOverlay");
+const adminLoginForm = document.getElementById("adminLoginForm");
+const adminPw = document.getElementById("adminPw");
+const adminLoginMsg = document.getElementById("adminLoginMsg");
+
+const form = {
+  id: document.getElementById("p_id"),
+  title: document.getElementById("p_title"),
+  category: document.getElementById("p_category"),
+  year: document.getElementById("p_year"),
+  blurb: document.getElementById("p_blurb"),
+  description: document.getElementById("p_description"),
+  embedSrc: document.getElementById("p_embedSrc"),
+  links: document.getElementById("p_links"),
+  height: document.getElementById("p_height"),
+};
+
+const adminList = document.getElementById("adminList");
+const adminSaveBtn = document.getElementById("adminSave");
+const adminResetBtn = document.getElementById("adminReset");
+const adminDeleteBtn = document.getElementById("adminDelete");
+const adminExportBtn = document.getElementById("adminExport");
+const adminImportBtn = document.getElementById("adminImport");
+const adminImportFile = document.getElementById("adminImportFile");
+const adminClearLocalBtn = document.getElementById("adminClearLocal");
+
+let editingId = null;
+
+function isAuthed(){
+  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
+}
+function setAuthed(v){
+  if(v) sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
+  else sessionStorage.removeItem(ADMIN_SESSION_KEY);
+  adminFab.classList.toggle("visible", isAuthed());
+}
+
+async function checkPassword(pw){
+  if (!ADMIN_PASSWORD_HASH || ADMIN_PASSWORD_HASH === "REPLACE_WITH_YOUR_SHA256_HASH") return false;
+  const hash = await window.__hash(pw);
+  return hash === ADMIN_PASSWORD_HASH;
+}
+
+function openAdmin(){
+  if(!isAuthed()){
+    adminLoginOverlay.classList.add("open");
+    adminPw.value = "";
+    adminPw.focus();
+    adminLoginMsg.textContent = "";
+    return;
+  }
+  adminOverlay.classList.add("open");
+  renderAdminList();
+}
+
+function closeAdmin(){
+  adminOverlay.classList.remove("open");
+}
+function closeLogin(){
+  adminLoginOverlay.classList.remove("open");
+}
+
+adminFab?.addEventListener("click", openAdmin);
+adminClose?.addEventListener("click", closeAdmin);
+adminOverlay?.addEventListener("click", (e)=>{ if(e.target === adminOverlay) closeAdmin(); });
+
+adminLoginOverlay?.addEventListener("click", (e)=>{ if(e.target === adminLoginOverlay) closeLogin(); });
+
+adminLoginForm?.addEventListener("submit", async (e)=>{
+  e.preventDefault();
+  const pw = adminPw.value || "";
+  const ok = await checkPassword(pw);
+  if(ok){
+    setAuthed(true);
+    closeLogin();
+    openAdmin();
+  }else{
+    adminLoginMsg.textContent = "Incorrect password.";
+  }
+});
+
+// Secret shortcut: Ctrl/⌘ + Shift + A
+document.addEventListener("keydown", (e)=>{
+  const isMac = navigator.platform.toUpperCase().includes("MAC");
+  const mod = isMac ? e.metaKey : e.ctrlKey;
+  if(mod && e.shiftKey && (e.key.toLowerCase() === "a")){
+    e.preventDefault();
+    openAdmin();
+  }
+});
+
+// Also: triple click your name
+const heroName = document.querySelector(".hero-name");
+heroName?.addEventListener("click", (e)=>{
+  if(e.detail === 3) openAdmin();
+});
+
+// ---------- Admin CRUD ----------
+function clearForm(){
+  editingId = null;
+  form.id.value = "";
+  form.title.value = "";
+  form.category.value = "designer";
+  form.year.value = "";
+  form.blurb.value = "";
+  form.description.value = "";
+  form.embedSrc.value = "";
+  form.links.value = "";
+  form.height.value = "medium";
+  adminDeleteBtn.disabled = true;
+}
+
+function parseLinks(text){
+  // One per line: Label | https://...
+  const lines = (text || "").split("\n").map(s=>s.trim()).filter(Boolean);
+  return lines.map(line=>{
+    const [label, href] = line.split("|").map(s=>s.trim());
+    if(!href) return null;
+    return { label: label || "Link", href };
+  }).filter(Boolean);
+}
+
+function toSlug(text){
+  return (text || "")
+    .toLowerCase()
+    .replace(/[^a-z0-9]+/g, "-")
+    .replace(/(^-|-$)/g, "")
+    .slice(0, 48) || ("p-" + Math.random().toString(16).slice(2,8));
+}
+
+function upsertProject(){
+  const id = (editingId || form.id.value || toSlug(form.title.value));
+  const next = {
+    id,
+    title: form.title.value.trim() || "Untitled Project",
+    category: form.category.value,
+    year: form.year.value.trim(),
+    blurb: form.blurb.value.trim(),
+    description: form.description.value.trim(),
+    embedSrc: form.embedSrc.value.trim(),
+    links: parseLinks(form.links.value),
+    height: form.height.value,
+  };
+
+  // Update or insert
+  const idx = projects.findIndex(p=>p.id===id);
+  const updated = [...projects];
+  if(idx >= 0) updated[idx] = next;
+  else updated.unshift(next);
+
+  saveProjects(updated);
+  renderTiles(updated);
+  renderAdminList();
+  clearForm();
+}
+
+function deleteProject(){
+  if(!editingId) return;
+  const updated = projects.filter(p=>p.id !== editingId);
+  saveProjects(updated);
+  renderTiles(updated);
+  renderAdminList();
+  clearForm();
+}
+
+function editProject(id){
+  const p = projects.find(x=>x.id===id);
+  if(!p) return;
+  editingId = id;
+  form.id.value = p.id || "";
+  form.title.value = p.title || "";
+  form.category.value = p.category || "designer";
+  form.year.value = p.year || "";
+  form.blurb.value = p.blurb || "";
+  form.description.value = p.description || "";
+  form.embedSrc.value = p.embedSrc || "";
+  form.links.value = (p.links||[]).map(l=>`${l.label} | ${l.href}`).join("\n");
+  form.height.value = p.height || "medium";
+  adminDeleteBtn.disabled = false;
+  window.scrollTo({ top: 0, behavior: "smooth" });
+}
+
+function renderAdminList(){
+  if(!adminList) return;
+  adminList.innerHTML = "";
+  const items = projects || [];
+  items.forEach(p=>{
+    const row = document.createElement("div");
+    row.className = "admin-item";
+    row.innerHTML = `
+      <div>
+        <strong>${p.title || "Untitled"}</strong>
+        <small>${(CATEGORY_LABELS[p.category]||"Project")} • ${p.year || ""} • id: ${p.id}</small>
+      </div>
+      <div class="admin-actions">
+        <button class="btn btn-pill" data-act="edit" data-id="${p.id}">Edit</button>
+        <button class="btn btn-pill" data-act="open" data-id="${p.id}">Open</button>
+      </div>
+    `;
+    row.addEventListener("click",(e)=>{
+      const btn = e.target.closest("button[data-act]");
+      if(!btn) return;
+      const act = btn.dataset.act;
+      const id = btn.dataset.id;
+      if(act==="edit") editProject(id);
+      if(act==="open") openDetail(id);
+    });
+    adminList.appendChild(row);
+  });
+}
+
+adminSaveBtn?.addEventListener("click", upsertProject);
+adminResetBtn?.addEventListener("click", clearForm);
+adminDeleteBtn?.addEventListener("click", deleteProject);
+
+adminExportBtn?.addEventListener("click", ()=>{
+  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" });
+  const url = URL.createObjectURL(blob);
+  const a = document.createElement("a");
+  a.href = url;
+  a.download = "projects.json";
+  document.body.appendChild(a);
+  a.click();
+  a.remove();
+  URL.revokeObjectURL(url);
+});
+
+adminImportBtn?.addEventListener("click", ()=> adminImportFile.click());
+adminImportFile?.addEventListener("change", async ()=>{
+  const file = adminImportFile.files?.[0];
+  if(!file) return;
+  const text = await file.text();
+  const data = safeJsonParse(text);
+  if(Array.isArray(data)){
+    saveProjects(data);
+    renderTiles(data);
+    renderAdminList();
+    clearForm();
+  }else{
+    alert("That file doesn't look like a projects JSON array.");
+  }
+  adminImportFile.value = "";
+});
+
+adminClearLocalBtn?.addEventListener("click", ()=>{
+  if(!confirm("Clear locally saved projects for this browser and revert to defaults?")) return;
+  localStorage.removeItem(STORAGE_KEY);
+  (async ()=>{
+    projects = await loadProjects();
+    renderTiles(projects);
+    renderAdminList();
+    clearForm();
+  })();
+});
+
+// Set initial auth state (session-based)
+setAuthed(isAuthed());
+
 document.getElementById('year').textContent=String(new Date().getFullYear());

