document.addEventListener("click", e => {
    let handle
    if (e.target.matches(".handle")) {
        handle = e.target
    } else {
        handle = e.target.closest(".handle")
    }
    if (handle != null) onhandleClick(handle)
    })

function onhandleClick(handle){
    const slider = handle.closest(".slide-container").querySelector(".slider")
    const sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue("--slider-index"))
   if (handle.classList.contains("left-handle") && (sliderIndex != 0)) {
        
        slider.style.setProperty("--slider-index", sliderIndex - 1)
      }

    if (handle.classList.contains("right-handle")){
        slider.style.setProperty("--slider-index", sliderIndex + 1)
        }
    } 