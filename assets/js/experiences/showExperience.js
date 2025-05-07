import { experiences } from "./experience.js";

const experience_section = document.getElementById("experience");
const experience_amount = document.getElementById("my-experience-number");

experience_amount.innerText = experiences.length;

experiences.forEach((p) => {
  const experience_card = document.createElement("article");
  experience_card.classList.add("card");
  experience_card.innerHTML = `
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
  experience_card.addEventListener("click", () => {
    localStorage.setItem("selected", JSON.stringify(p));
  });
  experience_section.appendChild(experience_card);
});
