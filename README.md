# Mood-Based Music Recommender

## Overview

This project is a web application that recommends music based on the user's mood. It is built using Next.js and deployed on Render.

## Features

* **Mood-Based Recommendations:** Users can select their mood, and the app will suggest relevant music.
* **Next.js Framework:** The application is built using Next.js for server-side rendering and improved performance.
* **Render Deployment:** The application is deployed on Render, a cloud hosting platform, for easy accessibility.

## Technologies Used

* Next.js
* React
* JavaScript
* HTML
* CSS
* Render

## Deployment

The application is deployed on Render and can be accessed via the following link:

[Live Render Link](https://moodify-app-x011.onrender.com)

## Prerequisites

Before running the application locally, ensure you have the following installed:

* Node.js
* npm or Yarn

## Installation

1.  Clone the repository:

    ```bash
    git clone [https://github.com/sadnyani-4/moodify-music-app.git](https://github.com/sadnyani-4/moodify-music-app.git)
    ```

2.  Navigate to the project directory:

    ```bash
    cd your-repo-name
    ```

3.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

## Running the Application

1.  Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  Open your browser and visit `http://localhost:3000` to view the application.

## Deployment on Render

The application is deployed on Render using the following steps:

1.  The Next.js application is configured for static export by setting `output: 'export'` in `next.config.js`.
2.  The `package.json` build script is set to `next build`.
3.  A Render static site is created, connected to the GitHub repository.
4.  The build command is set to `npm run build` (or `yarn build`).
5.  The publish directory is set to `out`.

## Contributing

Contributions are welcome! If you have any suggestions or find any issues, please feel free to open a pull request or submit an issue.

## Author

Sadnyani