// ====== CONFIG ======
const SUPABASE_URL = 'https://oznfsajhdxhykzivhumd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2oZY-aRcKRbuz2lMXH6wdA_X38zNOt5';
// ⚠️ Remplace par ta vraie clé publique FedaPay (fedapay.com)
const FEDAPAY_PUBLIC_KEY = 'pk_live_VOTRE_CLE_FEDAPAY_ICI';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let currentUser = null;
let currentLang = 'fr';
let currentProfileType = null;
let currentModule = null;

// ====== TRADUCTIONS ======
const T = {
  fr: {
    subtitle:'17 outils IA pour trouver, valider, créer et vendre tes produits digitaux',
    login:'Connexion', signup:'Créer un compte', signIn:'Se connecter',
    createAcc:'Créer mon compte', toSignup:"Pas encore de compte ? S'inscrire",
    toLogin:'Déjà un compte ? Se connecter', logout:'Se déconnecter',
    emailPh:'Ton email', pwPh:'Ton mot de passe', namePh:'Ton prénom et nom',
    profileSelTitle:'Quel est ton profil ?', profileSelSub:"Ton IA s'adapte à ta réalité",
    continue:'Continuer →', back:'← Retour',
    paywallSub:'Trouve, valide, crée et vends tes produits digitaux en Afrique',
    betaOffer:'🔥 Offre Beta limitée', betaDuration:"3 mois d'accès complet, une seule fois",
    perk1:'17 modules IA actifs', perk2:'Adapté au marché africain (XOF, Mobile Money)',
    perk3:'Mises à jour incluses pendant 3 mois', perk4:'Accès illimité à tous les modules',
    payBtn:'💳 Payer 10 000 XOF — MTN | Moov | Carte', paySecure:'🔒 Paiement sécurisé via FedaPay',
    welcome:'Bienvenue 👋', homeSubtitle:'Que veux-tu faire aujourd\'hui ?',
    profileTitle:'Mon Profil', settingsTitle:'Paramètres',
    statPlan:'Plan', statExpiry:'Expire le', statProfile:'Profil', statAnalyses:'Analyses',
    changeProfile:'Changer de profil', settingsLang:'🌐 Langue',
    settingsDelete:'⚠️ Supprimer mon compte',
    settingsDeleteDesc:'Cette action est irréversible.',
    deleteBtn:'Supprimer mon compte',
    loading:'⏳ Analyse en cours...', generating:'⏳ Génération en cours...',
    fillFields:'Remplis tous les champs requis',
    errAuth:'Connecte-toi pour utiliser cette fonctionnalité',
    errAccess:'Active ton accès Beta pour utiliser cette fonctionnalité.',
    errExpired:'Ta période Beta a expiré. Renouvelle ton abonnement.',
    errAI:"❌ Erreur lors de l'analyse. Réessaie dans quelques secondes.",
    loginErr:'Email ou mot de passe incorrect',
    signupOk:'✅ Compte créé ! Bienvenue sur Analyzer Pro.',
    logoutConfirm:'Veux-tu vraiment te déconnecter ?',
    deleteConfirm:'Es-tu sûr ? Cette action est irréversible.',
    profileSaved:'✅ Profil enregistré !',
    payActivated:'🎉 Accès Beta activé pour 3 mois !',
    payError:'Erreur lors de la vérification du paiement. Contacte le support.',
    selectProfile:'Sélectionne ton profil pour continuer',
    analyze:'Analyser', generate:'Générer',
    // Phases
    phase1:'Phase 1 — Trouver quoi vendre',
    phase2:'Phase 2 — Valider ton idée',
    phase3:'Phase 3 — Construire ta stratégie',
    phase4:'Phase 4 — Créer ton contenu',
    phase5:'Phase 5 — Cibler & s\'auto-évaluer',
  },
  en: {
    subtitle:'17 AI tools to find, validate, create and sell your digital products',
    login:'Login', signup:'Create Account', signIn:'Sign In',
    createAcc:'Create my account', toSignup:"Don't have an account? Sign Up",
    toLogin:'Already have an account? Sign In', logout:'Logout',
    emailPh:'Your email', pwPh:'Your password', namePh:'Your full name',
    profileSelTitle:'What is your profile?', profileSelSub:'Your AI adapts to your reality',
    continue:'Continue →', back:'← Back',
    paywallSub:'Find, validate, create and sell your digital products in Africa',
    betaOffer:'🔥 Limited Beta Offer', betaDuration:'3 months full access, one-time payment',
    perk1:'17 active AI modules', perk2:'Adapted to African market (XOF, Mobile Money)',
    perk3:'Updates included for 3 months', perk4:'Unlimited access to all modules',
    payBtn:'💳 Pay 10,000 XOF — MTN | Moov | Card', paySecure:'🔒 Secure payment via FedaPay',
    welcome:'Welcome 👋', homeSubtitle:'What do you want to do today?',
    profileTitle:'My Profile', settingsTitle:'Settings',
    statPlan:'Plan', statExpiry:'Expires on', statProfile:'Profile', statAnalyses:'Analyses',
    changeProfile:'Change profile', settingsLang:'🌐 Language',
    settingsDelete:'⚠️ Delete my account', settingsDeleteDesc:'This action is irreversible.',
    deleteBtn:'Delete my account',
    loading:'⏳ Analyzing...', generating:'⏳ Generating...',
    fillFields:'Please fill all required fields',
    errAuth:'Please login to use this feature',
    errAccess:'Activate your Beta access to use this feature.',
    errExpired:'Your Beta period has expired. Renew your subscription.',
    errAI:'❌ AI error. Please try again in a few seconds.',
    loginErr:'Wrong email or password',
    signupOk:'✅ Account created! Welcome to Analyzer Pro.',
    logoutConfirm:'Do you really want to logout?',
    deleteConfirm:'Are you sure? This action is irreversible.',
    profileSaved:'✅ Profile saved!',
    payActivated:'🎉 Beta access activated for 3 months!',
    payError:'Payment verification error. Contact support.',
    selectProfile:'Select your profile to continue',
    analyze:'Analyze', generate:'Generate',
    phase1:'Phase 1 — Find what to sell',
    phase2:'Phase 2 — Validate your idea',
    phase3:'Phase 3 — Build your strategy',
    phase4:'Phase 4 — Create your content',
    phase5:'Phase 5 — Target & self-assess',
  }
};
const t = k => T[currentLang][k] || k;

