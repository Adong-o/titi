# ViralTitles

A YouTube title optimization tool that helps content creators generate engaging, SEO-optimized titles for their videos.

## Features
- AI-powered title generation
- Title evaluation
- YouTube video analysis
- SEO optimization
- Google Authentication

## Setup
1. Clone the repository
2. Copy `config.example.js` to `config.js`
3. Add your API keys to `config.js`
4. Never commit `config.js` to version control

## Required API Keys
You will need:
- Firebase configuration
- YouTube Data API key
- RapidAPI key

## Environment Variables
The following environment variables are required:
- `YOUTUBE_API_KEY`: YouTube Data API key
- `RAPIDAPI_KEY`: RapidAPI key
- `RAPIDAPI_HOST`: RapidAPI host
- `FIREBASE_*`: Firebase configuration variables

Never commit the `.env` file to version control! 