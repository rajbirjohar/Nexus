# Nexus

> Authors:  
> Rajbir Johar  
> Isaac Curiel  
> Florian Catalan  
> Robert Rivera  
> Brian Coffey

## Table of Contents
1. [Overview](#overview)
2. [Usage](#usage)
3. [How To Run](#how-to-run)
4. [Diagrams](#diagrams)
5. [Stack & Dependencies](#stack-and-dependencies)

## Overview


## Team


## Usage

> Screenshot or GIF of website

### How To Run

1. Clone or fork this project on your local machine.
2. Ensure you have [Node](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed.
3. Within the root directory, run `yarn` or `yarn install` to install all required packages needed for this project.
4. Then run `yarn run dev` to start your local server at `http://localhost:3000` and enter this address in your favorite browswer.
5. From here, you can edit and poke around and watch your changes hot update.

⚠️ **Note: In order to achieve full functionality, you will need to configure your environment variables as explained below.**

## Configuration

### Set up a MongoDB database

1. Set up a MongoDB database either locally or with [MongoDB Atlas for free](https://mongodb.com/atlas).
2. Once you have created your cluster and database, select **Connect** to begin connecting your frontend to your database.
3. You will need to create a database user and note down the username and password.
4. Then select the method /FINISH FROM HERE/

### Set up environment variables

Rename `.env.example` to `.env.local`

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

- `MONGODB_URI` - Your MongoDB connection string. If you are using [MongoDB Atlas](https://mongodb.com/atlas) you can find this by clicking the "Connect" button for your cluster.

#### Deploy Your Local Project

To deploy your local project to Vercel, push it to GitHub/GitLab/Bitbucket and [import to Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example).

**Important**: When you import your project on Vercel, make sure to click on **Environment Variables** and set them to match your `.env.local` file.

[MongoDB](https://www.mongodb.com/) is a general purpose, document-based, distributed database built for modern application developers and for the cloud era. This example will show you how to connect to and use MongoDB as your backend for your Next.js app.

If you want to learn more about MongoDB, visit the following pages:

- [MongoDB Atlas](https://mongodb.com/atlas)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Deploy your own

Once you have access to the environment variables you'll need, deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-mongodb&project-name=with-mongodb&repository-name=with-mongodb&env=MONGODB_URI&envDescription=Required%20to%20connect%20the%20app%20with%20MongoDB)


## Diagrams

Sequence Diagram

### Frontend Structure

```bash
├── master
│   ├── components
│   │   ├── Header.js
│   │   ├── Layout.js
│   │   ├── ...
│   ├── pages
│   │   ├── index.js
│   │   ├── _app.js
│   │   ├── _document.js
│   │   ├── api
│   │   │   ├── auth
│   │   │   ├── ...
│   │   ├── ...
│   ├── lib
│   │   ├── mongodb.js
│   │   ├── ...
│   ├── styles
│   │   ├── global.css
│   │   ├── header.module.css
│   │   ├── layout.module.css
│   │   ├── ...
│   ├── ...
├── staging
│   │   ├── pages
│   │   ├── components
│   │   ├── lib
│   │   ├── styles
│   ├── ...
└── .gitignore
```


Overall System Diagram

## Stack And Dependencies

<img alt="Next JS" src="https://img.shields.io/badge/nextjs-%23000000.svg?&style=for-the-badge&logo=next.js&logoColor=white"/> <img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/> <img alt="HTML5" src="https://img.shields.io/badge/html5-%23E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white"/> <img alt="CSS3" src="https://img.shields.io/badge/css3-%231572B6.svg?&style=for-the-badge&logo=css3&logoColor=white"/> <img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white" />


