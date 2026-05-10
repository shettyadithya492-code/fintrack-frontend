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
}

let allTransactions = [];

// ==========================
// LOAD TRANSACTIONS
// ==========================
async function loadTransactions() {

    try {

        const res = await fetch(
            `${BASE_URL}/all?phone=${user.phone}`
        );

        const data =
            await res.json();

        if (!res.ok) {

            return alert(
                data.message
            );
        }

        allTransactions = data;

    } catch (err) {

        console.error(err);

        alert(
            "Failed to load transactions"
        );
    }
}

// ==========================
// FORMAT DATE
// ==========================
function formatDate(dateValue) {

    const date =
        new Date(dateValue);

    const formatted =
        date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    // Force Excel text
    return "'" + formatted;
}
// ==========================
// ESCAPE CSV VALUE
// ==========================
function escapeCSV(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return '""';
    }

    const stringValue =
        String(value)
            .replace(/"/g, '""');

    return `"${stringValue}"`;
}

// ==========================
// CONVERT TO CSV
// ==========================
function convertToCSV(
    transactions
) {

    const headers = [

        "Date",
        "Type",
        "Amount",
        "Category",
        "Mode",
        "Note"
    ];

    const rows =
        transactions.map(
            transaction => [

                formatDate(
                    transaction.date
                ),

                transaction.type,

                transaction.amount,

                transaction.category,

                transaction.mode || "-",

                transaction.note || "-"
            ]
        );

    const csvContent = [

        headers.join(","),

        ...rows.map(row =>

            row.map(escapeCSV)
                .join(",")
        )

    ].join("\n");

    return csvContent;
}

// ==========================
// DOWNLOAD CSV
// ==========================
function downloadCSV(
    csvContent,
    fileName
) {

    const BOM =
        "\uFEFF";

    const blob =
        new Blob(
            [BOM + csvContent],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );

    const url =
        window.URL
            .createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download = fileName;

    document.body.appendChild(
        link
    );

    link.click();

    document.body.removeChild(
        link
    );

    window.URL.revokeObjectURL(
        url
    );
}

// ==========================
// EXPORT ALL
// ==========================
function exportAllTransactions() {

    if (
        allTransactions.length === 0
    ) {

        return alert(
            "No transactions found"
        );
    }

    const csv =
        convertToCSV(
            allTransactions
        );

    downloadCSV(
        csv,
        "FinTrack_All_Transactions.csv"
    );
}

// ==========================
// EXPORT INCOME
// ==========================
function exportIncome() {

    const incomeTransactions =
        allTransactions.filter(
            transaction =>
                transaction.type === "income"
        );

    if (
        incomeTransactions.length === 0
    ) {

        return alert(
            "No income transactions found"
        );
    }

    const csv =
        convertToCSV(
            incomeTransactions
        );

    downloadCSV(
        csv,
        "FinTrack_Income.csv"
    );
}

// ==========================
// EXPORT EXPENSE
// ==========================
function exportExpense() {

    const expenseTransactions =
        allTransactions.filter(
            transaction =>
                transaction.type === "expense"
        );

    if (
        expenseTransactions.length === 0
    ) {

        return alert(
            "No expense transactions found"
        );
    }

    const csv =
        convertToCSV(
            expenseTransactions
        );

    downloadCSV(
        csv,
        "FinTrack_Expense.csv"
    );
}

// ==========================
// EXPORT MONTHLY REPORT
// ==========================
function exportMonthlyReport() {

    const selectedMonth =
        document.getElementById(
            "monthSelector"
        ).value;

    if (!selectedMonth) {

        return alert(
            "Select a month"
        );
    }

    const filteredTransactions =
        allTransactions.filter(
            transaction => {

                const transactionMonth =
                    new Date(
                        transaction.date
                    )
                    .toISOString()
                    .slice(0, 7);

                return (
                    transactionMonth ===
                    selectedMonth
                );
            }
        );

    if (
        filteredTransactions.length === 0
    ) {

        return alert(
            "No transactions found for selected month"
        );
    }

    const csv =
        convertToCSV(
            filteredTransactions
        );

    downloadCSV(
        csv,
        `FinTrack_${selectedMonth}.csv`
    );
}

// ==========================
// INITIAL LOAD
// ==========================
loadTransactions();