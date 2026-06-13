// ==================== CONFIGURATION ====================

const SUPABASE_URL = 'https://kukdgqlnzcceuzbgdkj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0kzkc3b-21b-QDzpc1ATfdw_calhiJFd';
const CLAUDE_API_KEY = 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

let currentUser = null;
let authToken = null;

// ==================== PAGE NAVIGATION ====================

function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.add('hidden');
    });
    
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
}

function backToDashboard() {
    if (currentUser) {
        showPage('dashboardPage');
    } else {
        showPage('authPage');
    }
}

// ==================== BUTTON LISTENERS ====================

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showPage('authPage');
            showLogin();
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            showPage('authPage');
            showSignup();
        });
    }
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
        currentUser = JSON.parse(savedUser);
        authToken = savedToken;
        showPage('dashboardPage');
    } else {
        showPage('authPage');
        showLogin();
    }
});

// ==================== AUTHENTICATION FUNCTIONS ====================

function showSignup() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) loginForm.classList.add('hidden');
    if (signupForm) signupForm.classList.remove('hidden');
}

function showLogin() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) signupForm.classList.add('hidden');
    if (loginForm) loginForm.classList.remove('hidden');
}

async function signup() {
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    
    const name = nameInput?.value;
    const email = emailInput?.value;
    const password = passwordInput?.value;

    if (!name || !email || !password) {
        alert('Please fill all fields!');
        return;
    }

    try {
        // Simulate signup (Supabase integration)
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            email: email,
            name: name
        };
        
        currentUser = user;
        authToken = Math.random().toString(36).substr(2);
        
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('token', authToken);
        
        alert('✅ Account created successfully! Welcome ' + name + '!');
        showPage('dashboardPage');
        
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

async function login() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    const email = emailInput?.value;
    const password = passwordInput?.value;

    if (!email || !password) {
        alert('Please fill all fields!');
        return;
    }

    try {
        // Simulate login
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            email: email
        };
        
        currentUser = user;
        authToken = Math.random().toString(36).substr(2);
        
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('token', authToken);
        
        alert('✅ Logged in successfully!');
        showPage('dashboardPage');
        
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

// ==================== CLAUDE API CALLS ====================

async function callClaudeAPI(prompt) {
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
                max_tokens: 1000,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        if (data.content && data.content[0]) {
            return data.content[0].text;
        }
        return 'No response received';
        
    } catch (error) {
        return '❌ Error calling Claude: ' + error.message;
    }
}

// ==================== IDEAS SECTION ====================

function showIdeas() {
    showPage('ideasPage');
}

async function generateIdeas() {
    const categoryInput = document.getElementById('categorySelect');
    const audienceInput = document.getElementById('audienceSelect');
    
    const category = categoryInput?.value || 'general';
    const audience = audienceInput?.value || 'entrepreneurs';

    const prompt = `Generate 5 PRODUCT IDEAS for ${audience} in Africa about ${category}.

For each idea provide:
- Title
- Description  
- Market Demand (High/Medium/Low)
- Recommended Format
- Estimated Price in XOF

Format as clear numbered list.`;

    const resultDiv = document.getElementById('ideasList');
    if (resultDiv) {
        resultDiv.innerHTML = '<p>Generating ideas...</p>';
    }
    
    const result = await callClaudeAPI(prompt);
    if (resultDiv) {
        resultDiv.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${result}</pre>`;
    }
    
    const resultContainer = document.getElementById('ideasResult');
    if (resultContainer) {
        resultContainer.classList.remove('hidden');
    }
}

// ==================== ANALYZER SECTION ====================

function showAnalyzer() {
    showPage('analyzerPage');
}

async function analyzeProduct() {
    const nameInput = document.getElementById('productName');
    const descInput = document.getElementById('productDesc');
    const formatInput = document.getElementById('productFormat');
    const priceInput = document.getElementById('productPrice');
    const audienceInput = document.getElementById('productAudience');
    
    const name = nameInput?.value;
    const desc = descInput?.value;
    const format = formatInput?.value;
    const price = priceInput?.value;
    const audience = audienceInput?.value;

    if (!name || !desc || !format || !price || !audience) {
        alert('Please fill all fields!');
        return;
    }

    const prompt = `Analyze this product:
Name: ${name}
Description: ${desc}
Format: ${format}
Price: ${price} XOF
Audience: ${audience}

Provide:
1. Viability Score (0-100)
2. 5 Strengths
3. 5 Weaknesses
4. GO/NO-GO Decision
5. Top 3 Action Items

Be frank and honest.`;

    const resultDiv = document.getElementById('analysisList');
    if (resultDiv) {
        resultDiv.innerHTML = '<p>Analyzing...</p>';
    }
    
    const result = await callClaudeAPI(prompt);
    if (resultDiv) {
        resultDiv.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${result}</pre>`;
    }
    
    const resultContainer = document.getElementById('analyzerResult');
    if (resultContainer) {
        resultContainer.classList.remove('hidden');
    }
}

