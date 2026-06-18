// ====== CONFIG ======
const SUPABASE_URL = 'https://oznfsajhdxhykzivhumd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2oZY-aRcKRbuz2lMXH6wdA_X38zNOt5';
const FEDAPAY_PUBLIC_KEY = 'pk_live_QbSs9YoX0hORrsi_Bjr7rpK8';
const MONTANT_XOF = 4900;

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null;
let currentLang = 'fr';
let currentProfileType = null;
let currentModule = null;
let userFreeModules = [];

// ====== IMAGES PAR CATÉGORIE (Unsplash, sans clé API) ======
const IMGS = {
  digital: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
  marketing: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&q=80',
  ecommerce: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80',
  africa: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80',
  mobile: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80',
  tiktok: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&q=80',
  formation: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
  business: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  freelance: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80',
  money: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
  strategy: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&q=80',
  content: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&q=80',
  growth: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
};

function getImg(keywords = '') {
  const kw = keywords.toLowerCase();
  if (kw.includes('tiktok') || kw.includes('video') || kw.includes('contenu')) return IMGS.tiktok;
  if (kw.includes('formation') || kw.includes('cours') || kw.includes('apprendre')) return IMGS.formation;
  if (kw.includes('marketing') || kw.includes('pub') || kw.includes('vente')) return IMGS.marketing;
  if (kw.includes('ecommerce') || kw.includes('boutique') || kw.includes('shop')) return IMGS.ecommerce;
  if (kw.includes('freelance') || kw.includes('service')) return IMGS.freelance;
  if (kw.includes('argent') || kw.includes('revenu') || kw.includes('money')) return IMGS.money;
  if (kw.includes('strateg') || kw.includes('plan') || kw.includes('lancement')) return IMGS.strategy;
  if (kw.includes('africa') || kw.includes('bénin') || kw.includes('nigeria')) return IMGS.africa;
  if (kw.includes('croissance') || kw.includes('tendance') || kw.includes('trend')) return IMGS.growth;
  return IMGS.digital;
}

// ====== TRADUCTIONS ======
const T = {
  fr: {
    welcome:'Bienvenue 👋', homeSubtitle:'Que veux-tu faire aujourd\'hui ?',
    phase1:'Phase 1 — Trouver quoi vendre', phase2:'Phase 2 — Valider ton idée',
    phase3:'Phase 3 — Construire ta stratégie', phase4:'Phase 4 — Créer ton contenu',
    phase5:'Phase 5 — Cibler & s\'auto-évaluer',
    loading:'⏳ Analyse en cours, patiente...', generating:'⏳ Génération en cours...',
    fillFields:'Remplis tous les champs requis',
    errAuth:'Connecte-toi pour utiliser cette fonctionnalité',
    errAccess:'Active ton accès pour utiliser cette fonctionnalité.',
    errExpired:'Ta période a expiré. Renouvelle ton abonnement.',
    errAI:'❌ Erreur IA. Réessaie dans quelques secondes.',
    loginErr:'Email ou mot de passe incorrect',
    signupOk:'✅ Compte créé ! Vérifie ton email.',
    logoutConfirm:'Veux-tu vraiment te déconnecter ?',
    profileSaved:'✅ Profil enregistré !',
    payActivated:'🎉 Accès activé avec succès !',
    payError:'Erreur paiement. Contacte le support.',
    selectProfile:'Sélectionne ton profil pour continuer',
    analyze:'Analyser', generate:'Générer', back:'← Retour',
    freeLabel:'Essai gratuit', usedLabel:'Abonnement requis',
    essaiUtilise:'Tu as utilisé ton essai gratuit pour ce module. Passe à l\'abonnement pour continuer.',
    profileTitle:'Mon Profil', settingsTitle:'Paramètres',
    statPlan:'Plan', statExpiry:'Expire le', statProfile:'Profil', statAnalyses:'Analyses',
    changeProfile:'Changer de profil', logout:'Se déconnecter',
    settingsLang:'🌐 Langue', settingsDelete:'⚠️ Supprimer mon compte',
    settingsDeleteDesc:'Cette action est irréversible.',
    deleteBtn:'Supprimer mon compte', deleteConfirm:'Es-tu sûr ? Cette action est irréversible.',
  },
  en: {
    welcome:'Welcome 👋', homeSubtitle:'What do you want to do today?',
    phase1:'Phase 1 — Find what to sell', phase2:'Phase 2 — Validate your idea',
    phase3:'Phase 3 — Build your strategy', phase4:'Phase 4 — Create your content',
    phase5:'Phase 5 — Target & self-assess',
    loading:'⏳ Analyzing, please wait...', generating:'⏳ Generating...',
    fillFields:'Please fill all required fields',
    errAuth:'Please login to use this feature',
    errAccess:'Activate your access to use this feature.',
    errExpired:'Your period has expired. Renew your subscription.',
    errAI:'❌ AI error. Please try again.',
    loginErr:'Wrong email or password',
    signupOk:'✅ Account created! Check your email.',
    logoutConfirm:'Do you really want to logout?',
    profileSaved:'✅ Profile saved!',
    payActivated:'🎉 Access activated successfully!',
    payError:'Payment error. Contact support.',
    selectProfile:'Select your profile to continue',
    analyze:'Analyze', generate:'Generate', back:'← Back',
    freeLabel:'Free trial', usedLabel:'Subscription required',
    essaiUtilise:'You\'ve used your free trial for this module. Subscribe to continue.',
    profileTitle:'My Profile', settingsTitle:'Settings',
    statPlan:'Plan', statExpiry:'Expires on', statProfile:'Profile', statAnalyses:'Analyses',
    changeProfile:'Change profile', logout:'Logout',
    settingsLang:'🌐 Language', settingsDelete:'⚠️ Delete my account',
    settingsDeleteDesc:'This action is irreversible.',
    deleteBtn:'Delete my account', deleteConfirm:'Are you sure? This action is irreversible.',
  }
};
const t = k => T[currentLang][k] || k;

// ====== PROFILS ======
const PROFILES = [
  { id:'infopreneur', emoji:'📦', label:'Infopreneur', sub:'Ebooks, formations, templates' },
  { id:'ecommerce', emoji:'🛒', label:'E-commerçant', sub:'Boutique en ligne, dropshipping' },
  { id:'createur', emoji:'🎬', label:'Créateur de contenu', sub:'TikTok, Instagram, YouTube' },
  { id:'freelance', emoji:'💼', label:'Freelance digital', sub:'Design, dev, rédaction' },
  { id:'formateur', emoji:'🎓', label:'Formateur en ligne', sub:'Vidéos, webinaires, masterclasses' },
  { id:'coach', emoji:'🤝', label:'Coach / Consultant', sub:'Coaching individuel ou groupe' },
  { id:'community', emoji:'📱', label:'Community Manager', sub:'Gestion des réseaux sociaux' },
  { id:'affilie', emoji:'🔗', label:'Affilié', sub:'Marketing d\'affiliation' },
  { id:'expert_ia', emoji:'🤖', label:'Expert IA', sub:'Formations IA, automatisation' },
];

