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

// LOGIN
function login() {
    console.log('🔑 Login');
    const email = document.getElementById('email1').value;
    const password = document.getElementById('password1').value;
    
    if (!email || !password) {
        alert('Fill fields!');
        return;
    }
    
    currentUser = {
        name: email.split('@')[0],
        email: email
    };
    
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    console.log('✅ Logged in:', currentUser);
    alert('✅ Logged in!');
    
    document.getElementById('authPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
}

// SIGNUP
function signup() {
    console.log('🔑 Signup');
    const name = document.getElementById('name2').value;
    const email = document.getElementById('email2').value;
    const password = document.getElementById('password2').value;
    
    if (!name || !email || !password) {
        alert('Fill fields!');
        return;
    }
    
    currentUser = {
        name: name,
        email: email
    };
    
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    console.log('✅ Signed up:', currentUser);
    alert('✅ Account created!');
    
    document.getElementById('authPage').classList.remove('active');
    document.getElementById('dashboardPage').classList.add('active');
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
}

// LOGOUT
function handleLogout() {
    if (confirm('Logout?')) {
        localStorage.removeItem('user');
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
async function generateIdeas() {
    console.log('💡 Generate ideas');
    const category = document.getElementById('ideaCategory').value;
    
    const result = document.getElementById('ideaResult');
    result.classList.remove('hidden');
    result.innerHTML = '<p>✅ Generated 5 ideas for ' + category + ':</p><pre>1. AI Course\n2. Email Templates\n3. SEO Guide\n4. Social Media Pack\n5. Coaching Program</pre>';
}

async function analyzeProduct() {
    console.log('📊 Analyze');
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    
    if (!name || !price) {
        alert('Fill fields!');
        return;
    }
    
    const result = document.getElementById('analyzerResult');
    result.classList.remove('hidden');
    result.innerHTML = '<p><strong>' + name + '</strong> @ ' + price + ' XOF</p><pre>✅ Viability Score: 75/100\n✅ Market Demand: HIGH\n✅ Revenue Potential: 30,000 XOF/month\n✅ GO: Yes</pre>';
}

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

// INIT
window.addEventListener('load', function() {
    console.log('✅ Window loaded');
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('authPage').classList.remove('active');
        document.getElementById('dashboardPage').classList.add('active');
        document.getElementById('profileName').textContent = currentUser.name;
        document.getElementById('profileEmail').textContent = currentUser.email;
        console.log('✅ User restored:', currentUser);
    }
});
