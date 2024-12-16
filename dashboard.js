import { config } from './config.js';

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const evaluateBtn = document.getElementById('evaluateBtn');
    const generateSection = document.getElementById('generateSection');
    const evaluateSection = document.getElementById('evaluateSection');
    const videoUrl = document.getElementById('videoUrl');
    const generateTitles = document.getElementById('generateTitles');
    const titlesList = document.getElementById('titlesList');
    const originalTitle = document.getElementById('originalTitle');
    const titleIdea = document.getElementById('titleIdea');
    const evaluateTitle = document.getElementById('evaluateTitle');

    // Switch between sections
    generateBtn.addEventListener('click', () => {
        generateSection.classList.add('active');
        evaluateSection.classList.remove('active');
        generateBtn.style.background = 'var(--primary-color)';
        generateBtn.style.color = 'var(--background-color)';
        evaluateBtn.style.background = 'var(--card-bg)';
        evaluateBtn.style.color = 'var(--text-color)';
    });

    evaluateBtn.addEventListener('click', () => {
        evaluateSection.classList.add('active');
        generateSection.classList.remove('active');
        evaluateBtn.style.background = 'var(--primary-color)';
        evaluateBtn.style.color = 'var(--background-color)';
        generateBtn.style.background = 'var(--card-bg)';
        generateBtn.style.color = 'var(--text-color)';
    });

    // Extract video ID from URL
    function extractVideoId(url) {
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&?]+)/);
        return videoIdMatch ? videoIdMatch[1] : null;
    }

    // Handle generate titles button click
    async function handleGenerateTitles() {
        const url = videoUrl.value.trim();
        if (!url) {
            alert('Please enter a valid YouTube URL');
            return;
        }

        try {
            // First get the video title from YouTube
            const videoId = extractVideoId(url);
            if (!videoId) {
                alert("Invalid YouTube link.");
                return;
            }

            const ytApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${config.youtube.apiKey}`;
            const ytResponse = await fetch(ytApiUrl);
            const ytData = await ytResponse.json();
            
            if (ytData.items.length === 0) {
                alert("Video not found.");
                return;
            }

            const videoTitle = ytData.items[0].snippet.title;
            originalTitle.textContent = videoTitle;

            // Then generate alternative titles using RapidAPI
            const rapidApiUrl = 'https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions';
            const options = {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': config.rapidApi.key,
                    'x-rapidapi-host': config.rapidApi.host,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: `Based on this YouTube video title (${videoTitle}), generate 10 catchy and engaging alternative titles that could increase viewership on a youtube channel. If a (${videoTitle}) has a semi-colon then the genrated titles should have titles that you suggest with semicolons and others just have one liners. If (${videoTitle}) is only sentences then your work is to give titles that are fire and one liners to capture attention.`
                    }],
                    model: 'gpt-4o',
                    max_tokens: 200,
                    temperature: 0.7
                })
            };

            //beginning of added code

            
            //end of aaded evaluation

            const response = await fetch(rapidApiUrl, options);
            const result = await response.json();
            const titles = result.choices[0].message.content.split('\n');

            titlesList.innerHTML = ''; // Clear previous titles
            titles.forEach((title, index) => {
                const cleanTitle = title.replace(/^\d+\.\s*/, '').trim();
                if (cleanTitle) {
                    const titleItem = document.createElement('div');
                    titleItem.className = 'title-item';
                    titleItem.innerHTML = `
                        <div class="title-content">
                            <span class="title-number">${index + 1}.</span>
                            <span class="title-text">${cleanTitle}</span>
                        </div>
                        <button class="copy-btn" onclick="copyTitle(this)">
                            <i class="fas fa-copy"></i>
                        </button>
                    `;
                    titlesList.appendChild(titleItem);
                }
            });
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while generating titles. Please try again later.');
        }
    }

    // Add enter key support for generate titles
    videoUrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleGenerateTitles();
        }
    });

    // Add click handler for generate button
    generateTitles.addEventListener('click', handleGenerateTitles);

    // Copy title function
    window.copyTitle = function(button) {
        const titleText = button.parentElement.querySelector('.title-text').textContent;
        navigator.clipboard.writeText(titleText).then(() => {
            const toast = document.getElementById('toast');
            toast.style.display = 'block';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 2000);
        });
    }

    // Add this after handleGenerateTitles function
    async function handleEvaluateTitles() {
        const titleIdeaInput = document.getElementById('titleIdea');
        const evaluationResults = document.querySelector('.evaluation-results');
        const idea = titleIdeaInput.value.trim();

        if (!idea) {
            alert("Please enter a title idea.");
            return;
        }

        try {
            const url = 'https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions';
            const options = {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': config.rapidApi.key,
                    'x-rapidapi-host': config.rapidApi.host,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: `Based on the content of this YouTube video (${idea}), generate 10 catchy and engaging titles that could increase viewership, keep it straight forward use 2 ":" and others just be full sentences. use CAPS to emphasize not all the time`
                    }],
                    model: 'gpt-4o',
                    max_tokens: 200,
                    temperature: 0.7
                })
            };

            evaluationResults.innerHTML = '<div class="loading">Generating suggestions...</div>';

            const response = await fetch(url, options);
            const result = await response.json();
            const titles = result.choices[0].message.content.split('\n');

            evaluationResults.innerHTML = `
                <div class="results-container">
                    <div class="original-title">
                        <h3>Your Title Idea:</h3>
                        <p>${idea}</p>
                    </div>
                    <div class="generated-titles">
                        <h3>Suggested Alternatives:</h3>
                        <div class="titles-list">
                        </div>
                    </div>
                </div>
            `;

            const titlesList = evaluationResults.querySelector('.titles-list');
            titles.forEach((title, index) => {
                const cleanTitle = title.replace(/^\d+\.\s*/, '').trim();
                if (cleanTitle) {
                    const titleItem = document.createElement('div');
                    titleItem.className = 'title-item';
                    titleItem.innerHTML = `
                        <div class="title-content">
                            <span class="title-number">${index + 1}.</span>
                            <span class="title-text">${cleanTitle}</span>
                        </div>
                        <button class="copy-btn" onclick="copyTitle(this)">
                            <i class="fas fa-copy"></i>
                        </button>
                    `;
                    titlesList.appendChild(titleItem);
                }
            });

        } catch (error) {
            console.error('Error:', error);
            evaluationResults.innerHTML = '<div class="error">An error occurred while generating suggestions. Please try again.</div>';
        }
    }

    // Add these event listeners after your existing event listeners
    titleIdea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEvaluateTitles();
        }
    });

    evaluateTitle.addEventListener('click', handleEvaluateTitles);
}); 