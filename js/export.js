function exportCSV(){

let csv =
"Date,Category,Amount\n";

expenses.forEach(exp=>{

csv +=
`${exp.date},${exp.category},${exp.amount}\n`;

});

let blob =
new Blob([csv]);

let a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"expenses.csv";

a.click();
}

function exportPDF(){

const { jsPDF } =
window.jspdf;

let pdf =
new jsPDF();

pdf.text(
"Expense Report",
20,
20
);

let y = 40;

expenses.forEach(exp=>{

pdf.text(
`${exp.date} ${exp.category} ₹${exp.amount}`,
20,
y
);

y += 10;

});

pdf.save(
"expenses.pdf"
);
}