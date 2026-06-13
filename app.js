// ==================== LANGUAGE SYSTEM ====================

let currentLanguage = localStorage.getItem('language') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateLanguage();
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
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
    console.log('Page loaded');
    updateLanguage();
    
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
        try {
            currentUser = JSON.parse(savedUser);
            authToken = savedToken;
            showDashboard();
            updateStats();
        } catch (e) {
            console.error('Error parsing user:', e);
            showAuthPage();
        }
    } else {
        showAuthPage();
    }
});

// ==================== PAGE NAVIGATION ====================

function showPage(pageId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
    
    // Show selected view
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('hidden');
    }
    
    closeSidebar();
}

function showAuthPage() {
    document.getElementById('authPage').classList.remove('hidden');
    document.getElementById('dashboardPage').classList.add('hidden');
    showLoginForm();
}

function showDashboard() {
    document.getElementById('authPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.remove('hidden');
    showPage('dashboardView');
    updateProfileDisplay();
}

function showSection(sectionId) {
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
    
    showPage(viewMap[sectionId]);
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
    document.getElementById('loginFormSection').classList.remove('hidden');
    document.getElementById('signupFormSection').classList.add('hidden');
}

function showSignupForm() {
    document.getElementById('signupFormSection').classList.remove('hidden');
    document.getElementById('loginFormSection').classList.add('hidden');
}

// ==================== AUTHENTICATION ====================

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
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
    
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    alert(t('✅ Logged in successfully!', '✅ Connecté avec succès!'));
    showDashboard();
}

function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
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
    
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    
    alert(t('✅ Account created! Welcome ' + name + '!', '✅ Compte créé! Bienvenue ' + name + '!'));
    showDashboard();
}

function handleLogout() {
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

const CLAUDE_API_KEY = 'sk-ant-YOUR-KEY-HERE'; // User will replace this

async function callClaude(prompt, maxTokens = 1500) {
    if (CLAUDE_API_KEY === 'sk-ant-YOUR-KEY-HERE') {
        return t('⚠️ Please configure your Claude API key in settings!', '⚠️ Veuillez configurer votre clé Claude API dans les paramètres!');
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
            console.error('Claude API Error:', data.error);
            return t('❌ API Error: ' + data.error.message, '❌ Erreur API: ' + data.error.message);
        }
        
        if (data.content && data.content[0]) {
            return data.content[0].text;
        }
        
        return t('No response from Claude', 'Pas de réponse de Claude');
        
    } catch (error) {
        console.error('Error calling Claude:', error);
        return t('❌ Error: ' + error.message, '❌ Erreur: ' + error.message);
    }
}

// ==================== 1. IDEA FINDER ====================

async function generateIdeas() {
    const category = document.getElementById('categorySelect').value;
    const experience = document.getElementById('experienceLevel').value;
    const format = document.getElementById('targetFormat').value;
    const budget = document.getElementById('budgetRange').value;
    
    const prompt = `You are an expert product strategist for African entrepreneurs. Generate 50+ profitable digital product ideas with these parameters:
    
Category: ${category}
Experience Level: ${experience}
Target Format: ${format}
Budget Range: ${budget}

For EACH idea provide:
1. Product Name
2. Description (1 sentence)
3. Target Market Size (High/Medium/Low)
4. Market Demand (Google Trends %)
5. Competition Level (1-10)
6. Revenue Potential (Realistic Year 1 in USD)
7. Time to Create (days)
8. Required Investment (USD)
9. Skills Required
10. Why it works in Africa

Format clearly. Be specific and realistic. Think about African markets (Nigeria, Benin, Senegal, Ghana, Kenya, etc.).`;

    showResultLoading('ideaResult', 'ideaList', t('Generating ideas...', 'Génération d\'idées...'));
    
    const result = await callClaude(prompt, 3000);
    displayResult('ideaResult', 'ideaList', result);
    ideasGeneratedCount++;
    updateStats();
}

// ==================== 2. WINNING PRODUCTS ====================

async function findWinningProducts() {
    const niche = document.getElementById('nicheInput').value;
    
    if (!niche) {
        alert(t('Please enter a niche!', 'Veuillez entrer une niche!'));
        return;
    }
    
    const prompt = `Find the top 10 REAL, verifiable winning digital products in the niche: "${niche}"

For each product:
1. Product Name
2. Creator/Platform
3. Description
4. Estimated Monthly Revenue (based on public data)
5. Active Advertising Evidence
6. Marketing Strategy Used
7. Why It's Successful
8. Target Audience
9. Price Point
10. How to Compete Against It

Only include REAL, proven products. Look for Udemy courses, Gumroad, Teachable, ClickBank top sellers, and established creators.`;

    showResultLoading('winningResult', 'winningList', t('Finding winners...', 'Recherche des gagnants...'));
    
    const result = await callClaude(prompt, 3000);
    displayResult('winningResult', 'winningList', result);
}

// ==================== 3. PRODUCT ANALYZER ====================

