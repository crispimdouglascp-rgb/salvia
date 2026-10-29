/* Sálvia — catálogo base e gerador de dados de demonstração (fictícios) */
'use strict';

const PRO_COLORS=['#4a7561','#c06e4b','#3c6890','#8d63a8','#a97f22','#4f8a87'];
const METHODS=['Pix','Cartão de crédito','Cartão de débito','Dinheiro'];
const CATS_IN=['Serviços','Pacotes','Produtos','Outras receitas'];
const CATS_OUT=['Aluguel','Energia e água','Fornecedores e insumos','Comissões','Salários','Marketing','Software e sistemas','Contabilidade','Impostos','Outras despesas'];
const SVC_CATS=['Facial','Injetáveis','Corporal','Laser','Beleza'];
const ORIGINS=['Instagram','Indicação','Google','Passante','WhatsApp'];

const TPL_SEED=[
 {id:'t_consent',name:'Termo de consentimento — procedimento estético',cat:'Termo',pages:2,body:
`TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO

Eu, {{cliente}}, CPF {{cpf}}, declaro que fui informado(a) por {{profissional}}, da {{clinica}}, sobre o procedimento "{{servico}}", seus objetivos, benefícios esperados, limitações, possíveis riscos e cuidados antes e depois da sessão, e que tive a oportunidade de esclarecer todas as minhas dúvidas.

Declaro que as informações prestadas na ficha de anamnese são verdadeiras e que comunicarei à clínica qualquer alteração no meu estado de saúde.

Autorizo a realização do procedimento descrito acima.

Tratamento de dados (LGPD): autorizo o uso dos meus dados pessoais e de saúde exclusivamente para atendimento, registro em prontuário e cumprimento de obrigações legais.

{{cidade}}, {{data}}.`},
 {id:'t_imagem',name:'Autorização de uso de imagem',cat:'Termo',pages:1,body:
`AUTORIZAÇÃO DE USO DE IMAGEM

Eu, {{cliente}}, autorizo a {{clinica}} a registrar fotografias antes, durante e depois dos procedimentos, para uso exclusivo no meu prontuário e no acompanhamento da minha evolução.

A divulgação em redes sociais, site ou material publicitário depende de nova autorização, específica e por escrito.

{{cidade}}, {{data}}.`},
 {id:'t_contrato',name:'Contrato de prestação de serviços',cat:'Contrato',pages:3,body:
`CONTRATO DE PRESTAÇÃO DE SERVIÇOS ESTÉTICOS

CONTRATANTE: {{cliente}}, CPF {{cpf}}.
CONTRATADA: {{clinica}}.

Cláusula 1 — Objeto: prestação do serviço "{{servico}}", conforme plano de tratamento apresentado.
Cláusula 2 — Pagamento: conforme valores e condições acordados no ato da contratação.
Cláusula 3 — Remarcação e cancelamento: o(a) contratante deve avisar com antecedência mínima de 24 horas. Faltas sem aviso poderão ser consideradas sessão realizada.
Cláusula 4 — Responsabilidades: o(a) contratante compromete-se a seguir as orientações pré e pós-procedimento.
Cláusula 5 — Dados pessoais: tratados conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).

{{cidade}}, {{data}}.`},
 {id:'t_pacote',name:'Contrato de pacote de sessões',cat:'Contrato',pages:2,body:
`CONTRATO DE PACOTE DE SESSÕES

CONTRATANTE: {{cliente}}.
CONTRATADA: {{clinica}}.

O(a) contratante adquire pacote de sessões do serviço "{{servico}}", a serem utilizadas em até 12 meses a partir desta data.
As sessões são pessoais e intransferíveis. Desmarcações com menos de 24 horas de antecedência consomem uma sessão.

{{cidade}}, {{data}}.`},
 {id:'t_pos',name:'Orientações pós-procedimento',cat:'Orientação',pages:1,body:
`ORIENTAÇÕES PÓS-PROCEDIMENTO

Cliente: {{cliente}}
Procedimento: {{servico}}

• Evite exposição solar nas próximas 48 horas e use protetor solar.
• Não aplique maquiagem ou ácidos na região por 24 horas.
• Mantenha a pele hidratada conforme orientação do profissional.
• Em caso de vermelhidão persistente, dor ou inchaço fora do esperado, entre em contato com a clínica.

Declaro ter recebido as orientações acima.
{{cidade}}, {{data}}.`}
];

