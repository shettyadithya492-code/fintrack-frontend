const BASE_URL =
    "http://localhost:5000/api/auth";

let otpVerified = false;

// ==========================
// MESSAGE HELPER
// ==========================
function setMessage(
    msg,
    color = "#dc2626"
) {

    const el =
        document.getElementById("message");

    if (!el) return;

    el.innerText = msg;
    el.style.color = color;
}

// ==========================
// EMAIL VALIDATION
// ==========================
function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}

// ==========================
// SEND OTP
// ==========================
async function sendOTP() {

    const email =
        document.getElementById("email")
            .value
            .trim();

    otpVerified = false;

    if (!validateEmail(email)) {

        return setMessage(
            "Enter valid email address"
        );
    }

    try {

        setMessage(
            "Sending OTP...",
            "#2563eb"
        );

        const res = await fetch(
            `${BASE_URL}/send-otp`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {

            return setMessage(
                data.message || "Failed to send OTP"
            );
        }

        setMessage(
            "OTP sent to your email",
            "#16a34a"
        );

        document
            .getElementById("otpSection")
            .classList.remove("hidden");

    } catch (error) {

        console.error(error);

        setMessage(
            "Failed to send OTP"
        );
    }
}

// ==========================
// VERIFY OTP
// ==========================
async function verifyOTP() {

    const email =
        document.getElementById("email")
            .value
            .trim();

    const otp =
        document.getElementById("otp")
            .value
            .trim();

    if (!otp) {

        return setMessage(
            "Enter OTP"
        );
    }

    try {

        setMessage(
            "Verifying OTP...",
            "#2563eb"
        );

        const res = await fetch(
            `${BASE_URL}/verify-otp`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    otp
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {

            return setMessage(
                data.message || "Invalid OTP"
            );
        }

        otpVerified = true;

        setMessage(
            "OTP verified successfully",
            "#16a34a"
        );

        document
            .getElementById("pinSection")
            .classList.remove("hidden");

    } catch (error) {

        console.error(error);

        setMessage(
            "OTP verification failed"
        );
    }
}

// ==========================
// REGISTER USER
// ==========================
async function register() {

    if (!otpVerified) {

        return setMessage(
            "Verify OTP first"
        );
    }

    const name =
        document.getElementById("name")
            .value
            .trim();

    const email =
        document.getElementById("email")
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

    if (
        !name ||
        !email ||
        !pin ||
        !confirmPin
    ) {

        return setMessage(
            "All fields are required"
        );
    }

    if (!validateEmail(email)) {

        return setMessage(
            "Enter valid email address"
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
            "Registering...",
            "#2563eb"
        );

        const res = await fetch(
            `${BASE_URL}/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name,
                    email,
                    pin,
                    confirmPin
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {

            return setMessage(
                data.message || "Registration failed"
            );
        }

        setMessage(
            "Registered successfully!",
            "#16a34a"
        );

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1000);

    } catch (error) {

        console.error(error);

        setMessage(
            "Registration failed"
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
            .getElementById("sendOtp")
            .addEventListener(
                "click",
                sendOTP
            );

        document
            .getElementById("verifyOtp")
            .addEventListener(
                "click",
                verifyOTP
            );

        document
            .getElementById("registerButton")
            .addEventListener(
                "click",
                register
            );

        document
            .getElementById("registerForm")
            .addEventListener(
                "submit",
                event => event.preventDefault()
            );
    }
);