// ====== PROFILS ENTREPRENEURS ======
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

// ====== MODULES (17) ======
const MODULES_CONFIG = [
  // Phase 1
  { id:'idea_finder', emoji:'💡', title:'Idea Finder', desc:'Génère des idées de produits rentables dans ta niche', phase:1,
    fields:[{type:'select',id:'f_cat',label:'Catégorie',opts:['Marketing','E-commerce','Développement personnel','Finance personnelle','Santé & Bien-être','Technologie & IA','Entrepreneuriat','Productivité','Éducation','Créativité & Design','Photographie & Vidéo','Cuisine & Alimentation','Mode & Beauté','Sport & Fitness','Immobilier','Relations & Communication','Développement web','Réseaux sociaux','Dropshipping','Affiliation','Musique & Audio','Gaming','Voyage & Tourisme','Langues','Développement durable','Crypto & Blockchain','Parenting','Animaux','Art & Illustration','Podcast & Radio']},{type:'text',id:'f_niche',label:'Précise ta niche (optionnel)',ph:'Ex: coaching pour femmes entrepreneurs au Sénégal'}],
    getDonnees:()=>({categorie:gv('f_cat'),niche:gv('f_niche')||null}), btnLabel:'generate' },

  { id:'winning_products', emoji:'🏆', title:'Winning Products', desc:'Produits qui marchent déjà dans ta niche', phase:1,
    fields:[{type:'text',id:'f_niche2',label:'Ta niche',ph:'Ex: formation en ligne, dropshipping vêtements...'},{type:'text',id:'f_pays',label:'Pays cible',ph:'Ex: Bénin, Nigeria, Sénégal, Côte d\'Ivoire...'}],
    getDonnees:()=>({niche:gv('f_niche2'),pays:gv('f_pays')}), btnLabel:'generate' },

  // Phase 2
  { id:'product_analyzer', emoji:'📊', title:'Product Analyzer', desc:'Score de viabilité, SWOT et verdict GO/NO-GO', phase:2,
    fields:[{type:'text',id:'f_pnom',label:'Nom de ton produit / service',ph:'Ex: Guide complet du dropshipping au Bénin'},{type:'textarea',id:'f_pdesc',label:'Description (à qui ça sert, quel problème ça résout)',ph:'Ex: Un guide pratique pour...'},{type:'number',id:'f_pprix',label:'Prix envisagé (XOF)',ph:'Ex: 5900'}],
    getDonnees:()=>({nom:gv('f_pnom'),description:gv('f_pdesc'),prix_xof:Number(gv('f_pprix'))||0}), btnLabel:'analyze' },

  { id:'competitor_spy', emoji:'🕵️', title:'Competitor Spy', desc:'Analyse tes concurrents et trouve comment les battre', phase:2,
    fields:[{type:'text',id:'f_cnom',label:'Nom du concurrent',ph:'Ex: Jean Marketing, @vendeur_pro...'},{type:'textarea',id:'f_cinfo',label:'Ce que tu sais de lui',ph:'Ex: Il vend des formations WhatsApp à 15 000 XOF, actif sur TikTok...'},{type:'text',id:'f_creseau',label:'Sur quel réseau est-il ?',ph:'Ex: TikTok, Instagram, Facebook...'}],
    getDonnees:()=>({concurrent:gv('f_cnom'),informations:gv('f_cinfo'),reseau:gv('f_creseau')}), btnLabel:'analyze' },

  { id:'trend_predictor', emoji:'📈', title:'Trend Predictor', desc:'Est-ce que ta niche est en train de monter ?', phase:2,
    fields:[{type:'text',id:'f_tmc',label:'Mot-clé ou niche à analyser',ph:'Ex: formation IA Afrique, dropshipping Bénin...'},{type:'text',id:'f_tpays',label:'Marché cible',ph:'Ex: Afrique de l\'Ouest, Nigeria, Global...'}],
    getDonnees:()=>({sujet:gv('f_tmc'),marche:gv('f_tpays')}), btnLabel:'analyze' },

  { id:'market_validator', emoji:'✅', title:'Market Validator', desc:'Taille du marché, demande réelle, verdict GO/NO-GO', phase:2,
    fields:[{type:'textarea',id:'f_mprod',label:'Ton produit et ton marché cible',ph:'Ex: Formation création de contenu TikTok pour entrepreneurs béninois 18-35 ans...'},{type:'number',id:'f_mprix',label:'Prix envisagé (XOF)',ph:'Ex: 12000'}],
    getDonnees:()=>({produit:gv('f_mprod'),prix_xof:Number(gv('f_mprix'))||0}), btnLabel:'analyze' },

  // Phase 3
  { id:'angle_generator', emoji:'🎯', title:'Angle Generator', desc:'7 façons différentes de présenter ton produit', phase:3,
    fields:[{type:'text',id:'f_aprod',label:'Ton produit',ph:'Ex: Formation création de contenu'},{type:'text',id:'f_aaud',label:'Ton audience principale',ph:'Ex: Jeunes entrepreneurs africains 18-30 ans'},{type:'number',id:'f_aprix',label:'Prix actuel (XOF)',ph:'Ex: 9000'}],
    getDonnees:()=>({produit:gv('f_aprod'),audience:gv('f_aaud'),prix_xof:Number(gv('f_aprix'))||0}), btnLabel:'generate' },

  { id:'monetization_hub', emoji:'💰', title:'Monetization Hub', desc:'6 sources de revenus pour ton activité', phase:3,
    fields:[{type:'textarea',id:'f_monprod',label:'Ton produit, service ou expertise',ph:'Ex: Je crée du contenu sur TikTok, j\'ai 5000 abonnés, niche: business en ligne...'},{type:'text',id:'f_monstade',label:'Ton stade actuel',ph:'Ex: Débutant, 3 mois d\'activité, 0 vente...'}],
    getDonnees:()=>({produit:gv('f_monprod'),stade:gv('f_monstade')}), btnLabel:'generate' },

  { id:'selling_strategy', emoji:'🚀', title:'Selling Strategy', desc:'Plan de lancement sur 28 jours, jour par jour', phase:3,
    fields:[{type:'text',id:'f_sprod',label:'Ton produit',ph:'Ex: Ebook : Comment trouver des clients en dropshipping'},{type:'text',id:'f_saud',label:'Ton audience cible',ph:'Ex: Dropshippers débutants au Bénin et en Côte d\'Ivoire'},{type:'number',id:'f_sprix',label:'Prix (XOF)',ph:'Ex: 4500'},{type:'number',id:'f_sbudget',label:'Budget marketing disponible (XOF)',ph:'Ex: 0 (si pas de budget)'}],
    getDonnees:()=>({produit:gv('f_sprod'),audience:gv('f_saud'),prix_xof:Number(gv('f_sprix'))||0,budget_xof:Number(gv('f_sbudget'))||0}), btnLabel:'generate' },

  { id:'international_expansion', emoji:'🌍', title:'International Expansion', desc:'Adapte ton produit à un autre marché africain ou mondial', phase:3,
    fields:[{type:'text',id:'f_intprod',label:'Ton produit / service',ph:'Ex: Formation marketing digital'},{type:'text',id:'f_intregion',label:'Région ou pays cible',ph:'Ex: Nigeria, Ghana, Europe francophone, Diaspora africaine...'}],
    getDonnees:()=>({produit:gv('f_intprod'),region:gv('f_intregion')}), btnLabel:'analyze' },

  // Phase 4
  { id:'product_generator', emoji:'📝', title:'Product Generator', desc:'Plan complet de ton produit digital à créer', phase:4,
    fields:[{type:'text',id:'f_pgsujet',label:'Sujet de ton produit',ph:'Ex: Comment créer une boutique Shopify rentable'},{type:'text',id:'f_pgaud',label:'Pour qui ?',ph:'Ex: Entrepreneurs béninois débutants en e-commerce'},{type:'select',id:'f_pgformat',label:'Format préféré',opts:['Laisse l\'IA choisir','Ebook (PDF)','Formation vidéo','Template','Guide pratique','Coaching','Webinaire']}],
    getDonnees:()=>({sujet:gv('f_pgsujet'),audience:gv('f_pgaud'),format:gv('f_pgformat')}), btnLabel:'generate' },

  { id:'image_generator', emoji:'🎨', title:'Image Generator', desc:'Prompts IA pour créer tes visuels (couvertures, posts, pubs)', phase:4,
    fields:[{type:'text',id:'f_igprod',label:'Ton produit',ph:'Ex: Ebook dropshipping'},{type:'text',id:'f_igtype',label:'Type de visuel voulu',ph:'Ex: couverture ebook, post Instagram, publicité Facebook...'},{type:'text',id:'f_igstyle',label:'Style ou ambiance souhaitée',ph:'Ex: professionnel, coloré, minimaliste, africain moderne...'}],
    getDonnees:()=>({produit:gv('f_igprod'),type_visuel:gv('f_igtype'),style:gv('f_igstyle')}), btnLabel:'generate' },

  { id:'prompt_generator', emoji:'✍️', title:'Prompt Generator', desc:'Prompts prêts à utiliser pour créer ton contenu avec l\'IA', phase:4,
    fields:[{type:'text',id:'f_prsujet',label:'Ton sujet ou produit',ph:'Ex: Vendre des formations en ligne en Afrique'},{type:'text',id:'f_praud',label:'Ton audience',ph:'Ex: Jeunes entrepreneurs nigérians 18-30 ans'},{type:'select',id:'f_prtype',label:'Type de contenu',opts:['Tous types','Post TikTok','Caption Instagram','Script vidéo YouTube','Email marketing','Article de blog','Post Facebook','Message WhatsApp','Thread Twitter/X']}],
    getDonnees:()=>({sujet:gv('f_prsujet'),audience:gv('f_praud'),type_contenu:gv('f_prtype')}), btnLabel:'generate' },

  // Phase 5
  { id:'country_targeting', emoji:'🗺️', title:'Country Targeting', desc:'Analyse complète d\'un pays cible pour vendre ton produit', phase:5,
    fields:[{type:'text',id:'f_ctprod',label:'Ton produit / service',ph:'Ex: Formation création de contenu TikTok'},{type:'text',id:'f_ctpays',label:'Pays cible',ph:'Ex: Nigeria, Ghana, Cameroun, Sénégal...'}],
    getDonnees:()=>({produit:gv('f_ctprod'),pays:gv('f_ctpays')}), btnLabel:'analyze' },

  { id:'honest_feedback', emoji:'💬', title:'Honest Feedback', desc:'Avis honnête sur ton idée — sans complaisance', phase:5,
    fields:[{type:'textarea',id:'f_hfidee',label:'Décris librement ton idée',ph:'Ex: Je veux créer une formation pour apprendre à vendre sur TikTok Shop. Mon audience cible c\'est les jeunes béninois 18-25 ans. Prix: 8000 XOF. Je compte poster des vidéos gratuites pour attirer des clients...'}],
    getDonnees:()=>({idee:gv('f_hfidee')}), btnLabel:'analyze' },

  // Compte
  { id:'profile_page', emoji:'👤', title:'Mon Profil', desc:'Infos et statistiques de ton compte', phase:6, isPage:true, pageId:'profilePage' },
  { id:'settings_page', emoji:'⚙️', title:'Paramètres', desc:'Langue, préférences et gestion du compte', phase:6, isPage:true, pageId:'settingsPage' },
];

