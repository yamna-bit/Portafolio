document.addEventListener("DOMContentLoaded", () => {

  document.body.classList.add("fade-in");

  const links = document.querySelectorAll("a");

  links.forEach(link => {
    link.addEventListener("click", e => {

      const href = link.getAttribute("href");

      if (href && !href.startsWith("#")) {
        e.preventDefault();

        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(() => {
          window.location.href = href;
        }, 700);
      }
    });
  });

});