// ====== MODULES (15 IA + 2 pages) ======
const MODULES_CONFIG = [
  { id:'idea_finder', emoji:'💡', title:'Idea Finder', desc:'Génère des idées de produits rentables dans ta niche', phase:1,
    fields:[{type:'select',id:'f_cat',label:'Catégorie',opts:['Marketing digital','E-commerce & Dropshipping','Développement personnel','Finance personnelle','Santé & Bien-être','Technologie & IA','Entrepreneuriat','Productivité','Éducation en ligne','Créativité & Design','Photographie & Vidéo','Cuisine & Lifestyle','Mode & Beauté','Sport & Fitness','Immobilier','Relations & Communication','Développement web & Tech','Réseaux sociaux','Affiliation','Musique & Audio','Gaming','Voyage & Tourisme','Langues étrangères','Développement durable','Crypto & Web3','Parenting','Animaux','Art & Illustration','Podcast','Business local']},{type:'text',id:'f_niche',label:'Précise ta niche (optionnel)',ph:'Ex: coaching pour femmes entrepreneurs au Sénégal'}],
    getDonnees:()=>({categorie:gv('f_cat'),niche:gv('f_niche')||null}), btnLabel:'generate' },

  { id:'winning_products', emoji:'🏆', title:'Winning Products', desc:'Produits qui marchent déjà dans ta niche', phase:1,
    fields:[{type:'text',id:'f_niche2',label:'Ta niche',ph:'Ex: formation en ligne, dropshipping vêtements...'},{type:'text',id:'f_pays',label:'Pays cible',ph:'Ex: Bénin, Nigeria, Sénégal, Côte d\'Ivoire...'}],
    getDonnees:()=>({niche:gv('f_niche2'),pays:gv('f_pays')}), btnLabel:'generate' },

  { id:'product_analyzer', emoji:'📊', title:'Product Analyzer', desc:'Score de viabilité, SWOT et verdict GO/NO-GO', phase:2,
    fields:[{type:'text',id:'f_pnom',label:'Nom de ton produit / service',ph:'Ex: Guide complet du dropshipping au Bénin'},{type:'textarea',id:'f_pdesc',label:'Description (à qui ça sert, quel problème ça résout)',ph:'Ex: Un guide pratique pour...'},{type:'number',id:'f_pprix',label:'Prix envisagé (XOF)',ph:'Ex: 5900'}],
    getDonnees:()=>({nom:gv('f_pnom'),description:gv('f_pdesc'),prix_xof:Number(gv('f_pprix'))||0}), btnLabel:'analyze' },

  { id:'competitor_spy', emoji:'🕵️', title:'Competitor Spy', desc:'Analyse tes concurrents et trouve comment les battre', phase:2,
    fields:[{type:'text',id:'f_cnom',label:'Nom du concurrent',ph:'Ex: Jean Marketing, @vendeur_pro...'},{type:'textarea',id:'f_cinfo',label:'Ce que tu sais de lui',ph:'Ex: Il vend des formations WhatsApp à 15 000 XOF, actif sur TikTok...'},{type:'text',id:'f_creseau',label:'Sur quel réseau ?',ph:'Ex: TikTok, Instagram, Facebook...'}],
    getDonnees:()=>({concurrent:gv('f_cnom'),informations:gv('f_cinfo'),reseau:gv('f_creseau')}), btnLabel:'analyze' },

  { id:'trend_predictor', emoji:'📈', title:'Trend Predictor', desc:'Est-ce que ta niche est en train de monter ?', phase:2,
    fields:[{type:'text',id:'f_tmc',label:'Mot-clé ou niche à analyser',ph:'Ex: formation IA Afrique, dropshipping Bénin...'},{type:'text',id:'f_tpays',label:'Marché cible',ph:'Ex: Afrique de l\'Ouest, Nigeria, Global...'}],
    getDonnees:()=>({sujet:gv('f_tmc'),marche:gv('f_tpays')}), btnLabel:'analyze' },

  { id:'market_validator', emoji:'✅', title:'Market Validator', desc:'Taille du marché, demande réelle, verdict GO/NO-GO', phase:2,
    fields:[{type:'textarea',id:'f_mprod',label:'Ton produit et marché cible',ph:'Ex: Formation création de contenu TikTok pour entrepreneurs béninois 18-35 ans...'},{type:'number',id:'f_mprix',label:'Prix envisagé (XOF)',ph:'Ex: 12000'}],
    getDonnees:()=>({produit:gv('f_mprod'),prix_xof:Number(gv('f_mprix'))||0}), btnLabel:'analyze' },

  { id:'angle_generator', emoji:'🎯', title:'Angle Generator', desc:'7 façons différentes de présenter ton produit', phase:3,
    fields:[{type:'text',id:'f_aprod',label:'Ton produit',ph:'Ex: Formation création de contenu'},{type:'text',id:'f_aaud',label:'Ton audience principale',ph:'Ex: Jeunes entrepreneurs africains 18-30 ans'},{type:'number',id:'f_aprix',label:'Prix actuel (XOF)',ph:'Ex: 9000'}],
    getDonnees:()=>({produit:gv('f_aprod'),audience:gv('f_aaud'),prix_xof:Number(gv('f_aprix'))||0}), btnLabel:'generate' },

  { id:'monetization_hub', emoji:'💰', title:'Monetization Hub', desc:'6 sources de revenus pour ton activité', phase:3,
    fields:[{type:'textarea',id:'f_monprod',label:'Ton produit, service ou expertise',ph:'Ex: Je crée du contenu sur TikTok, j\'ai 5000 abonnés, niche: business en ligne...'},{type:'text',id:'f_monstade',label:'Ton stade actuel',ph:'Ex: Débutant, 3 mois d\'activité, 0 vente...'}],
    getDonnees:()=>({produit:gv('f_monprod'),stade:gv('f_monstade')}), btnLabel:'generate' },

  { id:'selling_strategy', emoji:'🚀', title:'Selling Strategy', desc:'Plan de lancement complet sur 28 jours', phase:3,
    fields:[{type:'text',id:'f_sprod',label:'Ton produit',ph:'Ex: Ebook : Comment trouver des clients en dropshipping'},{type:'text',id:'f_saud',label:'Ton audience cible',ph:'Ex: Dropshippers débutants au Bénin'},{type:'number',id:'f_sprix',label:'Prix (XOF)',ph:'Ex: 4500'},{type:'number',id:'f_sbudget',label:'Budget marketing (XOF)',ph:'Ex: 0 si pas de budget'}],
    getDonnees:()=>({produit:gv('f_sprod'),audience:gv('f_saud'),prix_xof:Number(gv('f_sprix'))||0,budget_xof:Number(gv('f_sbudget'))||0}), btnLabel:'generate' },

  { id:'international_expansion', emoji:'🌍', title:'International Expansion', desc:'Adapte ton produit à un autre marché', phase:3,
    fields:[{type:'text',id:'f_intprod',label:'Ton produit / service',ph:'Ex: Formation marketing digital'},{type:'text',id:'f_intregion',label:'Région ou pays cible',ph:'Ex: Nigeria, Ghana, Europe francophone, Diaspora...'}],
    getDonnees:()=>({produit:gv('f_intprod'),region:gv('f_intregion')}), btnLabel:'analyze' },

  { id:'product_generator', emoji:'📝', title:'Product Generator', desc:'Plan complet de ton produit digital à créer', phase:4,
    fields:[{type:'text',id:'f_pgsujet',label:'Sujet de ton produit',ph:'Ex: Comment créer une boutique Shopify rentable'},{type:'text',id:'f_pgaud',label:'Pour qui ?',ph:'Ex: Entrepreneurs béninois débutants en e-commerce'},{type:'select',id:'f_pgformat',label:'Format préféré',opts:['Laisse l\'IA choisir','Ebook (PDF)','Formation vidéo','Template','Guide pratique','Coaching','Webinaire']}],
    getDonnees:()=>({sujet:gv('f_pgsujet'),audience:gv('f_pgaud'),format:gv('f_pgformat')}), btnLabel:'generate' },

  { id:'image_generator', emoji:'🎨', title:'Image Generator', desc:'Prompts IA pour créer tes visuels professionnels', phase:4,
    fields:[{type:'text',id:'f_igprod',label:'Ton produit',ph:'Ex: Ebook dropshipping'},{type:'text',id:'f_igtype',label:'Type de visuel voulu',ph:'Ex: couverture ebook, post Instagram, pub Facebook...'},{type:'text',id:'f_igstyle',label:'Style souhaité',ph:'Ex: professionnel, coloré, minimaliste, africain moderne...'}],
    getDonnees:()=>({produit:gv('f_igprod'),type_visuel:gv('f_igtype'),style:gv('f_igstyle')}), btnLabel:'generate' },

  { id:'prompt_generator', emoji:'✍️', title:'Prompt Generator', desc:'Prompts prêts à utiliser pour créer du contenu avec l\'IA', phase:4,
    fields:[{type:'text',id:'f_prsujet',label:'Ton sujet ou produit',ph:'Ex: Vendre des formations en ligne en Afrique'},{type:'text',id:'f_praud',label:'Ton audience',ph:'Ex: Jeunes entrepreneurs nigérians 18-30 ans'},{type:'select',id:'f_prtype',label:'Type de contenu',opts:['Tous types','Post TikTok','Caption Instagram','Script vidéo YouTube','Email marketing','Article de blog','Post Facebook','Message WhatsApp']}],
    getDonnees:()=>({sujet:gv('f_prsujet'),audience:gv('f_praud'),type_contenu:gv('f_prtype')}), btnLabel:'generate' },

  { id:'country_targeting', emoji:'🗺️', title:'Country Targeting', desc:'Analyse complète d\'un pays cible pour vendre', phase:5,
    fields:[{type:'text',id:'f_ctprod',label:'Ton produit / service',ph:'Ex: Formation création de contenu TikTok'},{type:'text',id:'f_ctpays',label:'Pays cible',ph:'Ex: Nigeria, Ghana, Cameroun, Sénégal...'}],
    getDonnees:()=>({produit:gv('f_ctprod'),pays:gv('f_ctpays')}), btnLabel:'analyze' },

  { id:'honest_feedback', emoji:'💬', title:'Honest Feedback', desc:'Avis honnête sur ton idée — sans complaisance', phase:5,
    fields:[{type:'textarea',id:'f_hfidee',label:'Décris librement ton idée',ph:'Ex: Je veux créer une formation pour apprendre à vendre sur TikTok Shop. Mon audience: jeunes béninois 18-25 ans. Prix: 8000 XOF...'}],
    getDonnees:()=>({idee:gv('f_hfidee')}), btnLabel:'analyze' },

  { id:'profile_page', emoji:'👤', title:'Mon Profil', desc:'Infos et statistiques de ton compte', phase:6, isPage:true, pageId:'profilePage' },
  { id:'settings_page', emoji:'⚙️', title:'Paramètres', desc:'Langue et gestion du compte', phase:6, isPage:true, pageId:'settingsPage' },
];