// ====== UTILS ======
const gv = id => (document.getElementById(id)||{}).value || '';
const el = id => document.getElementById(id);

function toast(msg, type='info') {
  el('toast')?.remove();
  const d = document.createElement('div');
  d.id = 'toast';
  d.textContent = msg;
  const bg = type==='error'?'#ef4444':type==='success'?'#22c55e':'#6c63ff';
  d.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:11px 22px;border-radius:24px;font-size:.9rem;font-weight:700;z-index:9999;color:#fff;background:${bg};box-shadow:0 8px 24px rgba(0,0,0,.2);white-space:nowrap;animation:toastIn .3s ease`;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(), 3500);
}

// ====== TRADUCTIONS ======
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang===lang));
  document.querySelectorAll('[data-t]').forEach(e => { if(T[lang][e.dataset.t]) e.textContent=T[lang][e.dataset.t]; });
  document.querySelectorAll('[data-t-ph]').forEach(e => { if(T[lang][e.dataset.tPh]) e.placeholder=T[lang][e.dataset.tPh]; });
  document.documentElement.lang = lang;
}

// ====== AUTH ======
function showAuthForm(type) {
  el('loginForm').classList.toggle('hidden', type!=='login');
  el('signupForm').classList.toggle('hidden', type!=='signup');
}

