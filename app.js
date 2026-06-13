// ==================== LANGUAGE SYSTEM ====================

let currentLanguage = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateLanguage();
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function t(en, fr) {
    return currentLanguage === 'fr' ? fr : en;
}

function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = currentLanguage === 'fr' ? el.getAttribute('data-placeholder-fr') : el.getAttribute('data-placeholder-en');
        } else {
            el.textContent = currentLanguage === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en');
        }
    });
}

// ==================== INITIALIZATION ====================

let currentUser = null;
let authToken = null;
let analysisCount = 0;
let ideasGeneratedCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Page loaded successfully!');
    updateLanguage();
    
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
        try {
            currentUser = JSON.parse(savedUser);
            authToken = savedToken;
            console.log('✅ User found:', currentUser);
            showDashboard();
            updateStats();
        } catch (e) {
            console.error('❌ Error parsing user:', e);
            showAuthPage();
        }
    } else {
        console.log('ℹ️ No user found, showing auth page');
        showAuthPage();
    }
});

// ==================== PAGE NAVIGATION ====================

function showPage(pageId) {
    console.log('🔀 Showing page:', pageId);
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected view
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('hidden');
        console.log('✅ Page shown:', pageId);
    } else {
        console.error('❌ Page not found:', pageId);
    }
    
    closeSidebar();
}

function showAuthPage() {
    console.log('🔐 Showing auth page');
    const authPage = document.getElementById('authPage');
    const dashPage = document.getElementById('dashboardPage');
    
    if (authPage) authPage.classList.remove('hidden');
    if (dashPage) dashPage.classList.add('hidden');
    
    showLoginForm();
}

function showDashboard() {
    console.log('📊 Showing dashboard');
    const authPage = document.getElementById('authPage');
    const dashPage = document.getElementById('dashboardPage');
    
    if (authPage) authPage.classList.add('hidden');
    if (dashPage) dashPage.classList.remove('hidden');
    
    showPage('dashboardView');
    updateProfileDisplay();
}

function showSection(sectionId) {
    console.log('📄 Showing section:', sectionId);
    
    const viewMap = {
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
    
    const viewId = viewMap[sectionId];
    if (viewId) {
        showPage(viewId);
    } else {
        console.error('❌ Unknown section:', sectionId);
    }
}

// ==================== SIDEBAR ====================

function openSidebar() {
    console.log('📂 Opening sidebar');
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.add('open');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.remove('open');
    }
}

// ==================== AUTH FORMS ====================

function showLoginForm() {
    console.log('📝 Showing login form');
    const loginForm = document.getElementById('loginFormSection');
    const signupForm = document.getElementById('signupFormSection');
    
    if (loginForm) loginForm.classList.remove('hidden');
    if (signupForm) signupForm.classList.add('hidden');
}

function showSignupForm() {
    console.log('📝 Showing signup form');
    const loginForm = document.getElementById('loginFormSection');
    const signupForm = document.getElementById('signupFormSection');
    
    if (loginForm) loginForm.classList.add('hidden');
    if (signupForm) signupForm.classList.remove('hidden');
}

// ==================== AUTHENTICATION ====================

function handleLogin() {
    console.log('🔑 Handling login');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    const email = emailInput ? emailInput.value : '';
    const password = passwordInput ? passwordInput.value : '';
    
    if (!email || !password) {
        alert(t('Please fill all fields!', 'Veuillez remplir tous les champs!'));
        return;
    }
    
    currentUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0]
    };
    
    authToken = 'token_' + Math.random().toString(36).substr(2);
    
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('token', authToken);
    
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    console.log('✅ Login successful:', currentUser);
    alert(t('✅ Logged in successfully!', '✅ Connecté avec succès!'));
    showDashboard();
}

