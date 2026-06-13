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

const savedTab = sessionStorage.getItem("selectedTab");
if (savedTab) {
  const savedButton = document.querySelector(`[data-target="#${savedTab}"]`);
  if (savedButton) savedButton.click();
}

window.addEventListener("load", () => {
  const savedScroll = sessionStorage.getItem("selectedScrollY");
  if (savedScroll !== null) {
    window.scrollTo(0, parseInt(savedScroll, 10));
    sessionStorage.removeItem("selectedTab");
    sessionStorage.removeItem("selectedScrollY");
  }
});
