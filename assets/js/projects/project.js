export const projects = [
  {
    title: "Pixel Saga Game",
    subtitle: "JAVA",
    background: `<b>This is my final project for Programming Methodology in Year 1 Semester 2 doing with 
      my friend (Napongthorn Charoenlap).</b>
      <br><br>
      The project is called <b>Pixel Saga</b>. It's a roguelike platformer game featuring pixel art. 
      The objective is to survive as long as possible by defeating enemies in various levels and conquering bosses. 
      Players can choose a class at the beginning of the game and get perks to enhance their abilities. 
      There are also areas where players can purchase new perks and upgrade existing perks to become stronger`,
    cover_image: "assets/img/project/pixel-saga/cover.png",
    images: ["assets/img/project/pixel-saga/cover.png"],
    can_preview_video: true,
    preview_video: "./assets/videos/pixel-saga.mp4",
    can_demo: false,
    preview_demo: "",
    have_doc: true,
    preview_doc: "assets/pdf/pixel-saga.pdf",
    tech_related: ["JAVA"],
    learn: `There are 2 things I can learn by doing this project
      <br><br>
      <dd>
        1. <b>I’ve learned the challenges and hardships of game development.</b>
        <br>
        I’ve always had long-standing questions about game development: 
        why do so many games I’ve played have bugs? Why aren’t they thoroughly tested before release? 
        On top of that, some bugs take several patches to get fixed, even though they don’t seem that 
        hard to resolve. However, after working on this project with my friend, I understood 
        why these situations happen. 
        <dd style="color: grey;"><i>P.S. I apologize for the harsh criticisms I’ve made about many games in the past. From now on, 
        I’ll focus on providing constructive feedback instead.</i></dd>
      </dd>
      <br>
      <dd>
        2. <b>This is my first chance to code with my friend. I thought it wouldn't be that hard but it's not like that.</b>
        <br>
        Although our communication went well, many functions we wanted to code were harder 
        than we thought due to our lack of experience. So we decided not to code many functions, 
        such as selling items and coding players' skills.
      </dd>`,
    contribution: `<b>The main parts I contributed to this project are as follows</b>
      <br><br>
      <dd>
        1. <b>Player Movement</b><br> I coded the basic movement system for the player (left-right movement) 
        and setting up the camera border to follow the player's position dynamically.
      </dd>
      <br>
      <dd>
        2. <b>Damage Calculation</b><br> I designed the system for calculating various types of damage for 
        both the player and monsters. This allows for a variety of damage outputs, with each attack
        producing different damage values. 
      </dd>
      <br>
      <dd>
        3. <b>Perk System</b><br> I implemented the abilities of different perks, 
        as well as the systems for purchasing and upgrading them.  
      </dd>
      <br>
      <dd>
        4. <b>SFX</b><br> I was responsible for selecting the music and sound effects 
        used throughout the game.
      </dd>
      <br>
      Additionally, I also assisted my partner in some aspects of this project. For example, 
      I contributed to defining the stats for both the player and monsters, designing 
      and creating various in-game scenes, and writing this project's sdocumentation.
      `,

    github: "https://github.com/BadLuckZ/Project-PixelSaga.git",
  },
  {
    title: "E-Commerce Web",
    subtitle: "React",
    background: `<b>This is the group project from Skooldio Bootcamp, Web Development Bootcamp #2</b>.
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
      <dd>
        1. I can practice my frontend skills like React, JavaScript and CSS and learn many new things 
        that I haven't know before like useContext in React and TailwindCSS.
      </dd>
      <br>
      <dd>
        2. This is my first chance to code with other people that I haven't known before and
        it takes a lot of my effort and time not only to code in my part but also to communicate with 
        other people and to
        prepare the presentation. But for me, it is a good experience.
      </dd>`,
    contribution: `My main responsibility is at the CategoryPage and DetailPage. 
      <br><br>
      <dd> 
        1. In <b>CategoryPage</b>, users can select any category, and items that are in the category will display
        as a clickable card. Furthermore, users can select the sort option, and the cards will be 
        sorted by the user's option.
      </dd>
      <br>
      <dd> 
        2. In <b>DetallPage</b>, users will see the item's selected detail. Users can interact with its images and 
        can select the size, color, and quantity options. After clicking the "Add to cart" button, 
        the selected options will be saved, and the cart will be updated on every page.
        Furthermore, when users go to the other items or other pages and come back to this item, 
        the selected options will display.
      </dd>`,
    github: "https://github.com/BadLuckZ/Project-Sandbox-Div-Centering.git",
  },
].sort((e1, e2) => {
  if (e1.subtitle === e2.subtitle) {
    return e1.title < e2.title ? -1 : 1;
  }
  return e1.subtitle < e2.subtitle ? -1 : 1;
});
