$(document).ready((function(){document.querySelectorAll("[data-clipboard-target]").forEach((function(e){e.addEventListener("click",(function(){const t=document.querySelector(e.getAttribute("data-clipboard-target"));t&&(t.select(),document.execCommand("copy"),"true"==e.getAttribute("data-clipboard-toast")&&$.createToast({message:"Copied to clipboard!",type:"success"}))}))})),document.querySelectorAll("[data-clipboard-text]").forEach((function(e){e.addEventListener("click",(function(){const t=e.getAttribute("data-clipboard-text");if(t){const c=document.createElement("input");c.value=t,document.body.appendChild(c),c.select(),document.execCommand("copy"),document.body.removeChild(c),"true"==e.getAttribute("data-clipboard-toast")&&$.createToast({message:"Copied to clipboard!",type:"success"})}}))})),document.querySelectorAll('[data-bs-switch="switch-element"]').forEach((e=>{e.addEventListener("click",(t=>{t.preventDefault();const c=document.querySelector(e.dataset.bsTargetF),o=document.querySelector(e.dataset.bsTargetS);c.classList.toggle("d-none"),o.classList.toggle("d-none")}))}))}));