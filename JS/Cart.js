document.addEventListener("DOMContentLoaded", () => {
  const cart = {};
  const cartBtn = document.getElementById("cartSidebarBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeSidebarBtn = document.getElementById("closeSidebar");
  const cartItemsList = document.getElementById("cartItems");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cartTotal");

  // 🔄 Update cart icon badge
  function updateCartCount() {
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }

  // 🛒 Animate icon
  function animateCartIcon() {
    cartBtn.classList.add("added-animation");
    setTimeout(() => cartBtn.classList.remove("added-animation"), 300);
  }

  // 📦 Update cart sidebar
  function updateCartSidebar() {
    cartItemsList.innerHTML = "";
    let total = 0;

    Object.entries(cart).forEach(([key, item]) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <span>${item.name}</span>
        <div class="cart-controls">
          <button class="qty-minus" data-name="${item.name}">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-plus" data-name="${item.name}">+</button>
        </div>
      `;
      cartItemsList.appendChild(li);
      total += item.quantity * item.price;
    });

    cartTotal.textContent = total.toFixed(2);
    updateCartCount();
    attachQtyButtons();
  }

  // ➕➖ Bind quantity buttons
  function attachQtyButtons() {
    document.querySelectorAll(".qty-minus").forEach(btn => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        if (cart[name].quantity > 1) {
          cart[name].quantity--;
        } else {
          delete cart[name];
        }
        updateCartSidebar();
        updateProductButtons();
      };
    });

    document.querySelectorAll(".qty-plus").forEach(btn => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        cart[name].quantity++;
        updateCartSidebar();
        updateProductButtons();
      };
    });
  }

  // 🔄 Replace "Add to Cart" with qty controls
  function updateProductButtons() {
    document.querySelectorAll(".product-card").forEach(card => {
      const name = card.querySelector(".product-name").textContent;
      const control = card.querySelector(".product-control");

      if (cart[name]) {
        control.innerHTML = `
          <button class="qty-minus" data-name="${name}">−</button>
          <span class="qty-display">${cart[name].quantity}</span>
          <button class="qty-plus" data-name="${name}">+</button>
        `;
      } else {
        control.innerHTML = `<button class="add-cart" data-product="${name}">Add to Cart</button>`;
      }
    });
    attachQtyButtons();
    attachAddButtons();
  }

  // 🧲 Bind Add to Cart
  function attachAddButtons() {
    document.querySelectorAll(".add-cart").forEach(btn => {
      btn.onclick = () => {
        const card = btn.closest(".product-card");
        const name = card.querySelector(".product-name").textContent;
        const price = parseFloat(card.querySelector(".product-price").textContent.replace(/[₹,]/g, ""));

        if (cart[name]) {
          cart[name].quantity++;
        } else {
          cart[name] = { name, price, quantity: 1 };
        }

        animateCartIcon();
        updateCartSidebar();
        updateProductButtons();
      };
    });
  }

  // 🧭 Toggle sidebar
  cartBtn.onclick = () => {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("show");
  };
  closeSidebarBtn.onclick = () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("show");
  };
  cartOverlay.onclick = () => {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("show");
  };

  // 🔁 Init
  attachAddButtons();
});
