function c(e){if(!navigator.clipboard){var o=document.createElement("textarea");o.value=e,document.body.appendChild(o),o.select(),document.execCommand("copy"),document.body.removeChild(o);return}navigator.clipboard.writeText(e)}export{c};