// const template_experience = {
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
//   learn: "",
//   contribution: "",
//   github: ""
// };

export const experiences = [
  {
    title: "CUCM Reward 2025",
    subtitle: "Fullstack",
    type: "Web Development",
    start_month: 10,
    start_year: 2025,
    information: `<b>This is the project from ISD (Information System Development), Chulalongkorn University.
    <br>This project started in October 2025 and finished in December 2025.</b>
    <br><br>
    This project is about building a reward-based web application for CUCM (Chula Chiangmai) Camp 2025,
    designed to encourage interaction between participants and staff through
    gifting, coin transactions, and event-based activities.
    <br><br>
    The system supports four roles: <b>Participant</b>, <b>Staff</b>, 
    <b>Moderator</b>, and <b>Admin</b>. Each role has clearly defined permissions
    and access scopes to ensure proper control, fairness, and system stability.
    <br><br>
    Participants and staff can log in using a username and a 6-digit PIN.
    After logging in, users can answer a one-time secret question, which is later
    used as a validation mechanism for sending gifts between users.
    This answer can only be reset by an Admin.
    <br><br>
    The core features for <b>Participant</b> and <b>Staff</b> include:
    <dd>
      1. Viewing personal information such as name, nickname, and school.
    </dd>
    <dd>
      2. Sending gifts to other users by correctly answering the recipient’s secret question.
      Each user has a limited number of gift attempts per hour and cannot send gifts
      to the same person more than once per reset cycle.
    </dd>
    <dd>
      3. Receiving coins from gifts and redeeming event codes to earn additional coins.
    </dd>
    <dd>
      4. Using coins to support the central staff team or purchase tickets
      for prize draws.
    </dd>
    <dd>
      5. Viewing transaction history including coin earnings, coin usage,
      and gifting records.
    </dd>
    <dd>
      6. Competing on a leaderboard that can be filtered by role or viewed overall.
    </dd>
    <br>
    For <b>Moderator</b>, the system provides tools to create events and manage
    active redeem codes for participants.
    <br><br>
    And for <b>Admin</b>, the system includes advanced management features such as
    toggling system access by role, resetting user secret answers,
    adjusting coin balances, configuring ticket prices,
    managing events, and exporting ticket purchase data in CSV format
    for prize drawing.
  `,
    cover_image: "assets/img/experience/cucm-isd-2025/cover.webp",
    images: [
      "assets/img/experience/cucm-isd-2025/content01.webp",
      "assets/img/experience/cucm-isd-2025/content02.webp",
      "assets/img/experience/cucm-isd-2025/content03.webp",
      "assets/img/experience/cucm-isd-2025/content04.webp",
      "assets/img/experience/cucm-isd-2025/content05.webp",
      "assets/img/experience/cucm-isd-2025/content06.webp",
      "assets/img/experience/cucm-isd-2025/content07.webp",
      "assets/img/experience/cucm-isd-2025/content08.webp",
      "assets/img/experience/cucm-isd-2025/content09.webp",
      "assets/img/experience/cucm-isd-2025/content10.webp",
      "assets/img/experience/cucm-isd-2025/content11.webp",
      "assets/img/experience/cucm-isd-2025/content12.webp",
      "assets/img/experience/cucm-isd-2025/content13.webp",
      "assets/img/experience/cucm-isd-2025/content14.webp",
      "assets/img/experience/cucm-isd-2025/content15.webp",
      "assets/img/experience/cucm-isd-2025/content16.webp",
      "assets/img/experience/cucm-isd-2025/content17.webp",
      "assets/img/experience/cucm-isd-2025/content18.webp",
      "assets/img/experience/cucm-isd-2025/content19.webp",
      "assets/img/experience/cucm-isd-2025/content20.webp",
      "assets/img/experience/cucm-isd-2025/content21.webp",
      "assets/img/experience/cucm-isd-2025/content22.webp",
      "assets/img/experience/cucm-isd-2025/content23.webp",
    ],
    can_preview_video: false,
    preview_video: "",
    can_demo: false,
    preview_demo: "",
    have_doc: false,
    doc_type: "",
    preview_doc: "",
    learn: `There are 3 key takeaways I gained from participating in this project.
    <br><br>
    <dd>
      1. <b>Taking the role of Senior Frontend Developer in a real project.</b>
      <br>
      This was my first time acting as a Senior Frontend Developer,
      where I was responsible for planning frontend features,
      dividing tasks among team members, and ensuring overall progress.
    </dd>
    <br>
    <dd>
      2. <b>Managing code quality and team collaboration.</b>
      <br>
      I regularly reviewed pull requests, checked code consistency,
      verified feature correctness, and merged code to ensure that
      all parts worked together smoothly within the system.
    </dd>
    <br>
    <dd>
      3. <b>Designing frontend architecture for complex business logic.</b>
      <br>
      I gained experience in structuring frontend logic to support
      real-world constraints such as role-based permissions,
      limited actions, cooldown resets, and one-time access flows.
    </dd>
  `,
    contribution: `<b>The parts I contributed to this project are as follows.</b>
    <br><br>
    <dd>
      1. As a <b>Senior Frontend Developer</b>, I planned the overall frontend feature set,
      defined workflows for each user role, and divided tasks among frontend team members
      while tracking progress throughout the development period.
    </dd>
    <br>
    <dd>
      2. I was responsible for <b>Participant and Staff features</b>,
      including dashboards, gifting workflow, redeem code flow,
      coin usage, ticket purchasing, transaction history,
      and leaderboard logic.
    </dd>
    <br>
    <dd>
      3. I reviewed, tested, and merged frontend code from team members,
      ensuring consistency in coding style, correctness of logic,
      and smooth integration with backend APIs.
    </dd>
    <br>
    <dd>
      4. I implemented the <b>authentication flow</b> using username and 6-digit PIN,
      including role-based access control and post-login redirection.
    </dd>
  `,
    github: "",
  },
  {
    title: "Chula Openhouse 2025",
    subtitle: "Frontend",
    type: "Web Development",
    start_month: 2,
    start_year: 2025,
    information: `<b>This is the project from ISD (Information System Development), Chulalongkorn University.
      <br>This project started in February 2025 and finished in April 2025.</b>
      <br><br>This project is about building a website that helps people register for Chulalongkorn University's Open House 2025 
      and also share information from each faculty in the university.
      <br><br>This project mainly focuses on mobile users, since a Line Official Account has been set up 
      as a way to chat with users and provide easy access to the website.
      <br><br>This project contributes to many parts.
      <dd>1. <b>LandingPage</b> which is the first page. It includes announcement popups, 
      promotional images from each faculty, a space for the university’s live streams,
       FAQs, Sponsors and more.</dd>
      <dd>2. <b>RegisterPage</b> where users can register and log in to the system.</dd>
      <dd>3. <b>AccountPage</b> which displays user's information. It is also the entry to get a certification.</dd>
      <dd>4. <b>NavigationPage</b> which shows the location of each faculty, nearby facilities, 
      and directions for getting from one faculty to another.</dd>
      <dd>5. <b>EventPage</b> which shows the events in the university.</dd>
      <dd>6. <b>FacultyPage</b> which shows each faculty's detail.</dd>
      <dd>7. <b>WorkshopPage</b> which shows workshops from each faculty.</dd>
      <dd>8. <b>PickYourFlowerPage</b> which is a horoscope page with a lucky flower theme.
      Users can share their results to bring good vibes and positivity to themselves.</dd>

      <br>Furthermore, there is an <b>Admin Section</b> where only admins of this event can access.
      It shows the permissions of each person managing the event, 
      along with the faculty they're responsible for. 
      Admins can add or remove staff/admin members and change their access rights between Staff or Admin.

      <br><br>Lastly, there's <b>Feedback Section</b> to collect the feedbacks from the participants.
      `,
    cover_image: "assets/img/experience/openhouse-cu-isd-2025/cover.webp",
    images: [
      "assets/img/experience/openhouse-cu-isd-2025/content01.webp",
      "assets/img/experience/openhouse-cu-isd-2025/content02.webp",
      "assets/img/experience/openhouse-cu-isd-2025/content03.webp",
      "assets/img/experience/openhouse-cu-isd-2025/content04.webp",
      "assets/img/experience/openhouse-cu-isd-2025/content05.webp",
      "assets/img/experience/openhouse-cu-isd-2025/content06.webp",
      "assets/img/experience/openhouse-cu-isd-2025/content07.webp",
      "assets/img/experience/openhouse-cu-isd-2025/content08.webp",
      "assets/img/experience/openhouse-cu-isd-2025/content09.webp",
    ],
    can_preview_video: false,
    preview_video: "",
    can_demo: false,
    preview_demo: "",
    have_doc: false,
    doc_type: "",
    preview_doc: "",
    learn: `There are 2 things I can learn by participating in this project.
      <br><br>
      <dd>
        1. <b>This is my first real-world project using Next.js.</b>
        <br>
        Even though I had used React before and was somewhat familiar with Next.js, 
        this was my first time using Next.js seriously in a real project. 
        So I had to spend my free time learning how to use it more fluently.
      </dd>
      <br>
      <dd>
        2. <b>I have to work in the team where team members know each other.</b>
        <br>
        This was my first project working with ISD, and most of the team members already knew 
        each other and had worked together before. It was quite a challenge for me to keep up 
        and not slow down the progress. So I followed team's assignments and instructions, 
        tried to do as much as I could on my own and 
        observed the coding style from other ISD projects. That helped me understand how 
        the team writes code and allowed me to adapt and fit the team.
      </dd>
      `,
    contribution: `<b>The parts I contributed to this project are as follows...</b>
      <br><br>
      <dd>
        1. In <b>LandingPage</b>, I built the entire UI based on the Figma design and 
        added features to match the project requirements—for example, 
        a function to disable the registration button, which only becomes active when the registration date arrives.
      </dd>
      <br>
      <dd>
        2. In <b>NavigationPage</b>, I built the entire UI based on the Figma design with no special features.
      </dd>
      <br>
      <dd>
        3. In <b>Admin Section</b>, I built both the entry and the main pages based on the Figma design 
        and added features  to match the project requirements-for example, 
        a functions to switch role between "Staff" and "Admin" 
        and a function to add or delete users.
      </dd>
      <br>
      <dd>
        4. In <b>Feedback Section</b>, I built the entry page based on the Figma design.
      </dd>
      `,
    github: "",
  },
  {
    title: "Botnoi Turbo Platform",
    subtitle: "Frontend",
    type: "Web Development",
    start_month: 6,
    start_year: 2025,
    information: `<b>This project was from IBOTNOI COMPANY LIMITED as my first-time Frontend Dev Intern.
      <br>I worked on this project from June 2025 to July 2025.</b>
      <br><br>The goal was to make a website where users can turn text into speech easily and the website should 
      work well on phones and computers.
      <br><br>Users can upload a script, type their own text, or use AI to make a script. 
      They can pick different voices and languages. Furthermore, users can buy points by getting 
      packages or subscriptions. User's points are used to convert text to speech.
      <br><br>This website has the following main features:
      <dd>1. <b>Register and Login Popup</b> where users must sign up or log in before using the website. Login options: email, Google, or Line.</dd>
      <dd>2. <b>Input Section</b> where users can upload scripts, type text, or use AI to create blogs.</dd>
      <dd>3. <b>Blog Section</b> where users can see and manage their blogs, use points to convert text to speech, and download voices.</dd>
      <dd>4. <b>Model Selection</b> where users can choose the voice model for text-to-speech.</dd>
      <dd>5. <b>Payment Section</b> where users can buy points with packages or subscriptions.</dd>
      <dd>6. <b>Account Section</b> where users can see and edit their account info.</dd>
      <dd>7. <b>Subscription Section</b> where users can see and manage their subscriptions.</dd>
      <br>Every action shows a popup to tell users if it worked or not. With all of these features, 
      I believe the website is easy to use and helpful.
    `,
    cover_image: "assets/img/experience/botnoi-turbo-platform/cover.webp",
    images: [
      "assets/img/experience/botnoi-turbo-platform/content01.webp",
      "assets/img/experience/botnoi-turbo-platform/content02.webp",
      "assets/img/experience/botnoi-turbo-platform/content03.webp",
      "assets/img/experience/botnoi-turbo-platform/content04.webp",
      "assets/img/experience/botnoi-turbo-platform/content05.webp",
      "assets/img/experience/botnoi-turbo-platform/content06.webp",
      "assets/img/experience/botnoi-turbo-platform/content07.webp",
    ],
    can_preview_video: false,
    preview_video: "",
    can_demo: false,
    preview_demo: "",
    have_doc: false,
    doc_type: "",
    preview_doc: "",
    learn: `There are 3 things I can learn by participating in this project.
      <br><br>
      <dd>1. <b>This was my first time leading the frontend team.</b>
      <br>This was my first time as a Frontend Developer Intern, and my task was to guide my team and 
        share tasks. At first, I felt nervous because I wanted everything to go well, 
        but I learned how to communicate and help my team work together.
      </dd>
      <br>
      <dd>2. <b>I understood the importance of building and using global components.</b>
      <br>At first, I knew global components were useful, but I didn’t realize how important they were until I had to make 
        shared components for everyone. It was sometimes hard to keep the code clean and simple for others to use.
        When my teammates used my components and said it helped them, this made me more confident in my coding and teamwork skills.
      </dd>
      <br>
      <dd>3. <b>This was my first time reviewing and organizing project structure.</b>
      <br>As a leader of frontend team, one of the jobs is checking my team's code and 
        planning how the project should be organized. Sometimes it was hard to give feedback, 
        but I learned how important it is to keep the code simple and clear. 
        I feel more confident now about working in a team and leading a project.
      </dd>
      `,
    contribution: `<b>Here's my participation in this project (only about my coding part)</b>
    <br><br>
    <dd>1. <b>Responsive Design</b> My first task is creating a responsive layout using TailwindCSS. 
      I made sure the website looks good on all devices.
    </dd>
    <br>
    <dd>2. <b>Component Library</b> I created a library of reusable components using React. 
      This made it easier for my team to build new features quickly and maintain consistency 
      across the app.
    </dd>
    <br>
    <dd>3. <b>Input Section</b> I worked on this section to display the content inside the document 
      and make sure that users can split the content into multiple blogs correctly.
    </dd>
    <br>
    <dd>4. <b>Model Selection Section</b> I worked on this section to allow users to filter and select 
      different models for their content generation.
    </dd>
    <br>
    <dd>5. <b>Blog Section</b> I worked on this section to allow users to create and 
      manage their blogs. This involved playing speech from blog's content 
      and allowing users to edit the blog's content and download the voices.
    </dd>
    <br>
    <dd>6. <b>Payment Section</b> I worked on this section to display packages and subscriptions information from the backend.
    `,
    github: "",
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
