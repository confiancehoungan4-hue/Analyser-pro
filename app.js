// ==================== LANGUAGE SYSTEM ====================

let currentLanguage = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateLanguage();
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const buttons = document.querySelectorAll('.lang-btn');
    if (lang === 'en' && buttons[0]) buttons[0].classList.add('active');
    if (lang === 'fr' && buttons[1]) buttons[1].classList.add('active');
}

function t(en, fr) {
    return currentLanguage === 'fr' ? fr : en;
}

function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            const placeholderFr = el.getAttribute('data-placeholder-fr');
            const placeholderEn = el.getAttribute('data-placeholder-en');
            el.placeholder = currentLanguage === 'fr' ? (placeholderFr || placeholderEn) : (placeholderEn || placeholderFr);
        } else {
            const textFr = el.getAttribute('data-fr');
            const textEn = el.getAttribute('data-en');
            if (textFr && textEn) {
                el.textContent = currentLanguage === 'fr' ? textFr : textEn;
            }
        }
    });
}

// ==================== GLOBAL VARIABLES ====================

let currentUser = null;
let authToken = null;
let analysisCount = 0;
let ideasGeneratedCount = 0;

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ APP STARTED');
    updateLanguage();
    
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
        try {
            currentUser = JSON.parse(savedUser);
            authToken = savedToken;
            console.log('✅ User logged in:', currentUser.name);
            showDashboard();
        } catch (e) {
            console.error('User parse error:', e);
            showAuthPage();
        }
    } else {
        showAuthPage();
    }
});

// ==================== PAGE SWITCHING ====================

function showAuthPage() {
    console.log('📄 Showing Auth Page');
    document.getElementById('authPage').classList.remove('hidden');
    document.getElementById('dashboardPage').classList.add('hidden');
    showLoginForm();
}

function showDashboard() {
    console.log('📄 Showing Dashboard');
    document.getElementById('authPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.remove('hidden');
    showPage('dashboardView');
    updateStats();
}

function showPage(pageId) {
    console.log('📄 Showing page:', pageId);
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const page = document.getElementById(pageId);
    if (page) page.classList.remove('hidden');
    closeSidebar();
}

function showSection(sectionId) {
    console.log('📄 Section:', sectionId);
    
    const map = {
        'ideaFinder': 'ideaFinderView',
        'winningProducts': 'winningProductsView',
        'analyzer': 'analyzerView',
        'competitorSpy': 'competitorSpyView',
        'trendPredictor': 'trendPredictorView',
        'marketValidator': 'marketValidatorView',
        'angleGenerator': 'angleGeneratorView',
        'monetization': 'monetizationView',
        'sellingStrategy': 'sellingStrategyView',
        'international': 'internationalView',
        'productGenerator': 'productGeneratorView',
        'imageGenerator': 'imageGeneratorView',
        'promptGenerator': 'promptGeneratorView',
        'countryTargeting': 'countryTargetingView',
        'honestFeedback': 'honestFeedbackView',
        'profile': 'profileView',
        'settings': 'settingsView'
    };
    
    showPage(map[sectionId] || 'dashboardView');
}

// ==================== SIDEBAR ====================

function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
}

// ==================== AUTH FORMS ====================

function showLoginForm() {
    console.log('📝 Login Form');
    document.getElementById('loginFormSection').classList.remove('hidden');
    document.getElementById('signupFormSection').classList.add('hidden');
}

function showSignupForm() {
    console.log('📝 Signup Form');
    document.getElementById('loginFormSection').classList.add('hidden');
    document.getElementById('signupFormSection').classList.remove('hidden');
}

// ==================== LOGIN/SIGNUP ====================

function handleLogin() {
    console.log('🔑 Login...');
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!email || !password) {
        alert('Please fill all fields!');
        return;
    }
    
    currentUser = {
        id: 'user_' + Date.now(),
        email: email,
        name: email.split('@')[0],
        createdAt: new Date().toLocaleDateString()
    };
    
    authToken = 'token_' + Math.random().toString(36).substr(2, 9);
    
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('token', authToken);
    
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    console.log('✅ Login success');
    alert('✅ Logged in as ' + currentUser.name);
    showDashboard();
}

function handleSignup() {
    console.log('🔑 Signup...');
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    
    if (!name || !email || !password) {
        alert('Please fill all fields!');
        return;
    }
    
    currentUser = {
        id: 'user_' + Date.now(),
        email: email,
        name: name,
        createdAt: new Date().toLocaleDateString()
    };
    
    authToken = 'token_' + Math.random().toString(36).substr(2, 9);
    
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('token', authToken);
    
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    
    console.log('✅ Signup success');
    alert('✅ Account created! Welcome ' + name);
    showDashboard();
}

function handleLogout() {
    if (confirm('Are you sure?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        currentUser = null;
        authToken = null;
        console.log('🚪 Logged out');
        showAuthPage();
    }
}

// ==================== CLAUDE API ====================

const CLAUDE_API_KEY = 'sk-ant-YOUR-KEY-HERE';

async function callClaude(prompt, maxTokens = 1500) {
    if (CLAUDE_API_KEY === 'sk-ant-YOUR-KEY-HERE') {
        return '⚠️ API key not configured. Replace sk-ant-YOUR-KEY-HERE in app.js with your real Claude API key from console.anthropic.com';
    }
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
