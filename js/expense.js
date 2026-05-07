const BASE_URL =
    "http://localhost:5000/api/transactions";

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
}

// ==========================
// ELEMENTS
// ==========================
const categorySelect =
    document.getElementById(
        "category"
    );

const otherInput =
    document.getElementById(
        "otherCategory"
    );

const otherCategoryWrapper =
    document.getElementById(
        "otherCategoryWrapper"
    );

const dateInput =
    document.getElementById(
        "date"
    );

const modeSelect =
    document.getElementById(
        "mode"
    );

// ==========================
// CATEGORY CHANGE
// ==========================
categorySelect.addEventListener(
    "change",
    () => {

        if (
            categorySelect.value === "Other"
        ) {

            otherCategoryWrapper.style.display =
                "block";

        } else {

            otherCategoryWrapper.style.display =
                "none";
        }
    }
);

// ==========================
// DEFAULT DATE
// ==========================
if (dateInput) {

    dateInput.value =
        new Date()
            .toISOString()
            .split("T")[0];
}

// ==========================
// MESSAGE
// ==========================
function setMessage(msg) {

    document.getElementById("message")
        .innerText = msg;
}

// ==========================
// ADD EXPENSE
// ==========================
async function addExpense() {

    const amount =
        document.getElementById(
            "amount"
        ).value;

    let category =
        categorySelect.value;

    const mode =
        modeSelect
            ? modeSelect.value
            : "";

    const date =
        dateInput
            ? dateInput.value
            : "";

    const note =
        document.getElementById(
            "note"
        ).value;

    // Validation
    if (
        !amount ||
        !category ||
        !mode ||
        !date
    ) {

        return setMessage(
            "All fields required"
        );
    }

    // Custom Category
    if (
        category === "Other"
    ) {

        category =
            otherInput.value;
    }

    try {

        const res = await fetch(
            `${BASE_URL}/add-expense`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    email: user.email,

                    amount,
                    category,
                    mode,
                    note,
                    date
                })
            }
        );

        const data =
            await res.json();

        if (!res.ok) {

            return setMessage(
                data.message
            );
        }

        setMessage(
            "Expense added successfully"
        );

        // Reset Form
        document.getElementById(
            "expenseForm"
        ).reset();

        // Reset Date
        if (dateInput) {

            dateInput.value =
                new Date()
                    .toISOString()
                    .split("T")[0];
        }

        // Hide Other Category
        otherCategoryWrapper.style.display =
            "none";

    } catch (err) {

        console.error(err);

        setMessage(
            "Error adding expense"
        );
    }
}