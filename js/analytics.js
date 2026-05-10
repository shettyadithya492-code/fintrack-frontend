// =====================
// LOAD USER
// =====================
const BASE_URL = "https://fintrack-backend-dv9z.onrender.com/api/transactions";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "index.html";
}

// =====================
// LOAD DATA & RENDER CHARTS
// =====================
async function loadAnalytics() {
    try {
        const res = await fetch(`${BASE_URL}/all?phone=${user.phone}`);
        const transactions = await res.json();

        if (!res.ok) {
            console.error("Failed to load transactions:", transactions.message);
            return;
        }

        // Calculate summary
        updateSummary(transactions);

        // Render charts
        renderIncomeExpenseChart(transactions);
        renderExpensePieChart(transactions);

    } catch (err) {
        console.error("Error loading analytics:", err);
    }
}

// =====================
// UPDATE SUMMARY
// =====================
function updateSummary(transactions) {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }
    });

    const balance = income - expense;

    document.getElementById("totalIncome").innerText = "₹" + income.toLocaleString();
    document.getElementById("totalExpense").innerText = "₹" + expense.toLocaleString();
    document.getElementById("balance").innerText = "₹" + balance.toLocaleString();
}

// =====================
// INCOME VS EXPENSE BAR CHART
// =====================
function renderIncomeExpenseChart(transactions) {
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');

    // Group by month
    const monthlyData = {};

    transactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expense: 0 };
        }

        if (t.type === 'income') {
            monthlyData[monthKey].income += t.amount;
        } else {
            monthlyData[monthKey].expense += t.amount;
        }
    });

    const labels = Object.keys(monthlyData);
    const incomeData = labels.map(month => monthlyData[month].income);
    const expenseData = labels.map(month => monthlyData[month].expense);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Income',
                data: incomeData,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }, {
                label: 'Expense',
                data: expenseData,
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#374151',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#6b7280'
                    },
                    grid: {
                        color: 'rgba(59, 130, 246, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#6b7280',
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(59, 130, 246, 0.1)'
                    }
                }
            }
        }
    });
}

// =====================
// EXPENSE CATEGORIES PIE CHART
// =====================
function renderExpensePieChart(transactions) {
    const ctx = document.getElementById('expensePieChart').getContext('2d');

    // Filter expenses and group by category
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryData = {};

    expenses.forEach(t => {
        const category = t.category || 'Other';
        categoryData[category] = (categoryData[category] || 0) + t.amount;
    });

    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);

    // Anime-style color palette matching dashboard theme
    const colors = [
        'rgba(59, 130, 246, 0.8)',   // Blue
        'rgba(239, 68, 68, 0.8)',    // Red
        'rgba(34, 197, 94, 0.8)',    // Green
        'rgba(251, 191, 36, 0.8)',   // Yellow
        'rgba(168, 85, 247, 0.8)',   // Purple
        'rgba(236, 72, 153, 0.8)',   // Pink
        'rgba(6, 182, 212, 0.8)',    // Cyan
        'rgba(245, 101, 101, 0.8)'   // Light Red
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
                borderWidth: 3,
                hoverBorderWidth: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#374151',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// =====================
// INITIAL LOAD
// =====================
loadAnalytics();