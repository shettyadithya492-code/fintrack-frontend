const BASE_URL =
    "http://localhost:5000/api/auth";

// Force fresh login every time
localStorage.removeItem("user");

// ==========================
// MESSAGE HELPER
// ==========================
function setMessage(
    msg,
    color = "#dc2626"
) {

    const el =
        document.getElementById("message");

    if (el) {

        el.innerText = msg;
        el.style.color = color;
    }
}

// ==========================
// EMAIL VALIDATION
// ==========================
function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}

// ==========================
// TOGGLE PIN VISIBILITY
// ==========================
function togglePinVisibility() {

    const pinInput =
        document.getElementById("pin");

    const toggleButton =
        document.getElementById("togglePin");

    if (pinInput.type === "password") {

        pinInput.type = "text";

        toggleButton.innerText = "Hide";

    } else {

        pinInput.type = "password";

        toggleButton.innerText = "Show";
    }
}

// ==========================
// LOGIN USER
// ==========================
async function login() {

    const email =
        document.getElementById("email")
            .value
            .trim();

    const pin =
        document.getElementById("pin")
            .value
            .trim();

    if (!email || !pin) {

        return setMessage(
            "Please enter email and PIN."
        );
    }

    if (!validateEmail(email)) {

        return setMessage(
            "Enter valid email address."
        );
    }

    if (
        pin.length !== 4 ||
        isNaN(pin)
    ) {

        return setMessage(
            "PIN must be exactly 4 digits."
        );
    }

    try {

        setMessage(
            "Logging in...",
            "#2563eb"
        );

        const response = await fetch(
            `${BASE_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    pin
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            return setMessage(
                data.message ||
                "Login failed."
            );
        }

        // Save User
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        setMessage(
            "Login successful!",
            "#16a34a"
        );

        // Welcome Animation
        showAnimeWelcome();

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1800);

    } catch (error) {

        console.error(error);

        setMessage(
            "Unable to reach server."
        );
    }
}

// ==========================
// ANIME WELCOME
// ==========================
function showAnimeWelcome() {

    const welcome =
        document.getElementById(
            "animeWelcome"
        );

    if (!welcome) return;

    welcome.classList.add("active");
}

// ==========================
// EVENT LISTENERS
// ==========================
document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .getElementById("togglePin")
            .addEventListener(
                "click",
                togglePinVisibility
            );

        document
            .getElementById("loginForm")
            .addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    login();
                }
            );
    }
);