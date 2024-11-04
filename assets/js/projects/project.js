export const projects = [
  {
    title: "E-Commerce Web by Skooldio",
    subtitle: "React",
    background: `This is the group project from <b>Skooldio Bootcamp, Web Development Bootcamp #2</b>.
      <br><br>The website should have a responsive and visually appealing design that works seamlessly 
      across multiple platforms and should function appropriately using the knowledge from the boot camp.
      <br><br>The website has 4 parts
        <dd>1. <b>HomePage</b> which is the first page.</dd>
        <dd>2. <b>CategoryPage</b> which displays a variety of product categories and allows users to filter 
      products based on their preferences.</dd>
        <dd>3. <b>DetailPage</b> which shows the item's detail, including images, descriptions, 
        pricing and options.</dd>
        <dd>4. <b>CartPage</b> which summarizes the items' price, quantities, and allows users to 
        proceed to checkout.</dd>`,
    cover_image: "assets/img/project/wdb2-ecommerce/cover.png",
    images: [
      "assets/img/project/wdb2-ecommerce/content01.png",
      "assets/img/project/wdb2-ecommerce/content02.png",
      "assets/img/project/wdb2-ecommerce/content03.png",
      "assets/img/project/wdb2-ecommerce/content04.png",
      "assets/img/project/wdb2-ecommerce/content05.png",
      "assets/img/project/wdb2-ecommerce/content06.png",
      "assets/img/project/wdb2-ecommerce/content07.png",
      "assets/img/project/wdb2-ecommerce/content08.png",
    ],
    can_preview_video: false,
    preview_video: "",
    can_demo: true,
    preview_demo: "https://project-sandbox-div-centering.vercel.app/",
    have_doc: false,
    preview_doc: "",
    tech_related: ["React", "CSS", "JavaScript"],
    learn: `There are 2 things I can learn by doing this project
        <br><br>
        <dd>1. I can practice my frontend skills like React, JavaScript and CSS and learn many new things that I haven't know before 
        like useContext in React and TailwindCSS.</dd>
        <br>
        <dd>2. This is my first chance to code with other people that I haven't known before and
        it takes a lot of my effort and time not only to code in my part but also to communicate with other people and to
        prepare the presentation. But for me, it is a good experience.</dd>`,
    contribution: `My main responsibility is at the CategoryPage and DetailPage. 
        <br><br>
        <dd> 1. In <b>CategoryPage</b>, users can select any category, and items that are in the category will display
            as a clickable card. Furthermore, users can select the sort option, and the cards will be 
            sorted by the user's option.</dd>
        <br>
        <dd> 2. In <b>DetallPage</b>, users will see the item's selected detail. Users can interact with its images and 
            can select the size, color, and quantity options. After clicking the "Add to cart" button, 
            the selected options will be saved, and the cart will be updated on every page.
            Furthermore, when users go to the other items or other pages and come back to this item, 
            the selected options will display.</dd>`,
  },
  {
    title: "Pixel Saga Game",
    subtitle: "JAVA",
    background: "Blah Blah",
    cover_image: "assets/img/project/pixel-saga/cover.png",
    images: ["assets/img/project/pixel-saga/cover.png"],
    can_preview_video: true,
    preview_video: "./assets/videos/pixel-saga.mp4",
    can_demo: false,
    preview_demo: "",
    have_doc: true,
    preview_doc: "assets/pdf/pixel-saga.pdf",
    tech_related: ["JAVA"],
    learn: ["AAA", "BBB"],
    contribution: "What I have done was Blah Blah",
    github: "https://github.com/BadLuckZ/Project-PixelSaga.git",
  },
].sort((e1, e2) => {
  if (e1.subtitle === e2.subtitle) {
    return e1.title < e2.title ? -1 : 1;
  }
  return e1.subtitle < e2.subtitle ? -1 : 1;
});
