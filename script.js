import { config } from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase with config from config.js
    firebase.initializeApp(config.firebase);

    // Initialize Google Auth Provider
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('email'); // Add email scope

    // Modal functionality
    const modal = document.getElementById('signupModal');
    const closeModal = document.querySelector('.close-modal');
    const signupButtons = document.querySelectorAll('.sign-up-btn, .cta-button, .pricing-btn, .primary, .secondary');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    // Form switching elements
    const signupFormContainer = document.getElementById('signupForm-container');
    const loginFormContainer = document.getElementById('loginForm-container');
    const showLoginLink = document.getElementById('showLoginForm');
    const showSignupLink = document.getElementById('showSignupForm');
    const signupGoogleBtn = document.getElementById('signupGoogleBtn');
    const loginGoogleBtn = document.getElementById('loginGoogleBtn');

    // Google Sign In Handler
    async function handleGoogleSignIn() {
        try {
            const result = await firebase.auth().signInWithPopup(googleProvider);
            console.log('Google Sign In successful:', result.user.email);
            window.location.href = './succes.html';
        } catch (error) {
            console.error('Google Sign In Error:', error);
            alert(error.message);
        }
    }

    // Add click handlers for Google buttons
    signupGoogleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleGoogleSignIn();
    });

    loginGoogleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleGoogleSignIn();
    });

    // Switch between signup and login forms
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupFormContainer.classList.remove('active');
        loginFormContainer.classList.add('active');
    });

    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.classList.remove('active');
        signupFormContainer.classList.add('active');
    });

    // Function to open modal
    function openModal(e) {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        // Always show signup form first when opening modal
        signupFormContainer.classList.add('active');
        loginFormContainer.classList.remove('active');
    }

    // Function to close modal
    function closeModalFunc() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        // Reset forms
        signupForm.reset();
        loginForm.reset();
    }

    // Add click event listeners to all signup buttons
    signupButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });

    // Close modal when clicking the close button
    closeModal.addEventListener('click', closeModalFunc);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Handle signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function() {
                window.location.href = "./succes.html";
            })
            .catch(function(error) {
                alert(error.message);
            });
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function() {
                window.location.href = "./succes.html";
            })
            .catch(function(error) {
                alert(error.message);
            });
    });

    // Handle smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Update the auth state observer
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            // You can add additional logic here if needed
        } else {
            // User is signed out
            console.log('User is signed out');
        }
    });
});