async function analyzeProduct() {
    const name = document.getElementById('productName').value;
    const desc = document.getElementById('productDesc').value;
    const format = document.getElementById('productFormat').value;
    const price = document.getElementById('productPrice').value;
    const audience = document.getElementById('productAudience').value;
    
    if (!name || !desc || !format || !price || !audience) {
        alert(t('Please fill all fields!', 'Veuillez remplir tous les champs!'));
        return;
    }
    
    const prompt = `You are a product strategist analyzing a digital product for African markets.

PRODUCT TO ANALYZE:
Name: ${name}
Description: ${desc}
Format: ${format}
Price: ${price} XOF
Target Audience: ${audience}

Provide a COMPLETE analysis:

1. VIABILITY SCORE (0-100)
   - Scoring breakdown
   - Justification

2. MARKET DEMAND
   - Market size estimate
   - Growth trends
   - Search volume estimate

3. COMPETITION ANALYSIS
   - Direct competitors
   - Indirect competitors
   - Competitive advantage needed

4. STRENGTHS (Top 5)
   - Specific strengths

5. WEAKNESSES (Top 5)
   - Critical issues
   - How to address them

6. PRICING ANALYSIS
   - Is price realistic?
   - Recommended price range
   - Payment method recommendations for Africa (Paystack, Flutterwave, etc.)

7. REVENUE POTENTIAL
   - Conservative estimate
   - Optimistic estimate
   - Break-even timeline

8. MARKET VALIDATION
   - How to validate the market
   - Potential customer acquisition cost
   - Realistic CAC for Africa

9. GO/NO-GO VERDICT
   - Clear recommendation
   - If GO: Top 3 action items
   - If NO: Why and alternatives

10. AFRICAN MARKET SPECIFIC
   - Opportunities in Africa
   - Challenges in Africa
   - Regional recommendations (Nigeria, Benin, Senegal, Ghana, Kenya, etc.)

Be honest and brutal. This is for someone making a real business decision.`;

    showResultLoading('analyzerResult', 'analysisList', t('Analyzing...', 'Analyse en cours...'));
    
    const result = await callClaude(prompt, 4000);
    displayResult('analyzerResult', 'analysisList', result);
    analysisCount++;
    updateStats();
}

// ==================== 4. COMPETITOR SPY ====================

async function spyCompetitor() {
    const name = document.getElementById('competitorName').value;
    const info = document.getElementById('competitorInfo').value;
    
    if (!name) {
        alert(t('Please enter a competitor name!', 'Veuillez entrer un nom de concurrent!'));
        return;
    }
    
    const prompt = `Analyze this competitor/product for someone entering their market: "${name}"

What you know: ${info || 'Not much, analyze based on the name'}

Provide detailed intelligence:

1. REAL STRENGTHS
   - What they do well
   - Why customers buy from them
   - Competitive advantages

2. CRITICAL WEAKNESSES
   - What's NOT working
   - Customer complaints/reviews
   - Gaps in their offering

3. MARKETING STRATEGY
   - How they acquire customers
   - Advertising channels used
   - Messaging strategy
   - Pricing strategy

4. CUSTOMER AVATAR
   - Who buys from them
   - Pain points they solve
   - Buying psychology

5. HOW TO BEAT THEM
   - Underserved segments
   - Better positioning angles
   - Product improvements
   - Price advantages

6. REVENUE ESTIMATE
   - Estimated monthly revenue
   - Scaling potential
   - Sustainability

7. PARTNERSHIP OPPORTUNITIES
   - Can you work with them?
   - Cross-selling potential

8. YOUR COMPETITIVE POSITION
   - Your advantages
   - Your risks
   - Recommended differentiation

Be specific. Base on real market dynamics.`;

    showResultLoading('competitorResult', 'competitorList', t('Analyzing competitor...', 'Analyse du concurrent...'));
    
    const result = await callClaude(prompt, 3000);
    displayResult('competitorResult', 'competitorList', result);
}

// ==================== 5. TREND PREDICTOR ====================

async function predictTrends() {
    const keyword = document.getElementById('trendKeyword').value;
    const platform = document.getElementById('trendPlatform').value;
    
    if (!keyword) {
        alert(t('Please enter a keyword!', 'Veuillez entrer un mot-clé!'));
        return;
    }
    
    const prompt = `Analyze trends for: "${keyword}" on ${platform}

Provide detailed trend analysis:

1. CURRENT TREND STATUS
   - Rising, stable, declining?
   - Growth percentage
   - Search volume

2. HISTORICAL TREND DATA
   - 3-month trend
   - 6-month trend
   - Year-over-year comparison

3. SEASONALITY
   - Best times to launch
   - Peak months
   - Off-season strategies

4. GEOGRAPHIC INSIGHTS
   - Where is it trending most?
   - African markets showing interest?
   - International opportunities

5. RELATED KEYWORDS
   - What searches drive it?
   - Long-tail opportunities
   - Semantic connections

6. COMPETITOR TREND PRESENCE
   - Who's capturing the trend?
   - Trending products in this space
   - Market saturation level

7. PREDICTED TREND TRAJECTORY
   - Will it grow or decline?
   - 3-month forecast
   - 12-month forecast

8. OPPORTUNITY TIMING
   - Time to enter (now/wait/too late)?
   - Window of opportunity
   - Action timeline

9. CONTENT STRATEGY
   - What type of content ranks?
   - Topics to cover
   - Engagement patterns

10. MONETIZATION TIMING
   - When to launch
   - Pricing strategy
   - Revenue potential at different timeline points

Use Google Trends data, social media signals, and search behavior patterns.`;

    showResultLoading('trendResult', 'trendList', t('Predicting trends...', 'Prédiction des tendances...'));
    
    const result = await callClaude(prompt, 3000);
    displayResult('trendResult', 'trendList', result);
}

