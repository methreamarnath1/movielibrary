const API_KEY = "fdf3c19e";
const BASE_URL = "https://www.omdbapi.com/";
const SEARCHAPI = `${BASE_URL}?apikey=${API_KEY}&s=`;
const DETAILAPI = `${BASE_URL}?apikey=${API_KEY}&i=`;
const movieBox = document.querySelector("#movie-box");
const loadingSpinner = document.querySelector("#loading");

const displayLoading = () => {
  loadingSpinner.style.display = "block";
};

const hideLoading = () => {
  loadingSpinner.style.display = "none";
};

// Fetch movies function
const getMovies = async (url) => {
  displayLoading();
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (data.Response === "True") {
      showMovies(data.Search);
    } else {
      movieBox.innerHTML = `<h2>No results found. Showing popular movies instead.</h2>`;
      getMovies(SEARCHAPI + "popular");
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    movieBox.innerHTML = `<h2>Error loading movies. Please try again later.</h2>`;
  }
  hideLoading();
};

// Display movies with overlay
const showMovies = (movies) => {
  movieBox.innerHTML = "";
  movies.forEach(async (movie) => {
    const movieDetails = await fetchMovieDetails(movie.imdbID);
    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = `
            <img src="${
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450.png?text=No+Image"
            }" alt="${movie.Title}" />
            <div class="overlay">
                <div class="title"> 
                    <h2>${movie.Title}</h2>
                    <span>Year: ${movie.Year}</span>
                    <span>Rating: ${movieDetails.imdbRating || "N/A"}</span>
                </div>
                <h3>Overview:</h3>
                <p>${movieDetails.Plot || "No overview available."}</p>
            </div>
        `;
    box.addEventListener("click", () => openMovieDetails(movie.imdbID));
    movieBox.appendChild(box);
  });
};

// Open movie details in new tab
const openMovieDetails = async (imdbID) => {
  const movieDetails = await fetchMovieDetails(imdbID);
  const newWindow = window.open("", "_blank");

  const detailPageContent = `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${movieDetails.Title} - Details</title>
            <style>
                * {
                    padding: 0;
                    margin: 0;
                    box-sizing: border-box;
                    font-family: 'Lato', sans-serif;
                    color: #ffffff;
                }
                body {
                    background-color: #121212;
                    padding: 20px;
                    text-align: center;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: #222;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                }
                h1, h2, h3 {
                    color: #ffcc00;
                }
                img {
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    margin-bottom: 20px;
                }
                .info {
                    margin: 20px 0;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .info-item {
                    flex: 1 1 45%;
                    text-align: left;
                    font-size: 1.1rem;
                }
                .plot {
                    font-size: 1rem;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    text-align: left;
                }
                .cast {
                    font-size: 1rem;
                    text-align: left;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${movieDetails.Title}</h1>
                <img src="${
                  movieDetails.Poster !== "N/A"
                    ? movieDetails.Poster
                    : "https://via.placeholder.com/300x450.png?text=No+Image"
                }" alt="${movieDetails.Title}">
                <div class="info">
                    <div class="info-item"><strong>Year:</strong> ${
                      movieDetails.Year
                    }</div>
                    <div class="info-item"><strong>Rating:</strong> ${
                      movieDetails.imdbRating || "N/A"
                    }</div>
                    <div class="info-item"><strong>Genre:</strong> ${
                      movieDetails.Genre || "N/A"
                    }</div>
                    <div class="info-item"><strong>Duration:</strong> ${
                      movieDetails.Runtime || "N/A"
                    }</div>
                    <div class="info-item"><strong>Director:</strong> ${
                      movieDetails.Director || "N/A"
                    }</div>
                </div>
                <h3>Overview</h3>
                <p class="plot">${
                  movieDetails.Plot || "No overview available."
                }</p>
                <h3>Cast</h3>
                <p class="cast">${
                  movieDetails.Actors || "No cast information available."
                }</p>
            </div>
        </body>
        </html>
    `;

  newWindow.document.write(detailPageContent);
};

// Fetch movie details by ID for plot and rating
const fetchMovieDetails = async (imdbID) => {
  const response = await fetch(DETAILAPI + imdbID);
  return await response.json();
};

// Search and display movies based on input
document.querySelector("#search").addEventListener("keyup", (event) => {
  const query = event.target.value;
  if (query) {
    getMovies(SEARCHAPI + query);
  } else {
    getMovies(SEARCHAPI + "popular");
  }
});

// Load popular movies initially
getMovies(SEARCHAPI + "popular");

// Filter movies by genre
const getMoviesByGenre = (genre) => {
  getMovies(`${SEARCHAPI}${genre}`);
};

// Logo click - reload popular movies
document
  .getElementById("logo")
  .addEventListener("click", () => getMovies(SEARCHAPI + "popular"));
