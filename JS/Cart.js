document.addEventListener("DOMContentLoaded", () => {
  const cartData = JSON.parse(localStorage.getItem("cart")) || {};
  const cartDetail = document.getElementById("cartDetail");
  const finalTotal = document.getElementById("finalTotal");
  let sum = 0;

  if (Object.keys(cartData).length === 0) {
    cartDetail.innerHTML = "<p>Your cart is empty.</p>";
    finalTotal.textContent = "0";
    return;
  }

  Object.values(cartData).forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="item-info">
        <strong>${item.name}</strong>
        <span>₹${item.price} × ${item.quantity}</span>
      </div>
      <div><strong>₹${item.price * item.quantity}</strong></div>
    `;
    cartDetail.appendChild(div);
    sum += item.price * item.quantity;
  });

  finalTotal.textContent = sum;
});

const placeOrderBtn = document.getElementById("placeOrderBtn");
const orderPopup = document.getElementById("orderPopup");

placeOrderBtn.addEventListener("click", () => {
  // Clear the cart
  localStorage.removeItem("cart");

  // Show floating message
  orderPopup.classList.add("show");

  // Disable the button
  placeOrderBtn.disabled = true;

  // Hide message and refresh after 3s
  setTimeout(() => {
    orderPopup.classList.remove("show");
    location.reload();
  }, 3000);
});


  