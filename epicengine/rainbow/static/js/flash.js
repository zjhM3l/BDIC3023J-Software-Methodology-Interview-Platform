// flash javaScript code
function close_flash_message(){
    document.all.alertMessage.style.display='none';
    return false;
}

// auto fade out
window.setTimeout(function() { $("#alertMessage").fadeTo(500, 0)}, 2300);