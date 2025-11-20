// Check auth state
auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user);
    if (user) {
        console.log('User logged in, redirecting to dashboard');
        if (window.location.pathname.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        console.log('No user, redirecting to login');
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
});

// Login function
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Attempting login with:', email);
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Login successful:', userCredential.user);
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Login error:', error);
            document.getElementById('errorMessage').textContent = error.message;
        });
});

// Logout function
function logout() {
    console.log('Logging out');
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    });
}