// ==================== GENERATOR SECTION ====================

function showGenerator() {
    showPage('generatorPage');
}

async function generateContent() {
    const typeInput = document.getElementById('genType');
    const topicInput = document.getElementById('genTopic');
    
    const type = typeInput?.value;
    const topic = topicInput?.value;

    if (!topic) {
        alert('Please enter a topic!');
        return;
    }

    let prompt = '';

    if (type === 'Ebook Outline') {
        prompt = `Create a detailed table of contents for an ebook about: ${topic}

Include: 
- Introduction
- 5 main chapters with subsections
- Key points per chapter
- Conclusion

Format as structured outline.`;
        
    } else if (type === 'Video Script') {
        prompt = `Create a 5-minute video script about: ${topic}

Include: 
- Hook/Intro
- 3 main points (with examples)
- Conclusion
- CTA

Format as script with timings.`;
        
    } else if (type === 'AI Image Prompt') {
        prompt = `Create 3 AI image generation prompts for: ${topic}

Make them detailed and optimized for:
1. DALL-E 3
2. Midjourney  
3. Stable Diffusion

Include style, composition, lighting, mood.`;
        
    } else {
        prompt = `Write compelling email copy to promote: ${topic}

Include: 
- Subject line
- Opening hook
- 3 benefits
- CTA

Make it engaging and conversion-focused.`;
    }

    const resultDiv = document.getElementById('generatedContent');
    if (resultDiv) {
        resultDiv.innerHTML = '<p>Generating...</p>';
    }
    
    const result = await callClaudeAPI(prompt);
    if (resultDiv) {
        resultDiv.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${result}</pre>`;
    }
    
    const resultContainer = document.getElementById('generatorResult');
    if (resultContainer) {
        resultContainer.classList.remove('hidden');
    }
}

// ==================== FEEDBACK SECTION ====================

function showFeedback() {
    showPage('feedbackPage');
}

async function getHonestFeedback() {
    const productInput = document.getElementById('feedbackProduct');
    const product = productInput?.value;

    if (!product) {
        alert('Please describe your product!');
        return;
    }

    const prompt = `Give completely HONEST feedback on this product idea:

${product}

Provide:
1. Will this work? (YES/NO/MAYBE - with % confidence)
2. Top 5 Weaknesses
3. Top 5 Strengths
4. Realistic Revenue Potential (Year 1)
5. My Honest Verdict & Top 3 Recommendations

Be brutal if needed - no sugar coating!`;

    const resultDiv = document.getElementById('feedbackContent');
    if (resultDiv) {
        resultDiv.innerHTML = '<p>Analyzing...</p>';
    }
    
    const result = await callClaudeAPI(prompt);
    if (resultDiv) {
        resultDiv.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${result}</pre>`;
    }
    
    const resultContainer = document.getElementById('feedbackResult');
    if (resultContainer) {
        resultContainer.classList.remove('hidden');
    }
}

// ==================== INITIALIZATION ====================

// The DOMContentLoaded event handler above handles initialization
