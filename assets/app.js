/* Sálvia — gestão para clínicas e salões
   Protótipo SaaS 100% front-end: os dados ficam no localStorage do navegador. */
'use strict';
const KEY='salvia_saas_v2';

/* ===================== Utilidades ===================== */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36).slice(-5)+Math.random().toString(36).slice(2,8);
const pad=n=>String(n).padStart(2,'0');
const dstr=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseD=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d||1)};
const today=()=>dstr(new Date());
const addDays=(s,n)=>{const d=parseD(s);d.setDate(d.getDate()+n);return dstr(d)};
const addMonths=(ym,n)=>{const[y,m]=ym.split('-').map(Number);const d=new Date(y,m-1+n,1);return `${d.getFullYear()}-${pad(d.getMonth()+1)}`};
const daysIn=ym=>{const[y,m]=ym.split('-').map(Number);return new Date(y,m,0).getDate()};
const ymOf=s=>String(s).slice(0,7);
const t2m=t=>{const[h,m]=String(t).split(':').map(Number);return h*60+(m||0)};
const m2t=m=>pad(Math.floor(m/60))+':'+pad(m%60);
const nowMin=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
const MONTHS=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const fmtD=s=>s?parseD(String(s).slice(0,10)).toLocaleDateString('pt-BR'):'—';
const fmtDT=iso=>iso?new Date(iso).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}):'—';
const monthLabel=ym=>{const[y,m]=ym.split('-').map(Number);return MONTHS[m-1]+'/'+String(y).slice(2)};
const monthLong=ym=>{const[y,m]=ym.split('-').map(Number);return new Date(y,m-1,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'})};
const longDate=s=>parseD(s).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
const wkShort=s=>parseD(s).toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','');
const capF=s=>s.charAt(0).toUpperCase()+s.slice(1);
const brl=v=>(+v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const brl0=v=>(+v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
const num=v=>(+v||0).toLocaleString('pt-BR');
const pct=(a,b)=>b?Math.round(a/b*100):0;
const onlyDigits=s=>String(s||'').replace(/\D/g,'');
const initials=n=>String(n||'?').replace(/^(Dra?\.)\s*/,'').split(' ').filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
const first=n=>String(n||'').replace(/^(Dra?\.)\s*/,'').split(' ')[0];
const byId=(arr,id)=>arr.find(x=>x.id===id);
const sum=(arr,f)=>arr.reduce((a,x)=>a+(f?f(x):x),0);
const byDT=(a,b)=>(a.date+a.time).localeCompare(b.date+b.time);
const val=id=>{const e=document.getElementById(id);return e?String(e.value).trim():''};
const chk=id=>{const e=document.getElementById(id);return !!(e&&e.checked)};

/* ===================== Ícones ===================== */
const IC={
home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>',
cal:'<rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.4 3.6 5.2"/>',
doc:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
wallet:'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/>',
box:'<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
tag:'<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="8" cy="8" r="1.5"/>',
mega:'<path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1z"/><path d="M17 8.5a5 5 0 0 1 0 7"/>',
chart:'<path d="M4 20V11M10 20V4M16 20v-7M21 20H3"/>',
team:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/>',
building:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
leaf:'<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15z"/><path d="M5 19 13 11"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
x:'<path d="M6 6l12 12M18 6 6 18"/>',
left:'<path d="m15 5-7 7 7 7"/>',right:'<path d="m9 5 7 7-7 7"/>',
wa:'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9.2 9.3c.3 2.9 2.6 5.2 5.5 5.5l1.1-1.4-2-1-.9.7a3.6 3.6 0 0 1-1.9-1.9l.7-.9-1-2z"/>',
pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
print:'<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
check:'<path d="m5 12.5 4.5 4.5L19 7"/>',
alert:'<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4M12 17h.01"/>',
gift:'<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8S10.5 3 8 4s0 4 4 4zM12 8s1.5-5 4-4 0 4-4 4z"/>',
cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
out:'<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
dl:'<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
up:'<path d="M12 21V9M7 14l5-5 5 5M4 4h16"/>',
cash:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
};
const ic=(n,s=18)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;
const logo=(s=30)=>`<span class="mark" style="width:${s}px;height:${s}px">${ic('leaf',Math.round(s*.6))}</span>`;

/* ===================== Estado ===================== */
let S;
let AFTER=[];
const ui={agendaDate:null,agendaView:'dia',agendaPro:'all',clientQ:'',cliSort:'nome',clientTab:'resumo',lastCli:null,
  finMonth:null,finTab:'lanc',finType:'all',docTab:'docs',docFilter:'all',stockTab:'prod',svcTab:'svc',repPeriod:'mes',equipeTab:'pros',lastHash:null};
const STATUS={agendado:{l:'Agendado',c:'blue'},confirmado:{l:'Confirmado',c:'sage'},atendimento:{l:'Em atendimento',c:'gold'},concluido:{l:'Concluído',c:'ink'},faltou:{l:'Faltou',c:'red'},cancelado:{l:'Cancelado',c:'mut'}};
const ROLES={
  admin:{l:'Administrador',nav:'*'},
  recepcao:{l:'Recepção',nav:['inicio','agenda','clientes','documentos','servicos','estoque','marketing']},
  profissional:{l:'Profissional',nav:['inicio','agenda','clientes','documentos']}
};
const NAV=[
 ['Principal',[['inicio','Início','home'],['agenda','Agenda','cal'],['clientes','Clientes','users']]],
 ['Clínica',[['documentos','Termos e fichas','doc'],['servicos','Serviços e pacotes','tag'],['estoque','Estoque','box']]],
 ['Gestão',[['financeiro','Financeiro','wallet'],['marketing','Marketing','mega'],['relatorios','Relatórios','chart']]],
 ['Administração',[['equipe','Equipe e acessos','team'],['rede','Unidades','building'],['config','Configurações','gear']]]
];

function load(){
  try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.version===2&&s.db)return s}catch(e){}
  return makeSeed();
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));return true}catch(e){toast('Armazenamento do navegador cheio. Exporte um backup e remova fotos antigas.');return false}}
const U=()=>byId(S.units,S.cur)||S.units[0];
const D=()=>S.db[S.cur];
const svc=id=>byId(D().services,id)||{name:'Serviço removido',dur:30,price:0,cat:''};
const pro=id=>byId(D().pros,id)||{name:'—',color:'#999',spec:'',comm:0,cats:[]};
const cli=id=>byId(D().clients,id)||{name:'Cliente removido',phone:''};
const prod=id=>byId(D().products,id);
const tpl=id=>byId(D().templates,id);
const canSee=name=>{const r=ROLES[S.session?.role]||ROLES.admin;return r.nav==='*'||r.nav.includes(name)};

/* ===================== UI base ===================== */
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),3400)}
function openModal(html,cls=''){
  closeModal();
  const ov=document.createElement('div');ov.className='ov';ov.id='ov';
  ov.innerHTML=`<div class="mdl ${cls}" role="dialog" aria-modal="true"><button class="icon-btn mdl-x" onclick="closeModal()" aria-label="Fechar">${ic('x')}</button>${html}</div>`;
  ov.addEventListener('mousedown',e=>{if(e.target===ov)closeModal()});
  document.body.appendChild(ov);document.body.classList.add('noscroll');
}
function closeModal(){const o=$('#ov');if(o)o.remove();document.body.classList.remove('noscroll')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const fld=(label,inner,cls='')=>`<label class="fld ${cls}"><span>${label}</span>${inner}</label>`;
const badge=(txt,c='')=>`<span class="badge ${c}">${txt}</span>`;
const stBadge=s=>badge(STATUS[s].l,STATUS[s].c);
const kpi=(l,v,s='',cls='')=>`<div class="kpi ${cls}"><div class="l">${l}</div><div class="v">${v}</div>${s?`<div class="s">${s}</div>`:''}</div>`;
const info=(l,v)=>`<div><small>${l}</small><b>${v}</b></div>`;
function toggleSide(open){document.body.classList.toggle('side-open',open)}
function copyText(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Link copiado.')).catch(()=>window.prompt('Copie o link:',t))}
function waLink(phone,msg){const d=onlyDigits(phone);const n=d?(d.length<=11?'55'+d:d):'';return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`}
async function sha256(s){
  try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  catch(e){let h=5381;for(let i=0;i<s.length;i++)h=(h*33^s.charCodeAt(i))>>>0;return 'djb2-'+h.toString(16)}
}
function exportCSV(name,header,rows){
  const csv='﻿'+[header,...rows].map(r=>r.map(c=>`"${String(c??'').replace(/"/g,'""')}"`).join(';')).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download=name+'.csv';document.body.appendChild(a);a.click();a.remove();
  toast('Planilha exportada.');
}
function mountPad(id){
  const c=document.getElementById(id);if(!c)return null;
  const r=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
  c.width=Math.max(1,r.width*dpr);c.height=Math.max(1,r.height*dpr);
  const x=c.getContext('2d');x.scale(dpr,dpr);x.lineWidth=2.3;x.lineCap='round';x.lineJoin='round';x.strokeStyle='#1c2621';
  let drawing=false,drawn=false;
  const pos=e=>{const b=c.getBoundingClientRect();return[e.clientX-b.left,e.clientY-b.top]};
  c.onpointerdown=e=>{drawing=true;try{c.setPointerCapture(e.pointerId)}catch(_){}x.beginPath();x.moveTo(...pos(e))};
  c.onpointermove=e=>{if(!drawing)return;x.lineTo(...pos(e));x.stroke();drawn=true};
  c.onpointerup=c.onpointercancel=c.onpointerleave=()=>{drawing=false};
  c._pad={isEmpty:()=>!drawn,data:()=>c.toDataURL('image/png'),clear:()=>{x.clearRect(0,0,c.width,c.height);drawn=false}};
  return c._pad;
}

/* Gráfico de barras em SVG */
function bars(items,series,{h=210,fmt=brl0}={}){
  const W=640,H=h,pl=8,pb=26,pt=12;
  const max=Math.max(1,...items.flatMap(i=>series.map(s=>i[s.k]||0)));
  const gw=(W-pl*2)/Math.max(1,items.length),gap=4,bw=Math.min(30,(gw-14-(series.length-1)*gap)/series.length);
  let g='';
  for(let k=1;k<=3;k++){const y=pt+(H-pb-pt)*(1-k/3);g+=`<line class="gl" x1="${pl}" x2="${W-pl}" y1="${y}" y2="${y}"/>`}
  items.forEach((it,i)=>{
    const tot=bw*series.length+gap*(series.length-1),x0=pl+i*gw+(gw-tot)/2;
    series.forEach((s,j)=>{const v=it[s.k]||0,bh=Math.max(v?2:0,(H-pb-pt)*v/max);g+=`<rect x="${x0+j*(bw+gap)}" y="${H-pb-bh}" width="${bw}" height="${bh}" rx="4" fill="${s.c}"><title>${esc(it.label)} · ${esc(s.n)}: ${fmt(v)}</title></rect>`});
    g+=`<text class="ax" x="${pl+i*gw+gw/2}" y="${H-8}" text-anchor="middle">${esc(it.label)}</text>`;
  });
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">${g}</svg>${series.length>1?`<div class="legend">${series.map(s=>`<span><i style="background:${s.c}"></i>${esc(s.n)}</span>`).join('')}</div>`:''}`;
}
const hbar=(n,v,max,txt)=>`<div class="hb"><div class="n" title="${esc(n)}">${esc(n)}</div><div class="bar"><i style="width:${max?Math.max(2,v/max*100):0}%"></i></div><div class="v">${txt}</div></div>`;

