const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');
const loadBtn = document.getElementById('load-btn');
const searchInput = document.getElementById('search-input');

let allProducts = [];

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const category = document.getElementById('category').value;

  const product = {
    title,
    price,
    category,
    description: "User product",
    image: "https://i.pravatar.cc"
  };

  const res = await fetch('https://fakestoreapi.com/products', {
    method: 'POST',
    body: JSON.stringify(product),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await res.json();
  alert("Product Created: " + data.title);
  form.reset();

  allProducts.push(data);
  renderProducts(filterProducts());
});

loadBtn.addEventListener('click', async () => {
  const res = await fetch('https://fakestoreapi.com/products');
  const data = await res.json();
  allProducts = data;
  renderProducts(filterProducts());
});


searchInput.addEventListener('input', () => {
  renderProducts(filterProducts());
});

function filterProducts() {
  const keyword = searchInput.value.toLowerCase();
  return allProducts.filter(product =>
    product.title.toLowerCase().includes(keyword) ||
    product.category.toLowerCase().includes(keyword)
  );
}

async function updateProduct(id) {
  const newTitle = prompt("Enter new title:");
  if (!newTitle) return;

  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title: newTitle }),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await res.json();
  alert("Updated Title: " + data.title);

  const index = allProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    allProducts[index].title = data.title;
    renderProducts(filterProducts());
  }
}

async function deleteProduct(id) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();
  alert("Deleted Product ID: " + data.id);

  allProducts = allProducts.filter(p => p.id !== id);
  renderProducts(filterProducts());
}

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach(product => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${product.title}</strong></p>
      <p>Price: $${product.price}</p>
      <p>Category: ${product.category}</p>
      <button onclick="updateProduct(${product.id})">Update</button>
      <button onclick="deleteProduct(${product.id})">Delete</button>
    `;
    productList.appendChild(div);
  });
}
