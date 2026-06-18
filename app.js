// ====== CONFIG ======
const SUPABASE_URL = 'https://oznfsajhdxhykzivhumd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2oZY-aRcKRbuz2lMXH6wdA_X38zNOt5';
const FEDAPAY_PUBLIC_KEY = 'pk_live_VOTRE_CLE_FEDAPAY_ICI';
const MONTANT_XOF = 4900;

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null, currentLang = 'fr', currentProfileType = null;
let currentModule = null, userFreeModules = [];

// ====== IMAGES ======
const IMGS = {
  digital:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
  marketing:'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&q=80',
  ecommerce:'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80',
  africa:'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80',
  mobile:'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80',
  tiktok:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&q=80',
  formation:'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
  money:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
  strategy:'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&q=80',
  content:'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&q=80',
  growth:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
};
function getImg(kw=''){
  kw=kw.toLowerCase();
  if(kw.includes('tiktok')||kw.includes('video'))return IMGS.tiktok;
  if(kw.includes('formation')||kw.includes('cours'))return IMGS.formation;
  if(kw.includes('marketing')||kw.includes('pub'))return IMGS.marketing;
  if(kw.includes('ecommerce')||kw.includes('boutique'))return IMGS.ecommerce;
  if(kw.includes('argent')||kw.includes('revenu'))return IMGS.money;
  if(kw.includes('strateg')||kw.includes('plan'))return IMGS.strategy;
  if(kw.includes('africa')||kw.includes('bénin')||kw.includes('nigeria'))return IMGS.africa;
  if(kw.includes('croissance')||kw.includes('trend'))return IMGS.growth;
  return IMGS.digital;
}

// ====== TRADUCTIONS ======
const T={
  fr:{loading:'⏳ Analyse en cours...',generating:'⏳ Génération en cours...',
    fillFields:'Remplis tous les champs requis',loginErr:'Email ou mot de passe incorrect',
    signupOk:'✅ Vérifie ton email pour confirmer ton compte',
    logoutConfirm:'Veux-tu vraiment te déconnecter ?',profileSaved:'✅ Profil enregistré !',
    payActivated:'🎉 Accès activé pour 3 mois !',payError:'Erreur paiement. Contacte le support.',
    selectProfile:'Sélectionne ton profil',analyze:'Analyser',generate:'Générer',back:'← Retour',
    errAI:'❌ Erreur IA. Réessaie dans quelques secondes.',
    phase1:'Phase 1 — Trouver quoi vendre',phase2:'Phase 2 — Valider ton idée',
    phase3:'Phase 3 — Construire ta stratégie',phase4:'Phase 4 — Créer ton contenu',
    phase5:'Phase 5 — Cibler & s\'auto-évaluer',
  },
  en:{loading:'⏳ Analyzing...',generating:'⏳ Generating...',
    fillFields:'Please fill all required fields',loginErr:'Wrong email or password',
    signupOk:'✅ Check your email to confirm your account',
    logoutConfirm:'Do you really want to logout?',profileSaved:'✅ Profile saved!',
    payActivated:'🎉 Access activated for 3 months!',payError:'Payment error. Contact support.',
    selectProfile:'Select your profile',analyze:'Analyze',generate:'Generate',back:'← Back',
    errAI:'❌ AI error. Please try again.',
    phase1:'Phase 1 — Find what to sell',phase2:'Phase 2 — Validate your idea',
    phase3:'Phase 3 — Build your strategy',phase4:'Phase 4 — Create your content',
    phase5:'Phase 5 — Target & self-assess',
  }
};
const t=k=>T[currentLang]?.[k]||k;

// ====== PROFILS ======
const PROFILES=[
  {id:'infopreneur',emoji:'📦',label:'Infopreneur',sub:'Ebooks, formations, templates'},
  {id:'ecommerce',emoji:'🛒',label:'E-commerçant',sub:'Boutique en ligne, dropshipping'},
  {id:'createur',emoji:'🎬',label:'Créateur de contenu',sub:'TikTok, Instagram, YouTube'},
  {id:'freelance',emoji:'💼',label:'Freelance digital',sub:'Design, dev, rédaction'},
  {id:'formateur',emoji:'🎓',label:'Formateur en ligne',sub:'Vidéos, webinaires, masterclasses'},
  {id:'coach',emoji:'🤝',label:'Coach / Consultant',sub:'Coaching individuel ou groupe'},
  {id:'community',emoji:'📱',label:'Community Manager',sub:'Gestion des réseaux sociaux'},
  {id:'affilie',emoji:'🔗',label:'Affilié',sub:'Marketing d\'affiliation'},
  {id:'expert_ia',emoji:'🤖',label:'Expert IA',sub:'Formations IA, automatisation'},
];

