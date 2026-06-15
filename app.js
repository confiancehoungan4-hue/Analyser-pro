// ====== CONFIGURATION SUPABASE ======
// Remplace ces 2 valeurs par celles de TON projet :
// Tableau de bord Supabase > Project Settings > API
const SUPABASE_URL = https: 'https://oznfsajhdxhykzivhumd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2oZY-aRcKRbuz2lMXH6wdA_X38zNOt5';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// GLOBAL
let currentUser = null;
let currentLanguage = 'en';

console.log('✅ APP LOADED');

// LANGUAGE
function setLanguage(lang) {
    currentLanguage = lang;
    console.log('🌐 Language:', lang);
}

// AUTH - LOGIN
function goToLogin() {
    console.log('📝 Go to Login');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
}

// AUTH - SIGNUP
function goToSignup() {
    console.log('📝 Go to Signup');
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

// Affiche le tableau de bord et remplit le profil avec les infos de l'utilisateur connecté
function showDashboard() {
    document.getElementById('authPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');

    const nom = currentUser.user_metadata?.nom || currentUser.email.split('@')[0];
    document.getElementById('profileName').textContent = nom;
    document.getElementById('profileEmail').textContent = currentUser.email;
}

// LOGIN
async function login() {
    console.log('🔑 Login');
    const email = document.getElementById('email1').value;
    const password = document.getElementById('password1').value;

    if (!email || !password) {
        alert('Fill fields!');
        return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        console.error('❌ Login error:', error);
        alert('❌ ' + error.message);
        return;
    }

    currentUser = data.user;
    console.log('✅ Logged in:', currentUser);
    showDashboard();
}

// SIGNUP
async function signup() {
    console.log('🔑 Signup');
    const name = document.getElementById('name2').value;
    const email = document.getElementById('email2').value;
    const password = document.getElementById('password2').value;

    if (!name || !email || !password) {
        alert('Fill fields!');
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { nom: name } }
    });

    if (error) {
        console.error('❌ Signup error:', error);
        alert('❌ ' + error.message);
        return;
    }

    console.log('✅ Signed up:', data.user);

    if (data.session) {
        // Connexion immédiate (confirmation email désactivée dans Supabase)
        currentUser = data.user;
        showDashboard();
    } else {
        // Confirmation email activée : on informe l'utilisateur et on revient au login
        alert('✅ Compte créé ! Vérifie ton email pour confirmer ton inscription.');
        goToLogin();
    }
}

// LOGOUT
async function handleLogout() {
    if (confirm('Logout?')) {
        await supabaseClient.auth.signOut();
        currentUser = null;

        document.getElementById('authPage').classList.add('active');
        document.getElementById('dashboardPage').classList.remove('active');
        document.getElementById('email1').value = '';
        document.getElementById('password1').value = '';

        console.log('🚪 Logged out');
    }
}

// PAGES
function showPage(pageId) {
    console.log('📄 Show:', pageId);

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    closeSidebar();
}

// SIDEBAR
function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
}

// FUNCTIONS

// 💡 Idea Finder — sera connecté au moteur IA à l'étape suivante
async function generateIdeas() {
    console.log('💡 Generate ideas');
    const category = document.getElementById('ideaCategory').value;

    const result = document.getElementById('ideaResult');
    result.classList.remove('hidden');
    result.innerHTML = '<p>✅ Generated 5 ideas for ' + category + ':</p><pre>1. AI Course\n2. Email Templates\n3. SEO Guide\n4. Social Media Pack\n5. Coaching Program</pre>';
}

// 📊 Product Analyzer — connecté au moteur IA (Edge Function "moteur-ia")
async function analyzeProduct() {
    console.log('📊 Analyze');
    const name = document.getElementById('productName').value;
    const desc = document.getElementById('productDesc').value;
    const price = document.getElementById('productPrice').value;

    if (!name || !price) {
        alert('Fill fields!');
        return;
    }

    const result = document.getElementById('analyzerResult');
    result.classList.remove('hidden');
    result.innerHTML = '<p>⏳ Analyse en cours...</p>';

    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) {
            result.innerHTML = '<p>❌ Connecte-toi pour utiliser l\'analyseur.</p>';
            return;
        }

        const response = await fetch(`${SUPABASE_URL}/functions/v1/moteur-ia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                module: 'product_analyzer',
                donnees: { nom: name, description: desc, prix_xof: Number(price) }
            })
        });

        const raw = await response.text();

        if (!response.ok) {
            const err = JSON.parse(raw);
            result.innerHTML = `<p>❌ ${err.message || err.error}</p>`;
            return;
        }

        const a = JSON.parse(raw);

        result.innerHTML = `
            <p><strong>${name}</strong> — ${price} XOF</p>
            <p>📊 Score de viabilité : <strong>${a.score_viabilite}/100</strong></p>
            <p>💰 Prix suggéré : ${a.prix_suggere_xof.min} – ${a.prix_suggere_xof.max} XOF</p>
            <p>✅ Verdict : <strong>${a.verdict}</strong></p>
            <p>${a.justification}</p>
            <p><strong>Forces</strong></p>
            <ul>${a.swot.forces.map(x => `<li>${x}</li>`).join('')}</ul>
            <p><strong>Faiblesses</strong></p>
            <ul>${a.swot.faiblesses.map(x => `<li>${x}</li>`).join('')}</ul>
            <p><strong>Opportunités</strong></p>
            <ul>${a.swot.opportunites.map(x => `<li>${x}</li>`).join('')}</ul>
            <p><strong>Menaces</strong></p>
            <ul>${a.swot.menaces.map(x => `<li>${x}</li>`).join('')}</ul>
            <p><strong>Plan d'action</strong></p>
            <ol>${a.plan_action.map(x => `<li>${x}</li>`).join('')}</ol>
        `;
    } catch (error) {
        console.error('❌ Analyze error:', error);
        result.innerHTML = '<p>❌ Erreur lors de l\'analyse. Réessaie.</p>';
    }
}

// 💬 Honest Feedback — sera connecté au moteur IA à l'étape suivante
async function getFeedback() {
    console.log('💬 Feedback');
    const text = document.getElementById('feedbackText').value;

    if (!text) {
        alert('Describe your idea!');
        return;
    }

    const result = document.getElementById('feedbackResult');
    result.classList.remove('hidden');
    result.innerHTML = '<p><strong>Honest Feedback:</strong></p><pre>Strengths:\n✅ Clear target market\n✅ Viable pricing\n\nWeaknesses:\n❌ Competition exists\n\nVerdict: GO (75% chance)</pre>';
}

// INIT — restaure la session Supabase au chargement (si l'utilisateur est déjà connecté)
window.addEventListener('load', async function() {
    console.log('✅ Window loaded');

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        currentUser = session.user;
        showDashboard();
        console.log('✅ Session restored:', currentUser);
    }
});
