const BASE_URL = "https://fintrack-backend-dv9z.onrender.com/api/transactions";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "index.html";
}

let allTransactions = [];
let editingTransactionId = null;

// ==========================
// MESSAGE
// ==========================
function setMessage(msg) {
    document.getElementById("message").innerText = msg;
}

// ==========================
// LOAD TRANSACTIONS
// ==========================
async function loadTransactions() {

    try {

      const res = await fetch(
    `${BASE_URL}/all?phone=${user.phone}`
);
        const data = await res.json();

        console.log("Transactions:", data);

        if (!res.ok) {
            return setMessage(data.message || "Failed to load");
        }

        allTransactions = data;

        updateSummary(allTransactions);

        renderTransactions(allTransactions);

    } catch (err) {

        console.error(err);

        setMessage("Failed to load transactions");
    }
}

// ==========================
// RENDER TABLE
// ==========================
function renderTransactions(transactions) {

    const table = document.getElementById("transactionsTable");

    table.innerHTML = "";

    if (transactions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">No transactions found</td>
            </tr>
        `;

        return;
    }

    transactions.forEach(transaction => {

        const row = `
            <tr>

                <td>
                    ${new Date(transaction.date).toLocaleDateString()}
                </td>

                <td class="${transaction.type}">
                    ${transaction.type}
                </td>

                <td>
                    ₹${transaction.amount}
                </td>

                <td>
                    ${transaction.category}
                </td>

                <td>
                    ${transaction.mode || "-"}
                </td>

                <td>
                    ${transaction.note || "-"}
                </td>

                <td class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editTransaction('${transaction._id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction('${transaction._id}')"
                    >
                        Delete
                    </button>

                </td>

            </tr>
        `;

        table.innerHTML += row;
    });
}

// ==========================
// FILTER TYPE
// ==========================
function filterTransactions(type, event) {

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    event.target.classList.add("active");

    if (type === "all") {
        renderTransactions(allTransactions);
        return;
    }

    const filtered = allTransactions.filter(transaction =>
        transaction.type === type
    );

    renderTransactions(filtered);
}

// ==========================
// SEARCH
// ==========================
function searchTransactions() {

    const value = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = allTransactions.filter(transaction => {

        return (

            transaction.category.toLowerCase().includes(value)

            ||

            transaction.type.toLowerCase().includes(value)

            ||

            transaction.mode.toLowerCase().includes(value)

            ||

            (transaction.note || "")
            .toLowerCase()
            .includes(value)
        );
    });

    renderTransactions(filtered);
}

// ==========================
// FILTER DATE
// ==========================
function filterByDate() {

    const selectedDate =
        document.getElementById("dateFilter").value;

    if (!selectedDate) {
        renderTransactions(allTransactions);
        return;
    }

    const filtered = allTransactions.filter(transaction => {

        const transactionDate =
            new Date(transaction.date)
            .toISOString()
            .split("T")[0];

        return transactionDate === selectedDate;
    });

    renderTransactions(filtered);
}

// ==========================
// FILTER CATEGORY
// ==========================
function filterByCategory() {

    const category =
        document.getElementById("categoryFilter").value;

    if (!category) {
        renderTransactions(allTransactions);
        return;
    }

    const filtered = allTransactions.filter(transaction =>
        transaction.category === category
    );

    renderTransactions(filtered);
}

// ==========================
// DELETE TRANSACTION
// ==========================
async function deleteTransaction(id) {

    const confirmDelete =
        confirm("Delete this transaction?");

    if (!confirmDelete) return;

    try {

        const res = await fetch(
            `${BASE_URL}/delete/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return setMessage(data.message || "Delete failed");
        }

        setMessage("Transaction deleted");

        loadTransactions();

    } catch (err) {

        console.error(err);

        setMessage("Delete failed");
    }
}

// ==========================
// OPEN EDIT MODAL
// ==========================
function openEditModal(id) {

    const transaction =
        allTransactions.find(t => t._id === id);

    if (!transaction) {
        return setMessage("Transaction not found");
    }

    editingTransactionId = id;

    document.getElementById("editAmount").value =
        transaction.amount;

    document.getElementById("editCategory").value =
        transaction.category;

    document.getElementById("editMode").value =
        transaction.mode || "Cash";

    document.getElementById("editNote").value =
        transaction.note || "";

    const modal = document.getElementById("editModal");

    modal.classList.add("active");

    modal.setAttribute("aria-hidden", "false");
}

// ==========================
// CLOSE MODAL
// ==========================
function closeEditModal() {

    const modal = document.getElementById("editModal");

    modal.classList.remove("active");

    modal.setAttribute("aria-hidden", "true");
}

// ==========================
// SAVE EDIT
// ==========================
async function saveEditTransaction() {

    const amount =
        Number(document.getElementById("editAmount").value);

    const category =
        document.getElementById("editCategory").value.trim();

    const mode =
        document.getElementById("editMode").value;

    const note =
        document.getElementById("editNote").value.trim();

    if (!amount || !category || !mode) {
        return setMessage(
            "Amount, category and mode required"
        );
    }

    try {

        const res = await fetch(
            `${BASE_URL}/update/${editingTransactionId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    amount,
                    category,
                    mode,
                    note
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return setMessage(data.message || "Update failed");
        }

        closeEditModal();

        setMessage("Transaction updated");

        loadTransactions();

    } catch (err) {

        console.error(err);

        setMessage("Update failed");
    }
}

// ==========================
// EDIT BUTTON
// ==========================
function editTransaction(id) {
    openEditModal(id);
}

// ==========================
// SUMMARY
// ==========================
function updateSummary(transactions) {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += Number(transaction.amount);
        } else {
            expense += Number(transaction.amount);
        }
    });

    const balance = income - expense;

    document.getElementById("totalIncome").innerText =
        `₹${income}`;

    document.getElementById("totalExpense").innerText =
        `₹${expense}`;

    document.getElementById("balance").innerText =
        `₹${balance}`;
}

// ==========================
// INITIAL LOAD
// ==========================
loadTransactions();