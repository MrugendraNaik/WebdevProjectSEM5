// --- General Page Animations & Interactions ---
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 6 + 's';
  particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
  document.getElementById('particles').appendChild(particle);
  setTimeout(() => particle.remove(), 6000);
}
setInterval(createParticle, 1000);

// --- Content Section & Modal Navigation ---
const discoveryOptions = document.querySelector('.discovery-options');
const contentSections = document.querySelectorAll('.content-section');
const backButtons = document.querySelectorAll('.back-btn');

// Artist Modal Variables
const artistModal = document.getElementById('artistModal');
const artistModalCloseBtn = artistModal.querySelector('.modal-close');
const artistsCardBtn = document.getElementById('artistsCardBtn');

// Trending Modal Variables
const trendingModal = document.getElementById('trendingModal');
const trendingModalCloseBtn = trendingModal.querySelector('.modal-close');

const personalizeModal = document.getElementById('personalizeModal');
const personalizeModalCloseBtn = personalizeModal.querySelector('.modal-close');
const genreGrid = personalizeModal.querySelector('.genre-grid');
const getRecommendationsBtn = document.getElementById('getRecommendationsBtn');
const genreSelectionDiv = document.getElementById('genreSelection');
const recommendationsResultDiv = document.getElementById('recommendationsResult');

function handleOptionClick(option) {
  if (option === 'exclusives') {
    discoveryOptions.style.display = 'none';
    const contentToShow = document.getElementById(option + '-content');
    if (contentToShow) contentToShow.style.display = 'block';
  }
  if (option === 'trending') {
    trendingModal.style.display = 'flex';
    fetchTrendingTracks();
  }
  if (option === 'personalize') {
    selectedGenres = [];
    recommendationsResultDiv.style.display = 'none';
    genreSelectionDiv.style.display = 'block';
    populateGenreGrid();
    getRecommendationsBtn.disabled = true;
    personalizeModal.style.display = 'flex';
  }
}

function showDiscoveryOptions() {
    contentSections.forEach(section => section.style.display = 'none');
    discoveryOptions.style.display = 'grid';
}
backButtons.forEach(button => button.addEventListener('click', showDiscoveryOptions));

// --- Mobile Menu ---
document.querySelector('.mobile-menu').addEventListener('click', () => {
  document.querySelector('nav ul').classList.toggle('show');
});

// --- Scroll Reveal ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.option-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

// --- FAQ Toggle ---
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// --- Artist Modal Logic ---
const artistSearchInput = document.getElementById('artistSearchInput');
const artistSearchBtn = document.getElementById('artistSearchBtn');

const fetchArtistData = async (artistName) => {
    try {
        // STEP 1: Get artist data from MusicBrainz
        const fetchOptions = { headers: { 'User-Agent': 'EchoRaga/1.0 ( hello@echoraga.com )' } };
        const mbSearchUrl = `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(artistName)}&fmt=json`;
        const mbRes = await fetch(mbSearchUrl, fetchOptions);
        const mbData = await mbRes.json();
        if (!mbData.artists || mbData.artists.length === 0) {
            alert("Artist not found!");
            return null;
        }
        
        const artist = mbData.artists[0];
        const officialName = artist.name;

        // STEP 2: Get the artist's image from Wikipedia
        let artistImage = 'https://via.placeholder.com/120/1a1a2e/ff1493?text=EchoRaga'; // Default placeholder
        const wikiApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize=200&titles=${encodeURIComponent(officialName)}&origin=*`;
        
        const wikiRes = await fetch(wikiApiUrl);
        const wikiData = await wikiRes.json();
        const pages = wikiData.query.pages;
        const page = Object.values(pages)[0]; // Get the first page object
        
        if (page.thumbnail && page.thumbnail.source) {
            artistImage = page.thumbnail.source;
        }

        // STEP 3: Get top tracks from MusicBrainz (as before)
        const tracksUrl = `https://musicbrainz.org/ws/2/artist/${artist.id}?inc=recordings&fmt=json`;
        const tracksRes = await fetch(tracksUrl, fetchOptions);
        const tracksData = await tracksRes.json();
        const topTracks = tracksData.recordings.slice(0, 5).map(t => ({ name: t.title, duration: t.length ? new Date(t.length).toISOString().substr(14, 5) : '?:??' }));
        
        // STEP 4: Combine all the data
        return {
            name: officialName,
            image: artistImage,
            listeners: artist.disambiguation || `From ${artist.country || 'N/A'}`,
            bio: `An artist from ${artist.country || 'an unknown location'}.`,
            topTracks: topTracks,
        };

    } catch (error) {
        console.error('Error fetching artist data:', error);
        alert('Failed to fetch data.');
        return null;
    }
};

