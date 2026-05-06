// animación simple al hacer scroll
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");

  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;

    if (top < window.innerHeight - 100) {
      sec.style.opacity = "1";
      sec.style.transform = "translateY(0)";
    }
  });
});
