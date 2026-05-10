
const BASE_URL =
    "https://fintrack-backend-dv9z.onrender.com/api/transactions";

// ==========================
// LOAD USER
// ==========================
const user =
    JSON.parse(
        localStorage.getItem("user")
    );

if (!user) {

    window.location.href =
        "index.html";

} else {

    document.getElementById("welcome")
        .innerText =
        `Welcome, ${user.name}`;
}

// ==========================
// LOAD SUMMARY
// ==========================
async function loadSummary() {

    try {

        const res = await fetch(
            `${BASE_URL}/summary?phone=${user.phone}`
        );

        const data =
            await res.json();

        if (!res.ok) {

            console.log(
                data.message
            );

            return;
        }

        document.getElementById("income")
            .innerText =
            "₹" + data.income;

        document.getElementById("expense")
            .innerText =
            "₹" + data.expense;

        document.getElementById("balance")
            .innerText =
            "₹" + data.balance;

    } catch (err) {

        console.error(err);
    }
}

// ==========================
// INITIAL LOAD
// ==========================
loadSummary();

// ==========================
// LOGOUT
// ==========================
function logout() {

    localStorage.removeItem("user");

    window.location.href =
        "index.html";
}

// ==========================
// DELETE ACCOUNT
// ==========================
async function deleteAccount() {

    const confirmDelete =
        confirm(
            "Delete your account permanently?"
        );

    if (!confirmDelete) return;

    const pin =
        prompt(
            "Enter your 4-digit PIN"
        );

    if (!pin) return;

    try {

        const res = await fetch(
    "https://fintrack-backend-dv9z.onrender.com/api/auth/delete-account",
            {
                method: "DELETE",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    phone: user.phone,
                    pin
                })
            }
        );

        const data =
            await res.json();

        if (!res.ok) {

            return alert(
                data.message
            );
        }

        alert(
            "Account deleted successfully"
        );

        localStorage.clear();

        window.location.href =
            "index.html";

    } catch (err) {

        console.error(err);

        alert(
            "Failed to delete account"
        );
    }
}

// ==========================
// NAVIGATION
// ==========================
function goToAddIncome() {

    window.location.href =
        "add-income.html";
}

function goToAddExpense() {

    window.location.href =
        "add-expense.html";
}

function goToViewTransactions() {

    window.location.href =
        "view-transactions.html";
}

function goToAnalytics() {

    window.location.href =
        "analytics.html";
}