async function login() {
  const email = el('em1').value.trim(), pw = el('pw1').value;
  if(!email||!pw){toast(t('fillFields'),'error');return;}
  const btn = el('em1').closest('.auth-form-wrap').querySelector('.btn-primary');
  btn.textContent='⏳'; btn.disabled=true;
  const {data,error} = await sb.auth.signInWithPassword({email,password:pw});
  btn.textContent=t('signIn'); btn.disabled=false;
  if(error){toast(t('loginErr'),'error');return;}
  currentUser=data.user;
  await afterAuth();
}

async function signup() {
  const name=el('nm2').value.trim(), email=el('em2').value.trim(), pw=el('pw2').value;
  if(!name||!email||!pw){toast(t('fillFields'),'error');return;}
  const btn = el('nm2').closest('.auth-form-wrap').querySelector('.btn-primary');
  btn.textContent='⏳'; btn.disabled=true;
  const {data,error} = await sb.auth.signUp({email,password:pw,options:{data:{nom:name}}});
  btn.textContent=t('createAcc'); btn.disabled=false;
  if(error){toast('❌ '+error.message,'error');return;}
  if(data.session){currentUser=data.user; toast(t('signupOk'),'success'); await afterAuth();}
  else{toast(t('signupOk'),'success'); showAuthForm('login');}
}

async function afterAuth() {
  const {data:prof} = await sb.from('profiles').select('profil_type,plan,beta_expires_at').eq('id',currentUser.id).single();
  currentProfileType = prof?.profil_type || null;

  if(!currentProfileType) { showProfileSelector(false); return; }

  const hasBeta = prof?.plan==='beta' && prof?.beta_expires_at && new Date(prof.beta_expires_at)>new Date();
  if(!hasBeta){ showPaywall(); return; }

  showDashboard();
}

async function handleLogout() {
  if(!confirm(t('logoutConfirm')))return;
  await sb.auth.signOut();
  currentUser=null; currentProfileType=null;
  showPage('landingPage');
  showAuthForm('login');
}

async function deleteAccount() {
  if(!confirm(t('deleteConfirm')))return;
  await sb.auth.admin?.deleteUser?.(currentUser.id);
  await handleLogout();
}

// ====== PAGES ======
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  el(pageId).classList.add('active');
}

function showView(viewId) {
  document.querySelectorAll('#dashboardPage .view').forEach(v=>v.classList.remove('active'));
  el(viewId).classList.add('active');
  closeSidebar();
  window.scrollTo(0,0);
}

// ====== PROFILE SELECTOR ======
function showProfileSelector(fromDashboard=false) {
  if(fromDashboard) { showPage('profileSelectorPage'); }
  else { showPage('profileSelectorPage'); }

  const grid = el('profileGrid');
  grid.innerHTML = PROFILES.map(p=>`
    <div class="profile-card ${currentProfileType===p.id?'selected':''}" onclick="selectProfileCard('${p.id}',this)">
      <div class="emoji">${p.emoji}</div>
      <div class="label">${p.label}</div>
      <div class="sub">${p.sub}</div>
    </div>
  `).join('');
}