function handleSignup() {
    console.log('🔑 Handling signup');
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    
    const name = nameInput ? nameInput.value : '';
    const email = emailInput ? emailInput.value : '';
    const password = passwordInput ? passwordInput.value : '';
    
    if (!name || !email || !password) {
        alert(t('Please fill all fields!', 'Veuillez remplir tous les champs!'));
        return;
    }
    
    currentUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: name
    };
    
    authToken = 'token_' + Math.random().toString(36).substr(2);
    
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('token', authToken);
    
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    console.log('✅ Signup successful:', currentUser);
    alert(t('✅ Account created! Welcome ' + name + '!', '✅ Compte créé! Bienvenue ' + name + '!'));
    showDashboard();
}

function handleLogout() {
    console.log('🚪 Handling logout');
    if (confirm(t('Are you sure you want to logout?', 'Êtes-vous sûr de vouloir vous déconnecter?'))) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        currentUser = null;
        authToken = null;
        showAuthPage();
        alert(t('✅ Logged out!', '✅ Déconnecté!'));
    }
}

// ==================== CLAUDE API ====================

const CLAUDE_API_KEY = 'sk-ant-YOUR-KEY-HERE';

async function callClaude(prompt, maxTokens = 1500) {
    console.log('🤖 Calling Claude API...');
    
    if (CLAUDE_API_KEY === 'sk-ant-YOUR-KEY-HERE') {
        const msg = t('⚠️ Please configure your Claude API key in the code!', '⚠️ Veuillez configurer votre clé Claude API dans le code!');
        console.warn(msg);
        return msg;
    }
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-opus-4-6',
                max_tokens: maxTokens,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            console.error('❌ Claude API Error:', data.error);
            return t('❌ API Error: ' + data.error.message, '❌ Erreur API: ' + data.error.message);
        }
        
        if (data.content && data.content[0]) {
            console.log('✅ Claude response received');
            return data.content[0].text;
        }
        
        return t('No response from Claude', 'Pas de réponse de Claude');
        
    } catch (error) {
        console.error('❌ Error calling Claude:', error);
        return t('❌ Error: ' + error.message, '❌ Erreur: ' + error.message);
    }
}

// ==================== 1. IDEA FINDER ====================

async function generateIdeas() {
    console.log('💡 Generating ideas...');
    
    const categorySelect = document.getElementById('categorySelect');
    const experienceSelect = document.getElementById('experienceLevel');
    const formatSelect = document.getElementById('targetFormat');
    const budgetSelect = document.getElementById('budgetRange');
    
    const category = categorySelect ? categorySelect.value : 'Marketing';
    const experience = experienceSelect ? experienceSelect.value : 'Beginner';
    const format = formatSelect ? formatSelect.value : 'Ebook';
    const budget = budgetSelect ? budgetSelect.value : '$0-500';
    
    const prompt = `Generate 50+ profitable digital product ideas with parameters: Category: ${category}, Experience: ${experience}, Format: ${format}, Budget: ${budget}. For each idea provide: 1) Name 2) Description 3) Target Market Size 4) Demand Level 5) Competition 6) Revenue Potential 7) Time to Create 8) Investment Needed 9) Required Skills 10) Why it works.`;

    showResultLoading('ideaResult', 'ideaList', t('Generating ideas...', 'Génération d\'idées...'));
    
    const result = await callClaude(prompt, 2000);
    displayResult('ideaResult', 'ideaList', result);
    ideasGeneratedCount++;
    updateStats();
}

// ==================== 2. WINNING PRODUCTS ====================

async function findWinningProducts() {
    console.log('🏆 Finding winning products...');
    
    const nicheInput = document.getElementById('nicheInput');
    const niche = nicheInput ? nicheInput.value : 'Digital Marketing';
    
    if (!niche) {
        alert(t('Please enter a niche!', 'Veuillez entrer une niche!'));
        return;
    }
    
    const prompt = `Find top 10 real winning digital products in niche: "${niche}". For each provide: 1) Name 2) Creator 3) Description 4) Est. Revenue 5) Marketing Strategy 6) Why Successful 7) Target Audience 8) Price 9) How to Compete.`;

    showResultLoading('winningResult', 'winningList', t('Finding winners...', 'Recherche des gagnants...'));
    
    const result = await callClaude(prompt, 2000);
    displayResult('winningResult', 'winningList', result);
}

