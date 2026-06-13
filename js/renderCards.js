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

    items
      .filter((item) => item.type === type)
      .forEach((item) => {
        const card = document.createElement("article");
        card.classList.add("card");
        card.innerHTML = `
          <a href="content.html">
            <img src="${item.cover_image}" class="card-image" />
            <div class="card-description">
              <div>
                <h3 class="card-subtitle">${item.subtitle}</h3>
                <h2 class="card-title">${item.title}</h2>
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
