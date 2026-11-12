import { formatPeriod } from "./formatPeriod.js";

export function renderCards(
  items,
  { sectionId, counterId, cardboxClass, containerClass },
) {
  const section = document.getElementById(sectionId);
  const counter = document.getElementById(counterId);
  counter.textContent = items.length;

  const types = [...new Set(items.map((item) => item.type))];

  types.forEach((type) => {
    const cardbox = document.createElement("div");
    cardbox.classList.add(cardboxClass);

    const header = document.createElement("h2");
    header.textContent = type;
    header.classList.add(`${cardboxClass}-header`);
    cardbox.appendChild(header);

    const container = document.createElement("div");
    container.classList.add(containerClass, "grid");

    const newestFirst = (a, b) =>
      b.start_year * 12 + b.start_month - (a.start_year * 12 + a.start_month);

    items
      .filter((item) => item.type === type)
      .sort(newestFirst)
      .forEach((item) => {
        const card = document.createElement("article");
        card.classList.add("card");
        card.innerHTML = `
          <a href="content.html?id=${item.id}">
            <img
              src="${item.cover_image}"
              class="card-image"
              alt="${item.title} cover"
              loading="lazy"
              decoding="async"
            />
            <div class="card-description">
              <div>
                <h3 class="card-subtitle">${
                  item.org ? `${item.org} | ${item.subtitle}` : item.subtitle
                }</h3>
                <h2 class="card-title">${item.title}</h2>
                <p class="card-period">${formatPeriod(item)}</p>
              </div>
            </div>
          </a>`;
        card.addEventListener("click", () => {
          sessionStorage.setItem("selectedContent", JSON.stringify(item));
          sessionStorage.setItem("selectedTab", sectionId);
          sessionStorage.setItem("selectedScrollY", window.scrollY);
        });
        container.appendChild(card);
      });

    cardbox.appendChild(container);
    section.appendChild(cardbox);
  });
}
