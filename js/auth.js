function showMessage(message, color = "red") {

    const msg = document.getElementById("message");

    if (!msg) return;

    msg.innerText = message;
    msg.style.color = color;
}

/* REGISTER */

function registerUser() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    if (!email || !password) {

        showMessage(
            "Please enter email and password."
        );

        return;
    }

    if (password.length < 6) {

        showMessage(
            "Password must be at least 6 characters."
        );

        return;
    }

    auth.createUserWithEmailAndPassword(
        email,
        password
    )

    .then((userCredential) => {

        const user =
            userCredential.user;

        user.sendEmailVerification()

        .then(() => {

            showMessage(
                "Account created. Verification email sent.",
                "green"
            );

        });

    })

    .catch((error) => {

        showMessage(error.message);

    });
}

/* LOGIN */

function loginUser() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    auth.signInWithEmailAndPassword(
        email,
        password
    )

    .then((userCredential) => {

        const user =
            userCredential.user;

        if (!user.emailVerified) {

            auth.signOut();

            showMessage(
                "Please verify your email before login."
            );

            return;
        }

        window.location.href =
            "index.html";

    })

    .catch((error) => {

        showMessage(error.message);

    });
}

/* FORGOT PASSWORD */

function resetPassword() {

    const email =
        document.getElementById("email").value.trim();

    if (!email) {

        showMessage(
            "Please enter your email address first."
        );

        return;
    }

    auth.sendPasswordResetEmail(email)

    .then(() => {

        alert(
            "Password reset email sent. If you don't see it within a few minutes, check your Spam, Junk, or Promotions folder."
        );

        showMessage(
            "Password reset email sent successfully.",
            "green"
        );

    })

    .catch((error) => {

        showMessage(error.message);

    });
}

/* LOGOUT */

function logoutUser() {

    auth.signOut()

    .then(() => {

        window.location.href =
            "login.html";

    })

    .catch((error) => {

        console.log(error);

    });
}

/* AUTH STATE */

auth.onAuthStateChanged((user) => {

    const emailElement =
        document.getElementById("userEmail");

    if (user && emailElement) {

        emailElement.innerText =
            user.email;
    }

});