// ==========================
// Cart data + selectors
// ==========================
let cart = JSON.parse(localStorage.getItem("cart")) || {};

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartBtn = document.getElementById("cartSidebarBtn");
const closeSidebarBtn = document.getElementById("closeSidebar");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.addEventListener("click", function (e) {
  e.preventDefault(); // Stop the immediate page load
  toggleCart(false);  // Close the drawer

  // Wait for animation, then redirect
  setTimeout(() => {
    window.location.href = this.href;
  }, 350); // match your .cart-sidebar transition time
});


// ==========================
// Accordion (collapsible categories)
// ==========================
document.querySelectorAll(".collapse-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const isOpen = btn.classList.contains("active");

    // Close all
    document.querySelectorAll(".collapse-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".product-panel").forEach(panel => {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
    });

    // Open clicked one
    if (!isOpen) {
      btn.classList.add("active");
      const panel = btn.nextElementSibling;
      panel.classList.add("open");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

// Open collapsible from hash on load
window.addEventListener("DOMContentLoaded", () => {
  updateCartSidebar();
  updateCartBadge();
  setupAddButtons();

  // Rebuild quantity controls on load
  for (const name in cart) {
    const card = document.querySelector(`.add-cart[data-product="${name}"]`)?.closest(".product-card");
    if (card) {
      const ctrl = card.querySelector(".product-control");
      ctrl.innerHTML = getQtyControlsHTML(name, cart[name].quantity);
    }
  }

  // Handle hash collapsible open
  const hash = window.location.hash.substring(1);
  if (hash) {
    const btn = document.getElementById(hash);
    if (btn && btn.classList.contains("collapse-btn")) {
      btn.classList.add("active");
      const panel = btn.nextElementSibling;
      panel.classList.add("open");
      panel.style.maxHeight = (panel.scrollHeight + 30) + "px";
      setTimeout(() => {
        btn.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }
});

// ==========================
// Cart sidebar toggle
// ==========================
function toggleCart(open) {
  cartSidebar.classList.toggle("active", open);
  cartOverlay.classList.toggle("active", open);
}

cartBtn.addEventListener("click", () => toggleCart(true));
closeSidebarBtn.addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

// ==========================
// Add to cart / quantity controls
// ==========================
function setupAddButtons() {
  document.querySelectorAll(".add-cart").forEach(button => {
    button.onclick = () => {
      const card = button.closest(".product-card");
      const name = card.querySelector(".product-name").textContent.trim();
      const price = parseInt(card.querySelector(".product-price").textContent.replace("₹", ""));
      const image = card.querySelector("img").src;

      if (!cart[name]) {
        cart[name] = { name, price, image, quantity: 1 };
        button.parentElement.innerHTML = getQtyControlsHTML(name, 1);
      } else {
        cart[name].quantity += 1;
      }

      updateCartSidebar();
      updateCartBadge();
      animateCartIcon();
      saveCart();
    };
  });
}

function getQtyControlsHTML(name, qty) {
  return `
    <div class="qty-controls" data-product="${name}">
      <button class="qty-minus" data-product="${name}">−</button>
      <span class="qty-display">${qty}</span>
      <button class="qty-plus" data-product="${name}">+</button>
    </div>
  `;
}

function setupQtyHandlers() {
  document.querySelectorAll(".qty-minus").forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.product;
      if (cart[name]) {
        cart[name].quantity -= 1;
        if (cart[name].quantity <= 0) {
          delete cart[name];
          revertToAddButton(name);
        } else {
          updateQtyControls(name);
        }
        updateCartSidebar();
        updateCartBadge();
        saveCart();
      }
    };
  });

  document.querySelectorAll(".qty-plus").forEach(btn => {
    btn.onclick = () => {
      const name = btn.dataset.product;
      if (cart[name]) {
        cart[name].quantity += 1;
        updateQtyControls(name);
        updateCartSidebar();
        updateCartBadge();
        saveCart();
      }
    };
  });
}

function updateQtyControls(name) {
  document.querySelectorAll(`.qty-controls[data-product="${name}"]`).forEach(ctrl => {
    if (cart[name]) {
      ctrl.querySelector(".qty-display").textContent = cart[name].quantity;
    }
  });
}

function revertToAddButton(name) {
  document.querySelectorAll(`.qty-controls[data-product="${name}"]`).forEach(ctrl => {
    ctrl.parentElement.innerHTML = `<button class="add-cart" data-product="${name}">Add to Cart</button>`;
  });
  setupAddButtons();
}

// ==========================
// Cart UI + badge updates
// ==========================
function updateCartSidebar() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let count = 0;

  for (const key in cart) {
    const item = cart[key];
    total += item.quantity * item.price;
    count += item.quantity;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <div class="qty-box">
          <button class="qty-minus" data-product="${item.name}">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-plus" data-product="${item.name}">+</button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(li);
  }

  cartTotal.textContent = total;
  checkoutBtn.disabled = count === 0;
  setupQtyHandlers();
}

function updateCartBadge() {
  let count = 0;
  for (const key in cart) {
    count += cart[key].quantity;
  }
  cartCount.textContent = count;
}

function animateCartIcon() {
  const icon = cartBtn.querySelector(".bx-cart");
  icon.classList.add("added-animation");
  setTimeout(() => icon.classList.remove("added-animation"), 400);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ==========================
// Open Description
// ==========================
  document.addEventListener("DOMContentLoaded", function () {
    const readMoreLinks = document.querySelectorAll(".read-more-link");

    readMoreLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const fullText = this.previousElementSibling;
        const shortText = fullText.previousElementSibling;

        const expanded = fullText.style.display === "inline";

        if (!expanded) {
          fullText.style.display = "inline";
          shortText.style.display = "none";
          this.textContent = "Read less";
          this.closest('.product-card').classList.add("expanded");
        } else {
          fullText.style.display = "none";
          shortText.style.display = "inline";
          this.textContent = "Read more";
          this.closest('.product-card').classList.remove("expanded");
        }
      });
    });
  });

  checkoutBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default navigation
  toggleCart(false);  // Close cart
  setTimeout(() => {
    window.location.href = "Cart.html"; // Navigate after animation
  }, 300); // Adjust if needed to match your CSS transition
});

