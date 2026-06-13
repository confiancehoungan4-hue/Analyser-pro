// ==================== CONFIGURATION ====================

const SUPABASE_URL = 'https://kukdgqlnzcceuzbgdkj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0kzkc3b-21b-QDzpc1ATfdw_calhiJFd';
const CLAUDE_API_KEY = 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

let currentUser = null;
let authToken = null;

// ==================== SHOW/HIDE PAGES ====================

function showPage(pageName) {
    console.log('Showing page:', pageName);
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.add('hidden'));
    
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.remove('hidden');
    }
}

function backToDashboard() {
    if (currentUser) {
        showPage('dashboardPage');
    } else {
        showPage('authPage');
    }
}

// ==================== AUTH FORMS ====================

function showLogin() {
    console.log('Showing login form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm) loginForm.classList.remove('hidden');
    if (signupForm) signupForm.classList.add('hidden');
}

function showSignup() {
    console.log('Showing signup form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (signupForm) signupForm.classList.remove('hidden');
    if (loginForm) loginForm.classList.add('hidden');
}

// ==================== SIGNUP ====================

function signup() {
    console.log('Signup clicked');
    
    const name = document.getElementById('signupName')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    
    console.log('Name:', name, 'Email:', email, 'Password:', password);
    
    if (!name || !email || !password) {
        alert('❌ Please fill all fields!');
        return;
    }
    
    // Simulate signup
    currentUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: name
    };
    
    authToken = 'token_' + Math.random().toString(36).substr(2);
    
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('token', authToken);
    
    alert('✅ Account created! Welcome ' + name + '!');
    
    // Clear form
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    
    showPage('dashboardPage');
}

// ==================== LOGIN ====================

function login() {
    console.log('Login clicked');
    
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    console.log('Email:', email, 'Password:', password);
    
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
    
    // Clear form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    showPage('dashboardPage');
}

// ==================== IDEAS ====================

function showIdeas() {
    console.log('Show ideas clicked');
    showPage('ideasPage');
}

async function generateIdeas() {
    console.log('Generate ideas clicked');
    
    const category = document.getElementById('categorySelect')?.value || 'general';
    const audience = document.getElementById('audienceSelect')?.value || 'entrepreneurs';
    
    const prompt = `Generate 5 PRODUCT IDEAS for ${audience} in Africa about ${category}.

For each idea provide:
- Title
- Description
- Market Demand (High/Medium/Low)
- Recommended Format
- Estimated Price in XOF

Format as numbered list.`;

    const resultDiv = document.getElementById('ideasList');
    if (resultDiv) {
        resultDiv.innerHTML = '⏳ Generating ideas... (this takes a few seconds)';
    }
    
    try {
        const result = await callClaudeAPI(prompt);
        if (resultDiv) {
            resultDiv.innerHTML = '<pre style="white-space: pre-wrap; word-wrap: break-word; color: #333; background: #f9f9f9; padding: 1rem; border-radius: 5px;">' + result + '</pre>';
        }
        const resultContainer = document.getElementById('ideasResult');
        if (resultContainer) {
            resultContainer.classList.remove('hidden');
        }
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerHTML = '❌ Error: ' + error.message;
        }
    }
}

// ==================== ANALYZER ====================

function showAnalyzer() {
    console.log('Show analyzer clicked');
    showPage('analyzerPage');
}

async function analyzeProduct() {
    console.log('Analyze product clicked');
    
    const name = document.getElementById('productName')?.value;
    const desc = document.getElementById('productDesc')?.value;
    const format = document.getElementById('productFormat')?.value;
    const price = document.getElementById('productPrice')?.value;
    const audience = document.getElementById('productAudience')?.value;
    
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
    if (resultDiv) {
        resultDiv.innerHTML = '⏳ Analyzing... (this takes a few seconds)';
    }
    
    try {
        const result = await callClaudeAPI(prompt);
        if (resultDiv) {
            resultDiv.innerHTML = '<pre style="white-space: pre-wrap; word-wrap: break-word; color: #333; background: #f9f9f9; padding: 1rem; border-radius: 5px;">' + result + '</pre>';
        }
        const resultContainer = document.getElementById('analyzerResult');
        if (resultContainer) {
            resultContainer.classList.remove('hidden');
        }
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerHTML = '❌ Error: ' + error.message;
        }
    }
}

