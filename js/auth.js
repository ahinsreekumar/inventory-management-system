// Check auth state
auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    } else if (!user && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
});

// Login function
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            document.getElementById('errorMessage').textContent = error.message;
        });
});

// Logout function
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'login.html';
    });
}
