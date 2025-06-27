document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector('.site-footer');

  if ('IntersectionObserver' in window && footer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          footer.classList.add('fade-in');
        } else {
          footer.classList.remove('fade-in'); // Remove to allow re-animation
        }
      });
    }, {
      threshold: 0.2
    });

    observer.observe(footer);
  } else {
    // Fallback for old browsers
    footer.classList.add('fade-in');
  }
});
