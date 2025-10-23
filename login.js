// Initialize Supabase
const supabaseUrl = "https://vbjgibvqjaotgiwsobfx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiamdpYnZxamFvdGdpd3NvYmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjQ4MjcsImV4cCI6MjA3NjgwMDgyN30.1wrh1Mme4lKZFmJnTwIbVefxz1Hci5XUcKEoypx854s";

  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const messageDiv = document.getElementById("message");

// Check if user is already logged in
checkUser();

async function checkUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    window.location.href = "forum.html";
  }
}

// Toggle between login and register forms
showRegister.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  messageDiv.innerHTML = "";
});

showLogin.addEventListener("click", (e) => {
  e.preventDefault();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  messageDiv.innerHTML = "";
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    messageDiv.innerHTML =
      '<div class="success">Login berhasil! Mengalihkan...</div>';
    setTimeout(() => {
      window.location.href = "forum.html";
    }, 1000);
  } catch (error) {
    messageDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
  }
});

// Register
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const name = document.getElementById("registerName").value;

  if (password.length < 6) {
    messageDiv.innerHTML =
      '<div class="error">Password minimal 6 karakter</div>';
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) throw error;

    messageDiv.innerHTML =
      '<div class="success">Pendaftaran berhasil! Silakan login.</div>';

    // Switch to login form after 2 seconds
    setTimeout(() => {
      registerForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
      messageDiv.innerHTML = "";
    }, 2000);
  } catch (error) {
    messageDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
  }
});
