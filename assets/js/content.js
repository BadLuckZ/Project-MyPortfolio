const body = document.getElementById("body");

const data = JSON.parse(localStorage.getItem("selected"));

body.innerHTML = data.subtitle;