const FORM_SEED=[
 {id:'f_facial',name:'Anamnese facial',fields:[
  {id:'q1',label:'Queixa principal / objetivo',type:'text'},
  {id:'q2',label:'Possui alergias?',type:'yesno',detail:true},
  {id:'q3',label:'Usa medicamentos contínuos?',type:'yesno',detail:true},
  {id:'q4',label:'Gestante ou lactante?',type:'yesno'},
  {id:'q5',label:'Já realizou procedimentos estéticos?',type:'yesno',detail:true},
  {id:'q6',label:'Tipo de pele',type:'choice',options:['Normal','Seca','Oleosa','Mista','Sensível']},
  {id:'q7',label:'Exposição solar frequente?',type:'yesno'},
  {id:'q8',label:'Condições de saúde',type:'multi',options:['Diabetes','Hipertensão','Cardiopatia','Distúrbio de coagulação','Tendência a queloide','Herpes recorrente','Doença autoimune']}
 ]},
 {id:'f_corporal',name:'Anamnese corporal',fields:[
  {id:'q1',label:'Objetivo do tratamento',type:'choice',options:['Redução de medidas','Celulite','Flacidez','Relaxamento','Pós-operatório']},
  {id:'q2',label:'Pratica atividade física?',type:'yesno',detail:true},
  {id:'q3',label:'Ingestão diária de água',type:'choice',options:['Menos de 1 litro','1 a 2 litros','Mais de 2 litros']},
  {id:'q4',label:'Possui varizes ou problemas circulatórios?',type:'yesno',detail:true},
  {id:'q5',label:'Cirurgias recentes?',type:'yesno',detail:true},
  {id:'q6',label:'Observações',type:'text'}
 ]},
 {id:'f_inj',name:'Anamnese — injetáveis',fields:[
  {id:'q1',label:'Área de interesse',type:'multi',options:['Testa','Glabela','Pés de galinha','Lábios','Olheiras','Mandíbula','Malar']},
  {id:'q2',label:'Já aplicou toxina ou preenchedor antes?',type:'yesno',detail:true},
  {id:'q3',label:'Faz uso de anticoagulantes?',type:'yesno',detail:true},
  {id:'q4',label:'Alergia a algum componente ou anestésico?',type:'yesno',detail:true},
  {id:'q5',label:'Gestante ou lactante?',type:'yesno'},
  {id:'q6',label:'Expectativa com o resultado',type:'text'}
 ]}
];