// ====== UTILS ======
const gv = id => (document.getElementById(id)||{}).value || '';
const el = id => document.getElementById(id);

function toast(msg, type='info') {
  el('toast')?.remove();
  const d = document.createElement('div'); d.id='toast'; d.textContent=msg;
  const bg = type==='error'?'#ef4444':type==='success'?'#22c55e':'#6c63ff';
  d.style.cssText=`position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:11px 22px;border-radius:24px;font-size:.9rem;font-weight:700;z-index:9999;color:#fff;background:${bg};box-shadow:0 8px 24px rgba(0,0,0,.2);white-space:nowrap;animation:toastIn .3s ease;max-width:90vw;text-align:center`;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(), 3500);
}

// ====== LANGUE ======
function setLang(lang) {
  currentLang=lang;
  document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  document.querySelectorAll('[data-t]').forEach(e=>{if(T[lang]?.[e.dataset.t])e.textContent=T[lang][e.dataset.t];});
  document.querySelectorAll('[data-t-ph]').forEach(e=>{if(T[lang]?.[e.dataset.tPh])e.placeholder=T[lang][e.dataset.tPh];});
}

// ====== AUTH ======
function showAuthForm(type) {
  el('loginForm').classList.toggle('hidden', type!=='login');
  el('signupForm').classList.toggle('hidden', type!=='signup');
}

async function login() {
  const email=el('em1').value.trim(), pw=el('pw1').value;
  if(!email||!pw){toast(t('fillFields'),'error');return;}
  const btn=el('loginBtn'); btn.textContent='⏳'; btn.disabled=true;
  const {data,error}=await sb.auth.signInWithPassword({email,password:pw});
  btn.textContent='Se connecter'; btn.disabled=false;
  if(error){toast(t('loginErr'),'error');return;}
  currentUser=data.user;
  await afterAuth();
}

