const buyerTable = document.getElementById("buyerTable");

db.collection("stock").onSnapshot(snapshot => {
  buyerTable.innerHTML = "";
  const merged = {};

  snapshot.forEach(doc => {
    const pet = doc.data();
    const key = `${pet.name}__${pet.price}`;
    if (!merged[key]) merged[key] = { name: pet.name, qty: 0, price: pet.price };
    merged[key].qty += pet.qty;
  });

  Object.values(merged).forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.price}</td>
    `;
    buyerTable.appendChild(row);
  });
});