const BASE_URL = "http://localhost:5000/api/transactions";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "index.html";
}

let barChart;
let pieChart;

// ==========================
// LOAD MONTHLY SUMMARY
// ==========================
async function loadMonthlySummary() {

    const selectedMonth =
        document.getElementById("monthSelector").value;

    if (!selectedMonth) {
        return alert("Select a month");
    }

    try {

        const res = await fetch(
            `${BASE_URL}/all?email=${user.email}`
        );

        const data = await res.json();

        if (!res.ok) {
            return alert(data.message);
        }

        const filteredTransactions =
            data.filter(transaction => {

                const transactionMonth =
                    new Date(transaction.date)
                    .toISOString()
                    .slice(0, 7);

                return transactionMonth === selectedMonth;
            });

        updateSummary(filteredTransactions);

        renderTable(filteredTransactions);

        renderBarChart(filteredTransactions);

        renderPieChart(filteredTransactions);

    } catch (err) {

        console.error(err);

        alert("Failed to load summary");
    }
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

    const savings = income - expense;

    document.getElementById("monthlyIncome").innerText =
        `₹${income}`;

    document.getElementById("monthlyExpense").innerText =
        `₹${expense}`;

    document.getElementById("monthlySavings").innerText =
        `₹${savings}`;

    document.getElementById("monthlyTransactions").innerText =
        transactions.length;
}

// ==========================
// TABLE
// ==========================
function renderTable(transactions) {

    const table =
        document.getElementById("monthlyTable");

    table.innerHTML = "";

    if (transactions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No transactions found
                </td>
            </tr>
        `;

        return;
    }

    transactions.forEach(transaction => {

        const row = `
            <tr>

                <td>
                    ${new Date(transaction.date)
                        .toLocaleDateString()}
                </td>

                <td>
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

            </tr>
        `;

        table.innerHTML += row;
    });
}

// ==========================
// BAR CHART
// ==========================
function renderBarChart(transactions) {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += Number(transaction.amount);
        } else {
            expense += Number(transaction.amount);
        }
    });

    const ctx =
        document.getElementById("monthlyBarChart");

    if (barChart) {
        barChart.destroy();
    }

    barChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: ["Income", "Expense"],

            datasets: [{
                label: "Amount",

                data: [income, expense],

                borderWidth: 1
            }]
        },

        options: {
            responsive: true
        }
    });
}

// ==========================
// PIE CHART
// ==========================
function renderPieChart(transactions) {

    const expenses =
        transactions.filter(
            transaction => transaction.type === "expense"
        );

    const categoryTotals = {};

    expenses.forEach(transaction => {

        if (!categoryTotals[transaction.category]) {
            categoryTotals[transaction.category] = 0;
        }

        categoryTotals[transaction.category] +=
            Number(transaction.amount);
    });

    const labels = Object.keys(categoryTotals);

    const values = Object.values(categoryTotals);

    const ctx =
        document.getElementById("monthlyPieChart");

    if (pieChart) {
        pieChart.destroy();
    }

    pieChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{
                data: values
            }]
        },

        options: {
            responsive: true
        }
    });
}