const BASE_URL =
"https://fintrack-backend-dv9z.onrender.com/api/auth";

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
// PHONE VALIDATION
// ==========================
function validatePhone(phone) {

    return /^[6-9]\d{9}$/
        .test(phone);
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

    const phone =
        document.getElementById("phone")
            .value
            .trim();

    const pin =
        document.getElementById("pin")
            .value
            .trim();

    // VALIDATION
    if (!phone || !pin) {

        return setMessage(
            "Please enter phone number and PIN."
        );
    }

    if (!validatePhone(phone)) {

        return setMessage(
            "Enter valid 10-digit phone number."
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
                    phone,
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

        // SAVE USER
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        setMessage(
            "Login successful!",
            "#16a34a"
        );

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1000);

    } catch (error) {

        console.error(error);

        setMessage(
            "Unable to reach server."
        );
    }
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