// ====== MODULES ======
const MODULES=[
  {id:'idea_finder',emoji:'💡',title:'Idea Finder',desc:'Génère des idées de produits rentables dans ta niche',phase:1,
    fields:[{type:'select',id:'f_cat',label:'Catégorie',opts:['Marketing digital','E-commerce & Dropshipping','Développement personnel','Finance personnelle','Santé & Bien-être','Technologie & IA','Entrepreneuriat','Productivité','Éducation en ligne','Créativité & Design','Photographie & Vidéo','Cuisine & Lifestyle','Mode & Beauté','Sport & Fitness','Immobilier','Relations & Communication','Développement web','Réseaux sociaux','Affiliation','Gaming','Voyage & Tourisme','Langues étrangères','Crypto & Web3','Parenting','Art & Illustration','Podcast','Business local','Beauté & Cosmétiques','Agriculture digitale','Bien-être mental']},{type:'text',id:'f_niche',label:'Précise ta niche (optionnel)',ph:'Ex: coaching femmes entrepreneurs Sénégal'}],
    getDonnees:()=>({categorie:gv('f_cat'),niche:gv('f_niche')||null}),btn:'generate'},
  {id:'winning_products',emoji:'🏆',title:'Winning Products',desc:'Produits qui marchent déjà dans ta niche',phase:1,
    fields:[{type:'text',id:'f_niche2',label:'Ta niche',ph:'Ex: formation en ligne, dropshipping vêtements...'},{type:'text',id:'f_pays',label:'Pays cible',ph:'Ex: Bénin, Nigeria, Sénégal...'}],
    getDonnees:()=>({niche:gv('f_niche2'),pays:gv('f_pays')}),btn:'generate'},
  {id:'product_analyzer',emoji:'📊',title:'Product Analyzer',desc:'Score de viabilité, SWOT et verdict GO/NO-GO',phase:2,
    fields:[{type:'text',id:'f_pnom',label:'Nom du produit / service',ph:'Ex: Guide dropshipping au Bénin'},{type:'textarea',id:'f_pdesc',label:'Description',ph:'Ex: Un guide pratique pour...'},{type:'number',id:'f_pprix',label:'Prix envisagé (XOF)',ph:'Ex: 5900'}],
    getDonnees:()=>({nom:gv('f_pnom'),description:gv('f_pdesc'),prix_xof:Number(gv('f_pprix'))||0}),btn:'analyze'},
  {id:'competitor_spy',emoji:'🕵️',title:'Competitor Spy',desc:'Analyse tes concurrents et trouve comment les battre',phase:2,
    fields:[{type:'text',id:'f_cnom',label:'Nom du concurrent',ph:'Ex: Jean Marketing, @vendeur_pro'},{type:'textarea',id:'f_cinfo',label:'Ce que tu sais de lui',ph:'Ex: Vend des formations WhatsApp à 15 000 XOF, actif TikTok...'},{type:'text',id:'f_creseau',label:'Réseau social',ph:'Ex: TikTok, Instagram, Facebook'}],
    getDonnees:()=>({concurrent:gv('f_cnom'),informations:gv('f_cinfo'),reseau:gv('f_creseau')}),btn:'analyze'},
  {id:'trend_predictor',emoji:'📈',title:'Trend Predictor',desc:'Est-ce que ta niche est en train de monter ?',phase:2,
    fields:[{type:'text',id:'f_tmc',label:'Mot-clé ou niche',ph:'Ex: formation IA Afrique, dropshipping Bénin'},{type:'text',id:'f_tpays',label:'Marché cible',ph:'Ex: Afrique de l\'Ouest, Nigeria'}],
    getDonnees:()=>({sujet:gv('f_tmc'),marche:gv('f_tpays')}),btn:'analyze'},
  {id:'market_validator',emoji:'✅',title:'Market Validator',desc:'Taille du marché, demande réelle, verdict GO/NO-GO',phase:2,
    fields:[{type:'textarea',id:'f_mprod',label:'Ton produit et marché cible',ph:'Ex: Formation TikTok pour entrepreneurs béninois 18-35 ans'},{type:'number',id:'f_mprix',label:'Prix envisagé (XOF)',ph:'Ex: 12000'}],
    getDonnees:()=>({produit:gv('f_mprod'),prix_xof:Number(gv('f_mprix'))||0}),btn:'analyze'},
  {id:'angle_generator',emoji:'🎯',title:'Angle Generator',desc:'7 façons différentes de présenter ton produit',phase:3,
    fields:[{type:'text',id:'f_aprod',label:'Ton produit',ph:'Ex: Formation création de contenu'},{type:'text',id:'f_aaud',label:'Audience principale',ph:'Ex: Jeunes entrepreneurs africains 18-30 ans'},{type:'number',id:'f_aprix',label:'Prix (XOF)',ph:'Ex: 9000'}],
    getDonnees:()=>({produit:gv('f_aprod'),audience:gv('f_aaud'),prix_xof:Number(gv('f_aprix'))||0}),btn:'generate'},
  {id:'monetization_hub',emoji:'💰',title:'Monetization Hub',desc:'6 sources de revenus pour ton activité',phase:3,
    fields:[{type:'textarea',id:'f_monprod',label:'Ton produit, service ou expertise',ph:'Ex: Je crée du contenu TikTok, 5000 abonnés, niche: business...'},{type:'text',id:'f_monstade',label:'Ton stade actuel',ph:'Ex: Débutant, 3 mois d\'activité, 0 vente'}],
    getDonnees:()=>({produit:gv('f_monprod'),stade:gv('f_monstade')}),btn:'generate'},
  {id:'selling_strategy',emoji:'🚀',title:'Selling Strategy',desc:'Plan de lancement complet sur 28 jours',phase:3,
    fields:[{type:'text',id:'f_sprod',label:'Ton produit',ph:'Ex: Ebook dropshipping'},{type:'text',id:'f_saud',label:'Audience cible',ph:'Ex: Dropshippers débutants au Bénin'},{type:'number',id:'f_sprix',label:'Prix (XOF)',ph:'Ex: 4500'},{type:'number',id:'f_sbudget',label:'Budget marketing (XOF)',ph:'Ex: 0'}],
    getDonnees:()=>({produit:gv('f_sprod'),audience:gv('f_saud'),prix_xof:Number(gv('f_sprix'))||0,budget_xof:Number(gv('f_sbudget'))||0}),btn:'generate'},
  {id:'international_expansion',emoji:'🌍',title:'International Expansion',desc:'Adapte ton produit à un autre marché',phase:3,
    fields:[{type:'text',id:'f_intprod',label:'Ton produit / service',ph:'Ex: Formation marketing digital'},{type:'text',id:'f_intregion',label:'Région ou pays cible',ph:'Ex: Nigeria, Ghana, Europe francophone'}],
    getDonnees:()=>({produit:gv('f_intprod'),region:gv('f_intregion')}),btn:'analyze'},
  {id:'product_generator',emoji:'📝',title:'Product Generator',desc:'Plan complet de ton produit digital',phase:4,
    fields:[{type:'text',id:'f_pgsujet',label:'Sujet',ph:'Ex: Comment créer une boutique Shopify rentable'},{type:'text',id:'f_pgaud',label:'Pour qui ?',ph:'Ex: Entrepreneurs béninois débutants'},{type:'select',id:'f_pgformat',label:'Format',opts:['Laisse l\'IA choisir','Ebook (PDF)','Formation vidéo','Template','Guide pratique','Coaching','Webinaire']}],
    getDonnees:()=>({sujet:gv('f_pgsujet'),audience:gv('f_pgaud'),format:gv('f_pgformat')}),btn:'generate'},
  {id:'image_generator',emoji:'🎨',title:'Image Generator',desc:'Prompts IA pour créer tes visuels professionnels',phase:4,
    fields:[{type:'text',id:'f_igprod',label:'Ton produit',ph:'Ex: Ebook dropshipping'},{type:'text',id:'f_igtype',label:'Type de visuel',ph:'Ex: couverture ebook, post Instagram, pub Facebook'},{type:'text',id:'f_igstyle',label:'Style souhaité',ph:'Ex: professionnel, coloré, africain moderne'}],
    getDonnees:()=>({produit:gv('f_igprod'),type_visuel:gv('f_igtype'),style:gv('f_igstyle')}),btn:'generate'},
  {id:'prompt_generator',emoji:'✍️',title:'Prompt Generator',desc:'Prompts prêts à utiliser avec l\'IA',phase:4,
    fields:[{type:'text',id:'f_prsujet',label:'Ton sujet',ph:'Ex: Vendre des formations en Afrique'},{type:'text',id:'f_praud',label:'Ton audience',ph:'Ex: Jeunes entrepreneurs nigérians 18-30 ans'},{type:'select',id:'f_prtype',label:'Type de contenu',opts:['Tous types','Post TikTok','Caption Instagram','Script vidéo','Email marketing','Article de blog','Post Facebook','Message WhatsApp']}],
    getDonnees:()=>({sujet:gv('f_prsujet'),audience:gv('f_praud'),type_contenu:gv('f_prtype')}),btn:'generate'},
  {id:'country_targeting',emoji:'🗺️',title:'Country Targeting',desc:'Analyse complète d\'un pays pour vendre',phase:5,
    fields:[{type:'text',id:'f_ctprod',label:'Ton produit / service',ph:'Ex: Formation TikTok'},{type:'text',id:'f_ctpays',label:'Pays cible',ph:'Ex: Nigeria, Ghana, Cameroun, Sénégal'}],
    getDonnees:()=>({produit:gv('f_ctprod'),pays:gv('f_ctpays')}),btn:'analyze'},
  {id:'honest_feedback',emoji:'💬',title:'Honest Feedback',desc:'Avis honnête sur ton idée — sans complaisance',phase:5,
    fields:[{type:'textarea',id:'f_hfidee',label:'Décris librement ton idée',ph:'Ex: Je veux créer une formation TikTok Shop pour jeunes béninois 18-25 ans, prix 8000 XOF...'}],
    getDonnees:()=>({idee:gv('f_hfidee')}),btn:'analyze'},
  {id:'profile_page',emoji:'👤',title:'Mon Profil',desc:'Infos et statistiques de ton compte',phase:6,isPage:true,pageId:'profilePage'},
  {id:'settings_page',emoji:'⚙️',title:'Paramètres',desc:'Langue et gestion du compte',phase:6,isPage:true,pageId:'settingsPage'},
];