async function signup() {
  const name=el('nm2').value.trim(), email=el('em2').value.trim(), pw=el('pw2').value;
  if(!name||!email||!pw){toast(t('fillFields'),'error');return;}
  const btn=el('signupBtn'); btn.textContent='⏳'; btn.disabled=true;
  const redirectUrl='https://confiancehoungan4-hue.github.io/Analyser-pro/';
  const {data,error}=await sb.auth.signUp({email,password:pw,options:{data:{nom:name},emailRedirectTo:redirectUrl}});
  btn.textContent='Créer mon compte'; btn.disabled=false;
  if(error){toast('❌ '+error.message,'error');return;}
  if(data.session){currentUser=data.user;await afterAuth();}
  else{el('confirmEmail').textContent=email;showPage('emailSentPage');}
}

async function afterAuth() {
  const {data:prof}=await sb.from('profiles').select('profil_type,plan,beta_expires_at,free_modules_used').eq('id',currentUser.id).single();
  currentProfileType=prof?.profil_type||null;
  userFreeModules=prof?.free_modules_used||[];

  // Page d'onboarding — affichée une seule fois
  const seenKey=`onboarding_${currentUser.id}`;
  if(!localStorage.getItem(seenKey)){showPage('onboardingPage');return;}

  if(!currentProfileType){showProfileSelector();return;}
  showDashboard();
}

async function handleLogout() {
  if(!confirm(t('logoutConfirm')))return;
  await sb.auth.signOut();
  currentUser=null; currentProfileType=null; userFreeModules=[];
  showPage('landingPage'); showAuthForm('login');
}

async function deleteAccount() {
  if(!confirm(t('deleteConfirm')))return;
  toast('Contacte le support pour supprimer ton compte.','info');
}

// ====== ONBOARDING ======
function finishOnboarding() {
  localStorage.setItem(`onboarding_${currentUser.id}`, '1');
  if(!currentProfileType){showProfileSelector();}
  else{showDashboard();}
}

// ====== PAGES ======
function showPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  el(id).classList.add('active');
}

function showView(id) {
  document.querySelectorAll('#dashboardPage .view').forEach(v=>v.classList.remove('active'));
  el(id).classList.add('active');
  closeSidebar(); window.scrollTo(0,0);
}

// ====== PROFIL SELECTOR ======
function showProfileSelector() {
  showPage('profileSelectorPage');
  el('profileGrid').innerHTML=PROFILES.map(p=>`
    <div class="profile-card ${currentProfileType===p.id?'selected':''}" onclick="selectPCard('${p.id}',this)">
      <div class="emoji">${p.emoji}</div>
      <div class="label">${p.label}</div>
      <div class="sub">${p.sub}</div>
    </div>`).join('');
}

function selectPCard(id,el_) {
  document.querySelectorAll('.profile-card').forEach(c=>c.classList.remove('selected'));
  el_.classList.add('selected'); currentProfileType=id;
}

async function saveProfile() {
  if(!currentProfileType){toast(t('selectProfile'),'error');return;}
  await sb.from('profiles').update({profil_type:currentProfileType}).eq('id',currentUser.id);
  toast(t('profileSaved'),'success');
  showDashboard();
}

// ====== PAYWALL ======
function showPaywall() {
  showPage('paywallPage');
  el('modulesPreview').innerHTML=MODULES_CONFIG.slice(0,14).map(m=>`
    <div class="module-prev"><span class="ico">${m.emoji}</span><span class="txt">${m.title}</span></div>`).join('');

  if(typeof FedaPay!=='undefined' && FEDAPAY_PUBLIC_KEY!=='pk_live_VOTRE_CLE_FEDAPAY_ICI') {
    try {
      FedaPay.init('#fedapay-btn', {
        public_key:FEDAPAY_PUBLIC_KEY,
        transaction:{amount:MONTANT_XOF,description:"Analyzer Pro — Accès complet 3 mois",currency:{iso:'XOF'}},
        customer:{email:currentUser?.email||'',firstname:currentUser?.user_metadata?.nom?.split(' ')[0]||''},
        onComplete:async function(tx){
          if(tx.reason===FedaPay.DIALOG_DISMISSED)return;
          await verifierPaiement(tx.id);
        }
      });
    } catch(e){console.warn('FedaPay:',e);}
  } else {
    el('fedapay-btn').onclick=()=>toast('⚠️ Configure ta clé FedaPay dans app.js','error');
  }
}

async function verifierPaiement(transactionId) {
  el('fedapay-btn').textContent='⏳ Activation...'; el('fedapay-btn').disabled=true;
  try {
    const {data:{session}}=await sb.auth.getSession();
    const res=await fetch(`${SUPABASE_URL}/functions/v1/verifier-paiement`,{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},
      body:JSON.stringify({transactionId})
    });
    const data=await res.json();
    if(data.success){toast(t('payActivated'),'success');setTimeout(()=>showDashboard(),1500);}
    else{toast(t('payError'),'error');el('fedapay-btn').textContent=`💳 Payer ${MONTANT_XOF.toLocaleString()} XOF`;el('fedapay-btn').disabled=false;}
  } catch(e){toast(t('payError'),'error');el('fedapay-btn').textContent=`💳 Payer ${MONTANT_XOF.toLocaleString()} XOF`;el('fedapay-btn').disabled=false;}
}

// ====== DASHBOARD ======
function showDashboard() {
  showPage('dashboardPage');
  buildSidebar(); buildHomeModules(); loadProfileData();
  showView('homePage');
  const prof=PROFILES.find(p=>p.id===currentProfileType);
  if(prof&&el('profileBadge'))el('profileBadge').textContent=`${prof.emoji} ${prof.label}`;
}

function buildSidebar() {
  const phases={1:'Phase 1 — Trouver',2:'Phase 2 — Valider',3:'Phase 3 — Stratégie',4:'Phase 4 — Créer',5:'Phase 5 — Cibler',6:'Mon compte'};
  let html='', last=0;
  MODULES_CONFIG.forEach(m=>{
    if(m.phase!==last){html+=`<div class="sidebar-section">${phases[m.phase]}</div>`;last=m.phase;}
    const action=m.isPage?`showView('${m.pageId}')`:`openModule('${m.id}')`;
    const isUsed=!m.isPage&&userFreeModules.includes(m.id);
    html+=`<a href="#" onclick="${action};return false">${m.emoji} ${m.title}${isUsed?' <span style="font-size:.7rem;color:#f59e0b">★</span>':''}</a>`;
  });
  el('sidebarNav').innerHTML=html;
}

