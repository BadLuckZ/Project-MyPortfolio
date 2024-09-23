import { projects } from "./project.js";

const project_section = document.getElementById("project");
const project_amount = document.getElementById("my-project-number");

project_amount.innerText = projects.length;

projects.forEach((p) => {
  const project_card = document.createElement("article");
  project_card.classList.add("project-card");
  project_card.innerHTML = `
  <a href='content.html'>
    <img
      src=${p.image}
      class="project-card-image"
    />
    <div class="project-card-description">
      <div>
        <p class="project-card-subtitle">${p.subtitle}</p>
        <h3 class="project-card-title">${p.title}</h3>
      </div>
    </div>
  </a>`;
  project_section.appendChild(project_card);
});
