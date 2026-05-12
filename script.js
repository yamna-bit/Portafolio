document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll("a");

    links.forEach(link => {

        link.addEventListener("click", function(e){

            const href = this.getAttribute("href");

            if(href && !href.startsWith("#")){

                e.preventDefault();

                document.body.classList.add("loading-screen");

                setTimeout(()=>{
                    window.location.href = href;
                },3000);

            }

        });

    });

});
