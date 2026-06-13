// ==================== CONFIG ====================

const SUPABASE_URL = 'https://kukdgqlnzcceuzbgdkj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0kzkc3b-21b-QDzpc1ATfdw_calhiJFd';
const CLAUDE_API_KEY = 'sk-ant-YOUR-KEY-HERE'; // REMPLACE AVEC TA CLÉ!

let currentUser = null;
let authToken = null;

// ==================== PAGE NAVIGATION ====================

function showPage(pageId) {
    console.log('Showing page:', pageId);
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(p => p.classList.add('hidden'));
    
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('hidden');
    }
}

function backToDashboard() {
    if (currentUser) {
        showPage('dashboardPage');
    }
}

// ==================== AUTH PAGES ====================

function showAuthPage() {
    showPage('authPage');
    showLoginForm();
}

function showLoginForm() {
    document.getElementById('loginFormSection').classList.remove('hidden');
    document.getElementById('signupFormSection').classList.add('hidden');
}

function showSignupForm() {
    document.getElementById('signupFormSection').classList.remove('hidden');
    document.getElementById('loginFormSection').classList.add('hidden');
}

// ==================== AUTH HANDLERS ====================

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('❌ Please fill all fields!');
        return;
    }

    // Simulate login
    currentUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: email
    };

    authToken = 'token_' + Math.random().toString(36).substr(2);

    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('token', authToken);

    alert('✅ Logged in successfully!');

    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';

    showPage('dashboardPage');
}

function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        alert('❌ Please fill all fields!');
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

    alert('✅ Account created! Welcome ' + name + '!');

    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';

    showPage('dashboardPage');
}

function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    currentUser = null;
    authToken = null;
    showAuthPage();
    alert('✅ Logged out!');
}

// ==================== DASHBOARD PAGES ====================

function showIdeasPage() {
    showPage('ideasPage');
}

function showAnalyzerPage() {
    showPage('analyzerPage');
}

function showGeneratorPage() {
    showPage('generatorPage');
}

function showFeedbackPage() {
    showPage('feedbackPage');
}

// ==================== IDEAS ====================

async function handleGenerateIdeas() {
    const category = document.getElementById('categorySelect').value;
    const audience = document.getElementById('audienceSelect').value;

    const prompt = `Generate 5 PRODUCT IDEAS for ${audience} in Africa about ${category}.

For each idea provide:
- Title
- Description
- Market Demand (High/Medium/Low)
- Recommended Format
- Estimated Price in XOF

Format as numbered list.`;

    const resultDiv = document.getElementById('ideasList');
    resultDiv.innerHTML = '⏳ Generating ideas...';

    try {
        const result = await callClaude(prompt);
        resultDiv.innerHTML = '<pre style="white-space: pre-wrap; word-wrap: break-word; color: #333; background: #f9f9f9; padding: 1rem; border-radius: 5px;">' + result + '</pre>';
        document.getElementById('ideasResult').classList.remove('hidden');
    } catch (error) {
        resultDiv.innerHTML = '❌ Error: ' + error.message;
    }
}

// ==================== ANALYZER ====================

async function handleAnalyzeProduct() {
    const name = document.getElementById('productName').value;
    const desc = document.getElementById('productDesc').value;
    const format = document.getElementById('productFormat').value;
    const price = document.getElementById('productPrice').value;
    const audience = document.getElementById('productAudience').value;

    if (!name || !desc || !format || !price || !audience) {
        alert('❌ Please fill all fields!');
        return;
    }

    const prompt = `Analyze this digital product idea:

Product Name: ${name}
Description: ${desc}
Format: ${format}
Target Price: ${price} XOF
Target Audience: ${audience}

Provide:
1. Viability Score (0-100)
2. Top 5 Strengths
3. Top 5 Weaknesses
4. GO/NO-GO Decision with reasoning
5. Top 3 Action Items

Be completely frank and honest.`;

    const resultDiv = document.getElementById('analysisList');
    resultDiv.innerHTML = '⏳ Analyzing...';

    try {
        const result = await callClaude(prompt);
        resultDiv.innerHTML = '<pre style="white-space: pre-wrap; word-wrap: break-word; color: #333; background: #f9f9f9; padding: 1rem; border-radius: 5px;">' + result + '</pre>';
        document.getElementById('analyzerResult').classList.remove('hidden');
    } catch (error) {
        resultDiv.innerHTML = '❌ Error: ' + error.message;
    }
}

// ==================== GENERATOR ====================

async function handleGenerateContent() {
    const type = document.getElementById('genType').value;
    const topic = document.getElementById('genTopic').value;

    if (!topic) {
        alert('❌ Please enter a topic!');
        return;
    }

    let prompt = '';

    if (type === 'Ebook Outline') {
        prompt = `Create a detailed table of contents for an ebook about: ${topic}
Include: Introduction, 5 main chapters, Conclusion.`;
    } else if (type === 'Video Script') {
        prompt = `Create a 5-minute video script about: ${topic}
Include: Hook, 3 main points, CTA.`;
    } else if (type === 'AI Image Prompt') {
        prompt = `Create 3 detailed AI image generation prompts for: ${topic}
Optimized for DALL-E, Midjourney, and Stable Diffusion.`;
    } else {
        prompt = `Write email marketing copy to promote: ${topic}
Include: Subject line, Opening, Benefits, CTA.`;
    }

    const resultDiv = document.getElementById('generatedContent');
    resultDiv.innerHTML = '⏳ Generating...';

    try {
        const result = await callClaude(prompt);
        resultDiv.innerHTML = '<pre style="white-space: pre-wrap; word-wrap: break-word; color: #333; background: #f9f9f9; padding: 1rem; border-radius: 5px;">' + result + '</pre>';
        document.getElementById('generatorResult').classList.remove('hidden');
    } catch (error) {
        resultDiv.innerHTML = '❌ Error: ' + error.message;
    }
}

// ==================== FEEDBACK ====================

async function handleGetFeedback() {
    const product = document.getElementById('feedbackProduct').value;

    if (!product) {
        alert('❌ Please describe your product idea!');
        return;
    }

    const prompt = `Give COMPLETELY HONEST feedback on this product idea:

${product}

Provide:
1. Will this work? (YES/NO/MAYBE with % confidence)
2. Top 5 Weaknesses (be brutal!)
3. Top 5 Strengths
4. Realistic Year 1 Revenue Potential
5. My Honest Verdict

No sugar coating!`;

    const resultDiv = document.getElementById('feedbackContent');
    resultDiv.innerHTML = '⏳ Analyzing...';

    try {
        const result = await callClaude(prompt);
        resultDiv.innerHTML = '<pre style="white-space: pre-wrap; word-wrap: break-word; color: #333; background: #f9f9f9; padding: 1rem; border-radius: 5px;">' + result + '</pre>';
        document.getElementById('feedbackResult').classList.remove('hidden');
    } catch (error) {
        resultDiv.innerHTML = '❌ Error: ' + error.message;
    }
}

// ==================== CLAUDE API ====================

async function callClaude(prompt) {
    console.log('Calling Claude API...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'claude-opus-4-6',
            max_tokens: 1500,
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
        throw new Error(data.error.message || 'Claude API error');
    }

    if (data.content && data.content[0]) {
        return data.content[0].text;
    }

    throw new Error('No response from Claude');
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded!');

    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
        try {
            currentUser = JSON.parse(savedUser);
            authToken = savedToken;
            console.log('User found:', currentUser);
            showPage('dashboardPage');
        } catch (e) {
            console.error('Error parsing user:', e);
            showAuthPage();
        }
    } else {
        console.log('No user found');
        showAuthPage();
    }
});
