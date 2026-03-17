// Basic DOM Elements
const form = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnSubmit = document.getElementById('btn-submit');
const errorAlert = document.getElementById('error-alert');
const errorText = document.getElementById('error-text');

// Some extra fields for signup
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');

// Utility to show error
function showError(message) {
  errorText.innerText = message;
  errorAlert.classList.remove('hidden');
  errorAlert.classList.add('flex');
}

// Hide error
function hideError() {
  errorAlert.classList.add('hidden');
  errorAlert.classList.remove('flex');
}

// Redirect if already logged in
async function checkUserSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    window.location.href = 'dashboard.html'; // Redirect already-logged-in users
  }
}

// Run on load
checkUserSession();

// Form handler pattern
if(form) {
    form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value; // NOTE: Do NOT trim passwords — spaces may be intentional

    if (!email || !password) {
        showError('Please fill in all required fields.');
        return;
    }
    // Basic email format validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        showError('Please enter a valid email address.');
        return;
    }

    // Checking if we are on Login or Signup page
    const isSignup = document.getElementById('is-signup') !== null;

    btnSubmit.disabled = true;
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Please wait...`;

    try {
        if (isSignup) {
            const firstName = firstNameInput ? firstNameInput.value.trim() : '';
            const lastName = lastNameInput ? lastNameInput.value.trim() : '';
            
            if (!firstName || !lastName) {
                showError('First Name and Last Name are required.');
                resetButton();
                return;
            }

            // Signup Logic
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        avatar_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
                    }
                }
            });

            if (error) throw error;

            // Success feedback
            const successModal = document.getElementById('success-modal');
            if (successModal) {
                successModal.classList.remove('hidden');
                successModal.classList.add('flex');
                
                document.getElementById('btn-modal-close').addEventListener('click', () => {
                    window.location.href = 'login.html';
                });
            } else {
                alert('Signup successful! You can now log in.');
                window.location.href = 'login.html';
            }
            
        } else {
            // Login Logic
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Successfully logged in
            window.location.href = 'dashboard.html'; // Adjust as needed
        }
    } catch (err) {
        showError(err.message || 'An error occurred during authentication.');
    } finally {
        resetButton();
    }

    function resetButton() {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;
    }
  });
}
