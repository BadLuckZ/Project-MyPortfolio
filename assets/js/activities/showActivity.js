import { activities } from "./activity.js";

const activity_section = document.getElementById("activity");
const activity_amount = document.getElementById("my-activity-number");

activity_amount.innerText = activities.length;

activities.forEach((p) => {
  const activity_card = document.createElement("article");
  activity_card.classList.add("card");
  activity_card.innerHTML = `
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
  activity_card.addEventListener("click", () => {
    localStorage.setItem("selected", JSON.stringify(p));
  });
  activity_section.appendChild(activity_card);
});
