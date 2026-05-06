// ===== TRANSICIÓN ENTRE PÁGINAS =====
const links = document.querySelectorAll("a");
const transition = document.querySelector(".transition");

links.forEach(link => {
  link.addEventListener("click", function(e){

    // evita cambio inmediato
    e.preventDefault();

    const url = this.href;

    // activa animación
    transition.classList.add("active");

    // espera y cambia de página
    setTimeout(()=>{
      window.location = url;
    }, 500);
  });
});
