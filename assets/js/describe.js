const data = JSON.parse(localStorage.getItem("selected"));

const head = document.getElementById("head-name");
const information = document.getElementById("information");
const image = document.getElementById("image");
const preview_video = document.getElementById("preview-video");
const preview_buttons = document.getElementById("preview-buttons");
const tech_related = document.getElementById("tech-related");
const learn = document.getElementById("learn");
const contribution = document.getElementById("contribution");

head.innerHTML = data.title;
if (data.github) {
  const button = document.createElement("a");
  button.classList.add("head-button");
  button.addEventListener("click", () => {
    window.open(data.github, "_blank");
  });
  button.innerHTML = '<i class="fa-brands fa-github"></i>';
  head.appendChild(button);
}

information.innerHTML = `
  <h2 style="margin-bottom: 12px;">Information</h2>
  <p>${data.information}</p>
`;

if (data.images.length == 1) {
  image.innerHTML = `
    <img src=${data.images[0]} alt="${data.title} Image"/>
`;
} else if (data.images.length > 1) {
  const slider = document.createElement("div");
  slider.classList.add("image-slider");
  data.images.forEach((imgLink) => {
    const img = document.createElement("img");
    img.src = imgLink;
    slider.appendChild(img);
  });
  const leftBtn = document.createElement("button");
  leftBtn.setAttribute("id", "prevBtn");
  leftBtn.innerHTML = '<i class="fa-solid fa-angles-left"></i>';
  const rightBtn = document.createElement("button");
  rightBtn.setAttribute("id", "nextBtn");
  rightBtn.innerHTML = '<i class="fa-solid fa-angles-right"></i>';
  const dots = document.createElement("div");
  dots.classList.add("image-dots");
  for (let i = 0; i < data.images.length; i++) {
    const dot = document.createElement("dot");
    dot.classList.add("image-dot");
    dot.setAttribute("data-slide", i);
    dots.appendChild(dot);
  }

  image.appendChild(slider);
  image.appendChild(leftBtn);
  image.appendChild(rightBtn);
  image.appendChild(dots);
}

if (data.can_preview_video) {
  preview_video.innerHTML = `
    <div>
      <h2>Preview Video</h2>
      <video height="400" controls>
          <source
              src=${data.preview_video}
              type="video/mp4"
              id="project-video"
          />
      </video>
    </div>
`;
} else {
  preview_video.classList.add("hidden");
}

if (data.can_demo) {
  const button = document.createElement("button");
  button.classList.add("preview-button");
  button.innerHTML = 'Demo <i class="fa-sharp fa-solid fa-arrow-down"></i>';
  button.addEventListener("click", () => {
    window.open(data.preview_demo, "_blank");
  });
  preview_buttons.appendChild(button);
}

if (data.have_doc) {
  const button = document.createElement("button");
  button.classList.add("preview-button");
  button.innerHTML =
    'Get The Document <i class="fa-sharp fa-solid fa-arrow-down"></i>';
  const link_button = document.createElement("a");
  link_button.href = data.preview_doc;
  link_button.appendChild(button);
  preview_buttons.appendChild(link_button);
}

if (preview_buttons.childNodes.length == 0) {
  preview_buttons.classList.add("hidden");
}

const tech_related_element = document.createElement("ul");
if (data.tech_related.length > 0) {
  data.tech_related.forEach((t, idx) => {
    const tech = document.createElement("li");
    tech.innerHTML = `<p><dd>${idx + 1}. ${t}</dd></p>`;
    tech_related_element.appendChild(tech);
  });
  tech_related.innerHTML = `
    <h2>Technologies Related</h2>
`;
  tech_related.appendChild(tech_related_element);
} else {
  tech_related.classList.add("hidden");
}

learn.innerHTML = `
  <h2>What I Learn</h2>
  <p>${data.learn}</p>
`;

contribution.innerHTML = `
    <h2>My Contribution</h2>
    <p>${data.contribution}</p>
`;
