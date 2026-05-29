const firebaseConfig = {
  apiKey: "AIzaSyDMemWHQxRyE3Ed4GLsFJRsZdmHXlHvLvk",
  authDomain: "expensetrackerpro-c1460.firebaseapp.com",
  projectId: "expensetrackerpro-c1460",
  storageBucket: "expensetrackerpro-c1460.firebasestorage.app",
  messagingSenderId: "334346124960",
  appId: "1:334346124960:web:04a2a4eba01bcd757493c5",
  measurementId: "G-2L19VFK6V0"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let expenses = [];
let chart = null;

function registerUser(){

let email =
document.getElementById("email").value;

let password =
document.getElementById("password").value;

auth.createUserWithEmailAndPassword(
email,
password
)
.then(()=>alert("Registered"))
.catch(err=>alert(err.message));
}

function loginUser(){

let email =
document.getElementById("email").value;

let password =
document.getElementById("password").value;

auth.signInWithEmailAndPassword(
email,
password
)
.then(()=>alert("Login Success"))
.catch(err=>alert(err.message));
}

function logoutUser(){
auth.signOut();
}

auth.onAuthStateChanged(user=>{

if(user){

currentUser = user;

loadExpenses();

}else{

currentUser = null;
expenses = [];

renderTable();
}
});

function saveExpense(){

if(!currentUser){
alert("Login First");
return;
}

const date =
document.getElementById("date").value;

const category =
document.getElementById("category").value;

const amount =
Number(
document.getElementById("amount").value
);

db.collection("expenses").add({

uid: currentUser.uid,
date,
category,
amount

});
}

function loadExpenses(){

db.collection("expenses")
.where(
"uid",
"==",
currentUser.uid
)
.onSnapshot(snapshot=>{

expenses = [];

snapshot.forEach(doc=>{

expenses.push({

id: doc.id,
...doc.data()

});

});

renderTable();
});
}

function deleteExpense(id){

db.collection("expenses")
.doc(id)
.delete();
}

function renderTable(){

let search =
document.getElementById("search")
?.value
.toLowerCase() || "";

let html = "";
let total = 0;

let categoryTotals = {};

expenses.forEach(exp=>{

if(
!exp.category
.toLowerCase()
.includes(search)
){
return;
}

total += exp.amount;

categoryTotals[exp.category] =
(categoryTotals[exp.category]||0)
+ exp.amount;

html += `
<tr>
<td>${exp.date}</td>
<td>${exp.category}</td>
<td>₹${exp.amount}</td>
<td>
<button
onclick="deleteExpense('${exp.id}')">
Delete
</button>
</td>
</tr>
`;
});

document.getElementById(
"expenseTable"
).innerHTML = html;

document.getElementById(
"total"
).innerHTML =
"Total ₹" + total;

drawChart(categoryTotals);
}

function drawChart(data){

const ctx =
document.getElementById(
"expenseChart"
);

if(chart){
chart.destroy();
}

chart = new Chart(ctx,{

type:"pie",

data:{
labels:Object.keys(data),

datasets:[{
data:Object.values(data)
}]
}

});
}