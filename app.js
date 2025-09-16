// Initialize Supabase
const SUPABASE_URL = "https://incaqfvqtgighoefptkm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluY2FxZnZxdGdpZ2hvZWZwdGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDIwNjEsImV4cCI6MjA3Mjk3ODA2MX0.NCdE4_MxpVGswMLWzwgUcgI2BIP7s2xQa_yJ6JBrO34";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// elements
let authPage = document.getElementById("authPage")
let newPage = document.getElementById("newPage")
let updtPasswSect = document.getElementById("updtPasswSect")

let emailInp = document.getElementById("emailInp")
let passwInp = document.getElementById("passwInp")
let signupBtn = document.getElementById("signupBtn")
let loginBtn = document.getElementById("loginBtn")
let logoutBtn = document.getElementById("logoutBtn")
let forgtPasswBtn = document.getElementById("forgtPasswBtn")

let newPassInp = document.getElementById("newPassInp")
let updtNewPassBtn = document.getElementById("updtNewPassBtn")


signupBtn.addEventListener("click" , async () => {

    const { data, error } = await supabase.auth.signUp({
        email: emailInp.value,
        password: passwInp.value
    })

    if (error) {
        error.message
    }
    else {
        alert("please check and confirm the email")
        console.log(data);
    }

    emailInp.value = ""
    passwInp.value = ""
})

loginBtn.addEventListener("click" , async () => {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInp.value,
        password: passwInp.value
    })

    if (error) {
        alert(error.message)
    }
    else {
        alert("Login successfully")
        console.log(data);
    }

    emailInp.value = ""
    passwInp.value = ""
})

logoutBtn.addEventListener("click" , async () => {

    await supabase.auth.signOut()

    authPage.classList.remove("hidden")
    newPage.classList.add("hidden")

})

// ---------- Forget Password Request ----------
forgtPasswBtn.addEventListener("click" , async () => {

    const { error } = await supabase.auth.resetPasswordForEmail(emailInp.value , 
        {
            redirectTo: window.location.href
        }
    )

    if (error) {
        alert("Please enter a valid email / " + error.message)
    }
    else {
        alert("Reset link sent to your email!");
    }

})

// ---------- Update Password ----------
updtNewPassBtn.addEventListener("click" , async () => {

    const { data , error } = await supabase.auth.updateUser({
        password: newPassInp.value
    });

    if (error) {
        alert("Something went wrong : " + error.message)
    }
    else {
        alert("Password updated successfully!")

        // First sign out user
        await supabase.auth.signOut();

        // Hide update password section
        updtPasswSect.classList.add("hidden");
        updtPasswSect.style.display = "none";

        // Show only login page
        authPage.classList.remove("hidden");
        authPage.style.display = "block";

        newPage.classList.add("hidden");

        newPassInp.value = "";
    }

});

// ----------<<< Auth State Change Listener >>>----------
supabase.auth.onAuthStateChange( async (event, session) => {

    console.log("Auth Change:", event, session);

    // If user came from reset link, show update password section
    if (event === "PASSWORD_RECOVERY") {
        authPage.style.display = "none";
        newPage.style.display = "none";
        updtPasswSect.style.display = "block";
    }

    if (session) {
        authPage.classList.add("hidden");
        updtPasswSect.classList.add("hidden");
        newPage.classList.remove("hidden");
    }
    else {
        authPage.classList.remove("hidden");
        newPage.classList.add("hidden");
        updtPasswSect.classList.add("hidden");
    }
    
});