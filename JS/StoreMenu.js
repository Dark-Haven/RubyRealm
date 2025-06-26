document.addEventListener("DOMContentLoaded", () => {
  const collapseButtons = document.querySelectorAll('.collapse-btn');
  const cartIcon = document.querySelector('.bx-cart');
  const cartBadgeContainer = document.createElement('div');
  cartBadgeContainer.className = 'cart-badge-container';
  document.body.appendChild(cartBadgeContainer);

  // Load or initialize cart
  const cart = JSON.parse(localStorage.getItem("cart")) || {};

  // Collapse toggling
  collapseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const panel = button.nextElementSibling;
      panel.classList.toggle('open');
    });
  });

  // Animate cart icon
  function animateCartIcon() {
    if (!cartIcon) return;
    cartIcon.classList.add('added-animation');
    setTimeout(() => cartIcon.classList.remove('added-animation'), 400);

    const badge = document.createElement('span');
    badge.className = 'cart-badge';
    badge.textContent = '+1';
    cartBadgeContainer.appendChild(badge);

    setTimeout(() => {
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(-30px)';
    }, 100);

    setTimeout(() => {
      cartBadgeContainer.removeChild(badge);
    }, 500);
  }

  // Replace button with quantity controls
  function replaceAddWithQty(button, productName, price) {
    const container = button.parentElement;
    container.innerHTML = '';

    const minusBtn = document.createElement('button');
    minusBtn.textContent = '−';
    minusBtn.classList.add('qty-minus');

    const qtyDisplay = document.createElement('span');
    qtyDisplay.textContent = cart[productName].qty;
    qtyDisplay.classList.add('qty-display');

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.classList.add('qty-plus');

    minusBtn.onclick = () => {
      if (cart[productName].qty > 1) {
        cart[productName].qty--;
        qtyDisplay.textContent = cart[productName].qty;
      } else {
        delete cart[productName];
        container.innerHTML = `<button class="add-cart" data-product="${productName}" data-price="${price}">Add to Cart</button>`;
        bindAddCart(); // Rebind
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    };

    plusBtn.onclick = () => {
      cart[productName].qty++;
      qtyDisplay.textContent = cart[productName].qty;
      localStorage.setItem("cart", JSON.stringify(cart));
    };

    container.append(minusBtn, qtyDisplay, plusBtn);
  }

  // Add to Cart bindings
  function bindAddCart() {
    const addBtns = document.querySelectorAll('.add-cart');
    addBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.product;
        const price = parseInt(btn.dataset.price, 10);

        if (!cart[name]) {
          cart[name] = { name, price, qty: 1 };
        } else {
          cart[name].qty++;
        }

        replaceAddWithQty(btn, name, price);
        animateCartIcon();
        localStorage.setItem("cart", JSON.stringify(cart));
      });
    });
  }

  bindAddCart();
});
const cartIcon = document.querySelector('.bx-cart');
cartIcon.classList.add('added-animation');
setTimeout(() => cartIcon.classList.remove('added-animation'), 400);