// ====== UTILS ======
const gv=id=>(document.getElementById(id)||{}).value||'';
const el=id=>document.getElementById(id);

function toast(msg,type='info'){
  const d=el('toast'); if(!d)return;
  d.textContent=msg;
  const bg=type==='error'?'#ef4444':type==='success'?'#22c55e':'#6c63ff';
  d.style.cssText=`background:${bg};box-shadow:0 8px 24px rgba(0,0,0,.2);display:block`;
  clearTimeout(d._t); d._t=setTimeout(()=>{d.style.display='none';},3500);
}

// ====== LANGUE ======
function setLang(lang){
  currentLang=lang;
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
}

// ====== AUTH MODAL ======
function openAuthModal(type){
  el('authModal').classList.remove('hidden');
  showAuthForm(type);
}
function closeAuthModal(){
  el('authModal').classList.add('hidden');
}
function showAuthForm(type){
  el('loginForm').classList.toggle('hidden',type!=='login');
  el('signupForm').classList.toggle('hidden',type!=='signup');
}

async function login(){
  const email=el('em1').value.trim(), pw=el('pw1').value;
  if(!email||!pw){toast(t('fillFields'),'error');return;}
  const btn=el('loginBtn'); btn.textContent='⏳'; btn.disabled=true;
  const {data,error}=await sb.auth.signInWithPassword({email,password:pw});
  btn.textContent='Se connecter'; btn.disabled=false;
  if(error){toast(t('loginErr'),'error');return;}
  currentUser=data.user;
  closeAuthModal();
  await afterAuth();
}

async function signup(){
  const name=el('nm2').value.trim(), email=el('em2').value.trim(), pw=el('pw2').value;
  if(!name||!email||!pw){toast(t('fillFields'),'error');return;}
  const btn=el('signupBtn'); btn.textContent='⏳'; btn.disabled=true;
  const redirectUrl='https://confiancehoungan4-hue.github.io/Analyser-pro/';
  const {data,error}=await sb.auth.signUp({email,password:pw,options:{data:{nom:name},emailRedirectTo:redirectUrl}});
  btn.textContent='Créer mon compte'; btn.disabled=false;
  if(error){toast('❌ '+error.message,'error');return;}
  closeAuthModal();
  if(data.session){currentUser=data.user; await afterAuth();}
  else{el('confirmEmail').textContent=email; showPage('emailSentPage');}
}

async function handleLogout(){
  if(!confirm(t('logoutConfirm')))return;
  await sb.auth.signOut();
  currentUser=null; currentProfileType=null; userFreeModules=[];
  showPage('landingPage');
}

