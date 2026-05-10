import { projects } from "./project.js";

const project_section = document.getElementById("project");
const project_amount = document.getElementById("my-project-number");

project_amount.innerText = projects.length;

const project_types = [];

for (let i = 0; i < projects.length; i++) {
  let p = projects[i];
  if (!project_types.includes(p.type)) {
    project_types.push(p.type);
  }
}

project_types.forEach((p_type) => {
  const project_cardbox = document.createElement("div");
  project_cardbox.classList.add("project-cardbox");

  const project_cardbox_header = document.createElement("h2");
  project_cardbox_header.innerHTML = p_type;
  project_cardbox_header.classList.add("project-cardbox-header");
  project_cardbox.appendChild(project_cardbox_header);

  const project_container = document.createElement("div");
  project_container.classList.add("project-container");
  project_container.classList.add("grid");

  projects
    .filter((p) => p.type == p_type)
    .forEach((p) => {
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
              <h3 class="card-subtitle">${p.subtitle}</h3>
              <h2 class="card-title">${p.title}</h2>
            </div>
          </div>
        </a>`;
      project_card.addEventListener("click", () => {
        localStorage.setItem("selected", JSON.stringify(p));
      });
      project_container.appendChild(project_card);
    });
  project_cardbox.appendChild(project_container);
  project_section.appendChild(project_cardbox);
});
