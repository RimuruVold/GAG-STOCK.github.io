const firebaseConfig = {
  apiKey: "AIzaSyDPc2OGZJkhxAAMHH-vkPq8SDCz-Y1kdxI",
  authDomain: "gag-stock-ea694.firebaseapp.com",
  databaseURL: "https://gag-stock-ea694-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gag-stock-ea694",
  storageBucket: "gag-stock-ea694.firebasestorage.app",
  messagingSenderId: "469914195593",
  appId: "1:469914195593:web:17209f759273a279ed9858"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let stock = [];
let isAdmin = false;
let currentKeyword = "";

db.ref('stock').on('value', snapshot => {
  const data = snapshot.val();
  stock = data ? data : [];
  renderTable();
});

function renderTable() {
  const table = document.getElementById('petTable');
  table.innerHTML = '';
  stock.forEach((pet, index) => {
    if (pet.name.toLowerCase().includes(currentKeyword)) {
      const row = document.createElement('tr');
      row.className = 'pet-row';
      row.innerHTML = `
        <td>${pet.name}</td>
        <td class="clickable" onclick="editField(${index}, 'qty')">${pet.qty}</td>
        <td class="clickable" onclick="editField(${index}, 'price')">${pet.price}</td>
        <td class="admin-column">
          ${isAdmin ? `
            <button class='qty-btn' onclick='changeQty(${index}, 1)'>+</button>
            <button class='qty-btn' onclick='changeQty(${index}, -1)'>-</button>
          ` : ''}
        </td>
      `;
      table.appendChild(row);
    }
  });

  document.querySelectorAll('.admin-column').forEach(col => {
    col.style.display = isAdmin ? 'table-cell' : 'none';
  });
  document.querySelector('.admin-controls').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('saveBtn').classList.toggle('hidden', !isAdmin);
  document.getElementById('logoutBtn').classList.toggle('hidden', !isAdmin);
}

function toggleLogin() {
  const loginPage = document.getElementById('loginPage');
  loginPage.style.display = loginPage.style.display === 'flex' ? 'none' : 'flex';
}

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user === 'admin' && pass === 'Skull771') {
    isAdmin = true;
    toggleLogin();
    renderTable();
  } else {
    alert('Invalid credentials.');
  }
}

function logout() {
  isAdmin = false;
  renderTable();
}

function changeQty(index, delta) {
  stock[index].qty += delta;
  if (stock[index].qty < 0) stock[index].qty = 0;
  renderTable();
}

function addNewPet() {
  const name = document.getElementById('newPetName').value.trim();
  const qty = parseInt(document.getElementById('newPetQty').value);
  const price = parseInt(document.getElementById('newPetPrice').value);
  if (name && !isNaN(qty) && !isNaN(price)) {
    stock.push({ name, qty, price });
    document.getElementById('newPetName').value = '';
    document.getElementById('newPetQty').value = '';
    document.getElementById('newPetPrice').value = '';
    renderTable();
  }
}

function editField(index, field) {
  if (!isAdmin) return;
  const newValue = prompt(`Enter new ${field}:`, stock[index][field]);
  if (newValue !== null && !isNaN(newValue)) {
    stock[index][field] = parseInt(newValue);
    renderTable();
  }
}

function saveStock() {
  stock = stock.filter(p => p.qty > 0);
  db.ref('stock').set(stock);
  alert('Stock saved and synced online.');
  renderTable();
}

function filterPets() {
  currentKeyword = document.getElementById('searchBox').value.toLowerCase();
  renderTable();
}

function sortStock() {
  const type = document.getElementById('sortSelect').value;
  if (type === 'name-asc') stock.sort((a, b) => a.name.localeCompare(b.name));
  else if (type === 'name-desc') stock.sort((a, b) => b.name.localeCompare(a.name));
  else if (type === 'price-asc') stock.sort((a, b) => a.price - b.price);
  else if (type === 'price-desc') stock.sort((a, b) => b.price - a.price);
  else if (type === 'qty-asc') stock.sort((a, b) => a.qty - b.qty);
  else if (type === 'qty-desc') stock.sort((a, b) => b.qty - a.qty);
  renderTable();
}

function generateCopyList() {
  const input = document.getElementById('copyInput').value;
  const names = input.split(',').map(n => n.trim().toLowerCase());
  let list = \"#WTS\\n\";
  names.forEach(name => {
    const found = stock.find(p => p.name.toLowerCase() === name);
    if (found) {
      list += `${found.name} (${found.qty}) r ${found.price}\\n`;
    }
  });
  list += \"\\nMINAT? PM/TAG DI GRUP\\nNEGO DI PM!!\\nDIRECT/MM FEE LU\";
  document.getElementById('copyOutput').value = list;
  document.getElementById('copyOutput').select();
  document.execCommand(\"copy\");
  alert(\"Copied selected pets to clipboard!\");
}

function generateFullCopyList() {
  let list = \"#WTS\\n\";
  stock.forEach(p => {
    list += `${p.name} (${p.qty}) r ${p.price}\\n`;
  });
  list += \"\\nMINAT? PM/TAG DI GRUP\\nNEGO DI PM!!\\nDIRECT/MM FEE LU\";
  document.getElementById('copyOutput').value = list;
  document.getElementById('copyOutput').select();
  document.execCommand(\"copy\");
  alert(\"Copied full stock list to clipboard!\");
}

// Disable right-click and developer tools
document.addEventListener('contextmenu', event => {
  if (!window.isAdmin) event.preventDefault();
});
document.addEventListener('keydown', function(e) {
  if (!window.isAdmin) {
    if (
      e.key === \"F12\" ||
      (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
    }
  }
});