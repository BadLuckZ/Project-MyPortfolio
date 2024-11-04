import { projects } from "./project.js";

const project_section = document.getElementById("project");
const project_amount = document.getElementById("my-project-number");

project_amount.innerText = projects.length;

projects.forEach((p) => {
  const project_card = document.createElement("article");
  project_card.classList.add("card");
  project_card.innerHTML = `
  <a href='content.html'>
    <img
      src=${p.cover_image}
      class="card-image"
    />
    <div class="card-description">
      <div>
        <p class="card-subtitle">${p.subtitle}</p>
        <h3 class="card-title">${p.title}</h3>
      </div>
    </div>
  </a>`;
  project_card.addEventListener("click", () => {
    localStorage.setItem("selected", JSON.stringify(p));
  });
  project_section.appendChild(project_card);
});
