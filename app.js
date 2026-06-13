// ==================== CONFIGURATION ====================

const SUPABASE_URL = 'https://kukdgqlnzcceuzbgdkj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0kzkc3b-21b-QDzpc1ATfdw_calhiJFd';
const CLAUDE_API_KEY = 'sk-ant-YOUR-KEY-HERE'; // Tu la rajouteras

let currentUser = null;
let authToken = null;

// ==================== PAGE NAVIGATION ====================

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    document.getElementById(pageName).classList.remove('hidden');
}

function backToDashboard() {
    if (currentUser) {
        showPage('dashboardPage');
    } else {
        showPage('authPage');
    }
}

document.getElementById('loginBtn')?.addEventListener('click', () => showPage('authPage'));
document.getElementById('signupBtn')?.addEventListener('click', () => {
    showPage('authPage');
    showSignup();
});

// ==================== AUTHENTICATION ====================

async function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        // Call Supabase API
        const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.user) {
            currentUser = { id: data.user.id, email, name };
            authToken = data.session.access_token;
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('token', authToken);
            showPage('dashboardPage');
            alert('Account created! Welcome!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.access_token) {
            currentUser = { id: data.user.id, email };
            authToken = data.access_token;
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('token', authToken);
            showPage('dashboardPage');
            alert('Logged in successfully!');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function showSignup() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
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
        return data.content[0].text;
    } catch (error) {
        return 'Error: ' + error.message;
    }
}

// ==================== IDEAS SECTION ====================

function showIdeas() {
    showPage('ideasPage');
}

async function generateIdeas() {
    const category = document.getElementById('categorySelect').value;
    const audience = document.getElementById('audienceSelect').value;

    const prompt = `Generate 5 PRODUCT IDEAS for ${audience} in Africa about ${category}.
For each idea provide:
- Title
- Description
- Market Demand (High/Medium/Low)
- Recommended Format
- Estimated Price in XOF

Format as clear list.`;

    const result = await callClaudeAPI(prompt);
    document.getElementById('ideasList').innerHTML = `<pre>${result}</pre>`;
    document.getElementById('ideasResult').classList.remove('hidden');
}

// ==================== ANALYZER SECTION ====================

function showAnalyzer() {
    showPage('analyzerPage');
}

async function analyzeProduct() {
    const name = document.getElementById('productName').value;
    const desc = document.getElementById('productDesc').value;
    const format = document.getElementById('productFormat').value;
    const price = document.getElementById('productPrice').value;
    const audience = document.getElementById('productAudience').value;

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

    const result = await callClaudeAPI(prompt);
    document.getElementById('analysisList').innerHTML = `<pre>${result}</pre>`;
    document.getElementById('analyzerResult').classList.remove('hidden');
}

// ==================== GENERATOR SECTION ====================

function showGenerator() {
    showPage('generatorPage');
}

async function generateContent() {
    const type = document.getElementById('genType').value;
    const topic = document.getElementById('genTopic').value;

    let prompt = '';

    if (type === 'Ebook Outline') {
        prompt = `Create a detailed table of contents for an ebook about: ${topic}
Include: chapters, sections, key points.`;
    } else if (type === 'Video Script') {
        prompt = `Create a 5-minute video script about: ${topic}
Include: intro, 3 main points, conclusion, CTA.`;
    } else if (type === 'AI Image Prompt') {
        prompt = `Create an AI image generation prompt for: ${topic}
Make it detailed and optimized for DALL-E 3 or Midjourney.`;
    } else {
        prompt = `Write email copy to promote: ${topic}
Include: subject line, opening, benefits, CTA.`;
    }

    const result = await callClaudeAPI(prompt);
    document.getElementById('generatedContent').innerHTML = `<pre>${result}</pre>`;
    document.getElementById('generatorResult').classList.remove('hidden');
}

// ==================== FEEDBACK SECTION ====================

function showFeedback() {
    showPage('feedbackPage');
}

async function getHonestFeedback() {
    const product = document.getElementById('feedbackProduct').value;

    const prompt = `Give completely HONEST feedback on this product idea:
${product}

Provide:
1. Will this work? (YES/NO/MAYBE - with confidence %)
2. Top 5 Weaknesses
3. Top 5 Strengths
4. Realistic Revenue Potential
5. My Honest Verdict

Be brutal if needed - no sugar coating!`;

    const result = await callClaudeAPI(prompt);
    document.getElementById('feedbackContent').innerHTML = `<pre>${result}</pre>`;
    document.getElementById('feedbackResult').classList.remove('hidden');
}

// ==================== INITIALIZATION ====================

window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
        currentUser = JSON.parse(savedUser);
        authToken = savedToken;
        showPage('dashboardPage');
    } else {
        showPage('authPage');
    }
});
