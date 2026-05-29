let expenses = [];
let currentUser = null;
let chartInstance = null;

// ================= AUTH =================
auth.onAuthStateChanged(user => {

    if (user) {

        currentUser = user;

        loadExpenses();
        loadBudget();

    } else {

        currentUser = null;
        expenses = [];

        renderTable();
        resetDashboard();
    }
});


// ================= SAVE EXPENSE =================
function saveExpense() {

    if (!currentUser) {
        alert("Please login");
        return;
    }

    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;

    if (!date || !category || !amount) {
        alert("Fill all fields");
        return;
    }

    db.collection("expenses")
        .add({
            uid: currentUser.uid,
            date: date,
            category: category,
            amount: Number(amount)
        })
        .then(() => {

            document.getElementById("date").value = "";
            document.getElementById("category").value = "";
            document.getElementById("amount").value = "";

        })
        .catch(error => {
            console.log(error);
        });
}


// ================= LOAD EXPENSES =================
function loadExpenses() {

    db.collection("expenses")
        .where("uid", "==", currentUser.uid)
        .onSnapshot(snapshot => {

            expenses = [];

            snapshot.forEach(doc => {

                expenses.push({
                    id: doc.id,
                    ...doc.data()
                });

            });

            renderTable();

        });
}


// ================= DELETE EXPENSE =================
function deleteExpense(id) {

    db.collection("expenses")
        .doc(id)
        .delete()
        .catch(error => {
            console.log(error);
        });
}


// ================= RENDER TABLE =================
function renderTable() {

    let html = "";
    let total = 0;

    expenses.forEach(exp => {

        total += Number(exp.amount);

        html += `
        <tr>
            <td>${exp.date}</td>
            <td>${exp.category}</td>
            <td>₹${exp.amount}</td>
            <td>
                <button class="delete-btn"
                    onclick="deleteExpense('${exp.id}')">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("expenseTable").innerHTML = html;

    document.getElementById("total").innerText =
        "₹" + total;

    updateDashboard(total);

    updateChart(expenses);

    updateInsights();
}


// ================= DASHBOARD =================
function updateDashboard(totalExpense) {

    const budget =
        Number(localStorage.getItem("budget")) || 0;

    // TOTAL EXPENSE
    document.getElementById("totalExpenseCard").innerText =
        "₹" + totalExpense;

    // BUDGET
    document.getElementById("budgetCard").innerText =
        "₹" + budget;

    // REMAINING
    document.getElementById("remainingCard").innerText =
        "₹" + (budget - totalExpense);

    // THIS MONTH
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let monthTotal = 0;

    expenses.forEach(exp => {

        const expDate = new Date(exp.date);

        if (
            expDate.getMonth() === currentMonth &&
            expDate.getFullYear() === currentYear
        ) {

            monthTotal += Number(exp.amount);
        }
    });

    document.getElementById("monthExpenseCard").innerText =
        "₹" + monthTotal;
}


// ================= SMART INSIGHTS =================
function updateInsights() {

    if (!expenses.length) {

        document.getElementById("topCategory").innerText = "-";

        document.getElementById("avgExpense").innerText = "₹0";

        document.getElementById("totalTransactions").innerText = "0";

        document.getElementById("highestExpense").innerText = "₹0";

        return;
    }

    let total = 0;
    let highest = 0;

    let categoryMap = {};

    expenses.forEach(exp => {

        let amount = Number(exp.amount);

        total += amount;

        if (amount > highest) {
            highest = amount;
        }

        categoryMap[exp.category] =
            (categoryMap[exp.category] || 0) + amount;
    });

    let topCategory = Object.keys(categoryMap)
        .reduce((a, b) =>
            categoryMap[a] > categoryMap[b] ? a : b
        );

    let avg = total / expenses.length;

    document.getElementById("topCategory").innerText =
        topCategory;

    document.getElementById("avgExpense").innerText =
        "₹" + avg.toFixed(2);

    document.getElementById("totalTransactions").innerText =
        expenses.length;

    document.getElementById("highestExpense").innerText =
        "₹" + highest;
}


// ================= SAVE BUDGET =================
function saveBudget() {

    const budgetInput =
        document.getElementById("monthlyBudget");

    const budget =
        Number(budgetInput.value);

    if (!budget || budget <= 0) {

        alert("Enter valid budget");

        return;
    }

    localStorage.setItem("budget", budget);

    loadBudget();

    budgetInput.value = "";
}


// ================= LOAD BUDGET =================
function loadBudget() {

    const budget =
        Number(localStorage.getItem("budget")) || 0;

    document.getElementById("budgetCard").innerText =
        "₹" + budget;

    const total = expenses.reduce(
        (sum, exp) =>
            sum + Number(exp.amount),
        0
    );

    document.getElementById("remainingCard").innerText =
        "₹" + (budget - total);
}


// ================= RESET DASHBOARD =================
function resetDashboard() {

    document.getElementById("totalExpenseCard").innerText =
        "₹0";

    document.getElementById("monthExpenseCard").innerText =
        "₹0";

    document.getElementById("budgetCard").innerText =
        "₹0";

    document.getElementById("remainingCard").innerText =
        "₹0";
}


// ================= CHART =================
function updateChart(data) {

    const canvas =
        document.getElementById("expenseChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let categories = {};

    data.forEach(exp => {

        categories[exp.category] =
            (categories[exp.category] || 0)
            + Number(exp.amount);

    });

    const labels = Object.keys(categories);

    const values = Object.values(categories);

    // DESTROY OLD CHART
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{
                data: values
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: "bottom"
                }
            }
        }
    });
}