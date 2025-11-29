// script.js

const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

function showLogin() {
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
}

function showSignup() {
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
}

signupForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('newUser').value.trim();
  const pass = document.getElementById('newPass').value.trim();

  if(!user || !pass){
    alert('Please enter both username and password.');
    return;
  }

  localStorage.setItem('adminUser', user);
  localStorage.setItem('adminPass', pass);
  alert('Signup successful! Please login.');
  showLogin();
});

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const savedUser = localStorage.getItem('adminUser');
  const savedPass = localStorage.getItem('adminPass');

  // Hardcoded super admin
  if(user === 'admin' && pass === 'admin@123') {
    alert('Super Admin Access Granted! 🚀');
    window.location.href = 'admin.html';
    return;
  }

  // Normal login
  if(user === savedUser && pass === savedPass) {
    alert('स्वागतम्! ☕');
    window.location.href = 'index.html';
  } else {
    errorMsg.textContent = 'Invalid username or password!';
    errorMsg.style.color = 'red';
  }
});
