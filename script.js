document.addEventListener("DOMContentLoaded", () => {

  document.body.classList.add("loaded");

  const links = document.querySelectorAll("a");

  links.forEach(link => {
    link.addEventListener("click", e => {

      const href = link.getAttribute("href");

      if (href && !href.startsWith("#")) {
        e.preventDefault();

        document.body.classList.add("transition-active");

        setTimeout(() => {
          window.location.href = href;
        }, 1400);
      }

    });
  });

});