function buildHomeModules() {
  const phases=[{num:1,key:'phase1'},{num:2,key:'phase2'},{num:3,key:'phase3'},{num:4,key:'phase4'},{num:5,key:'phase5'},{num:6,key:null}];
  let html='';
  phases.forEach(ph=>{
    const mods=MODULES_CONFIG.filter(m=>m.phase===ph.num);
    if(!mods.length)return;
    html+=`<div class="phase-label">${ph.key?t(ph.key):'Mon compte'}</div><div class="module-grid">`;
    mods.forEach(m=>{
      const action=m.isPage?`showView('${m.pageId}')`:`openModule('${m.id}')`;
      const isUsed=!m.isPage&&userFreeModules.includes(m.id);
      const badge=isUsed
        ?`<div class="module-badge used">★ Essayé</div>`
        :`<div class="module-badge free">Essai gratuit</div>`;
      html+=`<div class="module-card" onclick="${action}">
        <span class="mc-icon">${m.emoji}</span>
        <div class="mc-title">${m.title}</div>
        <div class="mc-desc">${m.desc}</div>
        ${!m.isPage?badge:''}
      </div>`;
    });
    html+='</div>';
  });
  el('homeModules').innerHTML=html;
}

// ====== MODULE ======
function openModule(moduleId) {
  const m=MODULES_CONFIG.find(x=>x.id===moduleId);
  if(!m)return;
  currentModule=m;
  el('moduleTitle').textContent=`${m.emoji} ${m.title}`;
  el('moduleBtn').textContent=m.btnLabel==='generate'?t('generate'):t('analyze');
  el('moduleResult').classList.add('hidden'); el('moduleResult').innerHTML='';

  // Badge essai/abonnement
  const isUsed=userFreeModules.includes(m.id);
  el('moduleBadge').innerHTML=isUsed
    ?`<span style="background:#fef3c7;color:#d97706;padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:600;">★ Essai utilisé — 1 analyse gratuite restante : 0</span>`
    :`<span style="background:#dcfce7;color:#16a34a;padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:600;">✅ 1 analyse gratuite disponible</span>`;

  el('moduleForm').innerHTML=m.fields.map(f=>{
    if(f.type==='select')return`<label>${f.label}</label><select id="${f.id}">${f.opts.map(o=>`<option>${o}</option>`).join('')}</select>`;
    if(f.type==='textarea')return`<label>${f.label}</label><textarea id="${f.id}" placeholder="${f.ph||''}" rows="3"></textarea>`;
    return`<label>${f.label}</label><input type="${f.type}" id="${f.id}" placeholder="${f.ph||''}">`;
  }).join('');

  showView('modulePage');
}

async function runCurrentModule() {
  if(!currentModule)return;
  const m=currentModule;
  if(m.fields[0]&&!gv(m.fields[0].id).trim()){toast(t('fillFields'),'error');return;}

  const result=el('moduleResult');
  result.classList.remove('hidden');
  result.innerHTML=`<div class="loading-state"><span class="spinner">⚙️</span><p>${t('loading')}</p></div>`;

  const donnees={...m.getDonnees(),profil_type:currentProfileType};
  const {data,error,errType}=await callAI(m.id,donnees);

  if(error){
    if(errType==='essai_utilise'){
      result.innerHTML=`<div class="paywall-mini">
        <div style="font-size:2rem;margin-bottom:8px">🔒</div>
        <p style="font-weight:700;margin-bottom:8px">Tu as utilisé ton essai gratuit pour ce module</p>
        <p style="color:rgba(255,255,255,.7);font-size:.9rem;margin-bottom:16px">Active ton accès complet pour continuer à utiliser tous les modules sans limite.</p>
        <button class="btn-pay" onclick="showPaywall()" style="max-width:280px;margin:0 auto;">💳 Activer l'accès — ${MONTANT_XOF.toLocaleString()} XOF</button>
      </div>`;
      return;
    }
    result.innerHTML=`<div class="error-msg">${t('errAI')}</div>`;
    return;
  }

  // Mettre à jour la liste locale des modules utilisés
  if(!userFreeModules.includes(m.id)){
    userFreeModules=[...userFreeModules,m.id];
    buildHomeModules(); buildSidebar();
    el('moduleBadge').innerHTML=`<span style="background:#fef3c7;color:#d97706;padding:4px 12px;border-radius:20px;font-size:.8rem;font-weight:600;">★ Essai utilisé</span>`;
  }

  result.innerHTML=renderResult(m.id,data,donnees);
}

// ====== APPEL IA ======
async function callAI(module,donnees) {
  const {data:{session}}=await sb.auth.getSession();
  if(!session)return{error:true,errType:'not_auth'};
  const res=await fetch(`${SUPABASE_URL}/functions/v1/moteur-ia`,{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},
    body:JSON.stringify({module,donnees})
  });
  const raw=await res.text();
  if(!res.ok){let err={};try{err=JSON.parse(raw);}catch(e){}return{error:true,errType:err.error,message:err.message};}
  try{return{data:JSON.parse(raw)};}
  catch(e){return{error:true,errType:'parse'};}
}

// ====== RENDUS RÉSULTATS ======
const sc=n=>n>=66?'#22c55e':n>=41?'#f59e0b':'#ef4444';
const vBg={'GO':'#dcfce7','NO-GO':'#fee2e2','ATTENDRE':'#fef9c3','LANCER_MAINTENANT':'#dcfce7','BON_MOMENT':'#dbeafe','PASSE':'#fee2e2','PROMETTEUR':'#dcfce7','RISQUÉ':'#fee2e2','À REVOIR':'#fef9c3','OPPORTUNITE_FORTE':'#dcfce7','OPPORTUNITE_MOYENNE':'#dbeafe','DIFFICILE':'#fee2e2'};
const vColor={'GO':'#16a34a','NO-GO':'#dc2626','ATTENDRE':'#ca8a04','LANCER_MAINTENANT':'#16a34a','BON_MOMENT':'#2563eb','PASSE':'#dc2626','PROMETTEUR':'#16a34a','RISQUÉ':'#dc2626','À REVOIR':'#ca8a04','OPPORTUNITE_FORTE':'#16a34a','OPPORTUNITE_MOYENNE':'#2563eb','DIFFICILE':'#dc2626'};
const verdict=v=>v?`<span class="verdict-badge" style="background:${vBg[v]||'#f3f4f6'};color:${vColor[v]||'#374151'}">${v}</span>`:'';
const scoreBlock=(n,label='Score')=>`<div class="score-ring"><div class="score-num" style="color:${sc(n)}">${n}<span style="font-size:.9rem;color:#888">/100</span></div><div class="score-bar"><div class="score-fill" style="width:${n}%;background:${sc(n)}"></div></div><div style="font-size:.8rem;color:#888;margin-top:4px">${label}</div></div>`;
const tags=(...items)=>items.filter(Boolean).map(i=>`<span class="tag">${i}</span>`).join('');
const section=(title,content)=>`<div class="r-section"><div class="r-section-title">${title}</div>${content}</div>`;
const list=arr=>arr?.map(x=>`<div style="padding:3px 0;font-size:.85rem">• ${x}</div>`).join('')||'';
const numlist=arr=>arr?.map((x,i)=>`<div class="plan-step"><div class="step-num">${i+1}</div><div class="step-txt">${x}</div></div>`).join('')||'';
const imgBlock=(kw,alt)=>`<img src="${getImg(kw)}" alt="${alt||''}" style="width:100%;border-radius:10px;margin-bottom:12px;object-fit:cover;height:160px" loading="lazy" onerror="this.style.display='none'">`;

