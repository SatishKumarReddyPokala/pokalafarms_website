// Simulated checkout database (in-memory)
const checkoutDB = {
  cartItems: [],

  addItem(productName, price) {
    // Check if item exists, increment qty
    const existing = this.cartItems.find(item => item.name === productName);
    if (existing < 10) {
      existing.qty++;
    } else {
      this.cartItems.push({ name: productName, price, qty: 1 });
    }
    this.saveToStorage();
  },

  removeItem(productName) {
    this.cartItems = this.cartItems.filter(item => item.name !== productName);
    this.saveToStorage();
  },

  updateQuantity(index, newQty) {
    if (this.cartItems[index]) {
	  if (newQty < 1) newQty = 1;
      if (newQty > 10) newQty = 10;
      this.cartItems[index].qty = newQty;
      this.saveToStorage();
    }
  },

  getTotalCount() {
    return this.cartItems.reduce((acc, item) => acc + item.qty, 0);
  },

  saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    updateCartCount();  // update count after saving
  },

  loadFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cartItems = JSON.parse(saved);
    }
  }
};

// Update the cart count badge in the header
function updateCartCount() {
  const count = checkoutDB.getTotalCount();
  const cartCountEl = document.getElementById('cart-count');
  if (!cartCountEl) return; // avoid error if element doesn't exist

  if (count > 0) {
    cartCountEl.style.display = 'inline-block';
    cartCountEl.textContent = count;
  } else {
    cartCountEl.style.display = 'none';
  }
}

// Function to add product to cart
function addToCart(name, price) {
  checkoutDB.addItem(name, price);
  alert(`${name} added to cart!`);
}

// On page load, restore cart and update count
window.addEventListener('DOMContentLoaded', () => {
  checkoutDB.loadFromStorage();
  updateCartCount();
});
