// ================= SEARCH =================
document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("search");

    searchInput.addEventListener("keyup", function () {

        let value = this.value.toLowerCase();

        let rows = document.querySelectorAll("#expenseTable tr");

        rows.forEach(row => {

            let category = row.children[1]?.textContent.toLowerCase() || "";
            let amount = row.children[2]?.textContent.toLowerCase() || "";

            if (category.includes(value) || amount.includes(value)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });

    });

});


// ================= CATEGORY FILTER (MISSING FIX) =================
function filterByCategory() {

    let selected = document.getElementById("categoryFilter").value.toLowerCase();

    let rows = document.querySelectorAll("#expenseTable tr");

    rows.forEach(row => {

        let category = row.children[1]?.textContent.toLowerCase() || "";

        if (selected === "all" || category === selected) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}


// ================= RESET FILTER =================
function resetFilter() {

    document.getElementById("search").value = "";
    document.getElementById("categoryFilter").value = "all";

    let rows = document.querySelectorAll("#expenseTable tr");

    rows.forEach(row => {
        row.style.display = "";
    });
}