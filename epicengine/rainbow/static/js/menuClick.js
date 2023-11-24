// Detect when the user clicks to expand the menu, place the rest at the bottom of the menu, and when the user clicks again, place it above the menu
let cross=document.querySelector('.cross')
        cross.addEventListener('click',()=>{
            cross.classList.toggle("open")

        })