/* ===================== Cálculos ===================== */
function finSum(db,type,from,to,status='pago'){return sum(db.fin.filter(f=>f.type===type&&(!status||f.status===status)&&f.date>=from&&f.date<=to),f=>f.value)}
function monthRange(m){return[m+'-01',m+'-'+pad(daysIn(m))]}
function cliStats(db=D()){const m={};db.appts.forEach(a=>{if(a.status!=='concluido')return;const s=m[a.clientId]||(m[a.clientId]={visits:0,total:0,last:''});s.visits++;s.total+=a.charged||0;if(a.date>s.last)s.last=a.date});return m}
function paperStats(from,to,db=D()){
  let dig=0,pap=0,sheets=0,psheets=0,an=0;
  db.docs.forEach(x=>{if(x.status!=='assinado')return;const dt=String(x.signedAt||x.createdAt).slice(0,10);if(dt<from||dt>to)return;const pg=(byId(db.templates,x.tplId)||{pages:1}).pages||1;if(x.mode==='digital'){dig++;sheets+=pg}else{pap++;psheets+=pg}});
  const pctDocs=pct(dig,dig+pap);
  db.records.forEach(r=>{if(r.type==='anamnese'&&r.date>=from&&r.date<=to){an++;sheets+=2}});
  return{dig:dig+an,pap,sheets,psheets,pct:pctDocs,saved:sheets*(S.org.paperCost||.35)};
}
function availablePkg(clientId,svcId){const db=D();for(const cp of db.clientPkgs){if(cp.clientId!==clientId||cp.used>=cp.total)continue;const p=byId(db.packages,cp.pkgId);if(p&&p.svcId===svcId)return{cp,pkg:p,name:p.name,left:cp.total-cp.used}}return null}
function hasConflict(db,proId,date,time,dur,ignore){const s=t2m(time),e=s+dur;return db.appts.some(a=>a.id!==ignore&&a.proId===proId&&a.date===date&&a.status!=='cancelado'&&t2m(a.time)<e&&t2m(a.time)+a.dur>s)}
function birthdays(db=D(),days=null){const t=today(),m=t.slice(5,7);return db.clients.filter(c=>{if(!c.birth)return false;if(days===null)return c.birth.slice(5,7)===m;for(let i=0;i<=days;i++){if(addDays(t,i).slice(5)===c.birth.slice(5))return true}return false}).sort((a,b)=>a.birth.slice(5).localeCompare(b.birth.slice(5)))}
function inactive(db=D(),days=60){const st=cliStats(db),lim=addDays(today(),-days);const fut=new Set(db.appts.filter(a=>a.date>=today()&&a.status!=='cancelado').map(a=>a.clientId));return db.clients.filter(c=>st[c.id]&&st[c.id].last<lim&&!fut.has(c.id)).map(c=>({c,last:st[c.id].last,total:st[c.id].total})).sort((a,b)=>b.total-a.total)}
function commissions(db,m){const[a,b]=monthRange(m);return db.pros.map(p=>{const list=db.appts.filter(x=>x.proId===p.id&&x.status==='concluido'&&x.date>=a&&x.date<=b);const base=sum(list,x=>x.charged||0);return{p,count:list.length,base,value:Math.round(base*(p.comm||0))/100}})}
const docTpl=(db,d)=>byId(db.templates,d.tplId)||{name:'Documento',cat:'',pages:1,body:''};
function docVars(doc,db=D(),unit=U()){
  const c=byId(db.clients,doc.clientId)||{},p=byId(db.pros,doc.proId),s=byId(db.services,doc.svcId);
  return{cliente:c.name||'________________',cpf:c.cpf||'___.___.___-__',profissional:p?p.name:'equipe responsável',servico:s?s.name:'procedimento estético',
    clinica:S.org.name+' — '+unit.name,cidade:String(unit.city||'').split('/')[0],data:new Date(doc.signedAt||doc.createdAt).toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'})};
}
const fillTpl=(body,v)=>String(body).replace(/\{\{(\w+)\}\}/g,(m,k)=>v[k]??m);
const docText=(doc,db=D(),unit=U())=>doc.text||fillTpl(docTpl(db,doc).body,docVars(doc,db,unit));

/* ===================== Roteamento ===================== */
const route=()=>{const h=location.hash.replace(/^#\/?/,'')||'';const p=h.split('/').map(decodeURIComponent);return{name:p[0]||'',args:p.slice(1)}};
const go=p=>{location.hash='#/'+p};
window.addEventListener('hashchange',render);
const PAGES={inicio:pgInicio,agenda:pgAgenda,clientes:pgClientes,cliente:pgCliente,documentos:pgDocumentos,servicos:pgServicos,estoque:pgEstoque,financeiro:pgFinanceiro,marketing:pgMarketing,relatorios:pgRelatorios,equipe:pgEquipe,rede:pgRede,config:pgConfig};

function render(){
  const r=route();
  if(location.hash!==ui.lastHash){ui.lastHash=location.hash;closeModal();window.scrollTo(0,0);toggleSide(false)}
  if(r.name==='agendar')return renderBooking(r.args[0]||S.cur);
  if(r.name==='assinar')return renderPublicSign(r.args[0],r.args[1]);
  if(!S.session){if(r.name!=='login'){location.replace('#/login');return}return renderLogin()}
  if(r.name==='login'||!r.name||!PAGES[r.name]){location.replace('#/inicio');return}
  if(!S.db[S.cur])S.cur=S.units[0].id;
  if(r.name==='cliente'&&r.args[0]!==ui.lastCli){ui.lastCli=r.args[0];ui.clientTab='resumo'}
  const key=r.name==='cliente'?'clientes':r.name;
  const page=canSee(key)?PAGES[r.name](...r.args):pgDenied();
  $('#root').innerHTML=`<div class="shell">${sidebar(key)}<div class="main">${topbar()}<div class="page" id="page">${page}</div></div></div><div class="scrim" onclick="toggleSide(false)"></div>`;
  const q=AFTER;AFTER=[];q.forEach(f=>f());
}
function sidebar(active){
  const d=D(),pend=d.docs.filter(x=>x.status==='pendente').length,low=d.products.filter(p=>p.qty<=p.min).length;
  const cnt={documentos:pend,estoque:low};
  return `<aside class="side" id="side">
  <div class="brand">${logo()}<span>Sálvia</span></div>
  <div class="org"><div class="org-n">${esc(S.org.name)}</div>${S.units.length>1?`<select class="unit-sel" onchange="switchUnit(this.value)" aria-label="Unidade">${S.units.map(u=>`<option value="${u.id}" ${u.id===S.cur?'selected':''}>${esc(u.name)}</option>`).join('')}</select>`:`<div class="org-u">${esc(U().name)}</div>`}</div>
  <nav class="nav">${NAV.map(([sec,items])=>{const vis=items.filter(i=>canSee(i[0]));return vis.length?`<div class="sec">${sec}</div>`+vis.map(([k,l,i])=>`<a href="#/${k}" class="${k===active?'on':''}">${ic(i)}<span>${l}</span>${cnt[k]?`<span class="cnt">${cnt[k]}</span>`:''}</a>`).join(''):''}).join('')}</nav>
  <div class="me"><div class="av">${initials(S.session.name)}</div><div class="me-t"><b>${esc(S.session.name)}</b><select onchange="setRole(this.value)" title="Simular perfil de acesso" aria-label="Perfil">${Object.entries(ROLES).map(([k,v])=>`<option value="${k}" ${k===S.session.role?'selected':''}>${v.l}</option>`).join('')}</select></div><button class="icon-btn" onclick="logout()" title="Sair" aria-label="Sair">${ic('out')}</button></div>
  </aside>`;
}
function topbar(){
  return `<header class="top"><button class="icon-btn burger" onclick="toggleSide(true)" aria-label="Menu">${ic('menu')}</button>
  <div class="search">${ic('search',16)}<input placeholder="Buscar cliente…" aria-label="Buscar cliente" onkeydown="if(event.key==='Enter'){ui.clientQ=this.value;go('clientes');render()}"></div>
  ${S.demo?'<span class="demo-pill">Demonstração · dados fictícios</span>':''}
  <div class="top-act"><a class="btn ghost sm hide-m" href="#/agendar/${S.cur}" target="_blank" rel="noopener">${ic('ext',15)} Agendamento online</a><button class="btn pri sm" onclick="newAppt()">${ic('plus',15)} Agendar</button></div></header>`;
}
function switchUnit(id){S.cur=id;ui.agendaPro='all';save();toast('Unidade: '+U().name);render()}
function setRole(r){S.session.role=r;save();toast('Visualizando como '+ROLES[r].l);const k=route().name;if(!canSee(k==='cliente'?'clientes':k))go('inicio');else render()}
function logout(){S.session=null;save();go('login')}
const pgDenied=()=>`<div class="card empty-state"><h3>Acesso restrito</h3><p>O perfil <b>${ROLES[S.session.role].l}</b> não tem permissão para este módulo.</p><a class="btn" href="#/inicio">Voltar ao início</a></div>`;

/* ===================== Login ===================== */
function renderLogin(){
  $('#root').innerHTML=`<div class="login"><div class="login-art"><div class="brand light">${logo()}<span>Sálvia</span></div>
  <div class="login-q"><h1>Sua clínica, inteira, num só lugar.</h1><p>Agenda, prontuário, termos assinados na tela, financeiro e estoque — para uma ou várias unidades.</p></div>
  <ul class="login-l"><li>${ic('check',16)} Termos e anamnese assinados no tablet, sem papel</li><li>${ic('check',16)} Agendamento online e confirmação por WhatsApp</li><li>${ic('check',16)} Financeiro, comissões e estoque integrados</li><li>${ic('check',16)} Várias unidades com painel consolidado</li></ul></div>
  <div class="login-f"><form onsubmit="event.preventDefault();doLogin()"><div class="brand" style="margin-bottom:6px">${logo()}<span>Sálvia</span></div><h2>Entrar</h2><p class="muted" style="margin:-8px 0 4px">Acesse o painel da sua clínica.</p>
  ${fld('E-mail',`<select id="lg_e">${S.users.map(u=>`<option value="${esc(u.email)}">${esc(u.email)} — ${ROLES[u.role].l}</option>`).join('')}</select>`)}
  ${fld('Senha',`<input id="lg_p" type="password" value="demonstracao" autocomplete="current-password">`)}
  <button class="btn pri block" type="submit">Entrar</button>
  <p class="note center">Ambiente de demonstração: escolha um usuário e entre. Não há validação de senha nesta versão.</p>
  <a class="link-s" href="index.html">← Voltar ao site</a></form></div></div>`;
}
function doLogin(){const e=val('lg_e');const u=S.users.find(x=>x.email===e)||S.users[0];S.session={name:u.name,email:u.email,role:u.role};if(u.unit&&u.unit!=='all'&&S.db[u.unit])S.cur=u.unit;save();go('inicio')}

/* ===================== Início ===================== */
function pgInicio(){
  const d=D(),u=U(),t=today(),m=ymOf(t),pm=addMonths(m,-1),dd=+t.slice(8);
  const rM=finSum(d,'in',m+'-01',t),rP=finSum(d,'in',pm+'-01',pm+'-'+pad(Math.min(dd,daysIn(pm))));
  const vr=rP?Math.round((rM-rP)/rP*100):0;
  const doneM=d.appts.filter(a=>a.status==='concluido'&&ymOf(a.date)===m);
  const ticket=doneM.length?sum(doneM,a=>a.charged||0)/doneM.length:0;
  const todayA=d.appts.filter(a=>a.date===t&&a.status!=='cancelado').sort(byDT);
  const cap=Math.max(1,d.pros.filter(p=>p.active).length*(t2m(u.close)-t2m(u.open)));
  const occ=Math.min(100,pct(sum(todayA,a=>a.dur),cap));
  const pend=d.docs.filter(x=>x.status==='pendente'),low=d.products.filter(p=>p.qty<=p.min);
  const bd=birthdays(d,7),pay=d.fin.filter(f=>f.type==='out'&&f.status==='pendente'&&f.date<=addDays(t,7));
  const unconf=d.appts.filter(a=>a.date===addDays(t,1)&&a.status==='agendado');
  const ch=[...Array(6)].map((_,i)=>{const mm=addMonths(m,i-5),[a,b]=monthRange(mm);return{label:monthLabel(mm),a:finSum(d,'in',a,b),b:finSum(d,'out',a,b)}});
  const ps=paperStats(m+'-01',t),h=new Date().getHours(),greet=h<12?'Bom dia':h<18?'Boa tarde':'Boa noite';
  const alerts=[
    pend.length&&`<div class="alert gold" onclick="ui.docTab='docs';ui.docFilter='pendente';go('documentos')">${ic('doc',18)}<div><b>${pend.length} termo(s) aguardando assinatura</b>Colete no tablet ou envie o link pelo WhatsApp.</div></div>`,
    unconf.length&&`<div class="alert sage" onclick="go('marketing')">${ic('wa',18)}<div><b>${unconf.length} atendimento(s) de amanhã sem confirmação</b>Envie a confirmação em um clique.</div></div>`,
    low.length&&`<div class="alert red" onclick="go('estoque')">${ic('box',18)}<div><b>${low.length} produto(s) no estoque mínimo</b>${esc(low.slice(0,3).map(p=>p.name).join(', '))}${low.length>3?'…':''}</div></div>`,
    pay.length&&`<div class="alert clay" onclick="ui.finTab='lanc';ui.finType='out';go('financeiro')">${ic('wallet',18)}<div><b>${pay.length} conta(s) a pagar nos próximos 7 dias</b>Total de ${brl(sum(pay,f=>f.value))}.</div></div>`,
    bd.length&&`<div class="alert" onclick="go('marketing')">${ic('gift',18)}<div><b>${bd.length} aniversariante(s) nesta semana</b>${esc(bd.slice(0,3).map(c=>first(c.name)).join(', '))}${bd.length>3?'…':''}</div></div>`
  ].filter(Boolean).join('')||'<p class="empty-s">Tudo em dia por aqui.</p>';
  return `<div class="ph"><div><div class="eyebrow">${esc(u.name)} · ${capF(longDate(t))}</div><h1 class="title">${greet}${/^(Gestão|Recepção)/.test(S.session.name)?', equipe '+esc(first(S.org.name)):', '+esc(first(S.session.name))}.</h1></div>
  <div class="ph-act"><button class="btn" onclick="go('agenda')">${ic('cal',16)} Ver agenda</button><button class="btn pri" onclick="newAppt()">${ic('plus',16)} Novo agendamento</button></div></div>
  <div class="kpis">
   ${canSee('financeiro')?kpi('Faturamento do mês',brl0(rM),`<span class="${vr>=0?'up':'down'}">${vr>=0?'▲':'▼'} ${Math.abs(vr)}%</span> vs. mesmo período de ${MONTHS[+pm.slice(5)-1]}`,'dark'):''}
   ${kpi('Atendimentos hoje',todayA.length,`${todayA.filter(a=>a.status==='concluido').length} concluídos · ${todayA.filter(a=>a.status==='confirmado').length} confirmados`)}
   ${kpi('Ocupação da agenda hoje',occ+'%',`<div class="prog" style="margin-top:6px"><i style="width:${occ}%"></i></div>`)}
   ${canSee('financeiro')?kpi('Ticket médio no mês',brl0(ticket),`${doneM.length} atendimentos concluídos`):kpi('Clientes',num(d.clients.length),'cadastrados na unidade')}
  </div>
  <div class="g g21">
   <div class="card"><div class="card-h"><h3>Agenda de hoje</h3><a class="btn ghost sm" href="#/agenda">Abrir agenda ${ic('right',14)}</a></div>
    <div class="list">${todayA.slice(0,8).map(a=>{const c=cli(a.clientId),s=svc(a.svcId),p=pro(a.proId);return `<div class="li" onclick="openAppt('${a.id}')"><div class="t">${a.time}</div><span class="dot" style="background:${p.color}"></span><div class="b"><b>${esc(c.name)}</b><small>${esc(s.name)} · ${esc(p.name)}</small></div>${stBadge(a.status)}</div>`}).join('')||'<p class="empty-s">Nenhum atendimento hoje.</p>'}
    ${todayA.length>8?`<p class="note">+ ${todayA.length-8} atendimentos</p>`:''}</div></div>
   <div class="card"><div class="card-h"><h3>Atenção</h3></div>${alerts}</div>
  </div>
  <div class="g g21">
   ${canSee('financeiro')?`<div class="card"><div class="card-h"><h3>Receitas e despesas</h3><span class="sub">Últimos 6 meses</span></div>${bars(ch,[{k:'a',n:'Receitas',c:'#4a7561'},{k:'b',n:'Despesas',c:'#e0b9a6'}])}</div>`:`<div class="card"><div class="card-h"><h3>Próximos dias</h3></div>${[1,2,3].map(i=>{const dd2=addDays(t,i),n=d.appts.filter(a=>a.date===dd2&&a.status!=='cancelado').length;return hbar(capF(longDate(dd2)),n,20,n+' atend.')}).join('')}</div>`}
   <div class="card"><div class="card-h"><h3>${ic('leaf',18)} Papel evitado no mês</h3></div>
    <div class="total">${num(ps.sheets)} folhas</div><p class="muted" style="font-size:.85rem">${ps.dig} documentos digitais · ≈ ${brl(ps.saved)} em impressão evitada</p>
    <div class="lbl">Assinaturas digitais</div><div class="prog"><i style="width:${ps.pct}%"></i></div><p class="note">${ps.pct}% dos termos do mês foram assinados na tela. Estimativa com base no nº de páginas de cada modelo.</p></div>
  </div>`;
}

/* ===================== Agenda ===================== */
function pgAgenda(){
  const d=D(),date=ui.agendaDate||(ui.agendaDate=today()),view=ui.agendaView;
  const act=d.pros.filter(p=>p.active),pros=act.filter(p=>ui.agendaPro==='all'||p.id===ui.agendaPro);
  const dayA=d.appts.filter(a=>a.date===date&&a.status!=='cancelado'&&pros.some(p=>p.id===a.proId));
  const head=`<div class="ph"><div><div class="eyebrow">Agenda · ${esc(U().name)}</div><h1 class="title">${capF(view==='dia'?longDate(date):'Semana de '+fmtD(weekStart(date)))}</h1></div>
  <div class="ph-act"><div class="seg"><button class="${view==='dia'?'on':''}" onclick="ui.agendaView='dia';render()">Dia</button><button class="${view==='semana'?'on':''}" onclick="ui.agendaView='semana';render()">Semana</button></div>
  <div class="datenav"><button class="icon-btn" onclick="agShift(-1)" aria-label="Anterior">${ic('left',16)}</button><button class="btn ghost sm" onclick="ui.agendaDate=today();render()">Hoje</button><button class="icon-btn" onclick="agShift(1)" aria-label="Próximo">${ic('right',16)}</button><input type="date" value="${date}" onchange="ui.agendaDate=this.value||today();render()" aria-label="Data"></div>
  <select onchange="ui.agendaPro=this.value;render()" aria-label="Profissional"><option value="all">Todos os profissionais</option>${act.map(p=>`<option value="${p.id}" ${ui.agendaPro===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
  <button class="btn pri" onclick="newAppt({date:'${date}'})">${ic('plus',16)} Agendar</button></div></div>`;
  if(!act.length)return head+`<div class="card empty-state"><h3>Nenhum profissional ativo</h3><p>Cadastre a equipe desta unidade para começar a agendar.</p><a class="btn pri" href="#/equipe">Cadastrar profissionais</a></div>`;
  const sumy=view==='dia'?`<div class="ag-sum">${badge(dayA.length+' atendimentos','ink')}${badge(dayA.filter(a=>a.status==='confirmado').length+' confirmados','sage')}${badge(dayA.filter(a=>a.status==='agendado').length+' a confirmar','blue')}${badge(dayA.filter(a=>a.status==='concluido').length+' concluídos')}${canSee('financeiro')?badge('Previsto '+brl0(sum(dayA,a=>a.charged??a.price)),'gold'):''}<span class="note" style="margin:0 0 0 auto">Clique num horário livre para agendar.</span></div>`:'';
  return head+sumy+(view==='dia'?agDay(date,pros):agWeek(date,pros));
}
const weekStart=s=>addDays(s,-((parseD(s).getDay()+6)%7));
function agShift(n){ui.agendaDate=addDays(ui.agendaDate||today(),(ui.agendaView==='semana'?7:1)*n);render()}
function agDay(date,pros){
  const u=U(),open=t2m(u.open),close=t2m(u.close),slot=+u.slot||30,RH=44,H=(close-open)/slot*RH;
  const list=D().appts.filter(a=>a.date===date&&a.status!=='cancelado');
  let times='';for(let m=open;m<close;m+=slot)times+=`<div class="ag-t" style="height:${RH}px">${m%60===0||slot<60?m2t(m):''}</div>`;
  const nm=nowMin(),now=date===today()&&nm>=open&&nm<=close?`<div class="ag-now" style="top:${(nm-open)/slot*RH}px"></div>`:'';
  const cols=pros.map(p=>`<div class="ag-col" style="height:${H}px;background-size:100% ${RH}px" onclick="agClick(event,'${p.id}')">${now}${list.filter(a=>a.proId===p.id).map(a=>apBlock(a,p,open,slot,RH)).join('')}</div>`).join('');
  AFTER.push(()=>{const sc=$('#agScroll');if(sc&&date===today())sc.scrollTop=Math.max(0,(nm-open)/slot*RH-140)});
  return `<div class="card ag"><div class="ag-scroll" id="agScroll"><div class="ag-grid" style="grid-template-columns:58px repeat(${pros.length},minmax(180px,1fr))">
  <div class="ag-hd ag-corner"></div>${pros.map(p=>{const n=list.filter(a=>a.proId===p.id).length;return `<div class="ag-hd"><div class="av sm" style="background:${p.color};color:#fff">${initials(p.name)}</div><div><b>${esc(p.name)}</b><small>${esc(p.spec)} · ${n} atend.</small></div></div>`}).join('')}
  <div class="ag-times">${times}</div>${cols}</div></div></div>`;
}
function apBlock(a,p,open,slot,RH){
  const c=cli(a.clientId),s=svc(a.svcId),top=(t2m(a.time)-open)/slot*RH,h=Math.max(RH-4,a.dur/slot*RH-4);
  return `<div class="ap st-${a.status}" style="top:${top+2}px;height:${h}px;--pc:${p.color}" onclick="event.stopPropagation();openAppt('${a.id}')" title="${esc(c.name)} — ${esc(s.name)}"><div class="ap-t">${a.time} · ${esc(s.name)}</div><div class="ap-c">${esc(c.name)}</div>${h>60?`<div class="ap-s">${STATUS[a.status].l}${a.origin==='online'?' · online':''}</div>`:''}</div>`;
}
function agClick(e,proId){
  if(e.target.closest('.ap'))return;
  const u=U(),open=t2m(u.open),slot=+u.slot||30,RH=44,r=e.currentTarget.getBoundingClientRect();
  const m=open+Math.floor((e.clientY-r.top)/RH)*slot;if(m>=t2m(u.close))return;
  newAppt({date:ui.agendaDate,time:m2t(m),proId});
}
function agWeek(date,pros){
  const mon=weekStart(date),ids=new Set(pros.map(p=>p.id)),t=today();
  return `<div class="wk">${[...Array(7)].map((_,i)=>{const dd=addDays(mon,i);const list=D().appts.filter(a=>a.date===dd&&ids.has(a.proId)&&a.status!=='cancelado').sort(byDT);
    return `<div class="wk-d ${dd===t?'is-today':''}"><div class="wk-h" onclick="ui.agendaDate='${dd}';ui.agendaView='dia';render()" title="Abrir o dia"><span>${wkShort(dd)}</span><b>${+dd.slice(8)}</b><small>${list.length} atend.</small></div>
    <div class="wk-l">${list.map(a=>{const p=pro(a.proId),c=cli(a.clientId),s=svc(a.svcId);return `<div class="wk-a st-${a.status}" style="--pc:${p.color}" onclick="openAppt('${a.id}')"><b>${a.time}</b> ${esc(first(c.name))}<small>${esc(s.name)}</small></div>`}).join('')||'<div class="empty-s">Livre</div>'}</div></div>`}).join('')}</div>`;
}
const cliLabel=c=>`${c.name} · ${c.phone||'sem telefone'}`;
function findCli(v,db=D()){v=String(v).trim();return db.clients.find(c=>cliLabel(c)===v)||db.clients.find(c=>c.name.toLowerCase()===v.toLowerCase())}
function proOptions(sel,svcId){const d=D(),s=svcId?svc(svcId):null;let list=d.pros.filter(p=>p.active&&(!s||p.cats.includes(s.cat)));if(!list.length)list=d.pros.filter(p=>p.active);return list.map(p=>`<option value="${p.id}" ${p.id===sel?'selected':''}>${esc(p.name)}</option>`).join('')}
function timeOptions(sel){const u=U(),slot=+u.slot||30;let o='';for(let m=t2m(u.open);m<t2m(u.close);m+=slot)o+=`<option ${m2t(m)===sel?'selected':''}>${m2t(m)}</option>`;return o}
function newAppt(pre={}){
  const d=D();if(!d.pros.some(p=>p.active)){toast('Cadastre um profissional antes de agendar.');return go('equipe')}
  const c0=pre.clientId?cli(pre.clientId):null;
  const s0=pre.svcId||(pre.proId?(d.services.find(s=>pro(pre.proId).cats.includes(s.cat))||{}).id:d.services[0]?.id);
  openModal(`<h2 class="mt">Novo agendamento</h2><p class="muted" style="margin-bottom:14px">${esc(U().name)}</p><div class="frm">
  ${fld('Cliente',`<input id="ap_cli" list="dl_cli" placeholder="Digite o nome (novo ou existente)" value="${c0?esc(cliLabel(c0)):''}" autocomplete="off"><datalist id="dl_cli">${d.clients.map(c=>`<option value="${esc(cliLabel(c))}"></option>`).join('')}</datalist>`,'full')}
  ${fld('WhatsApp (para cliente novo)',`<input id="ap_tel" inputmode="tel" placeholder="(41) 90000-0000">`)}
  ${fld('Serviço',`<select id="ap_svc" onchange="$('#ap_pro').innerHTML=proOptions($('#ap_pro').value,this.value)">${d.services.filter(s=>s.active!==false).map(s=>`<option value="${s.id}" ${s.id===s0?'selected':''}>${esc(s.name)} · ${s.dur} min · ${brl0(s.price)}</option>`).join('')}</select>`)}
  ${fld('Profissional',`<select id="ap_pro">${proOptions(pre.proId,s0)}</select>`)}
  ${fld('Data',`<input type="date" id="ap_date" value="${pre.date||ui.agendaDate||today()}">`)}
  ${fld('Horário',`<select id="ap_time">${timeOptions(pre.time||'09:00')}</select>`)}
  ${fld('Observações',`<textarea id="ap_obs" rows="2" placeholder="Opcional"></textarea>`,'full')}
  </div><div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveAppt()">${ic('check',16)} Agendar</button></div>`);
}
function newClientObj(o){return Object.assign({id:'c'+uid(),name:'',phone:'',email:'',cpf:'',birth:'',createdAt:today(),origin:'Recepção',tags:[],obs:''},o)}
function saveAppt(){
  const d=D(),v=val('ap_cli');if(!v)return toast('Informe o cliente.');
  let c=findCli(v);if(!c){c=newClientObj({name:v.split(' · ')[0],phone:val('ap_tel')});d.clients.push(c)}
  const s=svc(val('ap_svc')),date=val('ap_date'),time=val('ap_time'),proId=val('ap_pro');
  if(!date)return toast('Informe a data.');
  if(hasConflict(d,proId,date,time,s.dur)&&!confirm(pro(proId).name+' já tem atendimento nesse horário. Agendar mesmo assim?'))return;
  d.appts.push({id:'a'+uid(),clientId:c.id,svcId:s.id,proId,date,time,dur:s.dur,price:s.price,status:'agendado',obs:val('ap_obs'),origin:'recepção',createdAt:today()});
  save();closeModal();ui.agendaDate=date;ui.agendaView='dia';toast('Agendamento criado para '+fmtD(date)+' às '+time+'.');
  if(route().name!=='agenda')go('agenda');else render();
}
const confirmMsg=a=>{const c=cli(a.clientId);return `Olá, ${first(c.name)}! Passando para confirmar seu horário de ${svc(a.svcId).name} na ${S.org.name} (${U().name}) em ${fmtD(a.date)} às ${a.time}. Podemos confirmar?`};
function openAppt(id){
  const d=D(),a=byId(d.appts,id);if(!a)return;
  const c=cli(a.clientId),s=svc(a.svcId),p=pro(a.proId),doc=s.tpl?d.docs.find(x=>x.apptId===a.id):null,pk=availablePkg(a.clientId,a.svcId),done=a.status==='concluido';
  const docHtml=s.tpl?`<div class="docline">${ic('doc',16)} <b>Termo de consentimento:</b> ${doc?(doc.status==='assinado'?`${badge(doc.mode==='papel'?'Assinado em papel':'Assinado digitalmente','sage')} <button class="btn ghost sm" onclick="openDoc('${doc.id}')">Ver</button>`:`${badge('Pendente','gold')} <button class="btn sm" onclick="openDoc('${doc.id}')">${ic('pen',14)} Coletar assinatura</button>`):`${badge('Não gerado','mut')} <button class="btn sm" onclick="createDocForAppt('${a.id}')">Gerar termo</button>`}</div>`:'';
  openModal(`<div class="mh"><div class="av lg" style="background:${p.color}">${initials(c.name)}</div><div><h2 class="mt" style="margin:0">${esc(c.name)}</h2><div class="muted">${esc(s.name)} · ${esc(p.name)}</div></div></div>
  <div class="info">${info('Data',fmtD(a.date)+' · '+a.time)}${info('Duração',a.dur+' min')}${info(done?'Cobrado':'Valor',a.pkgUsed?'Sessão de pacote':brl(a.charged??a.price))}${info('Origem',a.origin==='online'?'Agendamento online':'Recepção')}</div>
  ${a.obs?`<p class="note">Obs.: ${esc(a.obs)}</p>`:''}
  <div class="lbl">Status</div><div class="chips">${done?stBadge('concluido'):['agendado','confirmado','atendimento','faltou','cancelado'].map(k=>`<button class="chip ${a.status===k?'on':''}" onclick="setApptStatus('${a.id}','${k}')">${STATUS[k].l}</button>`).join('')}</div>
  ${docHtml}${pk&&!done?`<div class="docline">${ic('gift',16)} Pacote disponível: <b>${esc(pk.name)}</b> · ${pk.left} sessão(ões) restante(s)</div>`:''}
  <div class="mf">${!done?`<button class="btn ghost danger" onclick="delAppt('${a.id}')" title="Excluir">${ic('trash',16)}</button>`:''}<span class="sp"></span>
   <a class="btn ghost" href="${waLink(c.phone,confirmMsg(a))}" target="_blank" rel="noopener">${ic('wa',16)} WhatsApp</a>
   <button class="btn ghost" onclick="closeModal();go('cliente/${c.id}')">Prontuário</button>
   ${!done?`<button class="btn ghost" onclick="editAppt('${a.id}')">Remarcar</button>`:''}
   ${!done&&a.status!=='cancelado'?`<button class="btn pri" onclick="checkout('${a.id}')">${ic('cash',16)} Finalizar e cobrar</button>`:''}</div>`);
}
function setApptStatus(id,st){const a=byId(D().appts,id);a.status=st;save();render();openAppt(id);toast('Status: '+STATUS[st].l)}
function delAppt(id){if(!confirm('Excluir este agendamento?'))return;const d=D();d.appts=d.appts.filter(a=>a.id!==id);d.docs=d.docs.filter(x=>!(x.apptId===id&&x.status==='pendente'));save();closeModal();render();toast('Agendamento excluído.')}
function editAppt(id){
  const a=byId(D().appts,id);
  openModal(`<h2 class="mt">Remarcar</h2><p class="muted" style="margin-bottom:14px">${esc(cli(a.clientId).name)} · ${esc(svc(a.svcId).name)}</p><div class="frm">
  ${fld('Data',`<input type="date" id="ea_date" value="${a.date}">`)}${fld('Horário',`<select id="ea_time">${timeOptions(a.time)}</select>`)}
  ${fld('Profissional',`<select id="ea_pro">${proOptions(a.proId,a.svcId)}</select>`,'full')}</div>
  <div class="mf"><button class="btn ghost" onclick="openAppt('${id}')">Voltar</button><button class="btn pri" onclick="saveEditAppt('${id}')">Salvar</button></div>`);
}
function saveEditAppt(id){
  const d=D(),a=byId(d.appts,id),date=val('ea_date'),time=val('ea_time'),proId=val('ea_pro');
  if(hasConflict(d,proId,date,time,a.dur,id)&&!confirm('Há conflito de horário. Remarcar mesmo assim?'))return;
  Object.assign(a,{date,time,proId,status:'agendado'});save();ui.agendaDate=date;render();openAppt(id);toast('Atendimento remarcado.');
}
function checkout(id){
  const a=byId(D().appts,id),s=svc(a.svcId),c=cli(a.clientId),pk=availablePkg(a.clientId,a.svcId);
  const doc=s.tpl?D().docs.find(x=>x.apptId===a.id):null;
  const ins=(s.ins||[]).map(([pid,q])=>{const p=prod(pid);return p?`<li>${esc(p.name)} — ${q} ${esc(p.unit)} <span class="muted">(em estoque: ${p.qty})</span></li>`:''}).join('');
  openModal(`<h2 class="mt">Finalizar atendimento</h2><p class="muted" style="margin-bottom:14px">${esc(c.name)} · ${esc(s.name)} · ${esc(pro(a.proId).name)}</p>
  ${s.tpl&&(!doc||doc.status!=='assinado')?`<div class="alert gold" onclick="${doc?`openDoc('${doc.id}')`:`createDocForAppt('${a.id}')`}">${ic('alert',18)}<div><b>Termo de consentimento ainda não assinado</b>Clique para coletar a assinatura antes de concluir.</div></div>`:''}
  <div class="frm">
  ${pk?fld('Usar sessão do pacote?',`<select id="co_pkg" onchange="coUpd()"><option value="">Não — cobrar avulso</option><option value="${pk.cp.id}" selected>Sim — ${esc(pk.name)} (${pk.left} restante(s))</option></select>`,'full'):''}
  ${fld('Valor (R$)',`<input id="co_val" type="number" step="0.01" min="0" value="${a.price}" oninput="coUpd()">`)}
  ${fld('Desconto (%)',`<input id="co_desc" type="number" min="0" max="100" value="0" oninput="coUpd()">`)}
  ${fld('Forma de pagamento',`<select id="co_met">${METHODS.map(m=>`<option>${m}</option>`).join('')}</select>`)}
  ${fld('Total',`<div class="total" id="co_tot">${brl(a.price)}</div>`)}
  ${fld('Evolução no prontuário (opcional)',`<textarea id="co_evo" rows="3" placeholder="Como foi o atendimento, produtos usados, orientações…"></textarea>`,'full')}
  </div>${ins?`<div class="lbl">Baixa automática de estoque</div><ul class="ul">${ins}</ul>`:''}
  <div class="mf"><button class="btn ghost" onclick="openAppt('${a.id}')">Voltar</button><button class="btn pri" onclick="doCheckout('${a.id}')">${ic('check',16)} Concluir e lançar</button></div>`);
  coUpd();
}
function coUpd(){const t=$('#co_tot');if(!t)return;const pk=val('co_pkg'),v=+val('co_val')||0,ds=Math.min(100,+val('co_desc')||0);t.textContent=pk?'Sessão do pacote':brl(v*(1-ds/100));['co_val','co_desc','co_met'].forEach(i=>{const e=$('#'+i);if(e)e.disabled=!!pk})}
function doCheckout(id){
  const d=D(),a=byId(d.appts,id),s=svc(a.svcId),c=cli(a.clientId),pkId=val('co_pkg');
  if(pkId){const cp=byId(d.clientPkgs,pkId),pk=byId(d.packages,cp.pkgId);cp.used++;a.pkgUsed=cp.id;a.charged=Math.round(pk.price/pk.sessions*100)/100}
  else{const v=+val('co_val')||0,ds=Math.min(100,+val('co_desc')||0),tot=Math.round(v*(1-ds/100)*100)/100;a.charged=tot;
    if(tot>0)d.fin.push({id:'f'+uid(),type:'in',desc:s.name,cat:'Serviços',value:tot,date:today(),method:val('co_met'),status:'pago',apptId:a.id,proId:a.proId,clientId:c.id})}
  (s.ins||[]).forEach(([pid,q])=>{const p=prod(pid);if(!p)return;p.qty=Math.max(0,p.qty-q);d.moves.push({id:'m'+uid(),prodId:pid,type:'out',qty:q,date:today(),reason:'Atendimento: '+s.name+' — '+c.name})});
  const evo=val('co_evo');if(evo)d.records.push({id:'r'+uid(),type:'evolucao',clientId:c.id,proId:a.proId,svcId:s.id,date:today(),text:evo,at:new Date().toISOString(),by:S.session.name});
  a.status='concluido';a.doneAt=new Date().toISOString();save();closeModal();render();
  toast(pkId?'Sessão do pacote registrada e estoque atualizado.':'Atendimento concluído: receita lançada e estoque atualizado.');
}

/* ===================== Clientes ===================== */
function pgClientes(){
  const d=D();
  return `<div class="ph"><div><div class="eyebrow">Clientes</div><h1 class="title">${num(d.clients.length)} clientes</h1></div>
  <div class="ph-act">${canSee('financeiro')?`<button class="btn ghost" onclick="exportClients()">${ic('dl',16)} Exportar</button>`:''}<button class="btn pri" onclick="editClient()">${ic('plus',16)} Novo cliente</button></div></div>
  <div class="card"><div class="toolbar"><div class="search in">${ic('search',16)}<input id="cliQ" placeholder="Buscar por nome, telefone ou etiqueta" value="${esc(ui.clientQ)}" oninput="ui.clientQ=this.value;$('#cliRows').innerHTML=cliRows()"></div>
  <select onchange="ui.cliSort=this.value;$('#cliRows').innerHTML=cliRows()" aria-label="Ordenar">${[['nome','Ordem alfabética'],['recente','Visita mais recente'],['total','Maior valor gasto'],['novo','Cadastro mais recente']].map(([k,l])=>`<option value="${k}" ${ui.cliSort===k?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="tbl-w"><table class="tbl"><thead><tr><th>Cliente</th><th>WhatsApp</th><th>Última visita</th><th class="r">Visitas</th><th class="r">Total gasto</th></tr></thead><tbody id="cliRows">${cliRows()}</tbody></table></div></div>`;
}
function cliRows(){
  const st=cliStats(),q=ui.clientQ.toLowerCase().trim(),qd=onlyDigits(q);
  let list=D().clients.filter(c=>!q||c.name.toLowerCase().includes(q)||(qd&&onlyDigits(c.phone).includes(qd))||(c.tags||[]).some(t=>t.toLowerCase().includes(q)));
  const g=c=>st[c.id]||{visits:0,total:0,last:''};
  list.sort(ui.cliSort==='recente'?(a,b)=>g(b).last.localeCompare(g(a).last):ui.cliSort==='total'?(a,b)=>g(b).total-g(a).total:ui.cliSort==='novo'?(a,b)=>b.createdAt.localeCompare(a.createdAt):(a,b)=>a.name.localeCompare(b.name));
  const rows=list.slice(0,250).map(c=>{const s=g(c);return `<tr class="click" onclick="go('cliente/${c.id}')"><td><div class="who"><div class="av sm">${initials(c.name)}</div><div><b>${esc(c.name)}</b>${(c.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div></td><td>${esc(c.phone||'—')}</td><td>${s.last?fmtD(s.last):'—'}</td><td class="r">${s.visits}</td><td class="r">${brl(s.total)}</td></tr>`}).join('');
  return rows||`<tr><td colspan="5" class="empty">Nenhum cliente encontrado.</td></tr>`;
}
function exportClients(){const st=cliStats();exportCSV('clientes-'+U().name,['Nome','WhatsApp','E-mail','Nascimento','Origem','Etiquetas','Visitas','Total gasto','Última visita'],D().clients.map(c=>{const s=st[c.id]||{};return[c.name,c.phone,c.email,fmtD(c.birth),c.origin,(c.tags||[]).join(', '),s.visits||0,(s.total||0).toFixed(2).replace('.',','),s.last?fmtD(s.last):'']}))}
function editClient(id){
  const c=id?cli(id):newClientObj({});
  openModal(`<h2 class="mt">${id?'Editar cliente':'Novo cliente'}</h2><div class="frm" style="margin-top:14px">
  ${fld('Nome completo',`<input id="cl_name" value="${esc(c.name)}">`,'full')}
  ${fld('WhatsApp',`<input id="cl_phone" inputmode="tel" value="${esc(c.phone)}" placeholder="(41) 90000-0000">`)}
  ${fld('E-mail',`<input id="cl_email" type="email" value="${esc(c.email)}">`)}
  ${fld('CPF',`<input id="cl_cpf" value="${esc(c.cpf)}" placeholder="000.000.000-00">`)}
  ${fld('Data de nascimento',`<input id="cl_birth" type="date" value="${esc(c.birth)}">`)}
  ${fld('Como conheceu',`<select id="cl_origin">${[...ORIGINS,'Recepção'].map(o=>`<option ${c.origin===o?'selected':''}>${o}</option>`).join('')}</select>`)}
  ${fld('Etiquetas (separe por vírgula)',`<input id="cl_tags" value="${esc((c.tags||[]).join(', '))}" placeholder="VIP, Pele sensível">`)}
  ${fld('Observações',`<textarea id="cl_obs" rows="2">${esc(c.obs)}</textarea>`,'full')}
  </div><p class="note">Dados pessoais tratados conforme a LGPD, com finalidade de atendimento.</p>
  <div class="mf">${id?`<button class="btn ghost danger" onclick="delClient('${id}')">${ic('trash',16)} Excluir</button><span class="sp"></span>`:''}<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveClient('${id||''}')">Salvar</button></div>`);
}
function saveClient(id){
  const name=val('cl_name');if(!name)return toast('Informe o nome.');
  const d=D(),data={name,phone:val('cl_phone'),email:val('cl_email'),cpf:val('cl_cpf'),birth:val('cl_birth'),origin:val('cl_origin'),tags:val('cl_tags').split(',').map(s=>s.trim()).filter(Boolean),obs:val('cl_obs')};
  let c;if(id){c=cli(id);Object.assign(c,data)}else{c=newClientObj(data);d.clients.push(c)}
  save();closeModal();toast('Cliente salvo.');if(!id)go('cliente/'+c.id);else render();
}
function delClient(id){if(!confirm('Excluir o cliente e todo o histórico dele nesta unidade? Esta ação não pode ser desfeita.'))return;const d=D();d.clients=d.clients.filter(c=>c.id!==id);['appts','docs','records','photos','clientPkgs'].forEach(k=>d[k]=d[k].filter(x=>x.clientId!==id));save();closeModal();go('clientes');toast('Cliente excluído.')}

function pgCliente(id){
  const d=D(),c=byId(d.clients,id);if(!c)return `<div class="card empty-state"><h3>Cliente não encontrado</h3><a class="btn" href="#/clientes">Voltar</a></div>`;
  const st=cliStats()[id]||{visits:0,total:0,last:''},t=today();
  const ap=d.appts.filter(a=>a.clientId===id).sort(byDT).reverse();
  const next=ap.filter(a=>a.date>=t&&['agendado','confirmado'].includes(a.status)).sort(byDT)[0];
  const evos=d.records.filter(r=>r.clientId===id&&r.type==='evolucao').sort((a,b)=>(b.at||b.date).localeCompare(a.at||a.date));
  const anams=d.records.filter(r=>r.clientId===id&&r.type==='anamnese');
  const docs=d.docs.filter(x=>x.clientId===id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  const photos=d.photos.filter(p=>p.clientId===id);
  const cps=d.clientPkgs.filter(p=>p.clientId===id);
  const T=ui.clientTab;
  const tabs=[['resumo','Resumo'],['prontuario','Prontuário',evos.length],['anamnese','Anamnese',anams.length],['docs','Documentos',docs.length],['fotos','Fotos',photos.length],['hist','Histórico',ap.length],['pacotes','Pacotes',cps.length]];
  let body='';
  if(T==='resumo'){
    body=`<div class="kpis">${kpi('Visitas',st.visits)}${kpi('Total gasto',brl0(st.total))}${kpi('Ticket médio',brl0(st.visits?st.total/st.visits:0))}${kpi('Próximo horário',next?fmtD(next.date)+' · '+next.time:'—',next?esc(svc(next.svcId).name):'')}</div>
    <div class="g g2"><div class="card"><div class="card-h"><h3>Dados</h3><button class="btn ghost sm" onclick="editClient('${id}')">${ic('pen',14)} Editar</button></div>
     <div class="info" style="background:none;padding:0">${info('Nascimento',fmtD(c.birth))}${info('CPF',esc(c.cpf||'—'))}${info('Como conheceu',esc(c.origin||'—'))}${info('Última visita',st.last?fmtD(st.last):'—')}</div>
     ${(c.tags||[]).length?`<div class="chips" style="margin-top:12px">${c.tags.map(x=>badge(esc(x),'clay')).join('')}</div>`:''}${c.obs?`<p class="note" style="margin-top:12px">${esc(c.obs)}</p>`:''}</div>
     <div class="card"><div class="card-h"><h3>Últimos atendimentos</h3></div><div class="list">${ap.slice(0,5).map(a=>`<div class="li" onclick="openAppt('${a.id}')"><div class="t" style="width:74px">${fmtD(a.date)}</div><div class="b"><b>${esc(svc(a.svcId).name)}</b><small>${esc(pro(a.proId).name)}</small></div>${stBadge(a.status)}</div>`).join('')||'<p class="empty-s">Sem atendimentos.</p>'}</div></div></div>`;
  }else if(T==='prontuario'){
    body=`<div class="card" style="margin-bottom:16px"><div class="card-h"><h3>Nova evolução</h3><span class="sub">Fica registrada com data, hora e autor</span></div><div class="frm">
     ${fld('Procedimento',`<select id="ev_svc"><option value="">Geral</option>${d.services.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select>`)}
     ${fld('Profissional',`<select id="ev_pro">${d.pros.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select>`)}
     ${fld('Anotação clínica',`<textarea id="ev_txt" rows="3" placeholder="Avaliação, conduta, produtos, orientações…"></textarea>`,'full')}</div>
     <div class="mf" style="margin-top:12px"><button class="btn pri" onclick="addEvo('${id}')">Registrar evolução</button></div></div>
     <div class="card"><div class="card-h"><h3>Histórico clínico</h3></div><div class="tl">${evos.map(r=>`<div class="tl-i"><small>${fmtD(r.date)}${r.at?' · '+new Date(r.at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):''} · ${esc(pro(r.proId).name)}${r.svcId?' · '+esc(svc(r.svcId).name):''}</small><p>${esc(r.text)}</p></div>`).join('')||'<p class="empty-s">Nenhuma evolução registrada.</p>'}</div></div>`;
  }else if(T==='anamnese'){
    body=`<div class="card" style="margin-bottom:16px"><div class="toolbar" style="margin:0"><select id="an_form">${d.forms.map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join('')}</select><button class="btn pri" onclick="fillForm('${id}',val('an_form'))">${ic('pen',16)} Preencher ficha digital</button><span class="note" style="margin:0">Pode ser preenchida pelo cliente no tablet da recepção.</span></div></div>
    <div class="card"><div class="tbl-w"><table class="tbl"><thead><tr><th>Ficha</th><th>Data</th><th>Assinatura</th><th></th></tr></thead><tbody>${anams.sort((a,b)=>b.date.localeCompare(a.date)).map(r=>`<tr class="click" onclick="viewAnam('${r.id}')"><td><b>${esc((byId(d.forms,r.formId)||{name:'Ficha'}).name)}</b></td><td>${fmtD(r.date)}</td><td>${r.signedAt?badge('Assinada digitalmente','sage'):badge('Sem assinatura','mut')}</td><td class="act"><button class="btn ghost sm">Abrir</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">Nenhuma ficha preenchida.</td></tr>'}</tbody></table></div></div>`;
  }else if(T==='docs'){
    body=`<div class="card" style="margin-bottom:16px"><div class="toolbar" style="margin:0"><select id="dc_tpl">${d.templates.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select><select id="dc_svc"><option value="">Procedimento (opcional)</option>${d.services.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select><button class="btn pri" onclick="genDoc('${id}')">${ic('doc',16)} Gerar documento</button></div></div>
    <div class="card">${docTable(docs,false)}</div>`;
  }else if(T==='fotos'){
    body=`<div class="upl">${fld('Tipo',`<select id="ph_lbl"><option>Antes</option><option>Depois</option><option>Evolução</option></select>`)}${fld('Procedimento / região',`<input id="ph_proc" placeholder="Ex.: Preenchimento labial">`)}
    <label class="btn pri" style="cursor:pointer">${ic('cam',16)} Adicionar foto<input type="file" accept="image/*" capture="environment" hidden onchange="addPhoto(this,'${id}')"></label></div>
    ${photos.length?`<div class="photos">${photos.sort((a,b)=>b.date.localeCompare(a.date)).map(p=>`<div class="ph-i"><img src="${p.data}" alt="${esc(p.label)}" onclick="viewPhoto('${p.id}')" style="cursor:zoom-in"><button class="icon-btn" onclick="delPhoto('${p.id}')" aria-label="Excluir foto">${ic('trash',15)}</button><div>${badge(esc(p.label),p.label==='Antes'?'clay':'sage')} <b>${esc(p.proc||'')}</b><br><span class="muted">${fmtD(p.date)}</span></div></div>`).join('')}</div>`:'<div class="card empty-state"><h3>Sem fotos ainda</h3><p>Registre o antes e depois direto pela câmera do tablet ou celular.</p></div>'}
    <p class="note">As fotos são reduzidas automaticamente para economizar espaço. Uso restrito ao prontuário, conforme autorização de imagem.</p>`;
  }else if(T==='hist'){
    body=`<div class="card"><div class="tbl-w"><table class="tbl"><thead><tr><th>Data</th><th>Serviço</th><th>Profissional</th><th>Status</th><th class="r">Valor</th></tr></thead><tbody>${ap.map(a=>`<tr class="click" onclick="openAppt('${a.id}')"><td>${fmtD(a.date)} · ${a.time}</td><td>${esc(svc(a.svcId).name)}</td><td>${esc(pro(a.proId).name)}</td><td>${stBadge(a.status)}</td><td class="r">${a.status==='concluido'?(a.pkgUsed?'Pacote':brl(a.charged)):'—'}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">Sem histórico.</td></tr>'}</tbody></table></div></div>`;
  }else if(T==='pacotes'){
    body=`<div class="card" style="margin-bottom:16px"><div class="toolbar" style="margin:0"><select id="pk_sel">${d.packages.map(p=>`<option value="${p.id}">${esc(p.name)} · ${brl0(p.price)}</option>`).join('')}</select><select id="pk_met">${METHODS.map(m=>`<option>${m}</option>`).join('')}</select><button class="btn pri" onclick="sellPkg('${id}')">${ic('gift',16)} Vender pacote</button></div></div>
    <div class="g g2">${cps.map(cp=>{const p=byId(d.packages,cp.pkgId)||{name:'Pacote'};return `<div class="card"><div class="card-h"><h3>${esc(p.name)}</h3>${cp.used>=cp.total?badge('Concluído','mut'):badge((cp.total-cp.used)+' restante(s)','sage')}</div><div class="prog"><i style="width:${pct(cp.used,cp.total)}%"></i></div><p class="note">${cp.used} de ${cp.total} sessões usadas · comprado em ${fmtD(cp.date)}</p></div>`}).join('')||'<div class="card empty-state"><h3>Nenhum pacote</h3><p>Venda pacotes de sessões e o saldo é descontado automaticamente ao finalizar o atendimento.</p></div>'}</div>`;
  }
  return `<a class="back" href="#/clientes">${ic('left',16)} Clientes</a>
  <div class="ph"><div class="who lg"><div class="av xl">${initials(c.name)}</div><div><h1 class="title sm">${esc(c.name)}</h1><div class="muted">${esc(c.phone||'Sem telefone')}${c.email?' · '+esc(c.email):''} · cliente desde ${fmtD(c.createdAt)}</div></div></div>
  <div class="ph-act"><a class="btn ghost" target="_blank" rel="noopener" href="${waLink(c.phone,'Olá, '+first(c.name)+'!')}">${ic('wa',16)} WhatsApp</a><button class="btn pri" onclick="newAppt({clientId:'${id}'})">${ic('plus',16)} Agendar</button></div></div>
  <div class="tabs">${tabs.map(([k,l,n])=>`<button class="${T===k?'on':''}" onclick="ui.clientTab='${k}';render()">${l}${n?`<span class="n">${n}</span>`:''}</button>`).join('')}</div>${body}`;
}
function addEvo(cid){const t=val('ev_txt');if(!t)return toast('Escreva a anotação.');D().records.push({id:'r'+uid(),type:'evolucao',clientId:cid,proId:val('ev_pro'),svcId:val('ev_svc')||null,date:today(),text:t,at:new Date().toISOString(),by:S.session.name});save();render();toast('Evolução registrada no prontuário.')}
function sellPkg(cid){const d=D(),p=byId(d.packages,val('pk_sel'));if(!p)return;if(!confirm(`Vender "${p.name}" por ${brl(p.price)}?`))return;d.clientPkgs.push({id:'cp'+uid(),clientId:cid,pkgId:p.id,total:p.sessions,used:0,date:today()});d.fin.push({id:'f'+uid(),type:'in',desc:p.name,cat:'Pacotes',value:p.price,date:today(),method:val('pk_met'),status:'pago',clientId:cid});save();render();toast('Pacote vendido e receita lançada.')}
function addPhoto(inp,cid){
  const f=inp.files&&inp.files[0];if(!f)return;
  const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{
    const M=900,k=Math.min(1,M/Math.max(img.width,img.height)),cv=document.createElement('canvas');cv.width=Math.round(img.width*k);cv.height=Math.round(img.height*k);
    cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
    const ph={id:'ph'+uid(),clientId:cid,label:val('ph_lbl'),proc:val('ph_proc'),date:today(),data:cv.toDataURL('image/jpeg',.72)};
    D().photos.push(ph);if(!save()){D().photos.pop();return}render();toast('Foto adicionada ao prontuário.')};img.src=r.result};r.readAsDataURL(f);
}
function viewPhoto(id){const p=byId(D().photos,id);openModal(`<h2 class="mt">${esc(p.label)} — ${esc(p.proc||'')}</h2><p class="muted">${fmtD(p.date)}</p><img src="${p.data}" alt="" style="width:100%;border-radius:14px;margin-top:10px">`,'lg')}
function delPhoto(id){if(!confirm('Excluir esta foto?'))return;const d=D();d.photos=d.photos.filter(p=>p.id!==id);save();render()}

/* Fichas de anamnese */
function formFieldsHTML(f,ans={},ro=false){
  const dis=ro?'disabled':'';
  return f.fields.map(q=>{const a=ans[q.id];
    if(q.type==='text')return fld(esc(q.label),`<textarea data-q="${q.id}" rows="2" ${dis}>${esc(a||'')}</textarea>`,'full');
    if(q.type==='yesno')return `<div class="fld full"><span>${esc(q.label)}</span><div class="yn"><label><input type="radio" name="q_${q.id}" value="Não" ${!a||a.v!=='Sim'?'checked':''} ${dis}> Não</label><label><input type="radio" name="q_${q.id}" value="Sim" ${a&&a.v==='Sim'?'checked':''} ${dis}> Sim</label>${q.detail?`<input data-qd="${q.id}" placeholder="Se sim, qual?" value="${esc(a&&a.d||'')}" ${dis}>`:''}</div></div>`;
    if(q.type==='choice')return fld(esc(q.label),`<select data-q="${q.id}" ${dis}><option value="">—</option>${(q.options||[]).map(o=>`<option ${a===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`,'full');
    return `<div class="fld full"><span>${esc(q.label)}</span><div class="checks">${(q.options||[]).map(o=>`<label class="ck"><input type="checkbox" data-qm="${q.id}" value="${esc(o)}" ${(a||[]).includes(o)?'checked':''} ${dis}> ${esc(o)}</label>`).join('')}</div></div>`;
  }).join('');
}
function readForm(f,root){
  const ans={};
  f.fields.forEach(q=>{
    if(q.type==='text'||q.type==='choice')ans[q.id]=(root.querySelector(`[data-q="${q.id}"]`)||{}).value||'';
    else if(q.type==='yesno'){const r=root.querySelector(`input[name="q_${q.id}"]:checked`);ans[q.id]={v:r?r.value:'Não',d:(root.querySelector(`[data-qd="${q.id}"]`)||{}).value||''}}
    else ans[q.id]=[...root.querySelectorAll(`[data-qm="${q.id}"]:checked`)].map(x=>x.value);
  });return ans;
}
function fillForm(cid,fid){
  const f=byId(D().forms,fid);if(!f)return toast('Crie uma ficha em Termos e fichas.');
  openModal(`<div class="eyebrow">Ficha digital</div><h2 class="mt">${esc(f.name)}</h2><p class="muted" style="margin-bottom:14px">${esc(cli(cid).name)}</p><div class="frm" id="fm_root">${formFieldsHTML(f)}</div>
  <div class="lbl">Consentimento e assinatura</div><label class="ck"><input type="checkbox" id="fm_lgpd"> Declaro que as informações são verdadeiras e autorizo o uso dos meus dados de saúde exclusivamente para atendimento (LGPD).</label>
  <canvas id="pad" class="pad" style="margin-top:10px"></canvas><div class="pad-act"><span class="note" style="margin:0">Assine com o dedo ou o mouse</span><button class="btn ghost sm" onclick="$('#pad')._pad.clear()">Limpar</button></div>
  <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveForm('${cid}','${fid}')">${ic('check',16)} Salvar ficha</button></div>`,'lg');
  mountPad('pad');
}
async function saveForm(cid,fid){
  const f=byId(D().forms,fid);if(!chk('fm_lgpd'))return toast('É necessário o consentimento do cliente.');
  const pad=$('#pad')._pad,answers=readForm(f,$('#fm_root')),now=new Date().toISOString();
  const rec={id:'ra'+uid(),type:'anamnese',clientId:cid,formId:fid,date:today(),answers,signedAt:pad.isEmpty()?null:now,sig:pad.isEmpty()?null:pad.data(),hash:null};
  rec.hash=await sha256(JSON.stringify(answers)+now+(rec.sig||''));
  D().records.push(rec);if(!save()){D().records.pop();return}closeModal();ui.clientTab='anamnese';render();toast('Ficha de anamnese salva no prontuário.');
}
function viewAnam(rid){
  const r=byId(D().records,rid),f=byId(D().forms,r.formId)||{name:'Ficha',fields:[]};
  openModal(`<div class="eyebrow">Anamnese · ${fmtD(r.date)}</div><h2 class="mt">${esc(f.name)}</h2><p class="muted" style="margin-bottom:14px">${esc(cli(r.clientId).name)}</p><div class="frm">${formFieldsHTML(f,r.answers,true)}</div>
  ${r.signedAt?`<div class="sig">${r.sig?`<img src="${r.sig}" alt="Assinatura">`:''}<div class="meta"><b>Assinada digitalmente</b> em ${fmtDT(r.signedAt)}<br>Código de integridade: <code>${esc(r.hash||'—')}</code></div></div>`:''}
  <div class="mf"><button class="btn ghost" onclick="closeModal()">Fechar</button></div>`,'lg');
}

/* ===================== Documentos ===================== */
function docTable(docs,showClient=true){
  const d=D();
  return `<div class="tbl-w"><table class="tbl"><thead><tr><th>Documento</th>${showClient?'<th>Cliente</th>':''}<th>Criado</th><th>Situação</th><th></th></tr></thead><tbody>${docs.slice(0,200).map(x=>{const t=docTpl(d,x);return `<tr class="click" onclick="openDoc('${x.id}')"><td><b>${esc(t.name)}</b>${x.svcId?`<br><small class="muted">${esc(svc(x.svcId).name)}</small>`:''}</td>${showClient?`<td>${esc(cli(x.clientId).name)}</td>`:''}<td>${fmtD(x.createdAt)}</td><td>${x.status==='pendente'?badge('Aguardando assinatura','gold'):x.mode==='papel'?badge('Assinado em papel','clay'):badge('Assinado digitalmente','sage')}</td><td class="act"><button class="btn ghost sm">Abrir</button></td></tr>`}).join('')||`<tr><td colspan="5" class="empty">Nenhum documento.</td></tr>`}</tbody></table></div>${docs.length>200?`<p class="note">Mostrando os 200 mais recentes de ${docs.length}.</p>`:''}`;
}
function createDoc(o){const x=Object.assign({id:'d'+uid(),tplId:null,clientId:null,apptId:null,proId:null,svcId:null,status:'pendente',mode:null,createdAt:new Date().toISOString(),signedAt:null,hash:null},o);D().docs.push(x);save();return x}
function createDocForAppt(aid){const a=byId(D().appts,aid),s=svc(a.svcId);const x=createDoc({tplId:s.tpl||'t_consent',clientId:a.clientId,apptId:a.id,proId:a.proId,svcId:a.svcId});render();openDoc(x.id)}
function genDoc(cid){const x=createDoc({tplId:val('dc_tpl'),clientId:cid,svcId:val('dc_svc')||null});render();openDoc(x.id)}
const signLink=x=>location.href.split('#')[0]+'#/assinar/'+S.cur+'/'+x.id;
function openDoc(id){
  const d=D(),x=byId(d.docs,id);if(!x)return;const t=docTpl(d,x),c=cli(x.clientId),text=docText(x);
  if(x.status==='assinado'){
    openModal(`<div class="eyebrow">${esc(t.cat||'Documento')}</div><h2 class="mt">${esc(t.name)}</h2><p class="muted">${esc(c.name)}</p><div class="paper">${esc(text)}</div>${sigBlock(x)}
    <div class="mf"><button class="btn ghost" onclick="closeModal()">Fechar</button><button class="btn pri" onclick="printDoc('${x.id}')">${ic('print',16)} Imprimir / salvar PDF</button></div>`,'lg');return;
  }
  const link=signLink(x);
  openModal(`<div class="eyebrow">${esc(t.cat||'Documento')} · aguardando assinatura</div><h2 class="mt">${esc(t.name)}</h2><p class="muted">${esc(c.name)}</p><div class="paper">${esc(text)}</div>
  <div class="lbl">Assinatura de ${esc(c.name)}</div><canvas id="pad" class="pad"></canvas>
  <div class="pad-act"><label class="ck"><input type="checkbox" id="dc_ok"> Li e concordo com o documento acima</label><button class="btn ghost sm" onclick="$('#pad')._pad.clear()">Limpar</button></div>
  <div class="mf"><button class="btn ghost danger" onclick="delDoc('${x.id}')" title="Excluir">${ic('trash',16)}</button><button class="btn ghost" onclick="signPaper('${x.id}')">Assinado em papel</button><span class="sp"></span>
  <button class="btn ghost" onclick="copyText('${link}')">${ic('link',16)} Copiar link</button><a class="btn ghost" target="_blank" rel="noopener" href="${waLink(c.phone,`Olá, ${first(c.name)}! Segue o documento "${t.name}" da ${S.org.name} para assinatura digital: ${link}`)}">${ic('wa',16)} Enviar</a>
  <button class="btn pri" onclick="signNow('${x.id}')">${ic('pen',16)} Assinar agora</button></div>`,'lg');
  mountPad('pad');
}
async function signCore(db,unit,x,sigData){
  const now=new Date().toISOString();x.signedAt=now;x.text=docText(x,db,unit);x.sig=sigData;x.mode='digital';x.status='assinado';
  x.hash=await sha256(x.text+'|'+now+'|'+sigData);x.device=navigator.userAgent.slice(0,120);
}
async function signNow(id){
  const x=byId(D().docs,id),pad=$('#pad')._pad;
  if(!chk('dc_ok'))return toast('Marque "Li e concordo" para assinar.');
  if(pad.isEmpty())return toast('Colete a assinatura no quadro.');
  await signCore(D(),U(),x,pad.data());save();render();openDoc(id);toast('Documento assinado e arquivado no prontuário.');
}
function signPaper(id){if(!confirm('Registrar que este documento foi impresso e assinado em papel?'))return;const x=byId(D().docs,id);Object.assign(x,{status:'assinado',mode:'papel',signedAt:new Date().toISOString(),text:docText(x)});save();render();openDoc(id);toast('Registrado como assinatura em papel (conta nos indicadores).')}
function delDoc(id){if(!confirm('Excluir este documento pendente?'))return;const d=D();d.docs=d.docs.filter(x=>x.id!==id);save();closeModal();render()}
function sigBlock(x){
  if(x.mode==='papel')return `<div class="sig"><div class="meta"><b>Assinado em papel</b> — registrado em ${fmtDT(x.signedAt)}. Via física arquivada na clínica.</div></div>`;
  return `<div class="sig">${x.sig?`<img src="${x.sig}" alt="Assinatura">`:''}<div class="meta"><b>Assinado eletronicamente</b> em ${fmtDT(x.signedAt)}<br>Código de integridade (SHA-256): <code>${esc(x.hash||'—')}</code>${x.hash&&String(x.hash).startsWith('demo')?'<br><span class="muted">Registro de demonstração</span>':''}</div></div>`;
}
function printDoc(id){
  const d=D(),x=byId(d.docs,id),t=docTpl(d,x),u=U();
  $('#print').innerHTML=`<div class="ph-hd"><b>${esc(S.org.name)} — ${esc(u.name)}</b><span>${esc(u.address||'')} · ${esc(u.phone||'')}</span></div><h1>${esc(t.name)}</h1><div class="txt">${esc(docText(x))}</div>
  ${x.sig?`<p><img src="${x.sig}" alt=""><br>${esc(cli(x.clientId).name)}</p>`:''}
  <div class="foot">${x.mode==='digital'?`Assinado eletronicamente em ${fmtDT(x.signedAt)} · SHA-256: ${esc(x.hash||'')}`:`Assinado em papel · registrado em ${fmtDT(x.signedAt)}`} · Documento gerado pelo Sálvia.</div>`;
  setTimeout(()=>window.print(),50);
}
function pgDocumentos(){
  const d=D(),T=ui.docTab,t=today(),m=ymOf(t),ps=paperStats(m+'-01',t);
  const pend=d.docs.filter(x=>x.status==='pendente').length;
  const head=`<div class="ph"><div><div class="eyebrow">Termos, contratos e fichas</div><h1 class="title">Documentos sem papel</h1></div><div class="ph-act"><button class="btn pri" onclick="newDocModal()">${ic('plus',16)} Novo documento</button></div></div>
  <div class="kpis">${kpi('Assinados digitalmente no mês',ps.dig,`${ps.pct}% dos termos do mês`,'sage')}${kpi('Aguardando assinatura',pend)}${kpi('Folhas evitadas no mês',num(ps.sheets),'≈ '+brl(ps.saved)+' em impressão')}${kpi('Ainda em papel no mês',ps.pap,num(ps.psheets)+' folhas impressas')}</div>
  <div class="tabs">${[['docs','Documentos'],['tpl','Modelos de termos e contratos'],['forms','Fichas de anamnese']].map(([k,l])=>`<button class="${T===k?'on':''}" onclick="ui.docTab='${k}';render()">${l}</button>`).join('')}</div>`;
  if(T==='tpl')return head+`<div class="tiles">${d.templates.map(x=>`<div class="tile" onclick="editTpl('${x.id}')">${badge(esc(x.cat||'Termo'),x.cat==='Contrato'?'blue':x.cat==='Orientação'?'gold':'sage')}<h4>${esc(x.name)}</h4><p>${x.pages} folha(s) equivalente(s) · ${d.docs.filter(y=>y.tplId===x.id).length} emitido(s)</p></div>`).join('')}<div class="tile" onclick="editTpl()" style="border-style:dashed;display:grid;place-items:center;text-align:center;color:var(--mut)">${ic('plus',22)}<h4>Novo modelo</h4></div></div><p class="note">Use variáveis: {{cliente}}, {{cpf}}, {{servico}}, {{profissional}}, {{clinica}}, {{cidade}}, {{data}}. Modelos ilustrativos — revise com assessoria jurídica antes do uso real.</p>`;
  if(T==='forms')return head+`<div class="tiles">${d.forms.map(f=>`<div class="tile" onclick="editForm('${f.id}')">${badge('Ficha','sage')}<h4>${esc(f.name)}</h4><p>${f.fields.length} perguntas · ${d.records.filter(r=>r.formId===f.id).length} preenchida(s)</p></div>`).join('')}<div class="tile" onclick="editForm()" style="border-style:dashed;display:grid;place-items:center;text-align:center;color:var(--mut)">${ic('plus',22)}<h4>Nova ficha</h4></div></div>`;
  const F=ui.docFilter;let list=d.docs.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  if(F==='pendente')list=list.filter(x=>x.status==='pendente');else if(F==='digital')list=list.filter(x=>x.mode==='digital');else if(F==='papel')list=list.filter(x=>x.mode==='papel');
  return head+`<div class="card"><div class="toolbar"><div class="chips">${[['all','Todos'],['pendente','Aguardando'],['digital','Digitais'],['papel','Papel']].map(([k,l])=>`<button class="chip ${F===k?'on':''}" onclick="ui.docFilter='${k}';render()">${l}</button>`).join('')}</div></div>${docTable(list)}</div>`;
}
function newDocModal(){
  const d=D();
  openModal(`<h2 class="mt">Novo documento</h2><div class="frm" style="margin-top:14px">
  ${fld('Cliente',`<input id="nd_cli" list="dl_cli2" placeholder="Digite o nome" autocomplete="off"><datalist id="dl_cli2">${d.clients.map(c=>`<option value="${esc(cliLabel(c))}"></option>`).join('')}</datalist>`,'full')}
  ${fld('Modelo',`<select id="nd_tpl">${d.templates.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select>`,'full')}
  ${fld('Procedimento (opcional)',`<select id="nd_svc"><option value="">—</option>${d.services.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select>`)}
  ${fld('Profissional (opcional)',`<select id="nd_pro"><option value="">—</option>${d.pros.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select>`)}
  </div><div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveNewDoc()">Gerar e abrir</button></div>`);
}
function saveNewDoc(){const c=findCli(val('nd_cli'));if(!c)return toast('Selecione um cliente cadastrado.');const x=createDoc({tplId:val('nd_tpl'),clientId:c.id,svcId:val('nd_svc')||null,proId:val('nd_pro')||null});render();openDoc(x.id)}
function editTpl(id){
  const x=id?tpl(id):{name:'',cat:'Termo',pages:1,body:''};
  openModal(`<h2 class="mt">${id?'Editar modelo':'Novo modelo'}</h2><div class="frm" style="margin-top:14px">
  ${fld('Nome',`<input id="tp_name" value="${esc(x.name)}">`,'full')}
  ${fld('Categoria',`<select id="tp_cat">${['Termo','Contrato','Orientação','Autorização'].map(c=>`<option ${x.cat===c?'selected':''}>${c}</option>`).join('')}</select>`)}
  ${fld('Folhas equivalentes (para o indicador de papel)',`<input id="tp_pages" type="number" min="1" value="${x.pages}">`)}
  ${fld('Texto do documento',`<textarea id="tp_body" rows="14" style="font-family:Georgia,serif">${esc(x.body)}</textarea>`,'full')}
  </div><p class="note">Variáveis: {{cliente}} {{cpf}} {{servico}} {{profissional}} {{clinica}} {{cidade}} {{data}}</p>
  <div class="mf">${id?`<button class="btn ghost danger" onclick="delTpl('${id}')">${ic('trash',16)}</button><span class="sp"></span>`:''}<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveTpl('${id||''}')">Salvar modelo</button></div>`,'lg');
}
function saveTpl(id){const name=val('tp_name');if(!name)return toast('Dê um nome ao modelo.');const data={name,cat:val('tp_cat'),pages:Math.max(1,+val('tp_pages')||1),body:$('#tp_body').value};if(id)Object.assign(tpl(id),data);else D().templates.push(Object.assign({id:'t'+uid()},data));save();closeModal();render();toast('Modelo salvo.')}
function delTpl(id){if(D().docs.some(x=>x.tplId===id&&!x.text)){if(!confirm('Há documentos emitidos com este modelo. Excluir mesmo assim? (os já assinados digitalmente mantêm o texto)'))return}else if(!confirm('Excluir modelo?'))return;const d=D();d.docs.forEach(x=>{if(x.tplId===id&&!x.text)x.text=docText(x)});d.templates=d.templates.filter(x=>x.id!==id);d.services.forEach(s=>{if(s.tpl===id)s.tpl=null});save();closeModal();render()}
let FD=null;
function editForm(id){const f=id?byId(D().forms,id):null;FD=f?JSON.parse(JSON.stringify(f)):{id:null,name:'',fields:[{id:'q'+uid(),label:'',type:'text'}]};renderFD()}
function renderFD(){
  const T=[['text','Texto livre'],['yesno','Sim / Não'],['choice','Escolha única'],['multi','Múltipla escolha']];
  openModal(`<h2 class="mt">${FD.id?'Editar':'Nova'} ficha de anamnese</h2>${fld('Nome da ficha',`<input id="fd_name" value="${esc(FD.name)}" oninput="FD.name=this.value">`,'full')}
  <div class="lbl">Perguntas</div><div class="fd">${FD.fields.map((q,i)=>`<div class="fd-r"><input value="${esc(q.label)}" placeholder="Pergunta ${i+1}" oninput="FD.fields[${i}].label=this.value">
  <select onchange="FD.fields[${i}].type=this.value;renderFD()">${T.map(([k,l])=>`<option value="${k}" ${q.type===k?'selected':''}>${l}</option>`).join('')}</select>
  ${q.type==='yesno'?`<label class="ck"><input type="checkbox" ${q.detail?'checked':''} onchange="FD.fields[${i}].detail=this.checked"> pedir detalhe</label>`:''}
  <button class="icon-btn" onclick="FD.fields.splice(${i},1);renderFD()" aria-label="Remover">${ic('trash',16)}</button>
  ${q.type==='choice'||q.type==='multi'?`<input class="fd-o" value="${esc((q.options||[]).join(', '))}" placeholder="Opções separadas por vírgula" oninput="FD.fields[${i}].options=this.value.split(',').map(s=>s.trim()).filter(Boolean)">`:''}</div>`).join('')}</div>
  <button class="btn ghost sm" onclick="FD.fields.push({id:'q'+uid(),label:'',type:'yesno'});renderFD()">${ic('plus',15)} Adicionar pergunta</button>
  <div class="mf">${FD.id?`<button class="btn ghost danger" onclick="delForm('${FD.id}')">${ic('trash',16)}</button><span class="sp"></span>`:''}<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveFD()">Salvar ficha</button></div>`,'lg');
}
function saveFD(){FD.name=FD.name.trim();if(!FD.name)return toast('Dê um nome à ficha.');FD.fields=FD.fields.filter(q=>q.label.trim());if(!FD.fields.length)return toast('Adicione ao menos uma pergunta.');const d=D();if(FD.id){const i=d.forms.findIndex(f=>f.id===FD.id);d.forms[i]=FD}else{FD.id='f'+uid();d.forms.push(FD)}save();closeModal();render();toast('Ficha salva.')}
function delForm(id){if(!confirm('Excluir esta ficha? As fichas já preenchidas continuam no prontuário, mas sem o modelo de perguntas.'))return;const d=D();d.forms=d.forms.filter(f=>f.id!==id);save();closeModal();render()}

/* ===================== Serviços e pacotes ===================== */
function pgServicos(){
  const d=D(),T=ui.svcTab;
  const head=`<div class="ph"><div><div class="eyebrow">Catálogo</div><h1 class="title">Serviços e pacotes</h1></div><div class="ph-act"><button class="btn pri" onclick="${T==='svc'?'editSvc()':'editPkg()'}">${ic('plus',16)} ${T==='svc'?'Novo serviço':'Novo pacote'}</button></div></div>
  <div class="tabs"><button class="${T==='svc'?'on':''}" onclick="ui.svcTab='svc';render()">Serviços<span class="n">${d.services.length}</span></button><button class="${T==='pkg'?'on':''}" onclick="ui.svcTab='pkg';render()">Pacotes<span class="n">${d.packages.length}</span></button></div>`;
  if(T==='pkg')return head+`<div class="card"><div class="tbl-w"><table class="tbl"><thead><tr><th>Pacote</th><th>Serviço</th><th class="r">Sessões</th><th class="r">Preço</th><th class="r">Por sessão</th><th class="r">Vendidos</th></tr></thead><tbody>${d.packages.map(p=>`<tr class="click" onclick="editPkg('${p.id}')"><td><b>${esc(p.name)}</b></td><td>${esc(svc(p.svcId).name)}</td><td class="r">${p.sessions}</td><td class="r">${brl(p.price)}</td><td class="r">${brl(p.price/p.sessions)} <small class="up">−${Math.max(0,100-pct(p.price/p.sessions,svc(p.svcId).price))}%</small></td><td class="r">${d.clientPkgs.filter(c=>c.pkgId===p.id).length}</td></tr>`).join('')||'<tr><td colspan="6" class="empty">Nenhum pacote.</td></tr>'}</tbody></table></div></div>`;
  return head+`<div class="card"><div class="tbl-w"><table class="tbl"><thead><tr><th>Serviço</th><th>Categoria</th><th class="r">Duração</th><th class="r">Preço</th><th>Termo vinculado</th><th>Insumos</th></tr></thead><tbody>${d.services.map(s=>`<tr class="click" onclick="editSvc('${s.id}')"><td><b>${esc(s.name)}</b>${s.active===false?' '+badge('Inativo','mut'):''}</td><td>${badge(esc(s.cat),'sage')}</td><td class="r">${s.dur} min</td><td class="r">${brl(s.price)}</td><td>${s.tpl?esc((tpl(s.tpl)||{name:'—'}).name):'<span class="muted">—</span>'}</td><td class="muted">${(s.ins||[]).map(([p,q])=>esc((prod(p)||{name:'?'}).name)+' ×'+q).join(', ')||'—'}</td></tr>`).join('')}</tbody></table></div></div><p class="note">Ao finalizar um atendimento, os insumos são baixados do estoque e o termo vinculado é solicitado automaticamente.</p>`;
}
function editSvc(id){
  const d=D(),s=id?svc(id):{name:'',cat:'Facial',dur:60,price:0,tpl:null,ins:[],active:true};
  const ins=[0,1,2].map(i=>s.ins[i]||['',1]);
  openModal(`<h2 class="mt">${id?'Editar serviço':'Novo serviço'}</h2><div class="frm" style="margin-top:14px">
  ${fld('Nome',`<input id="sv_name" value="${esc(s.name)}">`,'full')}
  ${fld('Categoria',`<select id="sv_cat">${SVC_CATS.map(c=>`<option ${s.cat===c?'selected':''}>${c}</option>`).join('')}</select>`)}
  ${fld('Duração (min)',`<input id="sv_dur" type="number" min="15" step="15" value="${s.dur}">`)}
  ${fld('Preço (R$)',`<input id="sv_price" type="number" min="0" step="0.01" value="${s.price}">`)}
  ${fld('Termo exigido',`<select id="sv_tpl"><option value="">Nenhum</option>${d.templates.map(x=>`<option value="${x.id}" ${s.tpl===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select>`)}
  <div class="fld full"><span>Insumos baixados por atendimento</span>${ins.map(([p,q],i)=>`<div class="ins-r"><select id="sv_ip${i}"><option value="">—</option>${d.products.map(x=>`<option value="${x.id}" ${x.id===p?'selected':''}>${esc(x.name)}</option>`).join('')}</select><input id="sv_iq${i}" type="number" min="0" step="0.5" value="${q}"></div>`).join('')}</div>
  <label class="ck full"><input type="checkbox" id="sv_act" ${s.active!==false?'checked':''}> Serviço ativo (aparece na agenda e no agendamento online)</label>
  </div><div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveSvc('${id||''}')">Salvar</button></div>`);
}
function saveSvc(id){const name=val('sv_name');if(!name)return toast('Informe o nome.');const data={name,cat:val('sv_cat'),dur:Math.max(15,+val('sv_dur')||30),price:+val('sv_price')||0,tpl:val('sv_tpl')||null,active:chk('sv_act'),ins:[0,1,2].map(i=>[val('sv_ip'+i),+val('sv_iq'+i)||0]).filter(([p,q])=>p&&q>0)};if(id)Object.assign(svc(id),data);else D().services.push(Object.assign({id:'s'+uid()},data));save();closeModal();render();toast('Serviço salvo.')}
function editPkg(id){
  const d=D(),p=id?byId(d.packages,id):{name:'',svcId:d.services[0]?.id,sessions:5,price:0};
  openModal(`<h2 class="mt">${id?'Editar pacote':'Novo pacote'}</h2><div class="frm" style="margin-top:14px">
  ${fld('Nome',`<input id="pk_name" value="${esc(p.name)}">`,'full')}
  ${fld('Serviço',`<select id="pk_svc">${d.services.map(s=>`<option value="${s.id}" ${s.id===p.svcId?'selected':''}>${esc(s.name)} (${brl0(s.price)})</option>`).join('')}</select>`,'full')}
  ${fld('Sessões',`<input id="pk_ses" type="number" min="2" value="${p.sessions}">`)}${fld('Preço do pacote (R$)',`<input id="pk_price" type="number" min="0" step="0.01" value="${p.price}">`)}
  </div><div class="mf">${id?`<button class="btn ghost danger" onclick="delPkg('${id}')">${ic('trash',16)}</button><span class="sp"></span>`:''}<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="savePkg('${id||''}')">Salvar</button></div>`);
}
function savePkg(id){const name=val('pk_name');if(!name)return toast('Informe o nome.');const data={name,svcId:val('pk_svc'),sessions:Math.max(2,+val('pk_ses')||2),price:+val('pk_price')||0};if(id)Object.assign(byId(D().packages,id),data);else D().packages.push(Object.assign({id:'pk'+uid()},data));save();closeModal();render();toast('Pacote salvo.')}
function delPkg(id){if(D().clientPkgs.some(c=>c.pkgId===id))return toast('Há clientes com este pacote; não é possível excluir.');if(!confirm('Excluir pacote?'))return;D().packages=D().packages.filter(p=>p.id!==id);save();closeModal();render()}

/* ===================== Estoque ===================== */
function pgEstoque(){
  const d=D(),T=ui.stockTab,m=ymOf(today());
  const low=d.products.filter(p=>p.qty<=p.min),value=sum(d.products,p=>p.qty*p.cost),outs=d.moves.filter(x=>x.type==='out'&&ymOf(x.date)===m);
  const head=`<div class="ph"><div><div class="eyebrow">Estoque · ${esc(U().name)}</div><h1 class="title">Produtos e insumos</h1></div><div class="ph-act"><button class="btn pri" onclick="editProd()">${ic('plus',16)} Novo produto</button></div></div>
  <div class="kpis">${kpi('Itens cadastrados',d.products.length)}${kpi('Valor em estoque',brl0(value),'a preço de custo')}${kpi('No estoque mínimo',low.length,low.length?'reponha para não faltar':'tudo abastecido',low.length?'dark':'')}${kpi('Saídas no mês',num(sum(outs,x=>x.qty)),'baixas automáticas e manuais')}</div>
  <div class="tabs"><button class="${T==='prod'?'on':''}" onclick="ui.stockTab='prod';render()">Produtos</button><button class="${T==='mov'?'on':''}" onclick="ui.stockTab='mov';render()">Movimentações<span class="n">${d.moves.length}</span></button></div>`;
  if(T==='mov'){const mv=d.moves.slice().reverse().slice(0,200);return head+`<div class="card"><div class="tbl-w"><table class="tbl"><thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th class="r">Qtd.</th><th>Motivo</th></tr></thead><tbody>${mv.map(x=>{const p=prod(x.prodId)||{name:'Produto removido',unit:''};return `<tr><td>${fmtD(x.date)}</td><td><b>${esc(p.name)}</b></td><td>${x.type==='in'?badge('Entrada','sage'):badge('Saída','clay')}</td><td class="r">${x.type==='in'?'+':'−'}${x.qty} ${esc(p.unit)}</td><td class="muted">${esc(x.reason||'')}</td></tr>`}).join('')||'<tr><td colspan="5" class="empty">Nenhuma movimentação ainda. Finalize um atendimento para ver a baixa automática.</td></tr>'}</tbody></table></div></div>`}
  return head+`<div class="card"><div class="tbl-w"><table class="tbl"><thead><tr><th>Produto</th><th>Categoria</th><th class="r">Em estoque</th><th class="r">Mínimo</th><th class="r">Custo unit.</th><th class="r">Valor</th><th>Situação</th><th></th></tr></thead><tbody>${d.products.slice().sort((a,b)=>(a.qty-a.min)-(b.qty-b.min)).map(p=>`<tr><td><b>${esc(p.name)}</b></td><td class="muted">${esc(p.cat)}</td><td class="r"><b>${num(p.qty)}</b> ${esc(p.unit)}</td><td class="r">${p.min}</td><td class="r">${brl(p.cost)}</td><td class="r">${brl(p.qty*p.cost)}</td><td>${p.qty<=p.min?badge('Repor','red'):p.qty<=p.min*1.5?badge('Atenção','gold'):badge('OK','sage')}</td><td class="act"><button class="btn ghost sm" onclick="moveProd('${p.id}','in')">Entrada</button> <button class="btn ghost sm" onclick="moveProd('${p.id}','out')">Saída</button> <button class="icon-btn" onclick="editProd('${p.id}')" aria-label="Editar">${ic('pen',15)}</button></td></tr>`).join('')}</tbody></table></div></div>`;
}
function editProd(id){
  const p=id?prod(id):{name:'',cat:'Facial',unit:'un',qty:0,min:1,cost:0};
  openModal(`<h2 class="mt">${id?'Editar produto':'Novo produto'}</h2><div class="frm" style="margin-top:14px">
  ${fld('Nome',`<input id="pr_name" value="${esc(p.name)}">`,'full')}
  ${fld('Categoria',`<input id="pr_cat" value="${esc(p.cat)}">`)}${fld('Unidade',`<select id="pr_unit">${['un','fr','kit','tb','sr','l','cx','ml','g'].map(u=>`<option ${p.unit===u?'selected':''}>${u}</option>`).join('')}</select>`)}
  ${fld('Quantidade atual',`<input id="pr_qty" type="number" min="0" step="0.5" value="${p.qty}">`)}${fld('Estoque mínimo',`<input id="pr_min" type="number" min="0" step="0.5" value="${p.min}">`)}
  ${fld('Custo unitário (R$)',`<input id="pr_cost" type="number" min="0" step="0.01" value="${p.cost}">`)}
  </div><div class="mf">${id?`<button class="btn ghost danger" onclick="delProd('${id}')">${ic('trash',16)}</button><span class="sp"></span>`:''}<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveProd('${id||''}')">Salvar</button></div>`);
}
function saveProd(id){const name=val('pr_name');if(!name)return toast('Informe o nome.');const data={name,cat:val('pr_cat'),unit:val('pr_unit'),qty:+val('pr_qty')||0,min:+val('pr_min')||0,cost:+val('pr_cost')||0};if(id)Object.assign(prod(id),data);else D().products.push(Object.assign({id:'p'+uid()},data));save();closeModal();render();toast('Produto salvo.')}
function delProd(id){if(D().services.some(s=>(s.ins||[]).some(([p])=>p===id))&&!confirm('Este produto é insumo de serviços. Excluir mesmo assim?'))return;const d=D();d.products=d.products.filter(p=>p.id!==id);d.services.forEach(s=>s.ins=(s.ins||[]).filter(([p])=>p!==id));save();closeModal();render()}
function moveProd(id,type){
  const p=prod(id);
  openModal(`<h2 class="mt">${type==='in'?'Entrada':'Saída'} de estoque</h2><p class="muted" style="margin-bottom:14px">${esc(p.name)} · atual: ${p.qty} ${esc(p.unit)}</p><div class="frm">
  ${fld('Quantidade',`<input id="mv_q" type="number" min="0.5" step="0.5" value="1">`)}${fld('Motivo',`<input id="mv_r" value="${type==='in'?'Compra de fornecedor':'Uso interno'}">`)}
  ${type==='in'&&canSee('financeiro')?`<label class="ck full"><input type="checkbox" id="mv_fin" checked> Lançar a compra como despesa no financeiro (${brl(p.cost)} por ${esc(p.unit)})</label>`:''}
  </div><div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveMove('${id}','${type}')">Confirmar</button></div>`);
}
function saveMove(id,type){const d=D(),p=prod(id),q=+val('mv_q')||0;if(q<=0)return toast('Informe a quantidade.');if(type==='out'&&q>p.qty)return toast('Quantidade maior que o estoque.');p.qty=Math.round((p.qty+(type==='in'?q:-q))*100)/100;d.moves.push({id:'m'+uid(),prodId:id,type,qty:q,date:today(),reason:val('mv_r')});if(type==='in'&&chk('mv_fin'))d.fin.push({id:'f'+uid(),type:'out',desc:'Compra: '+p.name,cat:'Fornecedores e insumos',value:Math.round(q*p.cost*100)/100,date:today(),method:'Pix',status:'pendente'});save();closeModal();render();toast('Estoque atualizado.')}

/* ===================== Financeiro ===================== */
function pgFinanceiro(){
  const d=D(),m=ui.finMonth||(ui.finMonth=ymOf(today())),T=ui.finTab,[a,b]=monthRange(m);
  const inM=d.fin.filter(f=>f.date>=a&&f.date<=b);const s=(t,st)=>sum(inM.filter(f=>f.type===t&&f.status===st),f=>f.value);
  const rec=s('in','pago'),des=s('out','pago'),arec=s('in','pendente'),apag=s('out','pendente');
  const head=`<div class="ph"><div><div class="eyebrow">Financeiro · ${esc(U().name)}</div><h1 class="title">${capF(monthLong(m))}</h1></div>
  <div class="ph-act"><div class="datenav"><button class="icon-btn" onclick="ui.finMonth=addMonths(ui.finMonth,-1);render()" aria-label="Mês anterior">${ic('left',16)}</button><button class="btn ghost sm" onclick="ui.finMonth=ymOf(today());render()">Mês atual</button><button class="icon-btn" onclick="ui.finMonth=addMonths(ui.finMonth,1);render()" aria-label="Próximo mês">${ic('right',16)}</button></div>
  <button class="btn ghost" onclick="exportFin()">${ic('dl',16)} Exportar</button><button class="btn pri" onclick="editFin()">${ic('plus',16)} Lançamento</button></div></div>
  <div class="kpis">${kpi('Receitas recebidas',brl0(rec),arec?brl0(arec)+' a receber':'','sage')}${kpi('Despesas pagas',brl0(des),apag?brl0(apag)+' a pagar':'')}${kpi('Resultado do mês',brl0(rec-des),rec?'Margem de '+pct(rec-des,rec)+'%':'',rec-des>=0?'dark':'')}${kpi('Comissões estimadas',brl0(sum(commissions(d,m),c=>c.value)),'com base nos atendimentos concluídos')}</div>
  <div class="tabs">${[['lanc','Lançamentos'],['fluxo','Fluxo de caixa'],['com','Comissões']].map(([k,l])=>`<button class="${T===k?'on':''}" onclick="ui.finTab='${k}';render()">${l}</button>`).join('')}</div>`;
  if(T==='fluxo'){
    const ch=[...Array(6)].map((_,i)=>{const mm=addMonths(m,i-5),[x,y]=monthRange(mm);return{label:monthLabel(mm),mm,a:finSum(d,'in',x,y),b:finSum(d,'out',x,y)}});
    const cats={};inM.filter(f=>f.type==='out').forEach(f=>cats[f.cat]=(cats[f.cat]||0)+f.value);const cl=Object.entries(cats).sort((x,y)=>y[1]-x[1]),cm=cl[0]?cl[0][1]:0;
    const met={};inM.filter(f=>f.type==='in'&&f.status==='pago').forEach(f=>met[f.method||'—']=(met[f.method||'—']||0)+f.value);const ml=Object.entries(met).sort((x,y)=>y[1]-x[1]),mmx=ml[0]?ml[0][1]:0;
    return head+`<div class="card" style="margin-bottom:16px"><div class="card-h"><h3>Receitas × despesas</h3><span class="sub">6 meses até ${monthLabel(m)}</span></div>${bars(ch,[{k:'a',n:'Receitas',c:'#4a7561'},{k:'b',n:'Despesas',c:'#e0b9a6'}],{h:230})}
    <div class="tbl-w" style="margin-top:12px"><table class="tbl"><thead><tr><th>Mês</th><th class="r">Receitas</th><th class="r">Despesas</th><th class="r">Resultado</th><th class="r">Margem</th></tr></thead><tbody>${ch.slice().reverse().map(r=>`<tr><td>${capF(monthLong(r.mm))}</td><td class="r">${brl(r.a)}</td><td class="r">${brl(r.b)}</td><td class="r ${r.a-r.b>=0?'pos':'neg'}"><b>${brl(r.a-r.b)}</b></td><td class="r">${pct(r.a-r.b,r.a)}%</td></tr>`).join('')}</tbody></table></div></div>
    <div class="g g2"><div class="card"><div class="card-h"><h3>Despesas por categoria</h3></div>${cl.map(([k,v])=>hbar(k,v,cm,brl0(v))).join('')||'<p class="empty-s">Sem despesas.</p>'}</div><div class="card"><div class="card-h"><h3>Receitas por forma de pagamento</h3></div>${ml.map(([k,v])=>hbar(k,v,mmx,brl0(v))).join('')||'<p class="empty-s">Sem receitas.</p>'}</div></div>`;
  }
  if(T==='com'){
    const cs=commissions(d,m),done=d.commLaunched&&d.commLaunched[m];
    return head+`<div class="card"><div class="card-h"><h3>Comissões de ${monthLong(m)}</h3>${done?badge('Lançadas no financeiro','sage'):`<button class="btn pri sm" onclick="launchComm('${m}')">Lançar como contas a pagar</button>`}</div>
    <div class="tbl-w"><table class="tbl"><thead><tr><th>Profissional</th><th class="r">Atendimentos</th><th class="r">Produção</th><th class="r">%</th><th class="r">Comissão</th></tr></thead><tbody>${cs.map(c=>`<tr><td><div class="who"><span class="dot" style="background:${c.p.color}"></span><b>${esc(c.p.name)}</b></div></td><td class="r">${c.count}</td><td class="r">${brl(c.base)}</td><td class="r">${c.p.comm}%</td><td class="r"><b>${brl(c.value)}</b></td></tr>`).join('')}<tr><td><b>Total</b></td><td class="r">${sum(cs,c=>c.count)}</td><td class="r">${brl(sum(cs,c=>c.base))}</td><td></td><td class="r"><b>${brl(sum(cs,c=>c.value))}</b></td></tr></tbody></table></div>
    <p class="note">Produção = valor cobrado nos atendimentos concluídos (sessões de pacote entram pelo valor proporcional). Percentuais configuráveis em Equipe.</p></div>`;
  }
  const F=ui.finType;let list=inM.filter(f=>F==='all'||f.type===F||(F==='pend'&&f.status==='pendente')).sort((x,y)=>y.date.localeCompare(x.date));
  return head+`<div class="card"><div class="toolbar"><div class="chips">${[['all','Todos'],['in','Receitas'],['out','Despesas'],['pend','Pendentes']].map(([k,l])=>`<button class="chip ${F===k?'on':''}" onclick="ui.finType='${k}';render()">${l}</button>`).join('')}</div><span class="note" style="margin:0 0 0 auto">${list.length} lançamento(s)</span></div>
  <div class="tbl-w"><table class="tbl"><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Forma</th><th>Situação</th><th class="r">Valor</th><th></th></tr></thead><tbody>${list.slice(0,400).map(f=>`<tr><td>${fmtD(f.date)}</td><td><b>${esc(f.desc)}</b>${f.clientId?`<br><small class="muted">${esc(cli(f.clientId).name)}</small>`:''}</td><td class="muted">${esc(f.cat)}</td><td class="muted">${esc(f.method||'—')}</td><td>${f.status==='pago'?badge(f.type==='in'?'Recebido':'Pago','sage'):badge(f.type==='in'?'A receber':'A pagar','gold')}</td><td class="r ${f.type==='in'?'pos':'neg'}"><b>${f.type==='in'?'+':'−'} ${brl(f.value)}</b></td><td class="act">${f.status!=='pago'?`<button class="btn ghost sm" onclick="finPay('${f.id}')">Baixar</button>`:''}<button class="icon-btn" onclick="editFin('${f.id}')" aria-label="Editar">${ic('pen',15)}</button></td></tr>`).join('')||'<tr><td colspan="7" class="empty">Nenhum lançamento neste mês.</td></tr>'}</tbody></table></div></div>`;
}
function finPay(id){const f=byId(D().fin,id);f.status='pago';save();render();toast(f.type==='in'?'Recebimento registrado.':'Pagamento registrado.')}
function editFin(id){
  const f=id?byId(D().fin,id):{type:'out',desc:'',cat:'Outras despesas',value:'',date:today(),method:'Pix',status:'pendente'};
  const cats=t=>(t==='in'?CATS_IN:CATS_OUT).map(c=>`<option ${f.cat===c?'selected':''}>${c}</option>`).join('');
  openModal(`<h2 class="mt">${id?'Editar lançamento':'Novo lançamento'}</h2><div class="frm" style="margin-top:14px">
  ${fld('Tipo',`<select id="fn_type" onchange="$('#fn_cat').innerHTML=(this.value==='in'?CATS_IN:CATS_OUT).map(c=>'<option>'+c+'</option>').join('')"><option value="in" ${f.type==='in'?'selected':''}>Receita</option><option value="out" ${f.type==='out'?'selected':''}>Despesa</option></select>`)}
  ${fld('Categoria',`<select id="fn_cat">${cats(f.type)}</select>`)}
  ${fld('Descrição',`<input id="fn_desc" value="${esc(f.desc)}">`,'full')}
  ${fld('Valor (R$)',`<input id="fn_val" type="number" min="0" step="0.01" value="${f.value}">`)}${fld('Data / vencimento',`<input id="fn_date" type="date" value="${f.date}">`)}
  ${fld('Forma',`<select id="fn_met">${[...METHODS,'Boleto','Transferência'].map(m=>`<option ${f.method===m?'selected':''}>${m}</option>`).join('')}</select>`)}
  ${fld('Situação',`<select id="fn_st"><option value="pago" ${f.status==='pago'?'selected':''}>Pago / recebido</option><option value="pendente" ${f.status==='pendente'?'selected':''}>Pendente</option></select>`)}
  </div><div class="mf">${id?`<button class="btn ghost danger" onclick="delFin('${id}')">${ic('trash',16)}</button><span class="sp"></span>`:''}<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveFin('${id||''}')">Salvar</button></div>`);
}
function saveFin(id){const desc=val('fn_desc'),v=+val('fn_val');if(!desc||!(v>0))return toast('Informe descrição e valor.');const data={type:val('fn_type'),cat:val('fn_cat'),desc,value:v,date:val('fn_date')||today(),method:val('fn_met'),status:val('fn_st')};if(id)Object.assign(byId(D().fin,id),data);else D().fin.push(Object.assign({id:'f'+uid()},data));save();closeModal();ui.finMonth=ymOf(data.date);render();toast('Lançamento salvo.')}
function delFin(id){if(!confirm('Excluir lançamento?'))return;D().fin=D().fin.filter(f=>f.id!==id);save();closeModal();render()}
function launchComm(m){const d=D(),cs=commissions(d,m).filter(c=>c.value>0);if(!confirm(`Lançar ${cs.length} comissão(ões), total ${brl(sum(cs,c=>c.value))}, como contas a pagar?`))return;const due=addMonths(m,1)+'-05';cs.forEach(c=>d.fin.push({id:'f'+uid(),type:'out',desc:'Comissão '+c.p.name+' — '+monthLabel(m),cat:'Comissões',value:c.value,date:due,method:'Pix',status:'pendente',proId:c.p.id}));d.commLaunched=d.commLaunched||{};d.commLaunched[m]=true;save();render();toast('Comissões lançadas com vencimento em '+fmtD(due)+'.')}
function exportFin(){const[a,b]=monthRange(ui.finMonth);exportCSV('financeiro-'+ui.finMonth,['Data','Tipo','Descrição','Categoria','Forma','Situação','Valor'],D().fin.filter(f=>f.date>=a&&f.date<=b).sort((x,y)=>x.date.localeCompare(y.date)).map(f=>[fmtD(f.date),f.type==='in'?'Receita':'Despesa',f.desc,f.cat,f.method||'',f.status,(f.type==='in'?1:-1)*f.value]))}

/* ===================== Marketing ===================== */
function pgMarketing(){
  const d=D(),t=today(),tm=addDays(t,1),link=location.href.split('#')[0]+'#/agendar/'+S.cur;
  const tomorrow=d.appts.filter(a=>a.date===tm&&['agendado','confirmado'].includes(a.status)).sort(byDT);
  const bd=birthdays(d),ina=inactive(d,60),online=d.appts.filter(a=>a.origin==='online'&&ymOf(a.createdAt)===ymOf(t)).length;
  const waBtn=(phone,msg,txt='Enviar')=>`<a class="btn ghost sm" target="_blank" rel="noopener" href="${waLink(phone,msg)}">${ic('wa',14)} ${txt}</a>`;
  return `<div class="ph"><div><div class="eyebrow">Marketing e relacionamento</div><h1 class="title">Clientes voltando sempre</h1></div></div>
  <div class="g g2">
   <div class="card"><div class="card-h"><h3>${ic('link',18)} Agendamento online</h3>${badge(online+' agendamento(s) online no mês','sage')}</div><p class="muted" style="font-size:.88rem">Coloque o link na bio do Instagram, no Google Meu Negócio e no WhatsApp. O cliente escolhe serviço, profissional e horário livre.</p>
    <div class="toolbar" style="margin:10px 0 0"><input value="${esc(link)}" readonly onclick="this.select()" style="flex:1;min-width:200px"><button class="btn" onclick="copyText('${link}')">Copiar</button><a class="btn pri" href="#/agendar/${S.cur}" target="_blank" rel="noopener">${ic('ext',15)} Abrir</a></div></div>
   <div class="card"><div class="card-h"><h3>${ic('clock',18)} Confirmações de amanhã</h3><span class="sub">${tomorrow.length} atendimento(s)</span></div><div class="list">${tomorrow.slice(0,6).map(a=>{const c=cli(a.clientId);return `<div class="li static"><div class="t">${a.time}</div><div class="b"><b>${esc(c.name)}</b><small>${esc(svc(a.svcId).name)}</small></div>${a.status==='confirmado'?badge('Confirmado','sage'):waBtn(c.phone,confirmMsg(a),'Confirmar')}</div>`}).join('')||'<p class="empty-s">Nenhum atendimento amanhã.</p>'}</div>${tomorrow.length>6?`<a class="btn ghost sm" onclick="ui.agendaDate='${tm}';go('agenda')">Ver todos</a>`:''}</div>
  </div>
  <div class="g g2">
   <div class="card"><div class="card-h"><h3>${ic('gift',18)} Aniversariantes de ${MONTHS[+t.slice(5,7)-1]}</h3><span class="sub">${bd.length} cliente(s)</span></div><div class="list">${bd.slice(0,7).map(c=>`<div class="li static"><div class="t">${c.birth.slice(8)}/${c.birth.slice(5,7)}</div><div class="b"><b>${esc(c.name)}</b><small>${esc(c.phone)}</small></div>${waBtn(c.phone,`Feliz aniversário, ${first(c.name)}! 🎉 A equipe da ${S.org.name} preparou um presente: 15% de desconto em qualquer procedimento este mês. Quer agendar?`,'Parabéns')}</div>`).join('')||'<p class="empty-s">Nenhum aniversariante neste mês.</p>'}</div></div>
   <div class="card"><div class="card-h"><h3>${ic('users',18)} Clientes sem voltar há 60+ dias</h3><span class="sub">${ina.length} cliente(s)</span></div><div class="list">${ina.slice(0,7).map(x=>`<div class="li static"><div class="b"><b>${esc(x.c.name)}</b><small>Última visita ${fmtD(x.last)} · ${brl0(x.total)} gastos</small></div>${waBtn(x.c.phone,`Oi, ${first(x.c.name)}! Sentimos sua falta na ${S.org.name}. Temos horários disponíveis esta semana — quer que eu reserve um para você?`,'Reativar')}</div>`).join('')||'<p class="empty-s">Ninguém inativo. Ótimo sinal!</p>'}</div></div>
  </div>
  <div class="card"><div class="card-h"><h3>${ic('mega',18)} Campanha por WhatsApp</h3><span class="sub">Monte a mensagem e envie individualmente</span></div>
   <div class="frm"><div class="fld"><span>Público</span><select id="cp_seg"><option value="all">Todos os clientes</option><option value="ina">Inativos há 60+ dias</option><option value="bd">Aniversariantes do mês</option><option value="vip">Etiqueta VIP</option></select></div>
   ${fld('Mensagem (use {{nome}})',`<textarea id="cp_msg" rows="3">Olá, {{nome}}! Novidade na ${esc(S.org.name)}: protocolos de verão com condições especiais até o fim do mês. Quer saber mais?</textarea>`,'full')}</div>
   <div class="mf" style="justify-content:flex-start"><button class="btn pri" onclick="buildCampaign()">Gerar lista de envio</button></div><div id="cp_out"></div>
   <p class="note">Nesta versão o envio é individual pelo WhatsApp Web/app (um clique por cliente). Disparo automático em massa exige integração com a API oficial do WhatsApp Business.</p></div>`;
}
function buildCampaign(){
  const d=D(),seg=val('cp_seg'),msg=$('#cp_msg').value;
  let list=seg==='ina'?inactive(d).map(x=>x.c):seg==='bd'?birthdays(d):seg==='vip'?d.clients.filter(c=>(c.tags||[]).includes('VIP')):d.clients.slice();
  list=list.filter(c=>onlyDigits(c.phone).length>=10);
  $('#cp_out').innerHTML=`<div class="lbl">${list.length} cliente(s) com WhatsApp</div><div class="list">${list.slice(0,40).map(c=>`<div class="li static"><div class="b"><b>${esc(c.name)}</b><small>${esc(c.phone)}</small></div><a class="btn ghost sm" target="_blank" rel="noopener" href="${waLink(c.phone,msg.replace(/\{\{nome\}\}/g,first(c.name)))}" onclick="this.classList.add('pri');this.innerHTML='Enviado ✓'">${ic('wa',14)} Enviar</a></div>`).join('')}</div>${list.length>40?`<p class="note">Mostrando 40 de ${list.length}.</p>`:''}`;
}

/* ===================== Relatórios ===================== */
function periodRange(p){const t=today(),m=ymOf(t);if(p==='ant'){const pm=addMonths(m,-1);return[pm+'-01',pm+'-'+pad(daysIn(pm)),'Mês anterior']}if(p==='90')return[addDays(t,-89),t,'Últimos 90 dias'];if(p==='ano')return[t.slice(0,4)+'-01-01',t,'Este ano'];return[m+'-01',t,'Este mês']}
function pgRelatorios(){
  const d=D(),[a,b,lbl]=periodRange(ui.repPeriod);
  const ap=d.appts.filter(x=>x.date>=a&&x.date<=b),done=ap.filter(x=>x.status==='concluido'),noshow=ap.filter(x=>x.status==='faltou').length,canc=ap.filter(x=>x.status==='cancelado').length,pastAp=ap.filter(x=>x.date<today()||x.status==='concluido');
  const rev=finSum(d,'in',a,b),newC=d.clients.filter(c=>c.createdAt>=a&&c.createdAt<=b).length,ps=paperStats(a,b);
  const bySvc={};done.forEach(x=>{const k=x.svcId;(bySvc[k]=bySvc[k]||{n:0,v:0}).n++;bySvc[k].v+=x.charged||0});const sv=Object.entries(bySvc).sort((x,y)=>y[1].v-x[1].v),svMax=sv[0]?sv[0][1].v:0;
  const byPro=d.pros.map(p=>{const l=done.filter(x=>x.proId===p.id);return{p,n:l.length,v:sum(l,x=>x.charged||0)}}).sort((x,y)=>y.v-x.v),prMax=byPro[0]?byPro[0].v:0;
  const org={};ap.forEach(x=>org[x.origin]=(org[x.origin]||0)+1);
  const t=today(),m=ymOf(t),adop=[...Array(6)].map((_,i)=>{const mm=addMonths(m,i-5),[x,y]=monthRange(mm),s=paperStats(x,y>t?t:y);return{label:monthLabel(mm),a:s.pct}});
  return `<div class="ph"><div><div class="eyebrow">Relatórios · ${esc(U().name)}</div><h1 class="title">${lbl}</h1><p class="muted">${fmtD(a)} a ${fmtD(b)}</p></div><div class="ph-act"><div class="seg">${[['mes','Este mês'],['ant','Mês anterior'],['90','90 dias'],['ano','Ano']].map(([k,l])=>`<button class="${ui.repPeriod===k?'on':''}" onclick="ui.repPeriod='${k}';render()">${l}</button>`).join('')}</div></div></div>
  <div class="kpis">${kpi('Faturamento',brl0(rev),'','dark')}${kpi('Atendimentos concluídos',num(done.length),`ticket médio ${brl0(done.length?sum(done,x=>x.charged||0)/done.length:0)}`)}${kpi('Novos clientes',newC)}${kpi('Faltas',pct(noshow,pastAp.length)+'%',`${noshow} faltas · ${canc} cancelamentos`)}${kpi('Papel evitado',num(ps.sheets)+' fl.',ps.pct+'% assinado na tela','sage')}</div>
  <div class="g g2">
   <div class="card"><div class="card-h"><h3>Faturamento por serviço</h3><button class="btn ghost sm" onclick="exportCSV('servicos-${a}',['Serviço','Atendimentos','Receita'],${esc(JSON.stringify(sv.map(([k,v])=>[svc(k).name,v.n,v.v.toFixed(2).replace('.',',')])))})">${ic('dl',14)} CSV</button></div>${sv.map(([k,v])=>hbar(svc(k).name,v.v,svMax,brl0(v.v)+' · '+v.n)).join('')||'<p class="empty-s">Sem dados no período.</p>'}</div>
   <div class="card"><div class="card-h"><h3>Produção por profissional</h3><button class="btn ghost sm" onclick="exportCSV('profissionais-${a}',['Profissional','Atendimentos','Produção'],${esc(JSON.stringify(byPro.map(x=>[x.p.name,x.n,x.v.toFixed(2).replace('.',',')])))})">${ic('dl',14)} CSV</button></div>${byPro.map(x=>hbar(x.p.name,x.v,prMax,brl0(x.v)+' · '+x.n)).join('')}</div>
  </div>
  <div class="g g2">
   <div class="card"><div class="card-h"><h3>${ic('leaf',18)} Adoção da assinatura digital</h3><span class="sub">% de termos assinados na tela</span></div>${bars(adop,[{k:'a',n:'% digital',c:'#4a7561'}],{h:190,fmt:v=>v+'%'})}<p class="note">${S.demo?'Histórico de demonstração simulando a implantação gradual. ':''}Indicador do plano de redução de papel.</p></div>
   <div class="card"><div class="card-h"><h3>Origem dos agendamentos</h3></div>${Object.entries(org).map(([k,v])=>hbar(k==='online'?'Agendamento online':'Recepção / WhatsApp',v,ap.length,pct(v,ap.length)+'%')).join('')||'<p class="empty-s">Sem dados.</p>'}
    <div class="lbl">Status dos agendamentos</div>${Object.keys(STATUS).map(k=>{const n=ap.filter(x=>x.status===k).length;return n?hbar(STATUS[k].l,n,ap.length,n):''}).join('')}</div>
  </div>`;
}

/* ===================== Equipe ===================== */
function pgEquipe(){
  const d=D(),T=ui.equipeTab;
  const head=`<div class="ph"><div><div class="eyebrow">Equipe · ${esc(U().name)}</div><h1 class="title">Equipe e acessos</h1></div><div class="ph-act"><button class="btn pri" onclick="${T==='pros'?'editPro()':'editUser()'}">${ic('plus',16)} ${T==='pros'?'Novo profissional':'Novo usuário'}</button></div></div>
  <div class="tabs"><button class="${T==='pros'?'on':''}" onclick="ui.equipeTab='pros';render()">Profissionais<span class="n">${d.pros.length}</span></button><button class="${T==='users'?'on':''}" onclick="ui.equipeTab='users';render()">Usuários e permissões<span class="n">${S.users.length}</span></button></div>`;
  if(T==='users'){
    const mods=NAV.flatMap(([,i])=>i);
    return head+`<div class="card" style="margin-bottom:16px"><div class="tbl-w"><table class="tbl"><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Unidade</th><th></th></tr></thead><tbody>${S.users.map(u=>`<tr><td><b>${esc(u.name)}</b></td><td>${esc(u.email)}</td><td>${badge(ROLES[u.role].l,u.role==='admin'?'ink':u.role==='recepcao'?'blue':'sage')}</td><td>${u.unit==='all'?'Todas':esc((byId(S.units,u.unit)||{name:'—'}).name)}</td><td class="act"><button class="icon-btn" onclick="editUser('${u.id}')" aria-label="Editar">${ic('pen',15)}</button></td></tr>`).join('')}</tbody></table></div></div>
    <div class="card"><div class="card-h"><h3>Matriz de permissões</h3><span class="sub">Teste no seletor de perfil, no canto inferior do menu</span></div><div class="tbl-w"><table class="tbl perm"><thead><tr><th>Módulo</th>${Object.values(ROLES).map(r=>`<th>${r.l}</th>`).join('')}</tr></thead><tbody>${mods.map(([k,l])=>`<tr><td>${l}</td>${Object.values(ROLES).map(r=>`<td>${r.nav==='*'||r.nav.includes(k)?`<span class="up">${ic('check',16)}</span>`:'<span class="muted">—</span>'}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="note">Nesta versão as permissões controlam o que aparece na tela. Em produção, o controle é aplicado também no servidor.</p></div>`;
  }
  return head+`<div class="tiles">${d.pros.map(p=>`<div class="tile" onclick="editPro('${p.id}')"><div class="who"><div class="av lg" style="background:${p.color}">${initials(p.name)}</div><div><h4 style="margin:0">${esc(p.name)}</h4><p>${esc(p.spec)}</p></div></div><div class="chips" style="margin-top:12px">${p.cats.map(c=>badge(esc(c),'sage')).join('')}${badge('Comissão '+p.comm+'%','gold')}${p.active?'':badge('Inativo','mut')}</div></div>`).join('')}<div class="tile" onclick="editPro()" style="border-style:dashed;display:grid;place-items:center;text-align:center;color:var(--mut)">${ic('plus',22)}<h4>Novo profissional</h4></div></div>`;
}
function editPro(id){
  const d=D(),p=id?pro(id):{name:'',spec:'',comm:40,cats:[],color:PRO_COLORS[d.pros.length%PRO_COLORS.length],active:true};
  openModal(`<h2 class="mt">${id?'Editar profissional':'Novo profissional'}</h2><div class="frm" style="margin-top:14px">
  ${fld('Nome',`<input id="pf_name" value="${esc(p.name)}">`,'full')}${fld('Especialidade',`<input id="pf_spec" value="${esc(p.spec)}">`)}${fld('Comissão (%)',`<input id="pf_comm" type="number" min="0" max="100" value="${p.comm}">`)}
  <div class="fld full"><span>Atende as categorias</span><div class="checks">${SVC_CATS.map(c=>`<label class="ck"><input type="checkbox" class="pf_cat" value="${c}" ${p.cats.includes(c)?'checked':''}> ${c}</label>`).join('')}</div></div>
  <div class="fld full"><span>Cor na agenda</span><div class="chips">${PRO_COLORS.map(c=>`<label class="ck"><input type="radio" name="pf_color" value="${c}" ${p.color===c?'checked':''}><span class="dot" style="background:${c};width:18px;height:18px"></span></label>`).join('')}</div></div>
  <label class="ck full"><input type="checkbox" id="pf_act" ${p.active?'checked':''}> Ativo na agenda</label></div>
  <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="savePro('${id||''}')">Salvar</button></div>`);
}
function savePro(id){const name=val('pf_name');if(!name)return toast('Informe o nome.');const cats=$$('.pf_cat:checked').map(x=>x.value);if(!cats.length)return toast('Selecione ao menos uma categoria.');const data={name,spec:val('pf_spec'),comm:+val('pf_comm')||0,cats,color:($('input[name=pf_color]:checked')||{}).value||PRO_COLORS[0],active:chk('pf_act')};if(id)Object.assign(pro(id),data);else D().pros.push(Object.assign({id:'pr'+uid()},data));save();closeModal();render();toast('Profissional salvo.')}
function editUser(id){
  const u=id?byId(S.users,id):{name:'',email:'',role:'recepcao',unit:S.cur};
  openModal(`<h2 class="mt">${id?'Editar usuário':'Novo usuário'}</h2><div class="frm" style="margin-top:14px">
  ${fld('Nome',`<input id="us_name" value="${esc(u.name)}">`)}${fld('E-mail',`<input id="us_email" type="email" value="${esc(u.email)}">`)}
  ${fld('Perfil',`<select id="us_role">${Object.entries(ROLES).map(([k,v])=>`<option value="${k}" ${u.role===k?'selected':''}>${v.l}</option>`).join('')}</select>`)}
  ${fld('Unidade',`<select id="us_unit"><option value="all">Todas as unidades</option>${S.units.map(x=>`<option value="${x.id}" ${u.unit===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select>`)}
  </div><p class="note">Na versão de produção o usuário recebe um convite por e-mail para criar a senha.</p>
  <div class="mf">${id&&S.users.length>1?`<button class="btn ghost danger" onclick="delUser('${id}')">${ic('trash',16)}</button><span class="sp"></span>`:''}<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveUser('${id||''}')">Salvar</button></div>`);
}
function saveUser(id){const name=val('us_name'),email=val('us_email');if(!name||!email)return toast('Informe nome e e-mail.');const data={name,email,role:val('us_role'),unit:val('us_unit')};if(id)Object.assign(byId(S.users,id),data);else S.users.push(Object.assign({id:'us'+uid()},data));save();closeModal();render();toast('Usuário salvo.')}
function delUser(id){if(!confirm('Remover acesso deste usuário?'))return;S.users=S.users.filter(u=>u.id!==id);save();closeModal();render()}

/* ===================== Rede / multiunidade ===================== */
function unitStats(u){const db=S.db[u.id],t=today(),m=ymOf(t),[a]=monthRange(m);const done=db.appts.filter(x=>x.status==='concluido'&&x.date>=a&&x.date<=t);const rev=finSum(db,'in',a,t);return{rev,done:done.length,ticket:done.length?sum(done,x=>x.charged||0)/done.length:0,clients:db.clients.length,pros:db.pros.filter(p=>p.active).length,res:rev-finSum(db,'out',a,t),paper:paperStats(a,t,db)}}
function pgRede(){
  const st=S.units.map(u=>({u,s:unitStats(u)})),tot=k=>sum(st,x=>x.s[k]);
  const colors=['#4a7561','#c06e4b','#3c6890','#8d63a8','#a97f22','#4f8a87'],m=ymOf(today());
  const ch=[...Array(6)].map((_,i)=>{const mm=addMonths(m,i-5),[a,b]=monthRange(mm),o={label:monthLabel(mm)};S.units.forEach(u=>o[u.id]=finSum(S.db[u.id],'in',a,b));return o});
  return `<div class="ph"><div><div class="eyebrow">${esc(S.org.name)} · Plano ${esc(S.org.plan)}</div><h1 class="title">Rede de unidades</h1></div><div class="ph-act"><button class="btn pri" onclick="newUnit()">${ic('plus',16)} Nova unidade</button></div></div>
  <div class="kpis">${kpi('Faturamento da rede no mês',brl0(tot('rev')),'','dark')}${kpi('Atendimentos no mês',num(tot('done')))}${kpi('Clientes na rede',num(tot('clients')))}${kpi('Unidades',S.units.length,num(tot('pros'))+' profissionais ativos')}</div>
  <div class="card" style="margin-bottom:16px"><div class="tbl-w"><table class="tbl"><thead><tr><th>Unidade</th><th>Cidade</th><th class="r">Faturamento no mês</th><th class="r">Resultado</th><th class="r">Atendimentos</th><th class="r">Ticket médio</th><th class="r">% digital</th><th></th></tr></thead><tbody>${st.map(({u,s})=>`<tr><td><b>${esc(u.name)}</b>${u.id===S.cur?' '+badge('atual','sage'):''}</td><td class="muted">${esc(u.city)}</td><td class="r">${brl(s.rev)}</td><td class="r ${s.res>=0?'pos':'neg'}">${brl(s.res)}</td><td class="r">${s.done}</td><td class="r">${brl0(s.ticket)}</td><td class="r">${s.paper.pct}%</td><td class="act">${u.id!==S.cur?`<button class="btn ghost sm" onclick="switchUnit('${u.id}');go('inicio')">Acessar</button>`:''}<button class="icon-btn" onclick="editUnit('${u.id}')" aria-label="Editar">${ic('pen',15)}</button></td></tr>`).join('')}</tbody></table></div></div>
  <div class="card"><div class="card-h"><h3>Faturamento por unidade</h3><span class="sub">Últimos 6 meses</span></div>${bars(ch,S.units.map((u,i)=>({k:u.id,n:u.name,c:colors[i%colors.length]})))}</div>`;
}
function newUnit(){
  openModal(`<h2 class="mt">Nova unidade</h2><p class="muted" style="margin-bottom:14px">Cada unidade tem agenda, equipe, estoque e financeiro próprios, com visão consolidada da rede.</p><div class="frm">
  ${fld('Nome da unidade',`<input id="nu_name" placeholder="Unidade Centro">`,'full')}${fld('Cidade/UF',`<input id="nu_city" placeholder="Curitiba/PR">`)}${fld('Telefone',`<input id="nu_phone">`)}
  ${fld('Endereço',`<input id="nu_addr">`,'full')}
  <label class="ck full"><input type="checkbox" id="nu_copy" checked> Copiar catálogo da unidade atual (serviços, pacotes, produtos, termos e fichas)</label>
  <label class="ck full"><input type="checkbox" id="nu_demo"> Preencher com dados de exemplo (para demonstração)</label></div>
  <div class="mf"><button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="createUnit()">Criar unidade</button></div>`);
}
function createUnit(){
  const name=val('nu_name');if(!name)return toast('Informe o nome da unidade.');
  const u={id:'u'+uid(),name,city:val('nu_city')||U().city,address:val('nu_addr'),phone:val('nu_phone'),open:'09:00',close:'19:00',slot:30};
  let db;
  if(chk('nu_demo'))db=seedUnit(Math.floor(Math.random()*1e6),[['Profissional A','Esteticista',40,['Facial','Corporal','Beleza']],['Profissional B','Biomédica',45,['Injetáveis','Laser']]],.45,u);
  else{db=emptyDb();if(chk('nu_copy')){const c=D();['services','packages','templates','forms'].forEach(k=>db[k]=clone(c[k]));db.products=c.products.map(p=>Object.assign(clone(p),{qty:0}))}else baseCatalog(db),db.products.forEach(p=>p.qty=0)}
  S.units.push(u);S.db[u.id]=db;S.cur=u.id;save();closeModal();toast('Unidade criada: '+name);go(db.pros.length?'inicio':'equipe');render();
}
function editUnit(id){const u=byId(S.units,id);openModal(`<h2 class="mt">Editar unidade</h2><div class="frm" style="margin-top:14px">${fld('Nome',`<input id="eu_name" value="${esc(u.name)}">`,'full')}${fld('Cidade/UF',`<input id="eu_city" value="${esc(u.city)}">`)}${fld('Telefone',`<input id="eu_phone" value="${esc(u.phone)}">`)}${fld('Endereço',`<input id="eu_addr" value="${esc(u.address)}">`,'full')}</div>
  <div class="mf">${S.units.length>1?`<button class="btn ghost danger" onclick="delUnit('${id}')">${ic('trash',16)} Excluir unidade</button><span class="sp"></span>`:''}<button class="btn ghost" onclick="closeModal()">Cancelar</button><button class="btn pri" onclick="saveUnitBasic('${id}')">Salvar</button></div>`)}
function saveUnitBasic(id){const u=byId(S.units,id);Object.assign(u,{name:val('eu_name')||u.name,city:val('eu_city'),phone:val('eu_phone'),address:val('eu_addr')});save();closeModal();render();toast('Unidade atualizada.')}
function delUnit(id){const u=byId(S.units,id);if(prompt(`Para excluir "${u.name}" e TODOS os dados dela, digite EXCLUIR:`)!=='EXCLUIR')return;S.units=S.units.filter(x=>x.id!==id);delete S.db[id];if(S.cur===id)S.cur=S.units[0].id;save();closeModal();render();toast('Unidade excluída.')}

/* ===================== Configurações ===================== */
function pgConfig(){
  const u=U();
  return `<div class="ph"><div><div class="eyebrow">Configurações</div><h1 class="title">${esc(u.name)}</h1></div></div>
  <div class="g g2">
   <div class="card"><div class="card-h"><h3>Dados e horário da unidade</h3></div><div class="frm">
    ${fld('Nome',`<input id="cf_name" value="${esc(u.name)}">`,'full')}${fld('Cidade/UF',`<input id="cf_city" value="${esc(u.city)}">`)}${fld('Telefone',`<input id="cf_phone" value="${esc(u.phone)}">`)}
    ${fld('Endereço',`<input id="cf_addr" value="${esc(u.address)}">`,'full')}
    ${fld('Abre às',`<input id="cf_open" type="time" step="1800" value="${u.open}">`)}${fld('Fecha às',`<input id="cf_close" type="time" step="1800" value="${u.close}">`)}
    ${fld('Intervalo da agenda',`<select id="cf_slot">${[15,30,60].map(s=>`<option value="${s}" ${+u.slot===s?'selected':''}>${s} minutos</option>`).join('')}</select>`)}
   </div><div class="mf"><button class="btn pri" onclick="saveCfg()">Salvar</button></div></div>
   <div class="card"><div class="card-h"><h3>Organização</h3></div><div class="frm">
    ${fld('Nome da clínica / rede',`<input id="cf_org" value="${esc(S.org.name)}">`,'full')}
    ${fld('Custo estimado por folha impressa (R$)',`<input id="cf_paper" type="number" step="0.01" min="0" value="${S.org.paperCost}">`)}
    ${fld('Plano',`<input value="${esc(S.org.plan)} — unidades ilimitadas" disabled>`)}
   </div><p class="note">O custo por folha (papel, tinta, energia) alimenta o indicador de papel evitado.</p><div class="mf"><button class="btn pri" onclick="saveOrg()">Salvar</button></div></div>
  </div>
  <div class="g g2">
   <div class="card"><div class="card-h"><h3>Backup dos dados</h3></div><p class="muted" style="font-size:.88rem">Exporte uma cópia de segurança de todas as unidades. Para conferir um backup sem alterar nada, use "Testar".</p>
    <div class="toolbar"><button class="btn pri" onclick="exportBackup()">${ic('dl',16)} Exportar backup</button><label class="btn" style="cursor:pointer">Testar backup<input type="file" accept=".json" hidden onchange="readBackup(this,false)"></label><label class="btn" style="cursor:pointer">${ic('up',16)} Restaurar<input type="file" accept=".json" hidden onchange="readBackup(this,true)"></label></div><p class="note" id="bk_msg"></p></div>
   <div class="card"><div class="card-h"><h3>Privacidade e demonstração</h3></div>
    <ul class="ul" style="color:var(--ink2)"><li>Nesta versão de apresentação, os dados ficam somente neste navegador e dispositivo.</li><li>Na versão de produção: banco de dados em servidor, login com senha, criptografia, backups automáticos e registro de acessos (LGPD).</li><li>Todos os clientes e valores de exemplo são fictícios.</li></ul>
    <div class="toolbar" style="margin-top:14px"><button class="btn" onclick="resetDemo(true)">Restaurar dados de exemplo</button><button class="btn danger" onclick="resetDemo(false)">Começar do zero</button></div></div>
  </div>`;
}
function saveCfg(){const u=U(),o=val('cf_open'),c=val('cf_close');if(t2m(c)<=t2m(o))return toast('O horário de fechamento deve ser depois da abertura.');Object.assign(u,{name:val('cf_name')||u.name,city:val('cf_city'),phone:val('cf_phone'),address:val('cf_addr'),open:o,close:c,slot:+val('cf_slot')});save();render();toast('Configurações salvas.')}
function saveOrg(){S.org.name=val('cf_org')||S.org.name;S.org.paperCost=Math.max(0,+val('cf_paper')||0);save();render();toast('Organização atualizada.')}
function exportBackup(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({app:'salvia',exportedAt:new Date().toISOString(),data:S})],{type:'application/json'}));a.download='backup-salvia-'+today()+'.json';document.body.appendChild(a);a.click();a.remove();toast('Backup exportado.')}
function readBackup(inp,apply){
  const f=inp.files&&inp.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{try{const j=JSON.parse(r.result);if(j.app!=='salvia'||!j.data||!j.data.db)throw 0;const n=Object.keys(j.data.db).length,c=sum(Object.values(j.data.db),x=>x.clients.length);
    if(!apply){$('#bk_msg').textContent=`Backup válido: ${n} unidade(s), ${num(c)} clientes, exportado em ${fmtDT(j.exportedAt)}. Nada foi alterado.`;return}
    if(!confirm('Substituir todos os dados atuais por este backup?'))return;const sess=S.session;S=j.data;S.session=sess;save();render();toast('Backup restaurado.')}
    catch(e){$('#bk_msg').textContent='Arquivo inválido: não é um backup do Sálvia.'}inp.value=''};
  r.readAsText(f);
}
function resetDemo(sample){
  if(!confirm(sample?'Recarregar os dados de exemplo? Tudo o que foi feito será perdido.':'Apagar todos os dados e começar do zero?'))return;
  const sess=S.session;
  if(sample){S=makeSeed()}
  else{const s=makeSeed();s.demo=false;s.units=[Object.assign(s.units[0],{name:'Unidade principal',address:'',phone:''})];const db=baseCatalog(emptyDb());db.products.forEach(p=>p.qty=0);s.db={u1:db};s.users=[s.users[0]];S=s}
  S.session=sess;S.session.role='admin';save();go('inicio');render();toast(sample?'Dados de exemplo restaurados.':'Sistema zerado. Comece cadastrando a equipe.');
}

/* ===================== Página pública: agendamento online ===================== */
let BK={};
function freeSlots(db,u,date,svcId,proId){
  const s=byId(db.services,svcId);if(!s)return[];
  const pros=proId&&proId!=='any'?[byId(db.pros,proId)].filter(Boolean):db.pros.filter(p=>p.active&&p.cats.includes(s.cat));
  const open=t2m(u.open),close=t2m(u.close),slot=+u.slot||30,lim=date===today()?nowMin()+60:-1,out=[];
  for(let m=open;m+s.dur<=close;m+=slot){if(m<lim)continue;const p=pros.find(p=>!hasConflict(db,p.id,date,m2t(m),s.dur));if(p)out.push({t:m2t(m),proId:p.id})}
  return out;
}
function renderBooking(unitId){
  const u=byId(S.units,unitId),db=S.db[unitId];
  if(!u||!db){$('#root').innerHTML=`<div class="pub"><main class="pub-c"><div class="card empty-state"><h3>Página não encontrada</h3><p>Verifique o link de agendamento.</p></div></main></div>`;return}
  if(BK.unit!==unitId)BK={unit:unitId,step:1};
  const s=BK.svcId&&byId(db.services,BK.svcId),p=BK.proId&&BK.proId!=='any'&&byId(db.pros,BK.proId);
  let body='';
  if(BK.step===1){
    const cats=[...new Set(db.services.filter(x=>x.active!==false).map(x=>x.cat))];
    body=`<h1 class="title sm" style="margin-bottom:14px">Qual serviço você deseja?</h1>${cats.map(c=>`<div class="lbl">${esc(c)}</div>${db.services.filter(x=>x.cat===c&&x.active!==false).map(x=>`<button class="opt" onclick="BK.svcId='${x.id}';BK.step=2;renderBooking('${unitId}')"><div><b>${esc(x.name)}</b><small>${x.dur} min</small></div><b>${brl0(x.price)}</b></button>`).join('')}`).join('')}`;
  }else if(BK.step===2){
    const ps=db.pros.filter(x=>x.active&&x.cats.includes(s.cat));
    body=`<h1 class="title sm" style="margin-bottom:14px">Com quem?</h1><button class="opt" onclick="BK.proId='any';BK.step=3;renderBooking('${unitId}')"><div><b>Sem preferência</b><small>Primeiro horário disponível</small></div>${ic('right')}</button>${ps.map(x=>`<button class="opt" onclick="BK.proId='${x.id}';BK.step=3;renderBooking('${unitId}')"><div class="who"><div class="av" style="background:${x.color};color:#fff">${initials(x.name)}</div><div><b>${esc(x.name)}</b><small>${esc(x.spec)}</small></div></div>${ic('right')}</button>`).join('')}`;
  }else if(BK.step===3){
    const days=[];let dd=today();while(days.length<14){if(parseD(dd).getDay()!==0)days.push(dd);dd=addDays(dd,1)}
    if(!BK.date||!days.includes(BK.date))BK.date=days.find(x=>freeSlots(db,u,x,BK.svcId,BK.proId).length)||days[0];
    const sl=freeSlots(db,u,BK.date,BK.svcId,BK.proId);
    body=`<h1 class="title sm" style="margin-bottom:14px">Escolha o dia e o horário</h1><div class="days">${days.map(x=>`<button class="day ${x===BK.date?'on':''}" onclick="BK.date='${x}';BK.time=null;renderBooking('${unitId}')"><span>${wkShort(x)}</span><b>${+x.slice(8)}</b><span>${MONTHS[+x.slice(5,7)-1]}</span></button>`).join('')}</div>
    <div class="lbl">${capF(longDate(BK.date))}</div>${sl.length?`<div class="slots">${sl.map(x=>`<button class="slot ${BK.time===x.t?'on':''}" onclick="BK.time='${x.t}';BK.slotPro='${x.proId}';BK.step=4;renderBooking('${unitId}')">${x.t}</button>`).join('')}</div>`:'<p class="empty-s">Sem horários livres neste dia. Escolha outra data.</p>'}`;
  }else if(BK.step===4){
    const pp=byId(db.pros,BK.slotPro);
    body=`<h1 class="title sm" style="margin-bottom:14px">Seus dados</h1><div class="card"><div class="frm">${fld('Nome completo',`<input id="bk_name" autocomplete="name" value="${esc(BK.name||'')}">`,'full')}${fld('WhatsApp',`<input id="bk_phone" inputmode="tel" autocomplete="tel" placeholder="(41) 90000-0000" value="${esc(BK.phone||'')}">`,'full')}</div>
    <label class="ck" style="margin-top:14px"><input type="checkbox" id="bk_ok"> Concordo com o uso dos meus dados para agendamento e contato da clínica (LGPD).</label>
    <div class="mf"><button class="btn pri block" onclick="bkConfirm('${unitId}')">${ic('check',16)} Confirmar agendamento</button></div></div><p class="note center">Profissional: ${esc(pp?pp.name:'')}</p>`;
  }else{
    body=`<div class="card center" style="padding:34px 22px"><div class="okmark">${ic('check',30)}</div><h1 class="title sm">Agendamento solicitado!</h1><p class="muted" style="margin:8px 0 18px">${esc(BK.done.svc)} com ${esc(BK.done.pro)}<br><b>${capF(longDate(BK.done.date))} às ${BK.done.time}</b></p><p class="note">A clínica enviará a confirmação pelo WhatsApp. ${esc(u.address||'')}</p><div class="mf" style="justify-content:center"><button class="btn" onclick="BK={};renderBooking('${unitId}')">Fazer outro agendamento</button></div></div>`;
  }
  const sumbox=BK.step>1&&BK.step<5?`<div class="sumbox">${s?`<span><b>${esc(s.name)}</b> · ${brl0(s.price)}</span>`:''}${BK.step>2?`<span>${p?esc(p.name):'Sem preferência'}</span>`:''}${BK.step>3?`<span>${fmtD(BK.date)} às ${BK.time}</span>`:''}<a href="javascript:void 0" style="margin-left:auto" onclick="BK.step--;renderBooking('${unitId}')">← Voltar</a></div>`:'';
  $('#root').innerHTML=`<div class="pub"><header class="pub-h"><div class="pub-brand"><span class="mark">${ic('leaf',22)}</span><div><b>${esc(S.org.name)}</b><small>${esc(u.name)} · ${esc(u.city)}${u.phone?' · '+esc(u.phone):''}</small></div></div></header>
  <main class="pub-c">${BK.step<5?`<div class="steps">${[1,2,3,4].map(i=>`<div class="${i<=BK.step?'on':''}"></div>`).join('')}</div>`:''}${sumbox}${body}</main>
  <footer class="pub-f">Agendamento online com <b>Sálvia</b>. Demonstração: os agendamentos ficam salvos neste navegador.</footer></div>`;
  window.scrollTo(0,0);
}
function bkConfirm(unitId){
  const db=S.db[unitId],name=val('bk_name'),phone=val('bk_phone');BK.name=name;BK.phone=phone;
  if(name.length<3)return toast('Informe seu nome.');if(onlyDigits(phone).length<10)return toast('Informe um WhatsApp válido com DDD.');if(!chk('bk_ok'))return toast('É necessário concordar com o uso dos dados.');
  const s=byId(db.services,BK.svcId);
  if(hasConflict(db,BK.slotPro,BK.date,BK.time,s.dur)){toast('Esse horário acabou de ser ocupado. Escolha outro.');BK.step=3;return renderBooking(unitId)}
  let c=db.clients.find(x=>onlyDigits(x.phone)===onlyDigits(phone));
  if(!c){c=newClientObj({name,phone,origin:'Agendamento online'});db.clients.push(c)}
  db.appts.push({id:'a'+uid(),clientId:c.id,svcId:s.id,proId:BK.slotPro,date:BK.date,time:BK.time,dur:s.dur,price:s.price,status:'agendado',obs:'Agendado pelo site',origin:'online',createdAt:today()});
  if(s.tpl)db.docs.push({id:'d'+uid(),tplId:s.tpl,clientId:c.id,apptId:db.appts[db.appts.length-1].id,proId:BK.slotPro,svcId:s.id,status:'pendente',mode:null,createdAt:new Date().toISOString(),signedAt:null,hash:null});
  save();BK.done={svc:s.name,pro:byId(db.pros,BK.slotPro).name,date:BK.date,time:BK.time};BK.step=5;renderBooking(unitId);
}

/* ===================== Página pública: assinatura por link ===================== */
function renderPublicSign(unitId,docId){
  const u=byId(S.units,unitId),db=S.db[unitId],x=db&&byId(db.docs,docId);
  const wrap=b=>`<div class="pub"><header class="pub-h"><div class="pub-brand"><span class="mark">${ic('leaf',22)}</span><div><b>${esc(S.org.name)}</b><small>${u?esc(u.name):''} · Assinatura digital</small></div></div></header><main class="pub-c">${b}</main><footer class="pub-f">Assinatura eletrônica com <b>Sálvia</b> · data, hora e código de integridade registrados.</footer></div>`;
  if(!x){$('#root').innerHTML=wrap(`<div class="card empty-state"><h3>Documento não encontrado</h3><p>Nesta demonstração o link funciona no mesmo navegador em que o documento foi criado. Na versão com servidor, funciona em qualquer celular.</p></div>`);return}
  const t=docTpl(db,x),c=byId(db.clients,x.clientId)||{name:''};
  if(x.status==='assinado'){$('#root').innerHTML=wrap(`<div class="card center" style="padding:30px 22px"><div class="okmark">${ic('check',30)}</div><h1 class="title sm">Documento assinado</h1><p class="muted">${esc(t.name)}<br>${fmtDT(x.signedAt)}</p>${x.hash?`<p class="note">Código de integridade: <code>${esc(x.hash)}</code></p>`:''}<p class="note">Uma cópia fica arquivada no seu prontuário na clínica.</p></div>`);return}
  $('#root').innerHTML=wrap(`<div class="eyebrow">Para ${esc(c.name)}</div><h1 class="title sm">${esc(t.name)}</h1><div class="paper" style="max-height:none">${esc(docText(x,db,u))}</div>
  <div class="lbl">Sua assinatura</div><canvas id="pad" class="pad"></canvas><div class="pad-act"><label class="ck"><input type="checkbox" id="ps_ok"> Li e concordo com o documento</label><button class="btn ghost sm" onclick="$('#pad')._pad.clear()">Limpar</button></div>
  <div class="mf"><button class="btn pri block" onclick="pubSign('${unitId}','${docId}')">${ic('pen',16)} Assinar documento</button></div>`);
  mountPad('pad');window.scrollTo(0,0);
}
async function pubSign(unitId,docId){
  const db=S.db[unitId],u=byId(S.units,unitId),x=byId(db.docs,docId),pad=$('#pad')._pad;
  if(!chk('ps_ok'))return toast('Marque "Li e concordo".');if(pad.isEmpty())return toast('Assine no quadro.');
  await signCore(db,u,x,pad.data());x.via='link';save();renderPublicSign(unitId,docId);
}

/* ===================== Início ===================== */
function boot(){
  S=load();save();
  if(!location.hash)location.replace('#/'+(S.session?'inicio':'login'));
  render();
}