// ====== AFTER AUTH ======
async function afterAuth(){
  const {data:prof}=await sb.from('profiles').select('profil_type,plan,beta_expires_at,free_modules_used').eq('id',currentUser.id).single();
  currentProfileType=prof?.profil_type||null;
  userFreeModules=prof?.free_modules_used||[];

  const seenKey=`ob_${currentUser.id}`;
  if(!localStorage.getItem(seenKey)){showPage('onboardingPage');return;}
  if(!currentProfileType){showProfileSelector();return;}
  showDashboard();
}

// ====== ONBOARDING ======
function finishOnboarding(){
  localStorage.setItem(`ob_${currentUser.id}`,'1');
  if(!currentProfileType){showProfileSelector();}
  else{showDashboard();}
}

// ====== PAGES ======
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  el(id).classList.add('active');
}
function showView(id){
  document.querySelectorAll('#dashboardPage .view').forEach(v=>v.classList.remove('active'));
  el(id).classList.add('active');
  closeSidebar(); window.scrollTo(0,0);
}

// ====== PROFILE SELECTOR ======
function showProfileSelector(){
  showPage('profileSelectorPage');
  el('profileGrid').innerHTML=PROFILES.map(p=>`
    <div class="profile-card ${currentProfileType===p.id?'selected':''}" onclick="selCard('${p.id}',this)">
      <div class="emoji">${p.emoji}</div>
      <div class="label">${p.label}</div>
      <div class="sub">${p.sub}</div>
    </div>`).join('');
}
function selCard(id,el_){
  document.querySelectorAll('.profile-card').forEach(c=>c.classList.remove('selected'));
  el_.classList.add('selected'); currentProfileType=id;
}
async function saveProfile(){
  if(!currentProfileType){toast(t('selectProfile'),'error');return;}
  await sb.from('profiles').update({profil_type:currentProfileType}).eq('id',currentUser.id);
  toast(t('profileSaved'),'success');
  showDashboard();
}

// ====== PAYWALL ======
function showPaywall(){
  showPage('paywallPage');
  el('modulesPreview').innerHTML=MODULES.slice(0,14).map(m=>`
    <div class="module-prev"><span class="ico">${m.emoji}</span><span class="txt">${m.title}</span></div>`).join('');
  if(typeof FedaPay!=='undefined'&&FEDAPAY_PUBLIC_KEY!=='pk_live_VOTRE_CLE_FEDAPAY_ICI'){
    try{FedaPay.init('#fedapay-btn',{
      public_key:FEDAPAY_PUBLIC_KEY,
      transaction:{amount:MONTANT_XOF,description:'Analyzer Pro — Accès complet 3 mois',currency:{iso:'XOF'}},
      customer:{email:currentUser?.email||'',firstname:currentUser?.user_metadata?.nom?.split(' ')[0]||''},
      onComplete:async function(tx){if(tx.reason!==FedaPay.DIALOG_DISMISSED)await verifierPaiement(tx.id);}
    });}catch(e){console.warn('FedaPay:',e);}
  }else{
    el('fedapay-btn').onclick=()=>toast('⚠️ Configure ta clé FedaPay dans app.js','error');
  }
}

async function verifierPaiement(txId){
  el('fedapay-btn').textContent='⏳ Activation...'; el('fedapay-btn').disabled=true;
  try{
    const {data:{session}}=await sb.auth.getSession();
    const res=await fetch(`${SUPABASE_URL}/functions/v1/verifier-paiement`,{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},
      body:JSON.stringify({transactionId:txId})
    });
    const data=await res.json();
    if(data.success){toast(t('payActivated'),'success');setTimeout(()=>showDashboard(),1500);}
    else{toast(t('payError'),'error'); el('fedapay-btn').textContent=`💳 Payer ${MONTANT_XOF.toLocaleString()} XOF`; el('fedapay-btn').disabled=false;}
  }catch(e){toast(t('payError'),'error'); el('fedapay-btn').textContent=`💳 Payer ${MONTANT_XOF.toLocaleString()} XOF`; el('fedapay-btn').disabled=false;}
}

// ====== DASHBOARD ======
function showDashboard(){
  showPage('dashboardPage');
  buildSidebar(); buildHome(); loadProfileData(); showView('homePage');
  const prof=PROFILES.find(p=>p.id===currentProfileType);
  if(prof&&el('profileBadge'))el('profileBadge').textContent=`${prof.emoji} ${prof.label}`;
}

function buildSidebar(){
  const phases={1:'Phase 1',2:'Phase 2',3:'Phase 3',4:'Phase 4',5:'Phase 5',6:'Mon compte'};
  let html='',last=0;
  MODULES.forEach(m=>{
    if(m.phase!==last){html+=`<div class="sidebar-section">${phases[m.phase]}</div>`;last=m.phase;}
    const action=m.isPage?`showView('${m.pageId}')`:`openModule('${m.id}')`;
    html+=`<a href="#" onclick="${action};return false">${m.emoji} ${m.title}</a>`;
  });
  el('sidebarNav').innerHTML=html;
}

function buildHome(){
  const phases=[{n:1,k:'phase1'},{n:2,k:'phase2'},{n:3,k:'phase3'},{n:4,k:'phase4'},{n:5,k:'phase5'},{n:6,k:null}];
  let html='';
  phases.forEach(ph=>{
    const mods=MODULES.filter(m=>m.phase===ph.n);
    if(!mods.length)return;
    html+=`<div class="phase-label">${ph.k?t(ph.k):'Mon compte'}</div><div class="module-grid">`;
    mods.forEach(m=>{
      const action=m.isPage?`showView('${m.pageId}')`:`openModule('${m.id}')`;
      const used=!m.isPage&&userFreeModules.includes(m.id);
      const badge=m.isPage?'':used?`<div class="module-badge used">★ Essayé</div>`:`<div class="module-badge free">Essai gratuit</div>`;
      html+=`<div class="module-card" onclick="${action}"><span class="mc-icon">${m.emoji}</span><div class="mc-title">${m.title}</div><div class="mc-desc">${m.desc}</div>${badge}</div>`;
    });
    html+='</div>';
  });
  el('homeModules').innerHTML=html;
}