// ==================== 6. MARKET VALIDATOR ====================

async function validateMarket() {
    const product = document.getElementById('marketProduct').value;
    const desc = document.getElementById('marketDesc').value;
    const market = document.getElementById('marketTarget').value;
    
    if (!product || !market) {
        alert(t('Please fill all fields!', 'Veuillez remplir tous les champs!'));
        return;
    }
    
    const prompt = `Validate if this product has a viable market:

PRODUCT: ${product}
DESCRIPTION: ${desc}
TARGET MARKET: ${market}

Provide market validation scoring:

1. MARKET SIZE ASSESSMENT
   - Total addressable market (TAM)
   - Serviceable addressable market (SAM)
   - Serviceable obtainable market (SOM)

2. MARKET DEMAND SCORE (0-100)
   - Customer willingness to pay
   - Pain point severity
   - Frequency of need

3. MARKET SATURATION ANALYSIS
   - Number of competitors
   - Market room for new players
   - Differentiation difficulty

4. CUSTOMER WILLINGNESS TO PAY
   - Price sensitivity
   - Value perception
   - Pricing benchmarks

5. ACQUISITION COST ESTIMATE
   - Customer acquisition cost (CAC)
   - Lifetime value (LTV)
   - CAC:LTV ratio

6. MARKET VALIDATION EVIDENCE
   - What validates this market?
   - What invalidates it?
   - Risk factors

7. GO/NO-GO/WAIT DECISION
   - GO: Launch now
   - NO-GO: Don't pursue
   - WAIT: Market not ready yet

8. VALIDATION CHECKLIST
   - What to validate
   - How to validate
   - Metrics to track

9. RESOURCE REQUIREMENTS
   - Minimum budget to test
   - Timeline to validation
   - Skills needed

10. NEXT STEPS
   - Immediate actions
   - Validation experiments
   - Pivot points

Be honest about market viability. This determines if they should continue.`;

    showResultLoading('validatorResult', 'validatorList', t('Validating market...', 'Validation du marché...'));
    
    const result = await callClaude(prompt, 3000);
    displayResult('validatorResult', 'validatorList', result);
}

// ==================== 7. ANGLE GENERATOR ====================

async function generateAngles() {
    const product = document.getElementById('angleProduct').value;
    const desc = document.getElementById('angleDesc').value;
    const target = document.getElementById('angleTarget').value;
    
    if (!product || !target) {
        alert(t('Please fill all fields!', 'Veuillez remplir tous les champs!'));
        return;
    }
    
    const prompt = `Generate 7-10 UNIQUE angles to position and sell: "${product}"

Target Audience: ${target}
Details: ${desc}

For EACH angle provide:

1. ANGLE NAME (catchy)
2. HEADLINE (emotional trigger)
3. UNIQUE SELLING PROPOSITION (USP)
4. TARGET SUB-AUDIENCE (specific segment)
5. PAIN POINT ADDRESSED (specific problem)
6. TRANSFORMATION (before/after)
7. PROOF POINT (why believe it)
8. TAGLINE (memorable)
9. PRICE POINT (suggested)
10. LAUNCH PLATFORM (where to sell it)
11. MARKETING CHANNELS (how to reach them)
12. COMPETITIVE ADVANTAGE (vs others)

Make each angle COMPLETELY different. Each should feel like a different product.

Examples of angles:
- "The lazy person's way to..."
- "Certified professionals use this because..."
- "In 30 days or money back..."
- "The controversial method that..."
- "Doctors hate this one simple trick..."
- "For people who failed at..."
- "The ethical/sustainable/African way to..."

Create 7-10 angles. Make them specific to African markets where relevant.`;

    showResultLoading('angleResult', 'angleList', t('Generating angles...', 'Génération d\'angles...'));
    
    const result = await callClaude(prompt, 3000);
    displayResult('angleResult', 'angleList', result);
}

// ==================== 8. MONETIZATION HUB ====================

async function generateMonetization() {
    const product = document.getElementById('monetProduct').value;
    const format = document.getElementById('monetFormat').value;
    
    if (!product) {
        alert(t('Please enter product name!', 'Veuillez entrer le no
