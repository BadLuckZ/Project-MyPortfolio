const data = JSON.parse(localStorage.getItem("selected"));

const head = document.getElementById("head-name");
const background = document.getElementById("background");
const image = document.getElementById("image");
const preview = document.getElementById("preview");
const tech_related = document.getElementById("tech-related");
const learn = document.getElementById("learn");
const contribution = document.getElementById("contribution");

head.innerHTML = data.title;

background.innerHTML = `
    <h2>Background</h2>
    <p>${data.background}</p>
`;

if (data.image.length == 1) {
  image.innerHTML = `
    <img src=${data.image} alt="${data.title} Image"/>
`;
} else if (data.image.length > 1) {
  const slider = document.createElement("div");
  slider.classList.add("image-slider");
  data.image.forEach((imgLink) => {
    const img = document.createElement("img");
    img.src = imgLink;
    slider.appendChild(img);
  });
  const leftBtn = document.createElement("button");
  leftBtn.setAttribute("id", "prevBtn");
  leftBtn.innerText = "<<";
  const rightBtn = document.createElement("button");
  rightBtn.setAttribute("id", "nextBtn");
  rightBtn.innerText = ">>";
  const dots = document.createElement("div");
  dots.classList.add("image-dots");
  for (let i = 0; i < data.image.length; i++) {
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

preview.innerHTML = `
    <h2>Preview Video</h2>
    <video height="400" controls>
        <source
            src=${data.preview_video}
            type="video/mp4"
            id="project-video"
        />
    </video>
`;

if (data.can_demo) {
  const button = document.createElement("button");
  button.onclick = `window.location.href=${data.preview_demo}`;
  button.innerHTML = 'Demo <i class="fa-sharp fa-solid fa-arrow-down"></i>';
  preview.appendChild(button);
}

if (data.have_doc) {
  const button = document.createElement("button");
  button.innerHTML =
    'Get The Document <i class="fa-sharp fa-solid fa-arrow-down"></i>';
  const link_button = document.createElement("a");
  link_button.href = data.preview_doc;
  link_button.appendChild(button);
  preview.appendChild(link_button);
}

const tech_related_element = document.createElement("ul");
data.tech_related.forEach((t) => {
  const tech = document.createElement("li");
  tech.innerHTML = `<p>${t}</p>`;
  tech_related_element.appendChild(tech);
});
tech_related.innerHTML = `
    <h2>Technologies Related</h2>
`;
tech_related.appendChild(tech_related_element);

const learn_element = document.createElement("ul");
data.learn.forEach((l) => {
  const learn_li = document.createElement("li");
  learn_li.innerHTML = `<p>${l}</p>`;
  learn_element.appendChild(learn_li);
});
learn.innerHTML = `
    <h2>What I learn</h2>
`;
learn.appendChild(learn_element);

contribution.innerHTML = `
    <h2>My Contribution</h2>
    <p>${data.contribution}</p>
`;