// ==================== 3. PRODUCT ANALYZER ====================

async function analyzeProduct() {
    console.log('📊 Analyzing product...');
    
    const nameInput = document.getElementById('productName');
    const descInput = document.getElementById('productDesc');
    const formatInput = document.getElementById('productFormat');
    const priceInput = document.getElementById('productPrice');
    const audienceInput = document.getElementById('productAudience');
    
    const name = nameInput ? nameInput.value : '';
    const desc = descInput ? descInput.value : '';
    const format = formatInput ? formatInput.value : 'Ebook';
    const price = priceInput ? priceInput.value : '0';
    const audience = audienceInput ? audienceInput.value : '';
    
    if (!name || !desc || !price || !audience) {
        alert(t('Please fill all fields!', 'Veuillez remplir tous les champs!'));
        return;
    }
    
    const prompt = `Analyze this digital product: Name: ${name}, Description: ${desc}, Format: ${format}, Price: ${price} XOF, Audience: ${audience}. Provide: 1) Viability Score (0-100) 2) Market Demand 3) Competition 4) Strengths 5) Weaknesses 6) Pricing Analysis 7) Revenue Potential 8) Market Validation 9) GO/NO-GO 10) African Market Specific.`;

    showResultLoading('analyzerResult', 'analysisList', t('Analyzing...', 'Analyse en cours...'));
    
    const result = await callClaude(prompt, 2500);
    displayResult('analyzerResult', 'analysisList', result);
    analysisCount++;
    updateStats();
}

// ==================== 4. COMPETITOR SPY ====================

async function spyCompetitor() {
    console.log('🕵️ Analyzing competitor...');
    
    const nameInput = document.getElementById('competitorName');
    const infoInput = document.getElementById('competitorInfo');
    
    const name = nameInput ? nameInput.value : '';
    const info = infoInput ? infoInput.value : '';
    
    if (!name) {
        alert(t('Please enter competitor name!', 'Veuillez entrer un nom de concurrent!'));
        return;
    }
    
    const prompt = `Analyze competitor/product: "${name}". Info: ${info}. Provide: 1) Real Strengths 2) Weaknesses 3) Marketing Strategy 4) Customer Avatar 5) How to Beat Them 6) Revenue Estimate 7) Partnerships 8) Your Competitive Position.`;

    showResultLoading('competitorResult', 'competitorList', t('Analyzing...', 'Analyse...'));
    
    const result = await callClaude(prompt, 2000);
    displayResult('competitorResult', 'competitorList', result);
}

// ==================== 5. TREND PREDICTOR ====================

async function predictTrends() {
    console.log('📈 Predicting trends...');
    
    const keywordInput = document.getElementById('trendKeyword');
    const platformInput = document.getElementById('trendPlatform');
    
    const keyword = keywordInput ? keywordInput.value : '';
    const platform = platformInput ? platformInput.value : 'Google Trends';
    
    if (!keyword) {
        alert(t('Please enter keyword!', 'Veuillez entrer un mot-clé!'));
        return;
    }
    
    const prompt = `Analyze trends for "${keyword}" on ${platform}. Provide: 1) Current Status 2) Historical Data 3) Seasonality 4) Geographic Insights 5) Related Keywords 6) Competitor Presence 7) Trend Forecast 8) Opportunity Timing 9) Content Strategy 10) Monetization Timing.`;

    showResultLoading('trendResult', 'trendList', t('Predicting...', 'Prédiction...'));
    
    const result = await callClaude(prompt, 2000);
    displayResult('trendResult', 'trendList', result);
}

// ==================== 6. MARKET VALIDATOR ====================

