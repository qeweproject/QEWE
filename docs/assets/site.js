"use strict";
const button=document.getElementById('copy-tip'),address=document.getElementById('tip-address'),status=document.getElementById('copy-status');
button?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(address.textContent.trim());status.textContent='Public address copied.';}catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(address);selection.removeAllRanges();selection.addRange(range);status.textContent='Address selected. Use your normal Copy action.';}});
