const body = document.getElementById("body");

const data = JSON.parse(localStorage.getItem("selectedProject"));

body.innerHTML = data.subtitle;
