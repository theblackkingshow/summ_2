// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const word = document.getElementById('word-input').value.trim();
    if (word) {
        searchWord(word);
    }
});

// Event listener for random word button
document.getElementById('random-btn').addEventListener('click', function() {
    generateRandomWord();
});

// Event listener for theme toggle
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const icon = this.textContent;
    this.textContent = icon === '🌙' ? '☀️' : '🌙';
});

// Function to fetch data from API
async function searchWord(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        displayResults(data[0]); // Assuming first entry
    } catch (error) {
        document.getElementById('results').innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Function to generate random word
async function generateRandomWord() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word');
        if (!response.ok) {
            throw new Error('Failed to generate random word');
        }
        const words = await response.json();
        const randomWord = words[0];
        document.getElementById('word-input').value = randomWord;
        searchWord(randomWord);
    } catch (error) {
        document.getElementById('results').innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Function to display results
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    let html = `<div class="word-title">${data.word}</div>`;

    // Pronunciation
    if (data.phonetics && data.phonetics.length > 0) {
        const phonetic = data.phonetics.find(p => p.text) || data.phonetics[0];
        html += `<div class="pronunciation">${phonetic.text || ''}`;
        if (phonetic.audio) {
            html += ` <button class="audio-btn" onclick="playAudio('${phonetic.audio}')">Play</button>`;
        }
        html += `</div>`;
    }

    // Meanings
    if (data.meanings && data.meanings.length > 0) {
        data.meanings.forEach(meaning => {
            html += `<div class="definition"><h3>${meaning.partOfSpeech}</h3>`;
            meaning.definitions.forEach(def => {
                html += `<p>${def.definition}</p>`;
                if (def.example) {
                    html += `<p><em>Example: ${def.example}</em></p>`;
                }
            });
            html += `</div>`;

            // Synonyms
            if (meaning.synonyms && meaning.synonyms.length > 0) {
                html += `<div class="synonym"><h3>Synonyms</h3><ul>`;
                meaning.synonyms.forEach(syn => {
                    html += `<li>${syn}</li>`;
                });
                html += `</ul></div>`;
            }
        });
    }

    resultsDiv.innerHTML = html;
}