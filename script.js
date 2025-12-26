const COLORS={designer:['#81a6de','#456ab5'],healthcare:['#689139','#d8b152'],community:['#ca7487','#d8b152'],research:['#456ab5','#81a6de'],impact:['#d8b152','#ca7487']};
const CATEGORY_LABELS={designer:'Designer',healthcare:'Healthcare Innovator',community:'Community Advocate',research:'Biomedical Researcher',impact:'Impact Strategist'};

const PROJECTS=[
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
  return `radial-gradient(120% 90% at 25% 20%, ${pair[0]}55, transparent 55%),
          radial-gradient(90% 70% at 70% 60%, ${pair[1]}55, transparent 60%),
          radial-gradient(120% 90% at 40% 85%, #ffffff16, transparent 60%)`;
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
renderTiles(PROJECTS);

// Detail view
const detail=document.getElementById('detail');
const detailTitle=document.getElementById('detailTitle');
const detailMeta=document.getElementById('detailMeta');
const detailDesc=document.getElementById('detailDesc');
const detailLinks=document.getElementById('detailLinks');
const detailFrame=document.getElementById('detailFrame');
const backBtn=document.getElementById('backBtn');

function openDetail(projectId){
  const p=PROJECTS.find(x=>x.id===projectId); if(!p) return;
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

document.getElementById('year').textContent=String(new Date().getFullYear());