// ==================== GENERATOR ====================

function showGenerator() {
    console.log('Show generator clicked');
    showPage('generatorPage');
}

async function generateContent() {
    console.log('Generate content clicked');
    
    const type = document.getElementById('genType')?.value;
    const topic = document.getElementById('genTopic')?.value;
    
    if (!topic) {
        alert('❌ Please enter a topic!');
        return;
    }
    
    let prompt = '';
    
    if (type === 'Ebook Outline') {
        prompt = `Create a detailed table of contents for an ebook about: ${topic}
Include: Introduction, 5 main chapters, Conclusion, Key takeaways.`;
    } else if (type === 'Video Script') {
        prompt = `Create a 5-minute video script about: ${topic}
Include: Hook, 3 main points, Examples, CTA.`;
    } else if (type === 'AI Image Prompt') {
        prompt = `Create 3 detailed AI image generation prompts for: ${topic}
Optimized for DALL-E, Midjourney, and Stable Diffusion.`;
    } else {
        prompt = `Write email marketing copy to promote: ${topic}
Include: Subject line, Opening, Benefits, CTA.`;
    }

    const resultDiv = document.getElementById('generatedContent');
    if (resultDiv) {
        resultDiv.innerHTML = '⏳ Generating... (this takes a few seconds)';
    }
    
    try {
        const result = await callClaudeAPI(prompt);
        if (resultDiv) {
            resultDiv.innerHTML = '<pre style="white-space: pre-wrap; word-wrap: break-word; color: #333; background: #f9f9f9; padding: 1rem; border-radius: 5px;">' + result + '</pre>';
        }
        const resultContainer = document.getElementById('generatorResult');
        if (resultContainer) {
            resultContainer.classList.remove('hidden');
        }
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerHTML = '❌ Error: ' + error.message;
        }
    }
}

// ==================== FEEDBACK ====================

function showFeedback() {
    console.log('Show feedback clicked');
    showPage('feedbackPage');
}

async function getHonestFeedback() {
    console.log('Get feedback clicked');
    
    const product = document.getElementById('feedbackProduct')?.value;
    
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

No sugar coating - be frank!`;

    const resultDiv = document.getElementById('feedbackContent');
    if (resultDiv) {
        resultDiv.innerHTML = '⏳ Analyzing... (this takes a few seconds)';
    }
    
    try {
        const result = await callClaudeAPI(prompt);
        if (resultDiv) {
            resultDiv.innerHTML = '<pre style="white-space: pre-wrap; word-wrap: break-word; color: #333; background: #f9f9f9; padding: 1rem; border-radius: 5px;">' + result + '</pre>';
        }
        const resultContainer = document.getElementById('feedbackResult');
        if (resultContainer) {
            resultContainer.classList.remove('hidden');
        }
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerHTML = '❌ Error: ' + error.message;
        }
    }
}

// ==================== CLAUDE API ====================

async function callClaudeAPI(prompt) {
    console.log('Calling Claude API...');
    
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
                max_tokens: 1500,
                messages: [{ 
                    role: 'user', 
                    content: prompt 
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message || 'Claude API error');
        }
        
        if (data.content && data.content[0]) {
            return data.content[0].text;
        }
        
        return 'No response from Claude';
        
    } catch (error) {
        console.error('Claude API Error:', error);
        throw error;
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded!');
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
        try {
            currentUser = JSON.parse(savedUser);
            authToken = savedToken;
            console.log('User found in storage:', currentUser);
            showPage('dashboardPage');
        } catch (e) {
            console.error('Error parsing user:', e);
            showPage('authPage');
            showLogin();
        }
    } else {
        console.log('No user found, showing auth page');
        showPage('authPage');
        showLogin();
    }
    
    // Make functions globally available (for onclick handlers)
    window.showPage = showPage;
    window.backToDashboard = backToDashboard;
    window.showIdeas = showIdeas;
    window.showAnalyzer = showAnalyzer;
    window.showGenerator = showGenerator;
    window.showFeedback = showFeedback;
    window.generateIdeas = generateIdeas;
    window.analyzeProduct = analyzeProduct;
    window.generateContent = generateContent;
    window.getHonestFeedback = getHonestFeedback;
    window.login = login;
    window.signup = signup;
    window.showLogin = showLogin;
    window.showSignup = showSignup;
    
    console.log('All functions registered');
});
