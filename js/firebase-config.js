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