const SVC_SEED=[
 ['s1','Limpeza de pele profunda','Facial',60,220,null,[['p_sab',1],['p_masc',1]]],
 ['s2','Peeling químico','Facial',45,280,'t_consent',[['p_acido',1]]],
 ['s3','Microagulhamento','Facial',60,450,'t_consent',[['p_agulha',1],['p_anest',1]]],
 ['s4','Toxina botulínica','Injetáveis',30,1200,'t_consent',[['p_toxina',1]]],
 ['s5','Preenchimento labial','Injetáveis',45,1600,'t_consent',[['p_ah',1],['p_anest',1]]],
 ['s6','Bioestimulador de colágeno','Injetáveis',60,2200,'t_consent',[['p_bio',1]]],
 ['s7','Drenagem linfática','Corporal',60,180,null,[['p_oleo',1]]],
 ['s8','Massagem modeladora','Corporal',50,190,null,[['p_oleo',1]]],
 ['s9','Depilação a laser (por área)','Laser',30,250,'t_consent',[['p_gel',1]]],
 ['s10','Design de sobrancelhas com henna','Beleza',30,90,null,[['p_henna',1]]]
];
const PROD_SEED=[
 ['p_sab','Sabonete facial','Facial','un',14,5,38],
 ['p_masc','Máscara calmante','Facial','un',9,6,22],
 ['p_acido','Ácido mandélico 10%','Facial','fr',4,3,45],
 ['p_agulha','Kit agulhas descartáveis','Descartáveis','kit',22,10,35],
 ['p_anest','Anestésico tópico','Injetáveis','tb',3,4,60],
 ['p_toxina','Toxina botulínica 100U','Injetáveis','fr',6,3,780],
 ['p_ah','Ácido hialurônico 1 ml','Injetáveis','sr',5,4,590],
 ['p_bio','Bioestimulador de colágeno','Injetáveis','fr',2,2,1100],
 ['p_oleo','Óleo de massagem','Corporal','l',7,3,48],
 ['p_gel','Gel condutor','Laser','l',5,2,30],
 ['p_henna','Henna para sobrancelhas','Beleza','un',11,4,18],
 ['p_luva','Luvas descartáveis (caixa)','Descartáveis','cx',8,4,42]
];
const PKG_SEED=[
 {id:'pk1',name:'Pacote 5 drenagens',svcId:'s7',sessions:5,price:800},
 {id:'pk2',name:'Pacote 4 limpezas de pele',svcId:'s1',sessions:4,price:780},
 {id:'pk3',name:'Laser — 6 sessões',svcId:'s9',sessions:6,price:1290},
 {id:'pk4',name:'Massagem modeladora — 10 sessões',svcId:'s8',sessions:10,price:1650}
];
const PROS_U1=[['Dra. Helena Prado','Biomédica esteta',45,['Injetáveis','Facial']],['Camila Rocha','Esteticista',40,['Facial','Laser']],['Juliana Matos','Esteticista corporal',40,['Corporal']],['Bruna Teles','Designer de sobrancelhas',50,['Beleza']]];
const PROS_U2=[['Dr. Rafael Lins','Médico dermatologista',50,['Injetáveis','Laser']],['Patrícia Alves','Esteticista',40,['Facial','Beleza']],['Larissa Moura','Massoterapeuta',40,['Corporal']]];
const FIRST=['Ana','Beatriz','Carolina','Daniela','Eduarda','Fernanda','Gabriela','Helena','Isabela','Júlia','Larissa','Mariana','Natália','Olívia','Paula','Rafaela','Sofia','Tatiane','Vanessa','Yasmin','Letícia','Priscila','Renata','Camila','Luana','Bianca','Aline','Lucas','Marcos','Thiago','Rodrigo','Felipe'];
const LAST=['Almeida','Barbosa','Cardoso','Duarte','Esteves','Ferraz','Gomes','Lacerda','Machado','Nunes','Oliveira','Pacheco','Queiroz','Ribeiro','Siqueira','Teixeira','Vieira','Moreira','Campos','Prates'];
const EVOS=['Pele com boa resposta ao procedimento, sem intercorrências.','Cliente relatou leve sensibilidade; orientada sobre os cuidados pós-procedimento.','Retorno agendado para avaliação em 15 dias.','Protocolo padrão aplicado; fotos registradas no prontuário.','Boa evolução em relação à sessão anterior.','Hidratação da pele melhorou; manter home care indicado.'];

const MONTHS_SEED=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const clone=o=>JSON.parse(JSON.stringify(o));

function emptyDb(){return {pros:[],services:[],packages:[],clients:[],appts:[],fin:[],products:[],moves:[],docs:[],templates:[],forms:[],records:[],photos:[],clientPkgs:[],commLaunched:{}}}
function baseCatalog(db){
  db.services=SVC_SEED.map(([id,name,cat,dur,price,tpl,ins])=>({id,name,cat,dur,price,tpl,ins:clone(ins),active:true}));
  db.products=PROD_SEED.map(([id,name,cat,unit,qty,min,cost])=>({id,name,cat,unit,qty,min,cost}));
  db.templates=clone(TPL_SEED);db.forms=clone(FORM_SEED);db.packages=clone(PKG_SEED);
  return db;
}

