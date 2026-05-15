const BASE_URL =
"https://fintrack-backend-dv9z.onrender.com/api/auth";

// ==========================
// MESSAGE HELPER
// ==========================
function setMessage(
    message,
    color = "#dc2626"
) {

    const messageEl =
        document.getElementById("message");

    if (!messageEl) return;

    messageEl.innerText = message;
    messageEl.style.color = color;
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
function togglePinVisibility(
    inputId,
    buttonId
) {

    const input =
        document.getElementById(inputId);

    const button =
        document.getElementById(buttonId);

    if (input.type === "password") {

        input.type = "text";
        button.innerText = "Hide";

    } else {

        input.type = "password";
        button.innerText = "Show";
    }
}

// ==========================
// REGISTER USER
// ==========================
async function register() {

    const name =
        document.getElementById("name")
            .value
            .trim();

    const phone =
        document.getElementById("phone")
            .value
            .trim();

    const pin =
        document.getElementById("pin")
            .value
            .trim();

    const confirmPin =
        document.getElementById("confirmPin")
            .value
            .trim();

    // ==========================
    // VALIDATION
    // ==========================

    if (
        !name ||
        !phone ||
        !pin ||
        !confirmPin
    ) {

        return setMessage(
            "All fields are required"
        );
    }

    if (!validatePhone(phone)) {

        return setMessage(
            "Enter valid 10-digit phone number"
        );
    }

    if (
        pin.length !== 4 ||
        isNaN(pin)
    ) {

        return setMessage(
            "PIN must be exactly 4 digits"
        );
    }

    if (pin !== confirmPin) {

        return setMessage(
            "PIN values do not match"
        );
    }

    try {

        setMessage(
            "Creating account...",
            "#2563eb"
        );

        const response =
            await fetch(
                `${BASE_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        phone,
                        pin
                    })
                }
            );

        // ==========================
        // HANDLE EMPTY RESPONSE
        // ==========================
        let data = {};

        try {

            data =
                await response.json();

        } catch {

            data = {};
        }

        // ==========================
        // ERROR RESPONSE
        // ==========================
        if (!response.ok) {

            return setMessage(
                data.message ||
                "Registration failed"
            );
        }

        // ==========================
        // SUCCESS
        // ==========================
        setMessage(
            "Account created successfully!",
            "#16a34a"
        );

        // REDIRECT
        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1500);

    } catch (error) {

        console.error(
            "Register Error:",
            error
        );

        setMessage(
            "Unable to connect to server"
        );
    }
}

// ==========================
// EVENT LISTENERS
// ==========================
document.addEventListener(
    "DOMContentLoaded",
    () => {

        // TOGGLE PIN
        document
            .getElementById("togglePin")
            .addEventListener(
                "click",
                () =>
                    togglePinVisibility(
                        "pin",
                        "togglePin"
                    )
            );

        // TOGGLE CONFIRM PIN
        document
            .getElementById("toggleConfirmPin")
            .addEventListener(
                "click",
                () =>
                    togglePinVisibility(
                        "confirmPin",
                        "toggleConfirmPin"
                    )
            );

        // REGISTER FORM
        document
            .getElementById("registerForm")
            .addEventListener(
                "submit",
                event => {

                    event.preventDefault();

                    register();
                }
            );
    }
);