function selectProfileCard(id, el) {
  document.querySelectorAll('.profile-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  currentProfileType = id;
}

async function saveProfile() {
  if(!currentProfileType){toast(t('selectProfile'),'error');return;}
  await sb.from('profiles').update({profil_type:currentProfileType}).eq('id',currentUser.id);
  toast(t('profileSaved'),'success');

  const {data:prof} = await sb.from('profiles').select('plan,beta_expires_at').eq('id',currentUser.id).single();
  const hasBeta = prof?.plan==='beta' && prof?.beta_expires_at && new Date(prof.beta_expires_at)>new Date();
  if(hasBeta){ showDashboard(); } else { showPaywall(); }
}

// ====== PAYWALL ======
function showPaywall() {
  showPage('paywallPage');
  // Preview des modules
  el('modulesPreview').innerHTML = MODULES_CONFIG.slice(0,14).map(m=>`
    <div class="module-prev"><span class="ico">${m.emoji}</span><span class="txt">${m.title}</span></div>
  `).join('');

  // Init FedaPay
  if(typeof FedaPay !== 'undefined' && FEDAPAY_PUBLIC_KEY !== 'pk_live_VOTRE_CLE_FEDAPAY_ICI') {
    try {
      FedaPay.init('#fedapay-btn', {
        public_key: FEDAPAY_PUBLIC_KEY,
        transaction: { amount:10000, description:"Analyzer Pro Beta — 3 mois d'accès complet", currency:{iso:'XOF'} },
        customer: { email:currentUser?.email||'', firstname:currentUser?.user_metadata?.nom||'' },
        onComplete: async function(transaction) {
          if(transaction.reason === FedaPay.DIALOG_DISMISSED) return;
          await verifierPaiement(transaction.id);
        }
      });
    } catch(e) { console.warn('FedaPay init error:', e); }
  } else {
    // Mode test (clé non configurée)
    el('fedapay-btn').onclick = () => toast('⚠️ Configure ta clé FedaPay dans app.js','error');
  }
}

async function verifierPaiement(transactionId) {
  el('fedapay-btn').textContent = '⏳ Activation...';
  el('fedapay-btn').disabled = true;
  try {
    const {data:{session}} = await sb.auth.getSession();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/verifier-paiement`, {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},
      body:JSON.stringify({transactionId})
    });
    const data = await res.json();
    if(data.success){ toast(t('payActivated'),'success'); setTimeout(()=>showDashboard(), 1500); }
    else { toast(t('payError'),'error'); el('fedapay-btn').textContent=t('payBtn'); el('fedapay-btn').disabled=false; }
  } catch(e) { toast(t('payError'),'error'); el('fedapay-btn').textContent=t('payBtn'); el('fedapay-btn').disabled=false; }
}

// ====== DASHBOARD ======
function showDashboard() {
  showPage('dashboardPage');
  buildSidebar();
  buildHomeModules();
  loadProfileData();
  showView('homePage');

  const prof = PROFILES.find(p=>p.id===currentProfileType);
  if(prof) el('profileBadge').textContent = `${prof.emoji} ${prof.label}`;
}

function buildSidebar() {
  const phases = {1:'Phase 1 — Trouver',2:'Phase 2 — Valider',3:'Phase 3 — Stratégie',4:'Phase 4 — Créer',5:'Phase 5 — Cibler',6:'Mon compte'};
  let html = '', lastPhase = 0;
  MODULES_CONFIG.forEach(m => {
    if(m.phase !== lastPhase) { html+=`<div class="sidebar-section">${phases[m.phase]||''}</div>`; lastPhase=m.phase; }
    const action = m.isPage ? `showView('${m.pageId}')` : `openModule('${m.id}')`;
    html += `<a href="#" onclick="${action};return false">${m.emoji} ${m.title}</a>`;
  });
  el('sidebarNav').innerHTML = html;
}

function buildHomeModules() {
  const phases = [
    {num:1,key:'phase1'}, {num:2,key:'phase2'}, {num:3,key:'phase3'},
    {num:4,key:'phase4'}, {num:5,key:'phase5'}, {num:6,key:null}
  ];
  let html = '';
  phases.forEach(ph => {
    const mods = MODULES_CONFIG.filter(m=>m.phase===ph.num);
    if(!mods.length) return;
    if(ph.key) html += `<div class="phase-label">${t(ph.key)}</div>`;
    else html += `<div class="phase-label">Mon compte</div>`;
    html += '<div class="module-grid">';
    mods.forEach(m => {
      const action = m.isPage ? `showView('${m.pageId}')` : `openModule('${m.id}')`;
      html += `<div class="module-card" onclick="${action}">
        <span class="mc-icon">${m.emoji}</span>
        <div class="mc-title">${m.title}</div>
        <div class="mc-desc">${m.desc}</div>
      </div>`;
    });
    html += '</div>';
  });
  el('homeModules').innerHTML = html;
}

// ====== MODULE DYNAMIQUE ======
function openModule(moduleId) {
  const m = MODULES_CONFIG.find(x=>x.id===moduleId);
  if(!m) return;
  currentModule = m;

  el('moduleTitle').textContent = `${m.emoji} ${m.title}`;
  el('moduleBtn').textContent = m.btnLabel==='generate' ? t('generate') : t('analyze');
  el('moduleResult').classList.add('hidden');
  el('moduleResult').innerHTML = '';

  // Générer le formulaire
  el('moduleForm').innerHTML = m.fields.map(f => {
    if(f.type==='select') return `<label>${f.label}</label><select id="${f.id}">${f.opts.map(o=>`<option>${o}</option>`).join('')}</select>`;
    if(f.type==='textarea') return `<label>${f.label}</label><textarea id="${f.id}" placeholder="${f.ph||''}" rows="3"></textarea>`;
    return `<label>${f.label}</label><input type="${f.type}" id="${f.id}" placeholder="${f.ph||''}">`;
  }).join('');

  showView('modulePage');
}

async function runCurrentModule() {
  if(!currentModule) return;
  const m = currentModule;

  // Vérifier les champs requis
  const firstRequired = m.fields[0];
  if(firstRequired && !gv(firstRequired.id).trim()) { toast(t('fillFields'),'error'); return; }

  const result = el('moduleResult');
  result.classList.remove('hidden');
  result.innerHTML = `<div class="loading-state"><span class="spinner">⏳</span>${t('loading')}</div>`;

  const donnees = { ...m.getDonnees(), profil_type:currentProfileType };
  const {data,error,errType} = await callAI(m.id, donnees);

  if(error) {
    if(errType==='acces_requis'||errType==='beta_expire') { result.innerHTML=''; showPaywall(); return; }
    result.innerHTML = `<div class="error-msg">${t('errAI')}</div>`;
    return;
  }

  result.innerHTML = renderResult(m.id, data);
}

// ====== APPEL IA ======
async function callAI(module, donnees) {
  const {data:{session}} = await sb.auth.getSession();
  if(!session) return {error:true, errType:'not_auth'};

  const res = await fetch(`${SUPABASE_URL}/functions/v1/moteur-ia`, {
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},
    body:JSON.stringify({module, donnees})
  });
  const raw = await res.text();
  if(!res.ok) {
    let err={};try{err=JSON.parse(raw);}catch(e){}
    return {error:true, errType:err.error, message:err.message};
  }
  try { return {data:JSON.parse(raw)}; }
  catch(e) { return {error:true, errType:'parse'}; }
}

// ====== RENDUS DES RÉSULTATS ======
const sc = n => n>=66?'#22c55e':n>=41?'#f59e0b':'#ef4444';
const vBg = {'GO':'#dcfce7','NO-GO':'#fee2e2','ATTENDRE':'#fef9c3','LANCER_MAINTENANT':'#dcfce7','BON_MOMENT':'#dbeafe','PASSE':'#fee2e2','PROMETTEUR':'#dcfce7','RISQUÉ':'#fee2e2','À REVOIR':'#fef9c3','OPPORTUNITE_FORTE':'#dcfce7','OPPORTUNITE_MOYENNE':'#dbeafe','DIFFICILE':'#fee2e2'};
const vColor = {'GO':'#16a34a','NO-GO':'#dc2626','ATTENDRE':'#ca8a04','LANCER_MAINTENANT':'#16a34a','BON_MOMENT':'#2563eb','PASSE':'#dc2626','PROMETTEUR':'#16a34a','RISQUÉ':'#dc2626','À REVOIR':'#ca8a04','OPPORTUNITE_FORTE':'#16a34a','OPPORTUNITE_MOYENNE':'#2563eb','DIFFICILE':'#dc2626'};
const verdict = v => v ? `<span class="verdict-badge" style="background:${vBg[v]||'#f3f4f6'};color:${vColor[v]||'#374151'}">${v}</span>` : '';
const scoreBlock = (n,label='Score') => `<div class="score-ring"><div class="score-num" style="color:${sc(n)}">${n}<span style="font-size:.9rem;color:#888">/100</span></div><div class="score-bar"><div class="score-fill" style="width:${n}%;background:${sc(n)}"></div></div><div class="text-muted text-sm">${label}</div></div>`;
const tags = (...items) => items.filter(Boolean).map(i=>`<span class="tag" style="background:${sc(80)}22;color:${sc(80)}">${i}</span>`).join('');
const section = (title,content) => `<div class="r-section"><div class="r-section-title">${title}</div>${content}</div>`;
const list = arr => arr?.map(x=>`<div style="padding:3px 0;font-size:.85rem">• ${x}</div>`).join('')||'';
const numlist = arr => arr?.map((x,i)=>`<div class="plan-step"><div class="step-num">${i+1}</div><div class="step-txt">${x}</div></div>`).join('')||'';

function renderResult(moduleId, d) {
  try {
    switch(moduleId) {

      case 'product_analyzer': return `
        <div class="text-center" style="margin-bottom:14px">
          ${scoreBlock(d.score_viabilite,'Score de viabilité')}
          ${verdict(d.verdict)}
          <p style="color:#555;font-style:italic;font-size:.9rem;margin-top:10px">"${d.justification}"</p>
        </div>
        ${section('💰 Prix suggéré',`<p class="fw-700" style="color:#16a34a;font-size:1.1rem">${d.prix_suggere_xof?.min?.toLocaleString()} – ${d.prix_suggere_xof?.max?.toLocaleString()} XOF</p>`)}
        <div class="swot-grid">
          <div class="swot-cell" style="background:#dcfce7"><div class="swot-cell-title" style="color:#16a34a">💪 Forces</div>${list(d.swot?.forces)}</div>
          <div class="swot-cell" style="background:#fee2e2"><div class="swot-cell-title" style="color:#dc2626">⚠️ Faiblesses</div>${list(d.swot?.faiblesses)}</div>
          <div class="swot-cell" style="background:#dbeafe"><div class="swot-cell-title" style="color:#2563eb">🚀 Opportunités</div>${list(d.swot?.opportunites)}</div>
          <div class="swot-cell" style="background:#fef9c3"><div class="swot-cell-title" style="color:#ca8a04">🛡️ Menaces</div>${list(d.swot?.menaces)}</div>
        </div>
        ${section('📋 Plan d\'action',numlist(d.plan_action))}`;

      case 'idea_finder': return `
        <p class="fw-700" style="margin-bottom:12px">💡 ${d.idees?.length||0} idées générées</p>
        ${d.idees?.map((id,i)=>`
          <div class="idea-card">
            <div class="fw-700" style="margin-bottom:4px">${i+1}. ${id.titre}</div>
            <p class="text-sm text-muted" style="margin-bottom:8px">${id.description}</p>
            <div>${tags('📦 '+id.format,'👥 '+id.audience,'📈 '+id.potentiel)}<span class="tag" style="background:#fff7ed;color:#ea580c">💰 ${id.prix_xof?.min?.toLocaleString()}–${id.prix_xof?.max?.toLocaleString()} XOF</span></div>
            ${id.pourquoi_maintenant?`<p class="text-sm" style="margin-top:8px;color:#6c63ff">⚡ ${id.pourquoi_maintenant}</p>`:''}
          </div>`).join('')}`;

      case 'winning_products': return `
        <div class="r-section"><div class="r-section-title">Tendance : ${d.tendance_globale} ${d.tendance_globale==='montante'?'📈':d.tendance_globale==='stable'?'→':'📉'}</div></div>
        ${d.produits_gagnants?.map(p=>`
          <div class="idea-card">
            <div class="fw-700">${p.titre}</div>
            <p class="text-sm text-muted">${p.type}</p>
            <p class="text-sm" style="margin:6px 0">${p.pourquoi_ca_marche}</p>
            ${tags('🏆 '+p.niveau_concurrence,'💰 '+p.prix_moyen_xof?.toLocaleString()+' XOF')}
            <p class="text-sm" style="color:#6c63ff;margin-top:8px">💡 ${p.comment_se_differencier}</p>
          </div>`).join('')}
        ${section('🎯 Opportunité clé',`<p class="text-sm">${d.opportunite_cle}</p>`)}
        ${section('💬 Conseil',`<p class="text-sm">${d.conseil}</p>`)}`;

      case 'competitor_spy': return `
        <div style="text-align:center;margin-bottom:14px">
          ${scoreBlock(d.score_menace,'Score de menace')}
        </div>
        ${section('💪 Forces',list(d.forces))}
        ${section('⚠️ Faiblesses',list(d.faiblesses))}
        ${section('📣 Stratégie marketing',`<p class="text-sm">${d.strategie_marketing}</p>`)}
        ${section('👥 Audience cible',`<p class="text-sm">${d.audience_cible}</p>`)}
        ${section('📲 Canaux de vente',list(d.canaux_vente))}
        ${section('⚔️ Comment le battre',numlist(d.comment_le_battre))}
        ${section('🎯 Niches non exploitées',list(d.niches_non_explorees))}`;

      case 'trend_predictor': return `
        <div style="text-align:center;margin-bottom:14px">
          ${scoreBlock(d.niveau_tendance,'Niveau de tendance')}
          ${verdict(d.verdict)}
          <p class="text-sm text-muted" style="margin-top:8px">${d.maturite} — ${d.direction}</p>
        </div>
        ${section('📊 Pourquoi',`<p class="text-sm">${d.pourquoi}</p>`)}
        ${section('⏰ Pic prévu',`<p class="text-sm fw-700">${d.pic_prevu}</p>`)}
        ${section('📲 Plateformes actives',list(d.plateformes_actives))}
        ${section('🔑 Mots-clés connexes',d.mots_cles_connexes?.map(k=>`<span class="tag" style="background:#ede9fe;color:#6c63ff">${k}</span>`).join('')||'')}
        ${section('💡 Conseil',`<p class="text-sm">${d.conseil}</p>`)}`;

      case 'market_validator': return `
        <div style="text-align:center;margin-bottom:14px">
          ${scoreBlock(d.score_marche,'Score marché')}
          ${verdict(d.verdict)}
        </div>
        <div class="swot-grid">
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Taille</div><p class="text-sm fw-700">${d.taille_marche}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Demande</div><p class="text-sm fw-700">${d.demande_estimee}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Saturation</div><p class="text-sm fw-700">${d.niveau_saturation}%</p></div>
          <div class="swot-cell" style="background:#f0fdf4"><div class="swot-cell-title">Prix optimal</div><p class="text-sm fw-700" style="color:#16a34a">${d.prix_optimal_xof?.min?.toLocaleString()}–${d.prix_optimal_xof?.max?.toLocaleString()} XOF</p></div>
        </div>
        ${section('🎯 Profil acheteur',`<p class="text-sm">${d.profil_acheteur}</p>`)}
        ${section('⚠️ Risques',list(d.risques))}
        ${section('🚀 Opportunités',list(d.opportunites))}
        ${section('💬 Recommandation',`<p class="text-sm">${d.recommandation}</p>`)}`;

      case 'angle_generator': return `
        <p class="fw-700" style="margin-bottom:12px">🎯 ${d.angles?.length||0} angles générés</p>
        ${d.angles?.map((a,i)=>`
          <div class="angle-card">
            <div class="fw-700" style="margin-bottom:4px">${i+1}. ${a.titre}</div>
            <p class="text-sm" style="color:#6c63ff;font-style:italic;margin-bottom:8px">"${a.accroche}"</p>
            <p class="text-sm text-muted" style="margin-bottom:6px">USP: ${a.usp}</p>
            ${tags('👥 '+a.audience_specifique,'📲 '+a.plateforme_ideale,'💰 '+a.prix_suggere_xof?.toLocaleString()+' XOF')}
            <p class="text-sm" style="margin-top:6px;color:#888">Format: ${a.format_contenu}</p>
          </div>`).join('')}`;

      case 'monetization_hub': return `
        ${section('💰 Potentiel total',`<p class="fw-700" style="color:#16a34a;font-size:1.1rem">${d.revenu_potentiel_total_xof?.min?.toLocaleString()} – ${d.revenu_potentiel_total_xof?.max?.toLocaleString()} XOF/mois</p>`)}
        ${d.sources_revenus?.map((s,i)=>`
          <div class="idea-card">
            <div class="fw-700" style="margin-bottom:4px">${i+1}. ${s.methode}</div>
            <p class="text-sm text-muted" style="margin-bottom:8px">${s.description}</p>
            ${tags('⚡ '+s.effort,'⏱️ '+s.delai_premier_revenu)}
            <p class="text-sm fw-700" style="color:#16a34a;margin-top:8px">💰 ${s.potentiel_mensuel_xof?.min?.toLocaleString()} – ${s.potentiel_mensuel_xof?.max?.toLocaleString()} XOF/mois</p>
            <p class="text-sm" style="color:#6c63ff;margin-top:6px">→ ${s.comment_commencer}</p>
          </div>`).join('')}
        ${section('🎯 Stratégie recommandée',`<p class="text-sm">${d.strategie_recommandee}</p>`)}`;

      case 'selling_strategy': return `
        ${section('📋 Résumé stratégie',`<p class="text-sm">${d.resume}</p>`)}
        ${section('🎯 Objectif 30 jours',`<p class="text-sm fw-700">${d.objectif_30_jours}</p>`)}
        ${d.semaines?.map(s=>`
          <div class="week-card">
            <div class="fw-700" style="color:#d97706;margin-bottom:6px">Semaine ${s.numero} — ${s.theme}</div>
            <p class="text-sm text-muted" style="margin-bottom:8px">${s.objectif}</p>
            <div class="text-sm fw-700" style="margin-bottom:4px">Actions :</div>${list(s.actions)}
            <div class="text-sm fw-700" style="margin:8px 0 4px">Contenu à créer :</div>${list(s.contenu_a_creer)}
          </div>`).join('')}
        ${section('📲 Plateformes prioritaires',d.plateformes_prioritaires?.map(p=>`<span class="tag" style="background:#ede9fe;color:#6c63ff">${p}</span>`).join('')||'')}
        ${section('💬 Message clé',`<p class="text-sm fw-700">"${d.message_cle}"</p>`)}
        ${section('❌ Erreurs à éviter',list(d.erreurs_a_eviter))}`;

      case 'international_expansion': return `
        <div style="text-align:center;margin-bottom:14px">${verdict(d.verdict)}</div>
        ${section('📊 Analyse marché',`<p class="text-sm">${d.analyse}</p>`)}
        ${section('💳 Moyens de paiement locaux',list(d.moyens_paiement))}
        ${section('📲 Réseaux sociaux dominants',list(d.reseaux_sociaux))}
        ${section('💰 Prix adapté',`<p class="fw-700" style="color:#16a34a">${d.adaptation_prix_xof?.min?.toLocaleString()} – ${d.adaptation_prix_xof?.max?.toLocaleString()} XOF</p>`)}
        ${section('🎭 Différences culturelles',list(d.differences_culturelles))}
        ${section('⚠️ Obstacles',list(d.obstacles))}
        ${section('🚀 Opportunités',list(d.opportunites))}
        ${section('📈 Projections revenus',`<p class="fw-700" style="color:#16a34a">${d.projections_xof?.mensuel_min?.toLocaleString()} – ${d.projections_xof?.mensuel_max?.toLocaleString()} XOF/mois</p>`)}
        ${section('📋 Plan d\'entrée',numlist(d.plan_entree))}`;

      case 'product_generator': return `
        ${section('📦 Produit',`<div class="fw-700" style="font-size:1.1rem">${d.titre}</div><p class="text-sm text-muted">${d.sous_titre}</p>`)}
        <div class="swot-grid">
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Format</div><p class="text-sm fw-700">${d.format}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Volume</div><p class="text-sm fw-700">${d.volume}</p></div>
          <div class="swot-cell" style="background:#f0fdf4"><div class="swot-cell-title">Prix</div><p class="text-sm fw-700" style="color:#16a34a">${d.prix_recommande_xof?.toLocaleString()} XOF</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Temps</div><p class="text-sm fw-700">${d.temps_total}</p></div>
        </div>
        ${d.modules?.map(m=>`
          <div class="week-card">
            <div class="fw-700" style="color:#d97706">Module ${m.numero} — ${m.titre}</div>
            <div style="margin-top:6px">${list(m.contenu_cle)}</div>
            <p class="text-sm text-muted" style="margin-top:6px">⏱️ ${m.duree_creation}</p>
          </div>`).join('')}
        ${section('🎁 Bonus suggérés',list(d.bonus))}
        ${section('📣 Accroche marketing',`<p class="text-sm fw-700" style="color:#6c63ff">"${d.accroche}"</p>`)}`;

      case 'image_generator': return `
        ${section('🎨 Style recommandé',`<p class="text-sm">${d.style_recommande}</p>`)}
        ${section('🌈 Palette',d.palette_couleurs?.map(c=>`<span class="tag" style="background:#f3f4f6">${c}</span>`).join('')||'')}
        ${d.prompts?.map((p,i)=>`
          <div class="idea-card">
            <div class="fw-700" style="margin-bottom:4px">${p.type} — ${p.plateforme}</div>
            <p class="text-sm text-muted" style="margin-bottom:6px">${p.dimensions}</p>
            <div style="background:#f8f7ff;border-radius:8px;padding:10px;margin-bottom:8px">
              <p class="text-sm fw-700" style="margin-bottom:4px">EN:</p>
              <p class="text-sm" style="font-family:monospace;word-break:break-all">${p.prompt_en}</p>
            </div>
            <div style="background:#f0fdf4;border-radius:8px;padding:10px;margin-bottom:8px">
              <p class="text-sm fw-700" style="margin-bottom:4px">FR:</p>
              <p class="text-sm" style="font-family:monospace;word-break:break-all">${p.prompt_fr}</p>
            </div>
            <p class="text-sm" style="color:#6c63ff">💡 ${p.conseil}</p>
          </div>`).join('')}
        ${section('🛠️ Outils gratuits',list(d.outils_gratuits))}`;

      case 'prompt_generator': return `
        ${d.prompts?.map((p,i)=>`
          <div class="idea-card">
            <div class="fw-700" style="margin-bottom:4px">${p.type}</div>
            <p class="text-sm text-muted" style="margin-bottom:8px">${p.objectif}</p>
            <div style="background:#f8f7ff;border-radius:8px;padding:12px;margin-bottom:8px;cursor:pointer" onclick="copyText(this)" title="Cliquer pour copier">
              <p class="text-sm" style="font-family:monospace;line-height:1.6">${p.prompt}</p>
              <p class="text-sm" style="color:#6c63ff;margin-top:6px;text-align:right">📋 Copier</p>
            </div>
            <p class="text-sm" style="color:#888">💡 ${p.conseil}</p>
          </div>`).join('')}
        ${section('💡 Conseil global',`<p class="text-sm">${d.conseil_global}</p>`)}`;

      case 'country_targeting': return `
        <div class="swot-grid">
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Internet</div><p class="text-sm fw-700">${d.taux_internet}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Concurrence</div><p class="text-sm fw-700">${d.niveau_concurrence}</p></div>
          <div class="swot-cell" style="background:#f8f7ff"><div class="swot-cell-title">Pic activité</div><p class="text-sm fw-700">${d.heure_peak}</p></div>
          <div class="swot-cell" style="background:#f0fdf4"><div class="swot-cell-title">Prix adapté</div><p class="text-sm fw-700" style="color:#16a34a">${d.prix_adapte_xof?.min?.toLocaleString()}–${d.prix_adapte_xof?.max?.toLocaleString()} XOF</p></div>
        </div>
        ${section('💳 Paiements préférés',list(d.moyens_paiement))}
        ${section('📲 Réseaux sociaux',list(d.reseaux_sociaux))}
        ${section('🎯 Stratégie locale',`<p class="text-sm">${d.strategie_locale}</p>`)}
        ${section('✅ À faire',list(d.do_list))}
        ${section('❌ À éviter',list(d.dont_list))}
        ${section('📋 Plan d\'action',numlist(d.plan_action))}
        ${section('📈 Potentiel mensuel',`<p class="fw-700" style="color:#16a34a">${d.potentiel_mensuel_xof?.min?.toLocaleString()} – ${d.potentiel_mensuel_xof?.max?.toLocaleString()} XOF</p>`)}`;

      case 'honest_feedback': return `
        <div style="text-align:center;margin-bottom:14px">
          ${scoreBlock(d.probabilite_succes,'Probabilité de succès')}
          ${verdict(d.verdict)}
        </div>
        <div class="swot-grid">
          <div class="swot-cell" style="background:#dcfce7"><div class="swot-cell-title" style="color:#16a34a">✅ Points forts</div>${list(d.points_forts)}</div>
          <div class="swot-cell" style="background:#fee2e2"><div class="swot-cell-title" style="color:#dc2626">❌ Points faibles</div>${list(d.points_faibles)}</div>
        </div>
        ${section('💡 Conseil principal',`<p class="text-sm">${d.conseil_principal}</p>`)}
        ${section('👉 Prochaine étape cette semaine',`<p class="text-sm fw-700" style="color:#6c63ff">${d.prochaine_etape}</p>`)}`;

      default: return `<pre style="font-size:.75rem;word-break:break-all;white-space:pre-wrap">${JSON.stringify(d,null,2)}</pre>`;
    }
  } catch(e) {
    return `<div class="error-msg">Erreur d'affichage. Les données ont bien été générées.</div><pre style="font-size:.7rem;word-break:break-all;white-space:pre-wrap">${JSON.stringify(d,null,2)}</pre>`;
  }
}

function copyText(el) {
  const text = el.querySelector('p').textContent;
  navigator.clipboard?.writeText(text).then(()=>toast('✅ Copié !','success'));
}

// ====== PROFIL DATA ======
async function loadProfileData() {
  const {data} = await sb.from('profiles').select('plan,beta_expires_at,profil_type').eq('id',currentUser.id).single();
  const {data:hist} = await sb.from('historique').select('id',{count:'exact'}).eq('user_id',currentUser.id);

  const nom = currentUser.user_metadata?.nom || currentUser.email.split('@')[0];
  el('profileName').textContent = nom;
  el('profileEmail').textContent = currentUser.email;
  el('statPlan').textContent = (data?.plan||'free').toUpperCase();
  el('statAnalyses').textContent = hist?.length || 0;

  if(data?.beta_expires_at) {
    const d = new Date(data.beta_expires_at);
    el('statExpiry').textContent = d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'});
  }

  const prof = PROFILES.find(p=>p.id===data?.profil_type);
  el('statProfile').textContent = prof ? `${prof.emoji} ${prof.label}` : '—';
}

// ====== SIDEBAR ======
function openSidebar() {
  el('sidebar').classList.add('open');
  el('sidebarOverlay').classList.add('show');
}
function closeSidebar() {
  el('sidebar').classList.remove('open');
  el('sidebarOverlay').classList.remove('show');
}

// ====== INIT ======
window.addEventListener('load', async () => {
  const {data:{session}} = await sb.auth.getSession();
  if(session) {
    currentUser = session.user;
    await afterAuth();
  } else {
    showPage('landingPage');
  }
  setLang('fr');
});