// ====== MODULE ======
function openModule(id){
  const m=MODULES.find(x=>x.id===id); if(!m)return;
  currentModule=m;
  el('moduleTitle').textContent=`${m.emoji} ${m.title}`;
  el('moduleBtn').textContent=m.btn==='generate'?t('generate'):t('analyze');
  el('moduleResult').classList.add('hidden'); el('moduleResult').innerHTML='';
  const used=userFreeModules.includes(m.id);
  el('moduleBadge').innerHTML=used
    ?`<span style="background:#fef9c3;color:#ca8a04;padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:600">★ Essai déjà utilisé</span>`
    :`<span style="background:#dcfce7;color:#16a34a;padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:600">✅ 1 analyse gratuite disponible</span>`;
  el('moduleForm').innerHTML=m.fields.map(f=>{
    if(f.type==='select')return`<label>${f.label}</label><select id="${f.id}">${f.opts.map(o=>`<option>${o}</option>`).join('')}</select>`;
    if(f.type==='textarea')return`<label>${f.label}</label><textarea id="${f.id}" placeholder="${f.ph||''}" rows="3"></textarea>`;
    return`<label>${f.label}</label><input type="${f.type}" id="${f.id}" placeholder="${f.ph||''}">`;
  }).join('');
  showView('modulePage');
}

async function runCurrentModule(){
  if(!currentModule)return;
  const m=currentModule;
  if(m.fields[0]&&!gv(m.fields[0].id).trim()){toast(t('fillFields'),'error');return;}
  const result=el('moduleResult');
  result.classList.remove('hidden');
  result.innerHTML=`<div class="loading-state"><span class="spinner">⚙️</span><p>${m.btn==='generate'?t('generating'):t('loading')}</p></div>`;
  const donnees={...m.getDonnees(),profil_type:currentProfileType};
  const {data,error,errType}=await callAI(m.id,donnees);
  if(error){
    if(errType==='essai_utilise'){
      result.innerHTML=`<div class="paywall-mini"><div style="font-size:2rem;margin-bottom:8px">🔒</div><p style="font-weight:700;margin-bottom:8px">Tu as utilisé ton essai gratuit pour ce module</p><p style="color:rgba(255,255,255,.7);font-size:.9rem;margin-bottom:16px">Active ton accès complet pour continuer sans limite.</p><button class="btn-pay" onclick="showPaywall()" style="max-width:280px;margin:0 auto">💳 Activer — ${MONTANT_XOF.toLocaleString()} XOF</button></div>`;
      return;
    }
    result.innerHTML=`<div class="error-msg">${t('errAI')}</div>`;
    return;
  }
  if(!userFreeModules.includes(m.id)){
    userFreeModules=[...userFreeModules,m.id];
    buildHome(); buildSidebar();
    el('moduleBadge').innerHTML=`<span style="background:#fef9c3;color:#ca8a04;padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:600">★ Essai utilisé</span>`;
  }
  result.innerHTML=renderResult(m.id,data,donnees);
}

// ====== APPEL IA ======
async function callAI(module,donnees){
  const {data:{session}}=await sb.auth.getSession();
  if(!session)return{error:true,errType:'not_auth'};
  try{
    const res=await fetch(`${SUPABASE_URL}/functions/v1/moteur-ia`,{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},
      body:JSON.stringify({module,donnees})
    });
    const raw=await res.text();
    if(!res.ok){let err={};try{err=JSON.parse(raw);}catch(e){}return{error:true,errType:err.error,message:err.message};}
    try{return{data:JSON.parse(raw)};}
    catch(e){return{error:true,errType:'parse'};}
  }catch(e){return{error:true,errType:'network'};}
}

// ====== RENDUS ======
const sc=n=>n>=66?'#22c55e':n>=41?'#f59e0b':'#ef4444';
const vBg={'GO':'#dcfce7','NO-GO':'#fee2e2','ATTENDRE':'#fef9c3','LANCER_MAINTENANT':'#dcfce7','BON_MOMENT':'#dbeafe','PASSE':'#fee2e2','PROMETTEUR':'#dcfce7','RISQUÉ':'#fee2e2','À REVOIR':'#fef9c3','OPPORTUNITE_FORTE':'#dcfce7','OPPORTUNITE_MOYENNE':'#dbeafe','DIFFICILE':'#fee2e2'};
const vColor={'GO':'#16a34a','NO-GO':'#dc2626','ATTENDRE':'#ca8a04','LANCER_MAINTENANT':'#16a34a','BON_MOMENT':'#2563eb','PASSE':'#dc2626','PROMETTEUR':'#16a34a','RISQUÉ':'#dc2626','À REVOIR':'#ca8a04','OPPORTUNITE_FORTE':'#16a34a','OPPORTUNITE_MOYENNE':'#2563eb','DIFFICILE':'#dc2626'};
const verd=v=>v?`<span class="verdict-badge" style="background:${vBg[v]||'#f3f4f6'};color:${vColor[v]||'#374151'}">${v}</span>`:'';
const score=(n,l='Score')=>`<div class="score-ring"><div class="score-num" style="color:${sc(n)}">${n}<span style="font-size:.9rem;color:#888">/100</span></div><div class="score-bar"><div class="score-fill" style="width:${n}%;background:${sc(n)}"></div></div><div style="font-size:.8rem;color:#888;margin-top:4px">${l}</div></div>`;
const tag=(...a)=>a.filter(Boolean).map(i=>`<span class="tag">${i}</span>`).join('');
const sec=(t,c)=>`<div class="r-section"><div class="r-section-title">${t}</div>${c}</div>`;
const lst=a=>a?.map(x=>`<div style="padding:3px 0;font-size:.85rem">• ${x}</div>`).join('')||'';
const nlst=a=>a?.map((x,i)=>`<div class="plan-step"><div class="step-num">${i+1}</div><div class="step-txt">${x}</div></div>`).join('')||'';
const img=(kw,alt)=>`<img src="${getImg(kw)}" alt="${alt||''}" style="width:100%;border-radius:10px;margin-bottom:12px;object-fit:cover;height:160px" loading="lazy" onerror="this.style.display='none'">`;