function renderResult(moduleId,d,donnees={}) {
  try {
    const kw=JSON.stringify(donnees);
    switch(moduleId) {
      case 'product_analyzer': return `
        ${imgBlock(kw+' '+d.justification,'Analyse produit')}
        <div style="text-align:center;margin-bottom:14px">
          ${scoreBlock(d.score_viabilite,'Score de viabilité')}
          ${verdict(d.verdict)}
          <p style="color:#555;font-style:italic;font-size:.9rem;margin-top:10px">"${d.justification}"</p>
        </div>
        ${section('💰 Prix suggéré',`<p style="font-weight:700;color:#16a34a;font-size:1.1rem">${d.prix_suggere_xof?.min?.toLocaleString()} – ${d.prix_suggere_xof?.max?.toLocaleString()} XOF</p>`)}
        <div class="swot-grid">
          <div class="swot-cell" style="background:#dcfce7"><div class="swot-cell-title" style="color:#16a34a">💪 Forces</div>${list(d.swot?.forces)}</div>
          <div class="swot-cell" style="background:#fee2e2"><div class="swot-cell-title" style="color:#dc2626">⚠️ Faiblesses</div>${list(d.swot?.faiblesses)}</div>
          <div class="swot-cell" style="background:#dbeafe"><div class="swot-cell-title" style="color:#2563eb">🚀 Opportunités</div>${list(d.swot?.opportunites)}</div>
          <div class="swot-cell" style="background:#fef9c3"><div class="swot-cell-title" style="color:#ca8a04">🛡️ Menaces</div>${list(d.swot?.menaces)}</div>
        </div>
        ${d.exemple_succes?section('🌟 Exemple de succès similaire',`<p style="font-size:.85rem;color:#6c63ff">${d.exemple_succes}</p>`):''}
        ${section('📋 Plan d\'action',numlist(d.plan_action))}`;

      case 'idea_finder': return `
        ${imgBlock(kw,'Idées de produits')}
        <p style="font-weight:700;margin-bottom:12px">💡 ${d.idees?.length||0} idées générées pour toi</p>
        ${d.idees?.map((id,i)=>`
          <div class="idea-card">
            <div style="font-weight:700;margin-bottom:4px">${i+1}. ${id.titre}</div>
            <p style="font-size:.85rem;color:#555;margin-bottom:8px">${id.description}</p>
            ${tags('📦 '+id.format,'👥 '+id.audience,'📈 '+id.potentiel)}
            <p style="font-size:.85rem;font-weight:700;color:#16a34a;margin-top:8px">💰 ${id.prix_xof?.min?.toLocaleString()}–${id.prix_xof?.max?.toLocaleString()} XOF</p>
            ${id.pourquoi_maintenant?`<p style="font-size:.8rem;color:#6c63ff;margin-top:6px">⚡ ${id.pourquoi_maintenant}</p>`:''}
            ${id.exemple_concret?`<p style="font-size:.8rem;color:#888;margin-top:4px;font-style:italic">👤 ${id.exemple_concret}</p>`:''}
          </div>`).join('')}`;

      case 'winning_products': return `
        ${imgBlock(kw,'Produits gagnants')}
        ${section('Tendance globale',`<p style="font-weight:700">${d.tendance_globale==='montante'?'📈 Marché en hausse':d.tendance_globale==='stable'?'→ Marché stable':'📉 Marché en baisse'}</p>`)}
        ${d.produits_gagnants?.map(p=>`
          <div class="idea-card">
            <div style="font-weight:700">${p.titre}</div>
            <p style="font-size:.85rem;color:#555">${p.type}</p>
            <p style="font-size:.85rem;margin:6px 0">${p.pourquoi_ca_marche}</p>
            ${tags('⚔️ '+p.niveau_concurrence,'💰 '+p.prix_moyen_xof?.toLocaleString()+' XOF')}
            <p style="font-size:.8rem;color:#6c63ff;margin-top:8px">💡 ${p.comment_se_differencier}</p>
            ${p.exemple_vendeur?`<p style="font-size:.8rem;color:#888;font-style:italic;margin-top:4px">👤 ${p.exemple_vendeur}</p>`:''}
          </div>`).join('')}
        ${section('🎯 Opportunité clé',`<p style="font-size:.85rem">${d.opportunite_cle}</p>`)}`;

      case 'competitor_spy': return `
        ${imgBlock('competitor spy strategie','Analyse concurrentielle')}
        <div style="text-align:center;margin-bottom:14px">${scoreBlock(d.score_menace,'Score de menace')}</div>
        ${section('💪 Forces',list(d.forces))}
        ${section('⚠️ Faiblesses',list(d.faiblesses))}
        ${section('📣 Stratégie marketing',`<p style="font-size:.85rem">${d.strategie_marketing}</p>`)}
        ${section('📲 Canaux de vente',list(d.canaux_vente))}
        ${section('⚔️ Comment le battre',numlist(d.comment_le_battre))}
        ${d.tactique_immediate?section('⚡ Tactique immédiate (cette semaine)',`<p style="font-size:.85rem;font-weight:700;color:#6c63ff">${d.tactique_immediate}</p>`):''}`;

      case 'trend_predictor': return `
        ${imgBlock(kw+' trend','Tendances du marché')}
        <div style="text-align:center;margin-bottom:14px">
          ${scoreBlock(d.niveau_tendance,'Niveau de tendance')}
          ${verdict(d.verdict)}
          <p style="font-size:.85rem;color:#888;margin-top:8px">${d.maturite} — ${d.direction}</p>
        </div>
        ${d.donnee_cle?section('📊 Donnée clé',`<p style="font-size:.85rem;font-weight:700;color:#2563eb">${d.donnee_cle}</p>`):''}
        ${section('📊 Pourquoi',`<p style="font-size:.85rem">${d.pourquoi}</p>`)}
        ${section('⏰ Pic prévu',`<p style="font-weight:700">${d.pic_prevu}</p>`)}
        ${section('📲 Plateformes actives',list(d.plateformes_actives))}
        ${section('💡 Conseil',`<p style="font-size:.85rem">${d.conseil}</p>`)}`;

      case 'market_validator': return `
        ${imgBlock(kw,'Validation de marché')}
        <div style="text-align:center;margin-bottom:14px">
          ${scoreBlock(d.score_marche,'Score marché')}
          ${verdict(d.verdict)}
        </div>
        <div class="swot-grid">
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Taille</div><p style="font-size:.85rem;font-weight:700">${d.taille_marche}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Demande</div><p style="font-size:.85rem;font-weight:700">${d.demande_estimee}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Saturation</div><p style="font-size:.85rem;font-weight:700">${d.niveau_saturation}%</p></div>
          <div class="swot-cell" style="background:#f0fdf4"><div class="swot-cell-title">Prix optimal</div><p style="font-size:.85rem;font-weight:700;color:#16a34a">${d.prix_optimal_xof?.min?.toLocaleString()}–${d.prix_optimal_xof?.max?.toLocaleString()} XOF</p></div>
        </div>
        ${d.marche_comparable?section('🌍 Marché comparable',`<p style="font-size:.85rem;color:#6c63ff">${d.marche_comparable}</p>`):''}
        ${section('⚠️ Risques',list(d.risques))}
        ${section('🚀 Opportunités',list(d.opportunites))}
        ${section('💬 Recommandation',`<p style="font-size:.85rem">${d.recommandation}</p>`)}`;

      case 'angle_generator': return `
        ${imgBlock(kw,'Angles marketing')}
        <p style="font-weight:700;margin-bottom:12px">🎯 ${d.angles?.length||0} angles générés</p>
        ${d.angles?.map((a,i)=>`
          <div class="angle-card">
            <div style="font-weight:700;margin-bottom:4px">${i+1}. ${a.titre}</div>
            <p style="color:#6c63ff;font-style:italic;font-size:.9rem;margin-bottom:8px">"${a.accroche}"</p>
            <p style="font-size:.85rem;color:#555;margin-bottom:6px">USP: ${a.usp}</p>
            ${tags('👥 '+a.audience_specifique,'📲 '+a.plateforme_ideale,'💰 '+a.prix_suggere_xof?.toLocaleString()+' XOF')}
            ${a.exemple_post?`<div style="background:#f8f7ff;border-radius:8px;padding:10px;margin-top:8px;font-size:.8rem;font-style:italic">"${a.exemple_post}"</div>`:''}
          </div>`).join('')}`;

      case 'monetization_hub': return `
        ${imgBlock('money revenue africa','Sources de revenus')}
        ${section('💰 Potentiel total',`<p style="font-weight:700;color:#16a34a;font-size:1.1rem">${d.revenu_potentiel_total_xof?.min?.toLocaleString()} – ${d.revenu_potentiel_total_xof?.max?.toLocaleString()} XOF/mois</p>`)}
        ${d.sources_revenus?.map((s,i)=>`
          <div class="idea-card">
            <div style="font-weight:700;margin-bottom:4px">${i+1}. ${s.methode}</div>
            <p style="font-size:.85rem;color:#555;margin-bottom:8px">${s.description}</p>
            ${tags('⚡ Effort: '+s.effort,'⏱️ '+s.delai_premier_revenu)}
            <p style="font-size:.85rem;font-weight:700;color:#16a34a;margin-top:8px">💰 ${s.potentiel_mensuel_xof?.min?.toLocaleString()} – ${s.potentiel_mensuel_xof?.max?.toLocaleString()} XOF/mois</p>
            <p style="font-size:.8rem;color:#6c63ff;margin-top:6px">→ ${s.comment_commencer}</p>
            ${s.exemple_africain?`<p style="font-size:.8rem;color:#888;font-style:italic;margin-top:4px">👤 ${s.exemple_africain}</p>`:''}
          </div>`).join('')}
        ${section('🎯 Stratégie recommandée',`<p style="font-size:.85rem">${d.strategie_recommandee}</p>`)}`;

      case 'selling_strategy': return `
        ${imgBlock('marketing strategy launch','Stratégie de lancement')}
        ${section('📋 Résumé',`<p style="font-size:.85rem">${d.resume}</p>`)}
        ${section('🎯 Objectif 30 jours',`<p style="font-weight:700">${d.objectif_30_jours}</p>`)}
        ${d.premier_post?section('📱 Premier post à publier (Jour 1)',`<div style="background:#f0fdf4;border-radius:8px;padding:12px;font-size:.85rem;font-style:italic;border-left:3px solid #22c55e">"${d.premier_post}"</div>`):''}
        ${d.semaines?.map(s=>`
          <div class="week-card">
            <div style="font-weight:700;color:#d97706;margin-bottom:6px">Semaine ${s.numero} — ${s.theme}</div>
            <p style="font-size:.85rem;color:#555;margin-bottom:8px">${s.objectif}</p>
            <div style="font-size:.85rem;font-weight:700;margin-bottom:4px">Actions :</div>${list(s.actions)}
          </div>`).join('')}
        ${section('❌ Erreurs à éviter',list(d.erreurs_a_eviter))}`;

      case 'international_expansion': return `
        ${imgBlock('africa map global','Expansion internationale')}
        <div style="text-align:center;margin-bottom:14px">${verdict(d.verdict)}</div>
        ${section('📊 Analyse',`<p style="font-size:.85rem">${d.analyse}</p>`)}
        ${section('💳 Paiements locaux',list(d.moyens_paiement))}
        ${section('💰 Prix adapté',`<p style="font-weight:700;color:#16a34a">${d.adaptation_prix_xof?.min?.toLocaleString()} – ${d.adaptation_prix_xof?.max?.toLocaleString()} XOF</p>`)}
        ${section('🎭 Différences culturelles',list(d.differences_culturelles))}
        ${d.exemple_reussite?section('🌟 Exemple de réussite',`<p style="font-size:.85rem;color:#6c63ff">${d.exemple_reussite}</p>`):''}
        ${section('📋 Plan d\'entrée',numlist(d.plan_entree))}`;

      case 'product_generator': return `
        ${imgBlock(kw,'Création de produit')}
        ${section('📦 Ton produit',`<div style="font-weight:700;font-size:1rem">${d.titre}</div><p style="font-size:.85rem;color:#555">${d.sous_titre}</p>`)}
        <div class="swot-grid">
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Format</div><p style="font-size:.85rem;font-weight:700">${d.format}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Volume</div><p style="font-size:.85rem;font-weight:700">${d.volume}</p></div>
          <div class="swot-cell" style="background:#f0fdf4"><div class="swot-cell-title">Prix</div><p style="font-size:.85rem;font-weight:700;color:#16a34a">${d.prix_recommande_xof?.toLocaleString()} XOF</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Temps</div><p style="font-size:.85rem;font-weight:700">${d.temps_total}</p></div>
        </div>
        ${d.modules?.map(m=>`
          <div class="week-card">
            <div style="font-weight:700;color:#d97706">Module ${m.numero} — ${m.titre}</div>
            <div style="margin-top:6px">${list(m.contenu_cle)}</div>
            ${m.exercice_pratique?`<p style="font-size:.8rem;color:#6c63ff;margin-top:6px">✏️ ${m.exercice_pratique}</p>`:''}
          </div>`).join('')}
        ${section('📣 Accroche marketing',`<p style="font-weight:700;color:#6c63ff">"${d.accroche}"</p>`)}`;

      case 'image_generator': return `
        ${section('🎨 Style recommandé',`<p style="font-size:.85rem">${d.style_recommande}</p>`)}
        ${d.prompts?.map((p,i)=>`
          <div class="idea-card">
            <div style="font-weight:700;margin-bottom:4px">${p.type} — ${p.plateforme}</div>
            <p style="font-size:.8rem;color:#888;margin-bottom:8px">${p.dimensions}</p>
            <div style="background:#f8f7ff;border-radius:8px;padding:10px;margin-bottom:8px;cursor:pointer" onclick="copyText(this)">
              <p style="font-size:.8rem;font-weight:600;margin-bottom:4px">Prompt (FR) :</p>
              <p style="font-size:.8rem;font-family:monospace;word-break:break-all">${p.prompt_fr}</p>
              <p style="font-size:.75rem;color:#6c63ff;text-align:right;margin-top:6px">📋 Copier</p>
            </div>
            ${p.reference_visuelle?`<p style="font-size:.8rem;color:#888;font-style:italic">📸 ${p.reference_visuelle}</p>`:''}
          </div>`).join('')}
        ${section('🛠️ Outils gratuits',list(d.outils_gratuits))}`;

      case 'prompt_generator': return `
        ${d.prompts?.map((p,i)=>`
          <div class="idea-card">
            <div style="font-weight:700;margin-bottom:4px">${p.type}</div>
            <p style="font-size:.85rem;color:#555;margin-bottom:8px">${p.objectif}</p>
            <div style="background:#f8f7ff;border-radius:8px;padding:12px;margin-bottom:8px;cursor:pointer" onclick="copyText(this)">
              <p style="font-size:.8rem;font-family:monospace;line-height:1.6">${p.prompt}</p>
              <p style="font-size:.75rem;color:#6c63ff;text-align:right;margin-top:6px">📋 Copier</p>
            </div>
            ${p.exemple_resultat?`<div style="background:#f0fdf4;border-radius:8px;padding:10px;font-size:.8rem;font-style:italic;color:#555">"${p.exemple_resultat}"</div>`:''}
          </div>`).join('')}
        ${section('💡 Conseil global',`<p style="font-size:.85rem">${d.conseil_global}</p>`)}`;

      case 'country_targeting': return `
        ${imgBlock(d.pays+' africa market','Ciblage pays')}
        <div class="swot-grid">
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Internet</div><p style="font-size:.85rem;font-weight:700">${d.taux_internet}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Concurrence</div><p style="font-size:.85rem;font-weight:700">${d.niveau_concurrence}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Peak</div><p style="font-size:.85rem;font-weight:700">${d.heure_peak}</p></div>
          <div class="swot-cell" style="background:#f0fdf4"><div class="swot-cell-title">Prix adapté</div><p style="font-size:.85rem;font-weight:700;color:#16a34a">${d.prix_adapte_xof?.min?.toLocaleString()}–${d.prix_adapte_xof?.max?.toLocaleString()} XOF</p></div>
        </div>
        ${d.fait_marche?section('📊 Fait clé',`<p style="font-size:.85rem;font-weight:700;color:#2563eb">${d.fait_marche}</p>`):''}
        ${section('💳 Paiements préférés',list(d.moyens_paiement))}
        ${section('✅ À faire',list(d.do_list))}
        ${section('❌ À éviter',list(d.dont_list))}
        ${section('📋 Plan d\'action',numlist(d.plan_action))}
        ${section('📈 Potentiel mensuel',`<p style="font-weight:700;color:#16a34a">${d.potentiel_mensuel_xof?.min?.toLocaleString()} – ${d.potentiel_mensuel_xof?.max?.toLocaleString()} XOF</p>`)}`;

      case 'honest_feedback': return `
        <div style="text-align:center;margin-bottom:14px">
          ${scoreBlock(d.probabilite_succes,'Probabilité de succès')}
          ${verdict(d.verdict)}
        </div>
        <div class="swot-grid">
          <div class="swot-cell" style="background:#dcfce7"><div class="swot-cell-title" style="color:#16a34a">✅ Points forts</div>${list(d.points_forts)}</div>
          <div class="swot-cell" style="background:#fee2e2"><div class="swot-cell-title" style="color:#dc2626">❌ Points faibles</div>${list(d.points_faibles)}</div>
        </div>
        ${section('💡 Conseil principal',`<p style="font-size:.85rem">${d.conseil_principal}</p>`)}
        ${section('👉 Prochaine étape cette semaine',`<p style="font-size:.85rem;font-weight:700;color:#6c63ff">${d.prochaine_etape}</p>`)}
        ${d.question_a_se_poser?section('🤔 La vraie question à te poser',`<p style="font-size:.85rem;font-style:italic">"${d.question_a_se_poser}"</p>`):''}`;

      default: return `<pre style="font-size:.75rem;word-break:break-all;white-space:pre-wrap">${JSON.stringify(d,null,2)}</pre>`;
    }
  } catch(e) {
    return `<div class="error-msg">Erreur d'affichage. Les données ont bien été générées.</div>`;
  }
}

function copyText(el) {
  const text=el.querySelector('p').textContent;
  navigator.clipboard?.writeText(text).then(()=>toast('✅ Copié !','success'));
}

// ====== PROFIL DATA ======
async function loadProfileData() {
  const {data}=await sb.from('profiles').select('plan,beta_expires_at,profil_type,free_modules_used').eq('id',currentUser.id).single();
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

// ====== SETTINGS ======
async function deleteAccount(){if(confirm(t('deleteConfirm')))toast('Contacte le support pour supprimer ton compte.','info');}

// ====== INIT ======
window.addEventListener('load',async()=>{
  // Écouter les changements d'auth (confirmation email, etc.)
  sb.auth.onAuthStateChange(async(event,session)=>{
    if((event==='SIGNED_IN'||event==='USER_UPDATED')&&session&&!currentUser){
      currentUser=session.user;
      await afterAuth();
    }
  });
  const {data:{session}}=await sb.auth.getSession();
  if(session){currentUser=session.user;await afterAuth();}
  else{showPage('landingPage');}
  setLang('fr');
});
