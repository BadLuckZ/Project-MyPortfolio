const data = JSON.parse(localStorage.getItem("selected"));

if (data.image.length > 1) {
  const slides = document.querySelector(".image-slider");
  const images = document.querySelectorAll(".image-slider img");
  const dots = document.querySelectorAll(".image-dot");

  let currentIndex = 0;
  let totalSlides = images.length;

  function showSlide(index) {
    if (index >= totalSlides) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = totalSlides - 1;
    } else {
      currentIndex = index;
    }

    slides.style.transform = `translateX(${-currentIndex * 100}%)`;

    dots.forEach((dot) => dot.classList.remove("dot-active"));
    dots[currentIndex].classList.add("dot-active");
  }

  document.getElementById("nextBtn").addEventListener("click", () => {
    showSlide(currentIndex + 1);
  });

  document.getElementById("prevBtn").addEventListener("click", () => {
    showSlide(currentIndex - 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  showSlide(currentIndex);
}
