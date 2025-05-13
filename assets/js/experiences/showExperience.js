import { experiences } from "./experience.js";

const experience_section = document.getElementById("experience");
const experience_amount = document.getElementById("my-experience-number");

experience_amount.innerText = experiences.length;

const experience_types = [];

for (let i = 0; i < experiences.length; i++) {
  let e = experiences[i];
  if (!experience_types.includes(e.type)) {
    experience_types.push(e.type);
  }
}

experience_types.forEach((e_type) => {
  const experience_cardbox = document.createElement("div");
  experience_cardbox.classList.add("experience-cardbox");

  const experience_cardbox_header = document.createElement("h2");
  experience_cardbox_header.innerHTML = e_type;
  experience_cardbox_header.classList.add("experience-cardbox-header");
  experience_cardbox.appendChild(experience_cardbox_header);

  const experience_container = document.createElement("div");
  experience_container.classList.add("experience-container");
  experience_container.classList.add("grid");

  experiences
    .filter((e) => e.type == e_type)
    .forEach((e) => {
      const experience_card = document.createElement("article");
      experience_card.classList.add("card");
      experience_card.innerHTML = `
        <a href='content.html'>
          <img
            src=${e.cover_image}
            class="card-image"
          />
          <div class="card-description">
            <div>
              <h3 class="card-subtitle">${e.subtitle}</h3>
              <h2 class="card-title">${e.title}</h2>
            </div>
          </div>
        </a>`;
      experience_card.addEventListener("click", () => {
        localStorage.setItem("selected", JSON.stringify(e));
      });
      experience_container.appendChild(experience_card);
    });
  experience_cardbox.appendChild(experience_container);
  experience_section.appendChild(experience_cardbox);
});