function renderResult(mid,d,don={}){
  try{
    const kw=JSON.stringify(don);
    switch(mid){
      case 'product_analyzer':return`
        ${img(kw,'Analyse produit')}
        <div style="text-align:center;margin-bottom:14px">${score(d.score_viabilite,'Score de viabilité')}${verd(d.verdict)}<p style="color:#555;font-style:italic;font-size:.9rem;margin-top:10px">"${d.justification}"</p></div>
        ${sec('💰 Prix suggéré',`<p style="font-weight:700;color:#16a34a;font-size:1.1rem">${d.prix_suggere_xof?.min?.toLocaleString()}–${d.prix_suggere_xof?.max?.toLocaleString()} XOF</p>`)}
        <div class="swot-grid">
          <div class="swot-cell" style="background:#dcfce7"><div class="swot-cell-title" style="color:#16a34a">💪 Forces</div>${lst(d.swot?.forces)}</div>
          <div class="swot-cell" style="background:#fee2e2"><div class="swot-cell-title" style="color:#dc2626">⚠️ Faiblesses</div>${lst(d.swot?.faiblesses)}</div>
          <div class="swot-cell" style="background:#dbeafe"><div class="swot-cell-title" style="color:#2563eb">🚀 Opportunités</div>${lst(d.swot?.opportunites)}</div>
          <div class="swot-cell" style="background:#fef9c3"><div class="swot-cell-title" style="color:#ca8a04">🛡️ Menaces</div>${lst(d.swot?.menaces)}</div>
        </div>
        ${d.realite_marche_2026?sec('📊 Réalité marché 2026',`<p style="font-size:.85rem;color:#2563eb">${d.realite_marche_2026}</p>`):''}
        ${sec('📋 Plan d\'action',nlst(d.plan_action))}`;

      case 'idea_finder':return`
        ${img(kw,'Idées')}
        <p style="font-weight:700;margin-bottom:12px">💡 ${d.idees?.length||0} idées générées</p>
        ${d.idees?.map((id,i)=>`<div class="idea-card"><div style="font-weight:700;margin-bottom:4px">${i+1}. ${id.titre}</div><p style="font-size:.85rem;color:#555;margin-bottom:8px">${id.description}</p>${tag('📦 '+id.format,'👥 '+id.audience,'📈 '+id.potentiel)}<p style="font-size:.85rem;font-weight:700;color:#16a34a;margin-top:8px">💰 ${id.prix_xof?.min?.toLocaleString()}–${id.prix_xof?.max?.toLocaleString()} XOF</p>${id.pourquoi_maintenant?`<p style="font-size:.8rem;color:#6c63ff;margin-top:6px">⚡ ${id.pourquoi_maintenant}</p>`:''}</div>`).join('')}`;

      case 'winning_products':return`
        ${img(kw,'Produits gagnants')}
        ${sec('Tendance',`<p style="font-weight:700">${d.tendance_globale==='montante'?'📈 En hausse':d.tendance_globale==='stable'?'→ Stable':'📉 En baisse'}</p>`)}
        ${d.produits_gagnants?.map(p=>`<div class="idea-card"><div style="font-weight:700">${p.titre}</div><p style="font-size:.85rem;color:#555;margin:6px 0">${p.pourquoi_ca_marche}</p>${tag('⚔️ '+p.niveau_concurrence,'💰 '+p.prix_moyen_xof?.toLocaleString()+' XOF')}<p style="font-size:.8rem;color:#6c63ff;margin-top:8px">💡 ${p.comment_se_differencier}</p>${p.donnee_actuelle?`<p style="font-size:.8rem;color:#888;font-style:italic;margin-top:4px">📊 ${p.donnee_actuelle}</p>`:''}</div>`).join('')}
        ${sec('🎯 Opportunité clé',`<p style="font-size:.85rem">${d.opportunite_cle}</p>`)}`;

      case 'competitor_spy':return`
        ${img('competitor spy','Analyse concurrentielle')}
        <div style="text-align:center;margin-bottom:14px">${score(d.score_menace,'Score de menace')}</div>
        ${sec('💪 Forces',lst(d.forces))}${sec('⚠️ Faiblesses',lst(d.faiblesses))}
        ${sec('📣 Stratégie marketing',`<p style="font-size:.85rem">${d.strategie_marketing}</p>`)}
        ${sec('⚔️ Comment le battre',nlst(d.comment_le_battre))}
        ${d.tactique_immediate?sec('⚡ Tactique immédiate',`<p style="font-size:.85rem;font-weight:700;color:#6c63ff">${d.tactique_immediate}</p>`):''}`;

      case 'trend_predictor':return`
        ${img(kw,'Tendances')}
        <div style="text-align:center;margin-bottom:14px">${score(d.niveau_tendance,'Niveau de tendance')}${verd(d.verdict)}</div>
        ${d.donnee_cle_2026?sec('📊 Donnée clé 2026',`<p style="font-size:.85rem;font-weight:700;color:#2563eb">${d.donnee_cle_2026}</p>`):''}
        ${sec('📊 Analyse',`<p style="font-size:.85rem">${d.pourquoi}</p>`)}
        ${sec('⏰ Pic prévu',`<p style="font-weight:700">${d.pic_prevu}</p>`)}
        ${sec('📲 Plateformes actives',lst(d.plateformes_actives))}
        ${sec('💡 Conseil',`<p style="font-size:.85rem">${d.conseil}</p>`)}`;

      case 'market_validator':return`
        ${img(kw,'Marché')}
        <div style="text-align:center;margin-bottom:14px">${score(d.score_marche,'Score marché')}${verd(d.verdict)}</div>
        <div class="swot-grid">
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Taille</div><p style="font-size:.85rem;font-weight:700">${d.taille_marche}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Demande</div><p style="font-size:.85rem;font-weight:700">${d.demande_estimee}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Saturation</div><p style="font-size:.85rem;font-weight:700">${d.niveau_saturation}%</p></div>
          <div class="swot-cell" style="background:#f0fdf4"><div class="swot-cell-title">Prix optimal</div><p style="font-size:.85rem;font-weight:700;color:#16a34a">${d.prix_optimal_xof?.min?.toLocaleString()}–${d.prix_optimal_xof?.max?.toLocaleString()} XOF</p></div>
        </div>
        ${d.chiffres_2026?sec('📊 Chiffres 2026',`<p style="font-size:.85rem;color:#2563eb">${d.chiffres_2026}</p>`):''}
        ${sec('⚠️ Risques',lst(d.risques))}${sec('🚀 Opportunités',lst(d.opportunites))}
        ${sec('💬 Recommandation',`<p style="font-size:.85rem">${d.recommandation}</p>`)}`;

      case 'angle_generator':return`
        ${img(kw,'Angles marketing')}
        <p style="font-weight:700;margin-bottom:12px">🎯 ${d.angles?.length||0} angles générés</p>
        ${d.angles?.map((a,i)=>`<div class="angle-card"><div style="font-weight:700;margin-bottom:4px">${i+1}. ${a.titre}</div><p style="color:#6c63ff;font-style:italic;font-size:.9rem;margin-bottom:8px">"${a.accroche}"</p>${tag('👥 '+a.audience_specifique,'📲 '+a.plateforme_ideale,'💰 '+a.prix_suggere_xof?.toLocaleString()+' XOF')}${a.exemple_post?`<div style="background:#f8f7ff;border-radius:8px;padding:10px;margin-top:8px;font-size:.8rem;font-style:italic">"${a.exemple_post}"</div>`:''}</div>`).join('')}`;

      case 'monetization_hub':return`
        ${sec('💰 Potentiel total',`<p style="font-weight:700;color:#16a34a;font-size:1.1rem">${d.revenu_potentiel_total_xof?.min?.toLocaleString()}–${d.revenu_potentiel_total_xof?.max?.toLocaleString()} XOF/mois</p>`)}
        ${d.sources_revenus?.map((s,i)=>`<div class="idea-card"><div style="font-weight:700;margin-bottom:4px">${i+1}. ${s.methode}</div><p style="font-size:.85rem;color:#555;margin-bottom:8px">${s.description}</p>${tag('⚡ '+s.effort,'⏱️ '+s.delai_premier_revenu)}<p style="font-size:.85rem;font-weight:700;color:#16a34a;margin-top:8px">💰 ${s.potentiel_mensuel_xof?.min?.toLocaleString()}–${s.potentiel_mensuel_xof?.max?.toLocaleString()} XOF/mois</p><p style="font-size:.8rem;color:#6c63ff;margin-top:6px">→ ${s.comment_commencer}</p></div>`).join('')}
        ${sec('🎯 Stratégie',`<p style="font-size:.85rem">${d.strategie_recommandee}</p>`)}`;

      case 'selling_strategy':return`
        ${img('marketing strategy','Stratégie')}
        ${sec('📋 Résumé',`<p style="font-size:.85rem">${d.resume}</p>`)}
        ${sec('🎯 Objectif 30 jours',`<p style="font-weight:700">${d.objectif_30_jours}</p>`)}
        ${d.premier_post?sec('📱 Premier post à publier (Jour 1)',`<div style="background:#f0fdf4;border-radius:8px;padding:12px;font-size:.85rem;font-style:italic;border-left:3px solid #22c55e">"${d.premier_post}"</div>`):''}
        ${d.semaines?.map(s=>`<div class="week-card"><div style="font-weight:700;color:#d97706;margin-bottom:6px">Semaine ${s.numero} — ${s.theme}</div><p style="font-size:.85rem;color:#555;margin-bottom:8px">${s.objectif}</p>${lst(s.actions)}</div>`).join('')}
        ${sec('❌ Erreurs à éviter',lst(d.erreurs_a_eviter))}`;

      case 'international_expansion':return`
        ${img('africa global','Expansion')}
        <div style="text-align:center;margin-bottom:14px">${verd(d.verdict)}</div>
        ${sec('📊 Analyse',`<p style="font-size:.85rem">${d.analyse}</p>`)}
        ${sec('💳 Paiements locaux',lst(d.moyens_paiement))}
        ${sec('💰 Prix adapté',`<p style="font-weight:700;color:#16a34a">${d.adaptation_prix_xof?.min?.toLocaleString()}–${d.adaptation_prix_xof?.max?.toLocaleString()} XOF</p>`)}
        ${d.exemple_reussite?sec('🌟 Exemple de réussite',`<p style="font-size:.85rem;color:#6c63ff">${d.exemple_reussite}</p>`):''}
        ${sec('📋 Plan d\'entrée',nlst(d.plan_entree))}`;

      case 'product_generator':return`
        ${sec('📦 Ton produit',`<div style="font-weight:700;font-size:1rem">${d.titre}</div><p style="font-size:.85rem;color:#555">${d.sous_titre}</p>`)}
        <div class="swot-grid">
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Format</div><p style="font-size:.85rem;font-weight:700">${d.format}</p></div>
          <div class="swot-cell" style="background:#f0fdf4"><div class="swot-cell-title">Prix</div><p style="font-size:.85rem;font-weight:700;color:#16a34a">${d.prix_recommande_xof?.toLocaleString()} XOF</p></div>
        </div>
        ${d.modules?.map(m=>`<div class="week-card"><div style="font-weight:700;color:#d97706">Module ${m.numero} — ${m.titre}</div><div style="margin-top:6px">${lst(m.contenu_cle)}</div></div>`).join('')}
        ${sec('📣 Accroche marketing',`<p style="font-weight:700;color:#6c63ff">"${d.accroche}"</p>`)}`;

      case 'image_generator':return`
        ${d.prompts?.map((p,i)=>`<div class="idea-card"><div style="font-weight:700;margin-bottom:4px">${p.type} — ${p.plateforme}</div><div style="background:#f8f7ff;border-radius:8px;padding:10px;margin-bottom:8px;cursor:pointer" onclick="copyText(this)"><p style="font-size:.8rem;font-family:monospace;line-height:1.6">${p.prompt_fr}</p><p style="font-size:.75rem;color:#6c63ff;text-align:right;margin-top:4px">📋 Copier</p></div></div>`).join('')}
        ${sec('🛠️ Outils gratuits',lst(d.outils_gratuits))}`;

      case 'prompt_generator':return`
        ${d.prompts?.map((p,i)=>`<div class="idea-card"><div style="font-weight:700;margin-bottom:4px">${p.type}</div><p style="font-size:.85rem;color:#555;margin-bottom:8px">${p.objectif}</p><div style="background:#f8f7ff;border-radius:8px;padding:12px;margin-bottom:8px;cursor:pointer" onclick="copyText(this)"><p style="font-size:.8rem;font-family:monospace;line-height:1.6">${p.prompt}</p><p style="font-size:.75rem;color:#6c63ff;text-align:right;margin-top:4px">📋 Copier</p></div></div>`).join('')}
        ${sec('💡 Conseil global',`<p style="font-size:.85rem">${d.conseil_global}</p>`)}`;

      case 'country_targeting':return`
        ${img(d.pays+' africa','Pays cible')}
        <div class="swot-grid">
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Internet</div><p style="font-size:.85rem;font-weight:700">${d.taux_internet}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Concurrence</div><p style="font-size:.85rem;font-weight:700">${d.niveau_concurrence}</p></div>
          <div class="swot-cell" style="background:#f0fdf4"><div class="swot-cell-title">Prix adapté</div><p style="font-size:.85rem;font-weight:700;color:#16a34a">${d.prix_adapte_xof?.min?.toLocaleString()}–${d.prix_adapte_xof?.max?.toLocaleString()} XOF</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Peak</div><p style="font-size:.85rem;font-weight:700">${d.heure_peak}</p></div>
        </div>
        ${d.fait_marche?sec('📊 Fait clé',`<p style="font-size:.85rem;font-weight:700;color:#2563eb">${d.fait_marche}</p>`):''}
        ${sec('💳 Paiements',lst(d.moyens_paiement))}${sec('✅ À faire',lst(d.do_list))}${sec('❌ À éviter',lst(d.dont_list))}
        ${sec('📋 Plan d\'action',nlst(d.plan_action))}`;

      case 'honest_feedback':return`
        <div style="text-align:center;margin-bottom:14px">${score(d.probabilite_succes,'Probabilité de succès')}${verd(d.verdict)}</div>
        <div class="swot-grid">
          <div class="swot-cell" style="background:#dcfce7"><div class="swot-cell-title" style="color:#16a34a">✅ Points forts</div>${lst(d.points_forts)}</div>
          <div class="swot-cell" style="background:#fee2e2"><div class="swot-cell-title" style="color:#dc2626">❌ Points faibles</div>${lst(d.points_faibles)}</div>
        </div>
        ${sec('💡 Conseil principal',`<p style="font-size:.85rem">${d.conseil_principal}</p>`)}
        ${sec('👉 Prochaine étape',`<p style="font-size:.85rem;font-weight:700;color:#6c63ff">${d.prochaine_etape}</p>`)}
        ${d.question_a_se_poser?sec('🤔 La vraie question',`<p style="font-size:.85rem;font-style:italic">"${d.question_a_se_poser}"</p>`):''}`;

      default:return`<pre style="font-size:.75rem;word-break:break-all;white-space:pre-wrap">${JSON.stringify(d,null,2)}</pre>`;
    }
  }catch(e){return`<div class="error-msg">Erreur d'affichage.</div>`;}
}

