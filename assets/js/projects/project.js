// const template_project = {
//   title: "",
//   subtitle: "",
//   type: "",
//   start_month: 0,
//   start_year: 0,
//   information: "",
//   cover_image: "",
//   images: [],
//   can_preview_video: false,
//   preview_video: "",
//   can_demo: false,
//   preview_demo: "",
//   have_doc: false,
//   doc_type: "", (pdf | article | "")
//   preview_doc: "",
//   tech_related: [],
//   learn: "",
//   contribution: "",
//   github: ""
// };

export const projects = [
  {
    title: "Baan-Saat",
    subtitle: "React",
    type: "Web Development",
    start_month: 8,
    start_year: 2025,
    information: `<b>This is the group project for Software Engineering Subject in Year 3.
      <br>This project started in August 2025 and finished in November 2025.</b>
      <br><br>This project is about creating a matching platform between customers and cleaning service providers. 
      Customers can post their service requirements and wait for interested service providers to apply. 
      When customers find a suitable provider, the system matches them together and opens communication channels 
      for discussion, payment processing, and post-service reviews.
      <br><br>The website features include:
      <dd>1. <b>Role-based Home Pages</b> that display different content for customers and service providers.</dd>
      <dd>2. <b>Service Creation and Editing Pages</b> (Customer-only) for posting and managing service requests.</dd>
      <dd>3. <b>Service Detail Pages</b> showing comprehensive information about posted services.</dd>
      <dd>4. <b>Application Submission and Editing Pages</b> (Provider-only) for applying to service requests.</dd>
      <dd>5. <b>Application Detail Pages</b> displaying provider application information.</dd>
      <dd>6. <b>Accept/Reject Pages</b> for customers to review and respond to provider applications.</dd>
      <dd>7. <b>Chat and Payment Pages</b> for communication, work updates, and payment processing.</dd>
      <dd>8. <b>Review Pages</b> for post-service feedback and ratings.</dd>
      <dd>9. <b>Account Pages</b> with role-specific menus showing different options for customers and providers.</dd>
      <dd>10. <b>Profile Pages</b> that display different information based on user roles, visible to relevant parties.</dd>`,
    cover_image: "assets/img/project/baan-saat/cover.png",
    images: [
      "assets/img/project/baan-saat/content01.png",
      "assets/img/project/baan-saat/content02.png",
      "assets/img/project/baan-saat/content03.png",
      "assets/img/project/baan-saat/content04.png",
      "assets/img/project/baan-saat/content05.png",
      "assets/img/project/baan-saat/content06.png",
      "assets/img/project/baan-saat/content07.png",
      "assets/img/project/baan-saat/content08.png",
      "assets/img/project/baan-saat/content09.png",
      "assets/img/project/baan-saat/content10.png",
      "assets/img/project/baan-saat/content11.png",
      "assets/img/project/baan-saat/content12.png",
      "assets/img/project/baan-saat/content13.png",
      "assets/img/project/baan-saat/content14.png",
      "assets/img/project/baan-saat/content15.png",
      "assets/img/project/baan-saat/content16.png",
      "assets/img/project/baan-saat/content17.png",
      "assets/img/project/baan-saat/content18.png",
    ],
    can_preview_video: false,
    preview_video: "",
    can_demo: false,
    preview_demo: "",
    have_doc: false,
    doc_type: "",
    preview_doc: "",
    tech_related: ["React", "TailwindCSS", "Express", "MongoDB", "Vercel"],
    learn: `Here're things I can learn by doing this project
      <br><br>
      <dd>
        1. <b>Gained hands-on experience with Agile Development methodology and Software Engineering workflows.</b> 
        <br>
        I practiced working in Sprints, conducting Sprint Retrospective Meetings, and presenting work to the Product Owner. 
        This experience helped me understand real-world software development processes and team collaboration dynamics.
      </dd>
      <br>
      <dd>
        2. <b>Developed leadership and project management skills.</b> 
        <br>
        As the team leader, I was responsible for controlling and monitoring the project progress, coordinating tasks among 
        team members, and ensuring timely delivery of features. This improved my ability to manage people and handle 
        project responsibilities effectively.
      </dd>
      <br>
      <dd>
        3. <b>Enhanced full-stack development capabilities.</b> 
        <br>
        I applied my knowledge across the entire stack, working on both Frontend implementation using React and TailwindCSS, 
        Backend API development using Express and MongoDB, and deployment processes using Vercel. This involvement 
        strengthened my understanding of how different parts of a web application work together.
      </dd>`,
    contribution: `My main responsibility covered full-stack development across multiple features. 
      <br><br>
      <dd> 
        1. <b>Home Page</b> - Implemented the UI according to Figma designs and created APIs to fetch and display 
        customer services based on user roles.
      </dd>
      <br>
      <dd> 
        2. <b>Service Creation and Editing Pages</b> - Developed both frontend UI implementation and backend APIs 
        for creating, updating, and deleting customer service requests.
      </dd>
      <br>
      <dd> 
        3. <b>Service Detail Page</b> - Built the complete feature including UI implementation and API development 
        to retrieve and display detailed service information.
      </dd>
      <br>
      <dd> 
        4. <b>Account Page</b> - Created role-based menu displays with corresponding UI and APIs to fetch 
        user information based on roles and current menu selections.
      </dd>
      <br>
      <dd> 
        5. <b>Application Submission and Editing Pages</b> - Implemented the full feature including UI design 
        and APIs for service providers to create and update their service applications.
      </dd>
      <br>
      <dd> 
        6. <b>Application Detail Page</b> - Developed both frontend and backend components to display 
        comprehensive information about service provider applications.
      </dd>
      <br>
      <dd> 
        7. <b>Chat and Payment Page</b> - Contributed to the service status update functionality, implementing 
        the UI according to Figma designs and creating APIs to update service statuses throughout the workflow.
      </dd>`,
    github: "",
  },
  {
    title: "Bitcoin Signal Prediction",
    subtitle: "Python",
    type: "Data Science",
    start_month: 6,
    start_year: 2025,
    information: `<b>This is my personal project called Bitcoin Signal Prediction.
      <br>This project started in June 2025 and it took me 2 months to complete this project.</b>
      <br><br>
      My purpose is to develop <b>a predictive model for Bitcoin trading signals</b> using Data Science and Machine Learning techniques. 
      The main goal is to help make better trading decisions by analyzing real-time market data from APIs and generating buy or sell signals based on that data.
      <br><br>
      This project is built by Python and contains many key features such as <b>Data Collection</b>, <b>Feature Engineering</b>, <b>Model Training</b>, <b>Model Evaluation</b>, and <b>Backtesting</b>.`,
    cover_image: "assets/img/project/bitcoin-signal-prediction/cover.png",
    images: [
      "assets/img/project/bitcoin-signal-prediction/content01.png",
      "assets/img/project/bitcoin-signal-prediction/content02.png",
      "assets/img/project/bitcoin-signal-prediction/content03.png",
      "assets/img/project/bitcoin-signal-prediction/content04.png",
    ],
    can_preview_video: false,
    preview_video: "",
    can_demo: false,
    preview_demo: "",
    have_doc: true,
    doc_type: "article",
    preview_doc:
      "https://medium.com/@BadLuckZ/building-crypto-trading-signal-models-from-api-to-machine-learning-models-f374cda06eda",
    tech_related: ["Python"],
    learn: `There are 3 things I can learn by doing this project
      <br><br>
      <dd>
        1. <b>I learned how to create a machine learning model for predicting Bitcoin signals.</b>
        <br>
        I practiced collecting data, preparing it, and training a model to make predictions. I also learned how to check if the model works well or not.
      </dd>
      <br>
      <dd>
        2. <b>I got better at using Python and Data Science tools to solve real problems.</b>
        <br>
        I learned how to use Python libraries like pandas and scikit-learn to work with real-time data, try different ways to improve my model, and fix issues that came up during the project. 
        I also learned how to think step by step to solve problems and make decisions based on data.
      </dd>
      <br>
      <dd>
        3. <b>This project gave me a chance to study trading knowledge.</b>
        <br>
        I can learn new trading terms, how different indicators work, and basic concepts about crypto trading, which helped me understand how real traders make decisions.
      </dd>`,
    contribution:
      "Since this is my personal project, It means I has built everything in this project by myself😊.",
    github: "https://github.com/BadLuckZ/Project-Bitcoin-Signal-Prediction.git",
  },
  {
    title: "My Flashcard",
    subtitle: "React",
    type: "Web Development",
    start_month: 5,
    start_year: 2025,
    information: `<b>This flashcard project was personally developed to help me remember 
      English vocabulary in preparation for the TOEIC Test in August 2025 😔.
      <br>This project started in May 2025 and it took me around 2 weeks to do due to my internship.</b>
      <br><br>
      The project has a responsive design, so it works well on phones, 
      tablets, and computers. I made it simple and easy to use, so I can focus on 
      learning and remembering words without any distractions.
      <br><br> This project contains 3 parts
      <dd>1. <b>EntryPage</b> which is the first page. It gives a simple welcome and lets users start the learning experience.</dd>
      <dd>2. <b>CategoryPage</b> which shows different vocabulary decks grouped by topics like Business, Travel, or Daily Life. 
      Users can pick the deck they want to study. Furthermore, users can rename decks or remove unused decks.</dd>
      <dd>3. <b>DeckPage</b> which displays flashcards from the selected deck. 
      At the front of each card, it shows a word and its type. On the other side, it shows its meaning and a sample sentence. 
      Cards can be flipped and browsed through.Furthermore, users can adjust card's information and remove cards from the deck.</dd>
      `,
    cover_image: "assets/img/project/flashcard/cover.png",
    images: [
      "assets/img/project/flashcard/content01.png",
      "assets/img/project/flashcard/content02.png",
      "assets/img/project/flashcard/content03.png",
      "assets/img/project/flashcard/content04.png",
      "assets/img/project/flashcard/content05.png",
      "assets/img/project/flashcard/content06.png",
      "assets/img/project/flashcard/content07.png",
      "assets/img/project/flashcard/content08.png",
      "assets/img/project/flashcard/content09.png",
    ],
    can_preview_video: false,
    preview_video: "",
    can_demo: true,
    preview_demo: "https://project-flashcard-seven.vercel.app/",
    have_doc: false,
    doc_type: "",
    preview_doc: "",
    tech_related: ["React", "TailwindCSS", "JavaScript"],
    learn: `Here're what I learned from doing this project.
      <dd>
      1. <b>This is my first time making a full personal project by 
      myself in a short amount of time.</b>
      <br>
      I planned everything on my own — from the design to the features. 
      It took a lot of time to design since I wasn’t very good at it (still not great 😔). 
      <br>
      Because of the short timeline, I had to manage my time carefully to finish everything.
      <br>
      In the end, the design is fine for me, it is easy to use, and its functionality went well, 
      and I think this helped me improve at building and completing real projects.
      </dd>
      <br>
      <dd>
      2. <b>I can create a responsive and user-friendly website.</b>
      <br>
      This project made me take on 3 roles: Designer, Developer, and User. 
      I had to think about how the app looks, how it works, and how it feels to use.
      <br>
      Doing all of this helped me understand how important it is to make a website that is both 
      functional and easy to use on any device.
      </dd>
      `,
    contribution:
      "Since this is my personal project, It means I has built all things in this project by myself😊.",
    github: "https://github.com/BadLuckZ/Project-Flashcard",
  },
  {
    title: "Pixel Saga Game",
    subtitle: "Java",
    type: "Others",
    start_month: 4,
    start_year: 2024,
    information: `<b>This is the group project for Programming Methodology Subject in Year 1.
      <br>This project started in April 2024 and finished in May 2024.</b>
      <br><br>
      We call this project <b>Pixel Saga</b>. It's a roguelike platformer game featuring pixel art. 
      The objective is to survive as long as possible by defeating enemies in various levels and conquering bosses. 
      Players can choose a class at the beginning of the game and get perks to enhance their abilities. 
      There are also areas where players can purchase new perks and upgrade existing perks to become stronger.`,
    cover_image: "assets/img/project/pixel-saga/cover.png",
    images: [
      "assets/img/project/pixel-saga/content01.png",
      "assets/img/project/pixel-saga/content02.png",
      "assets/img/project/pixel-saga/content03.png",
      "assets/img/project/pixel-saga/content04.png",
      "assets/img/project/pixel-saga/content05.png",
      "assets/img/project/pixel-saga/content06.png",
      "assets/img/project/pixel-saga/content07.png",
      "assets/img/project/pixel-saga/content08.png",
      "assets/img/project/pixel-saga/content09.png",
      "assets/img/project/pixel-saga/content10.png",
    ],
    can_preview_video: true,
    preview_video: "./assets/videos/pixel_saga.mp4",
    can_demo: false,
    preview_demo: "",
    have_doc: true,
    doc_type: "pdf",
    preview_doc: "assets/pdf/pixel_saga.pdf",
    tech_related: ["Java"],
    learn: `There are 2 things I can learn by doing this project
      <br><br>
      <dd>
        1. <b>I’ve learned the challenges and hardships of game development.</b>
        <br>
        I’ve always had questions about game development-for example, 
        why do so many games I’ve played have bugs? Why aren’t they thoroughly tested before release? 
        However, after working on this project with my friend, I understood why these situations happen.
        We tried to play our game as much as we can to solve the bugs inside the project and when our time 
        to present the project came, it still had bugs in our project.
      </dd>
      <br>
      <dd>
        2. <b>This is my first chance to code with my friend. 
        I thought it wouldn't be that hard but it's not like that.</b>
        <br>
        Although our communication went well, many functions we wanted to code were harder 
        than we thought due to our lack of experience and knowledge. So we decided to code 
        the main features first such as movement systems
        and animations. When we had some time, we learned how to code things we wanted and applied to our projects.
        That situation improves our coding skills.
      </dd>`,
    contribution: `<b>The parts I contributed to this project are as follows...</b>
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
      and creating various in-game scenes, and writing this project's documentation.
      `,
    github: "https://github.com/BadLuckZ/Project-PixelSaga.git",
  },
  {
    title: "E-Commerce Website",
    subtitle: "React",
    type: "Web Development",
    start_month: 10,
    start_year: 2024,
    information: `<b>This is the group project from Skooldio Bootcamp, Web Development Bootcamp #2.
      <br>This project started in October 2024 and finished in the same month.</b>
      <br><br>This project is about creating the website that should have a responsive and appealing 
      design that works across multiple platforms and should function appropriately 
      using the knowledge from the boot camp.
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
    doc_type: "",
    preview_doc: "",
    tech_related: ["React", "CSS", "JavaScript"],
    learn: `Here're things I can learn by doing this project
      <br><br>
      <dd>
        1. <b>This is the first chance coding real-world project with other people that I haven't known before.</b> 
        <br>
        It takes a lot of my effort and time not only to code in my part but also to communicate with 
        other people and to prepare the presentation. I took a lead of this group by separating parts of the projects
        and assign to each member in the team and I tried to help other members when they have some questions.
        That helps me improve my leadership skills and improve my communication skills.
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
        2. In <b>DetailPage</b>, users will see the item's selected detail. Users can interact with its images and 
        can select the size, color, and quantity options. After clicking the "Add to cart" button, 
        the selected options will be saved, and the cart will be updated on every page.
        Furthermore, when users go to the other items or other pages and come back to this item, 
        the selected options will display.
      </dd>`,
    github: "https://github.com/BadLuckZ/Project-ECommerce-Div-Centering.git",
  },
].sort((e1, e2) => {
  if (e1.start_year !== e2.start_year) {
    return e1.start_year < e2.start_year ? 1 : -1;
  }
  if (e1.start_month !== e2.start_month) {
    return e1.start_month < e2.start_month ? 1 : -1;
  }
  if (e1.subtitle === e2.subtitle) {
    return e1.title < e2.title ? -1 : 1;
  }
  return e1.subtitle < e2.subtitle ? -1 : 1;
});
