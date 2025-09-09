// Firebase Config (gunakan milikmu)
const firebaseConfig = {
  apiKey: "AIzaSyDPc2OGZJkhxAAMHH-vkPq8SDCz-Y1kdxI",
  authDomain: "gag-stock-ea694.firebaseapp.com",
  projectId: "gag-stock-ea694",
  storageBucket: "gag-stock-ea694.firebasestorage.app",
  messagingSenderId: "469914195593",
  appId: "1:469914195593:web:17209f759273a279ed9858"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();