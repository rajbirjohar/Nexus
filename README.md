# Nexus

<p align="center">
<img src="/documentation/images/Banner.png" alt="cover page for Nexus project">
</p>
&nbsp;

> Authors:  
> Florian Catalan  
> Brian Coffey  
> Isaac Curiel  
> Rajbir Johar  
> Robert Rivera  

## Table of Contents
1. [Overview](#overview)  
2. [Usage](#usage)  
3. [How To Run](#how-to-run)  
4. [Dependencies](#dependencies)  
5. [Challenges](#challenges)  
6. [Diagrams](#diagrams)  


## Overview

> Summary of Project, purpose, stack, etc.

### Stack

<img alt="Next JS" src="https://img.shields.io/badge/nextjs-%23000000.svg?&style=for-the-badge&logo=next.js&logoColor=white"/> <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/> <img alt="Typescript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/> <img alt="HTML5" src="https://img.shields.io/badge/html5-%23E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white"/> <img alt="CSS3" src="https://img.shields.io/badge/css3-%231572B6.svg?&style=for-the-badge&logo=css3&logoColor=white"/> <img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white" /> <img alt="Prettier" src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E"/> <img alt="Stack Overflow" src="https://img.shields.io/badge/Stack_Overflow-FE7A16?style=for-the-badge&logo=stack-overflow&logoColor=white"/>

### Features
- [x] Authentication
- [x] Static site generation
- [x] Server side rendering
- [x] Serverless apis
- [x] Static data fetching
- [x] Dynamic, protected, instant routing
- [x] User profiles
- [x] Orgs search, post, edit,  read, delete
- [x] Courses search, post, edit, read, delete
- [x] Events search, post, edit,  read, delete
- [x] Comments post, edit,  read, delete
- [x] Dark mode
- [x] Updated color scheme and layout
- [x] Rich text editor
- [x] Organization management
- [x] Notification system
- [x] Opportunities
- [x] Pagination
- [x] Roles collection
- [x] Role permissions
- [x] Add/remove admins
- [x] Add/remove members
- [x] Transfer ownership
- [x] Discover sidebar
- [x] Join/edit organizations
- [x] Latest reviews
- [x] Logo
- [x] Image database
- [x] Organization profile images
- [x] Organization social icons/links
- [x] Banner images for events
- [x] University course database
- [x] Types

### About

Nexus is the one-stop shop for a student at UCR hosting information on different clubs, organizations, and events as well as reviews on classes provided by other students. We want the students that use this site to be as informed as possible about what is currently going on on campus.
 
Using the most powerful and dynamic stack, we are able to provide a near instant and seamless user experience. Our framework of choice, NextJS allows us to build and scale our application for large populations all while remaining incredibly smooth. MongoDB allows us to structure data in an intuitive way and offers easy ways to access and write data to and from the frontend without any hiccups.

## Team

> List of pictures, names, and relevant websites

### Rajbir Johar

<img align="left" src="/documentation/images/rajbir.png" alt="image of Rajbir Johar" width="75" height="75">

Hey I'm Rajbir! You can find out more about me on my [Portfolio](https://rajbir.io/) or my [Github](https://github.com/rajbirjohar). Currently, I'm interested in automotives, especially german cars, building bespoke mechanical keyboards, and web development and design.

<br/>

### Isaac Curiel

<img align="left" src="/documentation/images/isaac.png" alt="image of Isaac Curiel" width="75" height="75">

Hey there, I'm Isaac! Some of my interests include stationery, mainly fountain pens, and sports (Go Rams!). Check out my [Github](https://github.com/isaac-18) for more. 

<br/>

### Florian Catalan
<img align="left" src="/documentation/images/florian.png" alt="image of Florian Catalan" width="75" height="75">

Hello, I'm Florian. 4th year CS major at UCR and you can find more from me at my [LinkedIn](https://www.linkedin.com/in/floriancatalan/). I enjoy playing video games, watching movies/shows, designing, and editing in my free time. Career prospects in UX/UI.

<br/>

### Brian Coffey
<img align="left" src="/documentation/images/brian.png" alt="image of Brian Coffey" width="75" height="75">

Hey, I'm Brian! I am a 4th year Computer Science major at UCR, and I am applying for my Masters in Education. Follow my [Github](https://github.com/brianpcoffey) to keep up to date with my projects! I also have many interests, such as bouldering, surfing, coffee, and really just trying anything new! 

<br/>

### Robert Rivera
<img align="left" src="/documentation/images/robert.png" alt="image of Robert Rivera" width="75" height="75">

Hello, I'm Robert! I'm a 4th year Computer Science major at UCR. If you are interested in learning more about me, check out my [LinkedIn](https://www.linkedin.com/in/robertrivera288/) and [Github](https://github.com/Robert288) pages. 

<br/>

## Usage

### How To Run

1. Clone or fork this project on your local machine.
2. Ensure you have [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed.
3. Within the root directory, run `yarn` or `yarn install` to install all required packages needed for this project.
4. Then run `yarn run dev` to start your local server at `http://localhost:3000` and enter this address in your favorite browser.
5. From here, you can edit, poke around, and watch your changes live update.

⚠️ **Important: In order to achieve full functionality, you will need to configure your environment variables as explained below.**

## Configuration

### Set Up MongoDB database

1. Set up a MongoDB database either locally or with [MongoDB Atlas for free](https://mongodb.com/atlas).
2. Once you have created your cluster and database, select **Connect** to begin connecting your frontend to your database.
3. You will need to create a database user and note down the username and password.
4. Then select the method **Connect Your Application** where you will be prompted with a link as represented below.
```
mongodb+srv://<user>:<password>@cluster0.qhvo8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```
5. This link represents your **MONGODB_URI** where you will replace `<user>`, `<password>`, and `myFirstDatabase` with your respective values without `<>`.

### Set Up Google OAuth Application

1. Follow the steps listed on [Google's Official OAauth2 Documentation](https://developers.google.com/identity/protocols/oauth2) to set up your API Console and access Google's APIs.
2. After creating your project, note down the `Google Client ID` and the `Google Client Secret` as you will need these to fill out the environment variables.

### Set Up Environment Variables

Rename `.env.example` to `.env.local`

Set each variable on `.env.local`:

- `MONGODB_URI` - Your MongoDB connection string.
- `MONGODB_DB` - The name of your Database.
- `NEXTAUTH_URL` - The canonical url of your website. Your local environment should be `http://localhost:3000`. Your production variable should be your actual domain.
- `JWT_SIGNING_PRIVATE_KEY` - A random string of characters used to generate JWT Tokens. Next-Auth will create one for you so this is optional but highly recommended to have your own. It is currently used for Google 3rd Party Sign-In.
- `GOOGLE_CLIENT_ID` - The ID generated by the Google API dashboard when you are setting up OAuth.
- `GOOGLE_CLIENT_SECRET` - The password by the Google API dashboard when you are setting up OAuth.
- `CLOUDINARY_URL` - The URL needed to store images in cloudinary.

⚠️ **Important: The `.gitignore` should already filter the .env files but just in case, never commit your environment variables.**

### Deploy Your Local Project

To deploy your local project to Vercel, push it to GitHub/GitLab/Bitbucket and [import to Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example).

⚠️ **Important: When you import your project on Vercel, make sure to click on **Environment Variables** and set them to match your `.env.local` file.**

[MongoDB](https://www.mongodb.com/) is a general purpose, document-based, distributed database built for modern application developers and for the cloud era. This example will show you how to connect to and use MongoDB as your backend for your Next.js app.

If you want to learn more about MongoDB, visit the following pages:

- [MongoDB Atlas](https://mongodb.com/atlas)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Dependencies

### Notable Libraries and Packages

- Next-Auth
    - Main library used for authentication.
    - Used in conjunction with Google OAuth.
    - Only extracts a user's name, email, and google image (for privacy) 
- TipTap 
    - Powers our Rich Text Editor.
    - Incredibly versatile and powerful.
- SWR
    - Allows for revalidating data fetching so all data is up to date.
- Formik
    - How our forms are made.
- CSS Modules
- Framer Motion
    - What is behind most of our layout animations for an incredibly smooth interface.
- react-hot-toast
    - Notifies the user with a cute toast.
- Lottie
    - Makes our landing page special with animated images.
- react-dropzone
    - Allows users to submit images.
- date-fns
    - Allows us to use the timestone (correctly).

### Python Script

- Allows us to collect all the courses offered at UCR over the past 5 quarters. 
- Works by submitting requests to the UCR registration website which returns a JSON response of course data that we parse, format, and upload to our database.
- Uses the Python Requests and JSON libraries.

## Challenges

This project has definitely tested our abilities as developers and forced us to learn and embrace challenges. Below we explain all of the major obstacles we've encountered while building this one-of-a-kind app.

### Frontend

I'd say the biggest issue we encountered on the frontend would probably be the animations. The difference between a good app and a great app in my opinion is how it feels in the user's hands. It should feel natural, almost as if it were an extension of their own body. And achieving that required a great sense of attention to detail and how different objects on the screen interact with each other and the user. This also includes how colors and shadows shift and ensuring that there is no resistance when using the app.

> &mdash; <cite>Rajbir Johar</cite>

One obstacle was visualizing the user experience to effectively deliver the needs to all our users. Another challenge was developing an intuitive navigation system to create a flawless experience. It was important to think about the overall impression we wanted our users to have before making important decisions. Our primary goal for Nexus is to become a central part of our users’ day-to-day lives. 

> &mdash; <cite>Robert Rivera</cite>

NextJS and Typescript being the bases of our stack for this web app was both exciting and daunting as Nexus would be the first time I would be working with either of these tools. It was definitely an uphill battle learning the language of these tools, but I enjoyed piecing it together and developing in the Nexus environment.

> &mdash; <cite>Florian Catalan</cite>

### Backend

This was the first time I realized that maybe not all the stuff taught in my theoretical CS classes was inapplicable. Structuring my backend forced me to think about how data is related to each other in order to reduce the amount of redundancies produced. This in turn helped me with fetching the right data in the fastest way possible to provide to the user.

> &mdash; <cite>Rajbir Johar</cite>

During the development of the Python script something changed with the requests we were submitting and we were no longer receiving any data in the response. Since this was my first experience with this particular library lots of debugging and documentation reading ensued. While it was a relatively simple fix in the end, it took some time to figure out what was wrong and the script had to be rewritten which caused a slight delay in adding all courses to the site.

> &mdash; <cite>Isaac Curiel</cite>

Dealing with images always proves to be a challenge, and this time was no exception. While we had experience from previous projects with image uploads, this time was a bit different since we were using Formik for user input, and I had trouble accessing and then passing the image data to the backend for upload.

> &mdash; <cite>Isaac Curiel</cite>

### Plan & Design

This is the first time where our group of software engineers took on the task to develop a full stack web application. Prior to this, most large scale projects we completed had guidance, an objective, and little planning was needed. However, developing Nexus brought on a whole set of new experiences and challenges. When we first started with our idea, we had to decide on the main features we wanted to incorporate into the product. Along with feature planning, we needed to plan sprints and approximate how much time each feature would take. In addition, we removed and added features during development for a multitude of reasons. Sometimes some features were too complex, impacted performance, or became negligible. Thus, constant changes, new ideas, and maintaining the original idea of the project proved extremely challenging.

> &mdash; <cite>Brian Coffey</cite>
> 
In order to contribute to Nexus, you need to be a UCR student or faculty member. Therefore, Nexus will deal with sensitive information. Security is our top priority because we want all our users to feel secure while using Nexus. We believe our multi-factor authentication will give users confidence in our infrastructure.

> &mdash; <cite>Robert Rivera</cite>

Initial design mockups and ideas would be scrapped and replaced with implementations that better fit the vision of Nexus. This planning process reinforced the idea of not getting too attached to your own designs. Others may have designs of their own that also accomplish the same goals as yours all while innovating in ways that may have never crossed your mind. 

> &mdash; <cite>Florian Catalan</cite>

## Diagrams

> UI/UX Mockups/State Diagrams

### Project Structure

Overall System Diagram

```bash
├── main
│   ├── components
│   │   │   ├── Reviews
│   │   │   │   ├── ListReviewPosts.tsx
│   │   │   │   ├── ...
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── ...
│   ├── pages
│   │   ├── index.tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── api
│   │   │   ├── auth
│   │   │   ├── ...
│   │   ├── ...
│   ├── lib
│   │   ├── mongodb.ts
│   │   ├── ...
│   ├── styles
│   │   ├── global.css
│   │   ├── header.module.css
│   │   ├── layout.module.css
│   │   ├── ...
│   ├── public
│   │   ├── assets
│   │   ├── ...
│   ├── ...
└── .gitignore
```


### Landing Page

Our design language leans towards a simple yet tasteful color scheme and layout to create an unparalleled user experience. We want to be able to provide as much information as possible while being digestible for the user. Along with our purple brand, we offer a dark mode for those who enjoy browsing at night giving the user options and control over their experience.

<p align="center">
<img src="/documentation/images/LandingLight.png" alt="image of Nexus' landing page">
</p>
&nbsp;

### Courses Page 

Our Courses page features functionality that allows users to post, read, edit, and delete course reviews. We want to be able to show all the important information that user might want to see at a glance. There are future plans on allowing the user to sort by a specific metric.

<p align="center">
<img src="/documentation/images/CoursesDark.png" alt="image of Nexus' courses page">
&nbsp;
 </p>
 &nbsp;
 
 ### Events Page 

Our Events page features upcoming events from organizations registered with Nexus. Here, users can see all events and their info all in one place.

<p align="center">
<img src="/documentation/images/EventsLight.png" alt="image of Nexus' events page">
&nbsp;
</p>
&nbsp;

### Organization Page 

Our Organization page features organizations registered with Nexus. Functionality includes allowing users to become members of organizations.

<p align="center">
<img src="/documentation/images/OrganizationsDark.png" alt="image of Nexus' organization page">
&nbsp;
</p>
&nbsp;

### Opportunities Page 

Our Opportunities page features opportunities posted by UCR professors. Users can see what professors are offering and apply to anything that piques their interest.

<p align="center">
<img src="/documentation/images/OpportunitiesLight.png" alt="image of Nexus' organization page">
&nbsp;
</p>
&nbsp;

### Sign Up Sequence Diagram 

The login sequence is structured to be smooth for the user so as to provide ease of use when first trying our app. They are directly sent to log in via Google OAuth and then once they complete the login sequence, will be redirected to their profile page. There they can view all their posts and navigate to any other page.

<p align="center">
<img src="/documentation/images/SignupSequence.svg" alt="image of login sequence diagram">
  </p>
&nbsp;

### Roles Sequence Diagram 

After the initial sign up, the user is prompted to request a role before they are able to leave reviews. At the moment there are only two options: "Professor" and "Student". Only students are able to leave reviews for courses. Once a role is selected the user's profile is updated on the database. Now when navigating to a specific course page their student role is verified and a form displayed allowing them to write a review.

<p align="center">
<img src="/documentation/images/AuthRoleSequence.svg" alt="image of login sequence diagram">
  </p>
&nbsp;

### New Review Sequence Diagram 

Users are able to create new posts via the `/reviews` page. Once they input all their information, it will be sent via a secured API and stored in our database. Our clever design allows for near instant, live updates to the page so users have a quick confirmation that their post can be seen by everyone. All data sent to the database is locked via Next-Auth api protection and fetched onto the frontend via SWR.

<p align="center">
<img src="/documentation/images/ReviewSequence.svg" alt="image of new post sequence diagram">
  </p>
&nbsp;

### New Organization Sequence Diagram 

When creating a new organization users must first apply to be an "Organizer" from the `/organizations` page. After approval their profile on the database is then updated to reflect this change. Once complete they are directed to a form where they can then create their new organization after filling in some information.

<p align="center">
<img src="/documentation/images/OrgSequence.svg" alt="image of new organization sequence diagram">
  </p>
&nbsp;

### New Event Sequence Diagram 

Once a user has successfully created an organization, they are able to create events for it by navigating to its respective page. They are greeted by a form where they can enter details about the event. The event is created and written to the database where it is then displayed on both the `/events` and organization's page.

<p align="center">
<img src="/documentation/images/EventSequence.svg" alt="image of new event sequence diagram">
  </p>
&nbsp;


### Searching for Course Sequence Diagram 

At the top of the `/courses` page there is a search bar allowing users to filter courses based on a provided search string. When first visiting the `/courses` page a request is sent to the database for a list of all courses. These courses are then returned and then displayed as cards on the page. As the user types in the search bar the page dynamically displays all courses matching the search query.

<p align="center">
<img src="/documentation/images/CourseSearchSequence.svg" alt="image of searching for course sequence diagram">
  </p>
&nbsp;

> More screenshots to come.