const updateModalContent = (artist) => {
    const modalContent = artistModal.querySelector('.modal-content');
    modalContent.querySelector('.modal-artist-name').textContent = artist.name;
    modalContent.querySelector('.modal-artist-image').src = artist.image;
    modalContent.querySelector('.modal-artist-stats').innerHTML = `<span>${artist.listeners}</span>`;
    modalContent.querySelector('.modal-artist-bio').textContent = artist.bio;
    const tracksEl = modalContent.querySelector('.modal-top-tracks');
    tracksEl.innerHTML = '';
    artist.topTracks.forEach((track, i) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `http://googleusercontent.com/youtube.com/0?search_query=${encodeURIComponent(artist.name + ' ' + track.name)}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.cssText = 'text-decoration:none; color:inherit;';
        link.innerHTML = `<span>${i + 1}.</span> ${track.name} <span class="track-duration">${track.duration}</span>`;
        li.appendChild(link);
        tracksEl.appendChild(li);
    });
};

artistsCardBtn.addEventListener('click', () => { artistModal.style.display = 'flex'; });
artistModalCloseBtn.addEventListener('click', () => { artistModal.style.display = 'none'; });
artistModal.addEventListener('click', (e) => { if (e.target === artistModal) artistModal.style.display = 'none'; });
artistSearchBtn.addEventListener('click', async () => {
    const query = artistSearchInput.value.trim();
    if (!query) return;
    artistModal.querySelector('.modal-artist-name').textContent = "Searching...";
    const artist = await fetchArtistData(query);
    if (artist) updateModalContent(artist);
});
artistSearchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') artistSearchBtn.click(); });

// --- Trending Modal Logic ---
const YOUTUBE_API_KEY = 'AIzaSyBucDGKKY87jg6mM4kWo_WZglqDg5KmqWc';

const fetchTrendingTracks = async () => {
    const trendingList = trendingModal.querySelector('.trending-list');
    trendingList.innerHTML = '<li style="text-align: center; color: #fff;">Loading...</li>';
    if (YOUTUBE_API_KEY === 'YOUR_API_KEY_HERE') {
        trendingList.innerHTML = `<li style="text-align: center; color: #ff82ab;">Please add a valid YouTube API key in discover.js</li>`;
        return;
    }
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=IN&videoCategoryId=10&key=${YOUTUBE_API_KEY}&maxResults=20`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (!data.items) throw new Error(data.error?.message || 'API error');
        trendingList.innerHTML = '';
        data.items.forEach(video => {
            const li = document.createElement('li');
            li.className = 'trending-item';
            
            // **FIX APPLIED HERE**: Use a CORS proxy for the thumbnail URL
            const thumbnailUrl = `https://images.weserv.nl/?url=${encodeURIComponent(video.snippet.thumbnails.default.url)}`;

            const link = document.createElement('a');
            link.href = `https://www.youtube.com/watch?v=${video.id}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'trending-item-link';
            link.innerHTML = `
                <img src="${thumbnailUrl}" alt="Video thumbnail" class="trending-thumbnail">
                <div class="trending-info">
                    <div class="trending-title">${video.snippet.title}</div>
                    <div class="trending-artist">${video.snippet.channelTitle}</div>
                </div>`;
            li.appendChild(link);
            trendingList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching trending videos:', error);
        trendingList.innerHTML = `<li style="text-align: center; color: #ff82ab;">Failed to load trending videos. The API key might be invalid or restricted.</li>`;
    }
};

const LASTFM_API_KEY = '61b8639c7a123eb9e7e9fcc173fe7ae6';

// A list of available genres from Last.fm (called "tags")
const availableGenres = ["pop", "k-pop", "hip-hop", "rock", "dance", "electronic", "r-n-b", "indie", "folk", "metal", "classical", "jazz"];
let selectedGenres = [];

// This function creates the clickable genre tags in the modal
const populateGenreGrid = () => {
  genreGrid.innerHTML = '';
  availableGenres.forEach(genre => {
    const tag = document.createElement('div');
    tag.className = 'genre-tag';
    tag.textContent = genre.replace('-', ' ');
    tag.dataset.genre = genre;
    tag.addEventListener('click', () => {
      if (selectedGenres.includes(genre)) {
        // Deselect genre
        selectedGenres = selectedGenres.filter(g => g !== genre);
        tag.classList.remove('selected');
      } else if (selectedGenres.length < 3) {
        // Select genre
        selectedGenres.push(genre);
        tag.classList.add('selected');
      }
      getRecommendationsBtn.disabled = selectedGenres.length === 0;
    });
    genreGrid.appendChild(tag);
  });
};

// This function fetches recommendations based on the selected genres
const fetchRecommendations = async () => {
  if (selectedGenres.length === 0) return;
  const recommendationsList = recommendationsResultDiv.querySelector('.trending-list');
  recommendationsList.innerHTML = '<li style="text-align: center; color: #fff;">Generating your playlist...</li>';
  try {
    const promises = selectedGenres.map(genre => {
        // In discover.js, inside fetchRecommendations
const url = `http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&api_key=${LASTFM_API_KEY}&format=json`;
        return fetch(url).then(res => res.json());
    });
    const results = await Promise.all(promises);
    const allTracks = new Map();
    results.forEach(result => {
      if (result.tracks && result.tracks.track) {
        result.tracks.track.forEach(track => {
          allTracks.set(track.name + track.artist.name, track);
        });
      }
    });
    const finalPlaylist = Array.from(allTracks.values()).sort(() => 0.5 - Math.random()).slice(0, 20);
    recommendationsList.innerHTML = '';
    if (finalPlaylist.length === 0) throw new Error("No tracks found for the selected genres.");
    
    finalPlaylist.forEach(track => {
      const listItem = document.createElement('li');
      listItem.className = 'trending-item';
      const imageUrl = track.image.find(img => img.size === 'extralarge')['#text'] || track.image[0]['#text'];
      const thumbnailUrl = imageUrl ? `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}` : 'https://via.placeholder.com/80x60';
      const link = document.createElement('a');
      link.href = track.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.className = 'trending-item-link';
      link.innerHTML = `
          <img src="${thumbnailUrl}" alt="Album art" class="trending-thumbnail">
          <div class="trending-info">
              <div class="trending-title">${track.name}</div>
              <div class="trending-artist">${track.artist.name}</div>
          </div>`;
      listItem.appendChild(link);
      recommendationsList.appendChild(listItem);
    });
    genreSelectionDiv.style.display = 'none';
    recommendationsResultDiv.style.display = 'block';
  } catch(error) {
    console.error("Error fetching recommendations:", error);
    recommendationsList.innerHTML = `<li style="text-align: center; color: #ff82ab;">Could not fetch recommendations.</li>`;
  }
};

trendingModalCloseBtn.addEventListener('click', () => { trendingModal.style.display = 'none'; });
trendingModal.addEventListener('click', (e) => { if (e.target === trendingModal) trendingModal.style.display = 'none'; });
personalizeModalCloseBtn.addEventListener('click', () => { personalizeModal.style.display = 'none'; });
personalizeModal.addEventListener('click', (e) => { if (e.target === personalizeModal) personalizeModal.style.display = 'none'; });
getRecommendationsBtn.addEventListener('click', fetchRecommendations);
