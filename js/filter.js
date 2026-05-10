const buttons = document.querySelectorAll("[data-target]");
const contents = document.querySelectorAll("[data-content]");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.target);
    contents.forEach((content) => {
      content.classList.remove("content-active");
    });
    target.classList.add("content-active");

    buttons.forEach((btn) => {
      btn.classList.remove("filter-active");
    });

    button.classList.add("filter-active");
  });
});
