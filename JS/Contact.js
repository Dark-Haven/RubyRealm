document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Show the floating success message
  const msg = document.getElementById('successMessage');
  msg.classList.add('show');

  // Optionally reset form
  this.reset();

  // Hide after delay
  setTimeout(() => {
    msg.classList.remove('show');
  }, 4000);
});
