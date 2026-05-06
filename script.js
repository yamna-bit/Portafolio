// ===== TRANSICIÓN ENTRE PÁGINAS =====
const links = document.querySelectorAll("a");
const transition = document.querySelector(".transition");

links.forEach(link => {
  link.addEventListener("click", function(e){

    const url = this.href;

    // evita cambio inmediato
    e.preventDefault();

    transition.classList.add("active");

    setTimeout(()=>{
      window.location = url;
    }, 500);
  });
});
