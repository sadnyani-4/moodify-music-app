# Moodify: Your Mind's Personal DJ! 🎶🧠

## Overview

Hey there, music lover! Ever wished your favorite tunes could sync up perfectly with your inner vibes? Moodify is here to help! I've created a web app that's like a trip inside your own "Headquarters," where our team of "Emotions" (just like in *Inside Out*) works to turn your feelings into a personalized playlist.  I use a bit of machine learning magic to understand your mood and then tap into our musical "Long-Term Memory" to find the perfect tracks.  Built with Next.js for a super-smooth experience and deployed on Render, Moodify brings the soundtrack of your mind to your fingertips!

## Features

* **Emotion-Powered Playlists:** Tell us how you're feeling, and we'll create a playlist that *gets* you. Whether you're feeling like you're on top of the world with Joy, or a bit blue with Sadness, we've got the tunes to match!
* **"Inside Out" Inspired:** We've taken a page from Riley's book, using the core emotions from *Inside Out* as the foundation for our mood detection.
* **Smart Mood Analysis:** We use machine learning to analyze your text input and determine your dominant emotion.  Think of it as our inner "Joy," "Sadness," "Anger," "Disgust," and "Fear" working in harmony (or disharmony, depending on your mood!) to understand what you're going through.
* **Next.js Magic:** Built with Next.js for lightning-fast performance and a super-slick user experience.  It's like having a super-efficient control center in your brain!
* **Render Ready:** Deployed on Render, so it's always up and ready to help you process those emotions with the perfect musical accompaniment.

## How It Works (A Journey Through Your Mind)

1.  **Express Yourself:** You tell us your mood by describing how you feel.  Are you feeling like you're bursting with Joy, down in the dumps with Sadness, seeing red with Anger, totally grossed out with Disgust, or trembling with Fear?  Just like Riley, your words help us understand what's going on in your emotional command center.
2.  **We Analyze Your Feels:** Our sophisticated machine learning algorithms (think of them as the hardworking emotions in your brain) analyze your input to pinpoint your dominant mood.  It's like they're sorting through your memories to find the core feeling.
3.  **Music to Your Ears:** We dive into our vast music library (our "Long-Term Memory," if you will), powered by our backend systems, and curate 20 songs that perfectly match your emotional state.
4.  **Vibe Check:** Get ready to ride the emotional rollercoaster with a playlist that understands you.

## Technologies Used (The Stuff That Makes Your Brain... er, App... Work)

* **Next.js:** The rockstar framework for building awesome web apps.
* **React:** For creating a dynamic and interactive user interface.
* **JavaScript:** The language of the web, making everything come alive.
* **Python/Flask:** Our powerful backend that processes your mood input and retrieves the relevant songs.  Think of this as the engine room of your mind, where all the complex processing happens.
* **Machine Learning:** The magic behind our mood analysis, allowing the app to understand the nuances of human emotion from your text.
* **HTML:** The structure of the app
* **CSS:** The design and style, making it look good.
* **Render:** The cloud platform that hosts the app and makes it accessible to you.

## Get Your Feels On! (Running Moodify Locally)

Want to run Moodify on your own computer?  No problem!  Here's how:

### Prerequisites

Make sure you have these installed:

* Node.js (because JavaScript needs a home to run)
* npm (Node Package Manager) or Yarn (another package manager - like different tools in your toolbox)
* Python (for the backend)
* pip (Python package installer)

### Installation

1.  Clone the repository (download the code):

    ```bash
    git clone https://github.com/sadnyani-4/moodify-music-app.git
    ```

2.  Navigate to the project directory (go into the folder):

    ```bash
    cd moodify-music-app
    ```

3.  Install the frontend dependencies (install the necessary tools for the web app):

    ```bash
        npm install
        # or if you're a Yarn person:
        yarn install
    ```

4.  Navigate to the backend directory:

    ```bash
    cd backend
    ```

5.  Create a virtual environment (optional but recommended for Python projects):

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate  # On Windows
    ```

6.  Install the backend dependencies:

    ```bash
    pip install -r requirements.txt
    ```

7.  Navigate back to the main directory

    ```bash
    cd ..
    ```

### Run the App

1.  Start the backend server:

    ```bash
    cd backend
    python app.py
    ```

2.  Open a new terminal and start the development server (launch the web app):

    ```bash
    cd ..
    npm run dev
    # or
    yarn dev
    ```

3.  Open your browser and go to `http://localhost:3000` to experience Moodify!

## Deployment on Render (How We Got It To You)

Moodify lives on Render, a cloud hosting service. Here's the technical breakdown:

1.  The Next.js frontend is configured to export a static site.
2.  We use `npm run build` to prepare the frontend for deployment.
3.  A separate Render service is used to deploy the Python/Flask backend.
4.  Render hosts the static frontend and the dynamic backend.

The app can be accessed via the following link:
[Live Render Link](https://moodify-app-x011.onrender.com)

## Contributing

Got a great idea for Moodify? We'd love to hear it! Feel free to contribute by submitting a pull request or opening an issue.

## Author

Sadnyani