async function validateMarket() {
    console.log('✅ Validating market...');
    
    const productInput = document.getElementById('marketProduct');
    const descInput = document.getElementById('marketDesc');
    const marketInput = document.getElementById('marketTarget');
    
    const product = productInput ? productInput.value : '';
    const desc = descInput ? descInput.value : '';
    const market = marketInput ? marketInput.value : '';
    
    if (!product || !market) {
        alert(t('Please fill all fields!', 'Veuillez remplir tous les champs!'));
        return;
    }
    
    const prompt = `Validate market for product: "${product}", Description: ${desc}, Target: ${market}. Provide: 1) Market Size 2) Demand Score 3) Saturation 4) Willingness to Pay 5) CAC Estimate 6) Validation Evidence 7) GO/NO-GO 8) Validation Checklist 9) Resources Needed 10) Next Steps.`;

    showResultLoading('validatorResult', 'validatorList', t('Validating...', 'Validation...'));
    
    const result = await callClaude(prompt, 2000);
    displayResult('validatorResult', 'validatorList', result);
}

// ==================== 7. ANGLE GENERATOR ====================

async function generateAngles() {
    console.log('🎯 Generating angles...');
    
    const productInput = document.getElementById('angleProduct');
    const descInput = document.getElementById('angleDesc');
    const targetInput = document.getElementById('angleTarget');
    
    const product = productInput ? productInput.value : '';
    const desc = descInput ? descInput.value : '';
    const target = targetInput ? targetInput.value : '';
    
    if (!product || !target) {
        alert(t('Please fill required fields!', 'Veuillez remplir les champs requis!'));
        return;
    }
    
    const prompt = `Generate 7-10 unique angles to position "${product}". Target: ${target}, Details: ${desc}. For each angle provide: Name, Headline, USP, Target Audience, Pain Point, Transformation, Proof Point, Tagline, Price, Platform, Marketing Channels, Competitive Advantage.`;

    showResultLoading('angleResult', 'angleList', t('Generating...', 'Génération...'));
    
    const result = await callClaude(prompt, 2500);
    displayResult('angleResult', 'angleList', result);
}

// ==================== 8. MONETIZATION HUB ====================

async function generateMonetization() {
    console.log('💰 Generating monetization...');
    
    const productInput = document.getElementById('monetProduct');
    const formatInput = document.getElementById('monetFormat');
    
    const product = productInput ? productInput.value : '';
    const format = formatInput ? formatInput.value : 'Ebook';
    
    if (!product) {
        alert(t('Please enter product!', 'Veuillez entrer le produit!'));
        return;
    }
    
    const prompt = `Generate 5-8 revenue streams for "${product}" (${format}). For each provide: Name, Description, Effort, Time, Revenue Potential, Target Customers, Pricing, Implementation Steps, Challenges, Success Metrics.`;

    showResultLoading('monetResult', 'monetList', t('Generating...', 'Génération...'));
    
    const result = await callClaude(prompt, 2000);
    displayResult('monetResult', 'monetList', result);
}

// ==================== 9. SELLING STRATEGY ====================

async function generateSellingStrategy() {
    console.log('💼 Generating selling strategy...');
    
    const productInput = document.getElementById('saleProduct');
    const targetInput = document.getElementById('saleTarget');
    const priceInput = document.getElementById('salePrice');
    
    const product = productInput ? productInput.value : '';
    const target = targetInput ? targetInput.value : '';
    const price = priceInput ? priceInput.value : '0';
    
    if (!product || !price) {
        alert(t('Please fill required fields!', 'Veuillez remplir les champs requis!'));
        return;
    }
    
    const prompt = `Create 28-day selling strategy for "${product}". Target: ${target}, Price: ${price} XOF. Provide: Day 1-3 Pre-Launch, Day 4-7 Soft Launch, Day 8-14 Full Launch, Day 15-21 Momentum, Day 22-28 Closing. Include copy, email sequences, social media posts, ad copy, KPIs, budget.`;

    showResultLoading('saleResult', 'saleList', t('Generating...', 'Génération...'));
    
    const result = await callClaude(prompt, 3000);
    displayResult('saleResult', 'saleList', result);
}

// ==================== 1