function copyText(el_){
  const text=el_.querySelector('p').textContent;
  navigator.clipboard?.writeText(text).then(()=>toast('✅ Copié !','success'));
}

// ====== PROFIL DATA ======
async function loadProfileData(){
  const {data}=await sb.from('profiles').select('plan,beta_expires_at,profil_type').eq('id',currentUser.id).single();
  const {count}=await sb.from('historique').select('id',{count:'exact',head:true}).eq('user_id',currentUser.id);
  const nom=currentUser.user_metadata?.nom||currentUser.email.split('@')[0];
  el('profileName').textContent=nom;
  el('profileEmail').textContent=currentUser.email;
  el('statPlan').textContent=(data?.plan||'free').toUpperCase();
  el('statAnalyses').textContent=count||0;
  if(data?.beta_expires_at){const d=new Date(data.beta_expires_at);el('statExpiry').textContent=d.toLocaleDateString('fr-FR');}
  const prof=PROFILES.find(p=>p.id===data?.profil_type);
  el('statProfile').textContent=prof?`${prof.emoji} ${prof.label}`:'—';
}

// ====== SIDEBAR ======
function openSidebar(){el('sidebar').classList.add('open');el('sidebarOverlay').classList.add('show');}
function closeSidebar(){el('sidebar').classList.remove('open');el('sidebarOverlay').classList.remove('show');}

// ====== INIT ======
window.addEventListener('load',async()=>{
  sb.auth.onAuthStateChange(async(event,session)=>{
    if((event==='SIGNED_IN'||event==='USER_UPDATED')&&session&&!currentUser){
      currentUser=session.user;
      closeAuthModal();
      await afterAuth();
    }
  });
  const {data:{session}}=await sb.auth.getSession();
  if(session){currentUser=session.user;await afterAuth();}
  else{showPage('landingPage');}
  setLang('fr');
});