function seedUnit(n,prosDef,scale,unit){
  const R=rng(n*9973+7),pick=a=>a[Math.floor(R()*a.length)];
  const db=baseCatalog(emptyDb()),t=today();
  const open=t2m(unit.open),close=t2m(unit.close);
  db.pros=prosDef.map((p,i)=>({id:'pr'+n+'_'+i,name:p[0],spec:p[1],comm:p[2],cats:p[3],color:PRO_COLORS[i%PRO_COLORS.length],active:true}));
  // Clientes
  const used=new Set(),nCli=Math.round(78*scale);
  for(let i=0;i<nCli;i++){
    let name;do{name=pick(FIRST)+' '+pick(LAST)+(R()<.25?' '+pick(LAST):'')}while(used.has(name));used.add(name);
    const y=1965+Math.floor(R()*38),bm=1+Math.floor(R()*12),bd=1+Math.floor(R()*28);
    const recent=R()<.16;
    db.clients.push({id:'c'+n+'_'+i,name,phone:`(41) 9${String(1000+Math.floor(R()*8999))}-${String(1000+Math.floor(R()*8999))}`,email:'',cpf:'',birth:`${y}-${pad(bm)}-${pad(bd)}`,
      createdAt:addDays(t,recent?-1-Math.floor(R()*40):-60-Math.floor(R()*420)),origin:pick(ORIGINS),tags:R()<.14?['VIP']:R()<.08?['Pele sensível']:[],obs:''});
  }
  // Força alguns aniversariantes neste mês
  for(let i=0;i<4;i++){const c=db.clients[i*7];if(c)c.birth=c.birth.slice(0,5)+t.slice(5,7)+'-'+pad(Math.min(28,+t.slice(8)+i*3))}
  const nowM=new Date().getHours()*60+new Date().getMinutes();
  // Agendamentos e atendimentos
  for(let off=-185;off<=14;off++){
    const date=addDays(t,off),dow=parseD(date).getDay();if(dow===0)continue;
    const pool=db.clients.filter(c=>c.createdAt<=date);
    db.pros.forEach(p=>{
      const svcs=db.services.filter(s=>p.cats.includes(s.cat));if(!svcs.length)return;
      const target=Math.max(1,Math.round((dow===6?2:3.4)*scale*(.6+R()*.7)));
      // horários espalhados ao longo do dia
      const starts=[];for(let k=0;k<target*3;k++)starts.push(open+Math.floor(R()*((close-open)/30-1))*30);
      starts.sort((a,b)=>a-b);
      let busyUntil=open,count=0;
      for(const cur of starts){
        if(count>=target)break;if(cur<busyUntil)continue;
        let s=pick(svcs);if(s.cat==='Injetáveis'&&R()<.55)s=pick(svcs);
        const dur=Math.ceil(s.dur/30)*30;if(cur+dur>close)continue;
        const c=pool.length?pick(pool):pick(db.clients);
        let status;
        if(off<0||(off===0&&cur+dur<=nowM)){const r=R();status=r<.86?'concluido':r<.93?'faltou':'cancelado'}
        else status=off<=2&&R()<.55?'confirmado':'agendado';
        const a={id:'a'+n+'_'+db.appts.length,clientId:c.id,svcId:s.id,proId:p.id,date,time:m2t(cur),dur:s.dur,price:s.price,status,obs:'',origin:R()<.2?'online':'recepção',createdAt:addDays(date,-Math.floor(R()*12))};
        if(status==='concluido'){
          a.charged=Math.round(s.price*(R()<.15?.9:1));
          db.fin.push({id:'f'+n+'_'+db.fin.length,type:'in',desc:s.name,cat:'Serviços',value:a.charged,date,method:pick(METHODS),status:'pago',apptId:a.id,proId:p.id,clientId:c.id});
          if(s.tpl&&R()<.94){
            const pp=off<-120?.7:off<-90?.55:off<-60?.38:off<-30?.18:.06; // adoção gradual da assinatura digital
            const paper=R()<pp,ts=date+'T'+a.time+':00';
            db.docs.push({id:'d'+n+'_'+db.docs.length,tplId:s.tpl,clientId:c.id,apptId:a.id,proId:p.id,svcId:s.id,status:'assinado',mode:paper?'papel':'digital',createdAt:ts,signedAt:ts,hash:paper?null:'demo-'+Math.floor(R()*1e12).toString(16)});
          }
          if(off>-45&&R()<.35)db.records.push({id:'r'+n+'_'+db.records.length,type:'evolucao',clientId:c.id,proId:p.id,svcId:s.id,date,text:pick(EVOS)});
        }else if(s.tpl&&off>=0&&off<=4&&status!=='cancelado'){
          db.docs.push({id:'d'+n+'_'+db.docs.length,tplId:s.tpl,clientId:c.id,apptId:a.id,proId:p.id,svcId:s.id,status:'pendente',mode:null,createdAt:t+'T08:00:00',signedAt:null,hash:null});
        }
        db.appts.push(a);busyUntil=cur+dur;count++;
      }
    });
  }
  // Despesas fixas e variáveis
  const m0=ymOf(t);
  for(let k=-5;k<=0;k++){
    const m=addMonths(m0,k);
    const ex=[['Aluguel','Aluguel',6800,5],['Energia elétrica','Energia e água',850+R()*250,10],['Água','Energia e água',190+R()*60,10],['Compra de insumos','Fornecedores e insumos',2600+R()*1600,15],['Marketing digital','Marketing',1200,20],['Sistema de gestão','Software e sistemas',349,1],['Contabilidade','Contabilidade',900,8],['Salário recepção','Salários',2600,5],['Simples Nacional','Impostos',0,20]];
    ex.forEach(([desc,cat,v,day])=>{
      const date=m+'-'+pad(Math.min(day,daysIn(m)));
      let value=Math.round(v*scale);
      if(cat==='Impostos'){value=Math.round(db.fin.filter(f=>f.type==='in'&&ymOf(f.date)===addMonths(m,-1)).reduce((s,f)=>s+f.value,0)*.06)}
      if(!value)return;
      db.fin.push({id:'f'+n+'_'+db.fin.length,type:'out',desc,cat,value,date,method:'Pix',status:date<=t?'pago':'pendente'});
    });
    // Comissões do mês anterior, pagas no dia 5
    const pm=addMonths(m,-1),[pa,pb]=[pm+'-01',pm+'-'+pad(daysIn(pm))],due=m+'-05';
    db.pros.forEach(p=>{const base=db.appts.filter(x=>x.proId===p.id&&x.status==='concluido'&&x.date>=pa&&x.date<=pb).reduce((s,x)=>s+(x.charged||0),0);
      if(base>0)db.fin.push({id:'f'+n+'_'+db.fin.length,type:'out',desc:'Comissão '+p.name+' — '+MONTHS_SEED[+pm.slice(5)-1]+'/'+pm.slice(2,4),cat:'Comissões',value:Math.round(base*p.comm)/100,date:due,method:'Pix',status:due<=t?'pago':'pendente',proId:p.id})});
    db.commLaunched[pm]=true;
  }
  // Pacotes vendidos
  for(let i=0;i<6;i++){
    const c=db.clients[3+i*5],pk=pick(db.packages);if(!c)continue;
    const date=addDays(t,-Math.floor(R()*60));
    db.clientPkgs.push({id:'cp'+n+'_'+i,clientId:c.id,pkgId:pk.id,total:pk.sessions,used:Math.floor(R()*pk.sessions*.7),date});
    db.fin.push({id:'f'+n+'_'+db.fin.length,type:'in',desc:pk.name,cat:'Pacotes',value:pk.price,date,method:pick(METHODS),status:'pago',clientId:c.id});
  }
  // Anamneses digitais
  db.clients.forEach((c,i)=>{if(R()<.35){db.records.push({id:'ra'+n+'_'+i,type:'anamnese',clientId:c.id,formId:'f_facial',date:c.createdAt,answers:{q1:pick(['Melhorar textura da pele','Reduzir manchas','Controle de oleosidade','Prevenção de rugas']),q2:{v:'Não',d:''},q3:{v:R()<.2?'Sim':'Não',d:''},q4:{v:'Não',d:''},q5:{v:R()<.5?'Sim':'Não',d:''},q6:pick(['Normal','Seca','Oleosa','Mista','Sensível']),q7:{v:R()<.4?'Sim':'Não',d:''},q8:[]},signedAt:c.createdAt+'T10:00:00',sig:null,hash:'demo-'+Math.floor(R()*1e12).toString(16)})}});
  return db;
}

function makeSeed(){
  const units=[
    {id:'u1',name:'Unidade Batel',city:'Curitiba/PR',address:'Rua Exemplo, 100 — Batel',phone:'(41) 3000-0001',open:'08:00',close:'20:00',slot:30},
    {id:'u2',name:'Unidade Água Verde',city:'Curitiba/PR',address:'Rua Modelo, 250 — Água Verde',phone:'(41) 3000-0002',open:'09:00',close:'19:00',slot:30}
  ];
  return {version:2,session:null,cur:'u1',demo:true,
    org:{name:'Pallie Concept',plan:'Rede',paperCost:.35},
    users:[
      {id:'us1',name:'Gestão Pallie',email:'gestao@pallie.demo',role:'admin',unit:'all'},
      {id:'us2',name:'Recepção Batel',email:'recepcao@pallie.demo',role:'recepcao',unit:'u1'},
      {id:'us3',name:'Dra. Helena Prado',email:'helena@pallie.demo',role:'profissional',unit:'u1'}
    ],
    units,
    db:{u1:seedUnit(1,PROS_U1,1,units[0]),u2:seedUnit(2,PROS_U2,.72,units[1])}
  };
}
