import { data } from "./getItems.js";
import { formatPeriod } from "./formatPeriod.js";

const head = document.getElementById("head-name");
const information = document.getElementById("information");
const image = document.getElementById("image");
const preview_video = document.getElementById("preview-video");
const preview_buttons = document.getElementById("preview-buttons");
const learn = document.getElementById("learn");
const contribution = document.getElementById("contribution");

head.textContent = data.title;
if (data.github) {
  const button = document.createElement("a");
  button.classList.add("head-button");
  button.href = data.github;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.setAttribute("aria-label", `${data.title} on GitHub`);
  button.innerHTML = '<i class="fa-brands fa-github" aria-hidden="true"></i>';
  head.appendChild(button);
}

const meta = document.createElement("p");
meta.id = "head-meta";
meta.textContent = data.org
  ? `${data.org} | ${formatPeriod(data)}`
  : formatPeriod(data);
head.insertAdjacentElement("afterend", meta);

information.innerHTML = `
  <h2 style="margin-bottom: 12px;">Information</h2>
  <p>${data.information}</p>
`;

function markWhenLoaded(img) {
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add("loaded");
    return;
  }
  img.addEventListener("load", () => img.classList.add("loaded"), {
    once: true,
  });
  img.addEventListener("error", () => img.classList.add("loaded"), {
    once: true,
  });
}

if (data.images.length === 0) {
  image.classList.add("hidden");
} else if (data.images.length === 1) {
  image.innerHTML = `<img src="${data.images[0]}" alt="${data.title} screenshot 1" loading="lazy"/>`;
  markWhenLoaded(image.querySelector("img"));
} else {
  const slider = document.createElement("div");
  slider.classList.add("image-slider");
  data.images.forEach((imgLink, i) => {
    const img = document.createElement("img");
    img.src = imgLink;
    img.alt = `${data.title} screenshot ${i + 1}`;
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";
    markWhenLoaded(img);
    slider.appendChild(img);
  });
  const leftBtn = document.createElement("button");
  leftBtn.setAttribute("id", "prevBtn");
  leftBtn.setAttribute("aria-label", "Previous image");
  leftBtn.innerHTML =
    '<i class="fa-solid fa-angles-left" aria-hidden="true"></i>';
  const rightBtn = document.createElement("button");
  rightBtn.setAttribute("id", "nextBtn");
  rightBtn.setAttribute("aria-label", "Next image");
  rightBtn.innerHTML =
    '<i class="fa-solid fa-angles-right" aria-hidden="true"></i>';
  const dots = document.createElement("div");
  dots.classList.add("image-dots");
  for (let i = 0; i < data.images.length; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.classList.add("image-dot");
    dot.setAttribute("data-slide", i);
    dot.setAttribute("aria-label", `Go to image ${i + 1}`);
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
      <div class="video-wrapper">
        <iframe
          src="${data.preview_video}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      </div>
    </div>
`;
} else {
  preview_video.classList.add("hidden");
}

if (data.can_demo) {
  const button = document.createElement("a");
  button.classList.add("preview-button");
  button.href = data.preview_demo;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  button.setAttribute("aria-label", `Open the ${data.title} demo`);
  button.innerHTML = 'Demo <i class="fa-solid fa-play" aria-hidden="true"></i>';
  preview_buttons.appendChild(button);
}

if (data.have_doc) {
  const link_button = document.createElement("a");
  link_button.classList.add("preview-button");
  if (data.doc_type === "pdf") {
    link_button.href = data.preview_doc;
    link_button.setAttribute("aria-label", `Open the ${data.title} document`);
    link_button.innerHTML = `Document <i class="fa-solid fa-file" aria-hidden="true"></i>`;
  } else if (data.doc_type === "article") {
    link_button.href = data.preview_doc;
    link_button.target = "_blank";
    link_button.rel = "noopener noreferrer";
    link_button.setAttribute("aria-label", `Read the ${data.title} article`);
    link_button.innerHTML = `Article <i class="fas fa-newspaper" aria-hidden="true"></i>`;
  }
  preview_buttons.appendChild(link_button);
}

if (preview_buttons.childNodes.length === 0) {
  preview_buttons.classList.add("hidden");
}

learn.innerHTML = `
  <h2>What I Learn</h2>
  <p>${data.learn}</p>
`;

contribution.innerHTML = `
    <h2>My Contribution</h2>
    <p>${data.contribution}</p>
`;
