const API_KEY = 'f531333d637d0c44abc85b3e74db2186';
const movieList = document.getElementById('movies-list');
const sortByDateButton = document.getElementById('sort-by-date');
const sortByRatingButton = document.getElementById('sort-by-rating');
const pagination = document.querySelector("div.pagination");
const prevButton = document.querySelector("button#prev-button");
const pageNumberButton = document.querySelector("button#prev-number-button");
const nextButton = document.querySelector("button#next-button");
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const allTab = document.getElementById("all-tab");
const favouritesTab = document.getElementById("favourites-tab");
const sortBottons = document.querySelector(".sorting-options");
let movies = [];
let currentPage = 1;
let firstSortedByDateClicked = true;
let firstSortedByRatingClicked = true;
// step 1 = fetch the movies
async function fetchMovies(page){
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
        // const response = await fetch(GET_MOVIES_API);
        const result = await response.json();
        movies = result.results;
        // console.log(result.results)
        renderMovies(movies);
    }catch(error){
        console.log(error);
    }
}
// fetchMovies(currentPage)

function getMovieNamesFromLocalStorage(){
    const favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
    // console.log("favouriteMovies",favouriteMovies);
    return favouriteMovies === null ? [] : favouriteMovies;
}

function addMovieNameToLocalStorage(movieName){
    // get the movie names form local storage and add it to local storage
    const favouriteMoviesNames = getMovieNamesFromLocalStorage();

    // localstorage.setItem(key,data)
    localStorage.setItem("favouriteMovies",JSON.stringify([...favouriteMoviesNames,movieName]));
}

function removeMovieNameFromLocalStorage(movieName){
    const favouriteMoviesNames = getMovieNamesFromLocalStorage();

    let filteredMoviesNames = favouriteMoviesNames.filter((movie) => movie !== movieName);

    localStorage.setItem("favouriteMovies",JSON.stringify(filteredMoviesNames));
}
// step 2 = render movies
const renderMovies = (movies) =>{
    // const movieList = document.getElementById('movies-list');
    // when the user closes the browser and when he opens the browser again favourites should be present
    const favouriteMoviesNames = getMovieNamesFromLocalStorage();
    movieList.innerHTML = ""; //making movies list empty because we already have data.

    // loop through all the movies and get the data
    movies.map((movie) => {
        console.log(movie);
        const { poster_path,title,vote_count,vote_average } = movie;
        let listItem = document.createElement('li');
        listItem.className = 'card';

        let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";

        listItem.innerHTML += `
        <img class="poster" src=${imgSrc} alt=${title}>
        <p class="title">${title}</p>
        <section class="vote-favouriteIcon">
            <section class="vote">
                <p class="vote-count">Votes: ${vote_count}</p>
                <p class="vote-average">Rating: ${vote_average}</p>
            </section>
            <i class="favourite-icon ${favouriteMoviesNames.includes(title) ? "fa-solid" : null }  fa-regular fa-heart fa-2xl" id="${title}"></i> 
        </section>
        `;

        // favourite icon
        const favouriteIconButton = listItem.querySelector(".favourite-icon");
        favouriteIconButton.addEventListener("click", (event) =>{
            // alert("clicked");
            const {id} = event.target;
            // console.log(id);

            if(favouriteIconButton.classList.contains("fa-solid")){
                // remove the movie name from local storage and from favourites array
                removeMovieNameFromLocalStorage(id);
                // remove this class from favouriteIconButton
                favouriteIconButton.classList.remove("fa-solid");
            }
            else{
                // add the movie name to local storage and to favourites array
                addMovieNameToLocalStorage(id);
                // add this class to favouriteIconButton
                favouriteIconButton.classList.add("fa-solid");
            }
        })
        movieList.appendChild(listItem);
    })
}

// sort functions for sortbydate
// const sortByDateButton = document.getElementById('sort-by-date');
// sortByDateButton.addEventListener("click",sortByDate);

// let firstSortedByDateClicked = true;
function sortByDate(){
    // alert('clicked')
    let sortedMovies;
    
    if(firstSortedByDateClicked){
        // use sort function to create new array of sorted movies in ascending order
        sortedMovies = movies.sort(function(a,b){
            return new Date(a.release_date) - new Date(b.release_date)
        })
        sortByDateButton.textContent = "Sort by date (latest to oldest)";
        firstSortedByDateClicked = false;
    }
    else if(!firstSortedByDateClicked){
        // use sort function to create new array of sorted movies in descending order
        sortedMovies = movies.sort(function(a,b){
            return new Date(b.release_date) - new Date(a.release_date)
        })
        sortByDateButton.textContent = "Sort by date (oldest to latest)";
        firstSortedByDateClicked = true;
    }

    // console.log(sortedMovies);
    // sortByDateButton.textContent = "Sort by date (latest to oldest)";
    renderMovies(sortedMovies);
}

// sort functions for sortbyrating
// const sortByRatingButton = document.getElementById('sort-by-rating');
// sortByRatingButton.addEventListener("click",sortByRating);

// let firstSortedByRatingClicked = true;
function sortByRating(){
    // alert('clicked');
    let sortedMovies;

    if(firstSortedByRatingClicked){
        // use sort function to create new array of sorted movies in ascending order
        sortedMovies = movies.sort(function(a,b){
            return a.vote_average - b.vote_average;
        })
        sortByRatingButton.textContent = "Sort by rating (most to least)";
        firstSortedByRatingClicked = false;
    }
    else if(!firstSortedByRatingClicked){
        // use sort function to create new array of sorted movies in descending order
        sortedMovies = movies.sort(function(a,b){
            return b.vote_average - a.vote_average;
        })
        sortByRatingButton.textContent = "Sort by rating (least to most)";
        firstSortedByRatingClicked = true;
    }
    renderMovies(sortedMovies);
}

// We are assuming that we only have 4pages of data
// pagination element
// const pagination = document.querySelector("div.pagination");
// const prevButton = document.querySelector("button#prev-button");
// const pageNumberButton = document.querySelector("button#prev-number-button");
// const nextButton = document.querySelector("button#next-button");

// logic for previous button 
// prevButton.addEventListener("click",prevPage)

function prevPage(){
    // alert("clicked")

    // decrease the current page by 1
    // currentPage--;

    // fetch the movies for the previous page
    fetchMovies(currentPage);

    // update page number button text 
    pageNumberButton.textContent = `Current Page: ${currentPage}`;

    // Disable prevoius button when the current page is 1
    if(currentPage === 1){
        prevButton.disabled = true;
        nextButton.disabled = false;
    }
    else{
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
    currentPage--;
}

// logic for next button
nextButton.addEventListener("click",nextPage)

function nextPage(){
    // alert("clicked");

    // increase the current page by 1;
    currentPage++;

    // fetch the movies for next page
    fetchMovies(currentPage);

    // update page number button text
    pageNumberButton.textContent = `Current Page: ${currentPage}`;

    // Disable next button when the current page is 4
    if(currentPage === 4){
        prevButton.disabled = false;
        nextButton.disabled = true;
    }
    else{
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
}

// search the movie name API response
const searchMovies = async (searchedMovies) => {
    try{
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchedMovies}&api_key=${API_KEY}&include_adult=false&language=en-US&page=1`);
        const result = await response.json();
        
        movies = result.results;
        renderMovies(movies);

    }catch(error){
        console.log(error);
    }
}

// search element
// const searchButton = document.getElementById("search-button");
// const searchInput = document.getElementById("search-input");

searchButton.addEventListener("click", () =>{
    // alert("clicked");
    searchMovies(searchInput.value);
    pagination.style.display = 'none';
})

// all tab and favourites tab section
// const allTab = document.getElementById("all-tab");
// const favouritesTab = document.getElementById("favourites-tab");
// const sortBottons = document.querySelector(".sorting-options");

const getMovieByName = async (movieName) => {
    try{
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${API_KEY}&include_adult=false&language=en-US&page=1`);
        const result = await response.json();
        return result.results[0];


    }catch(error){
        console.log(error);
    }
}


const showFavourites = (favMovie) => {
    console.log(favMovie)
    const { poster_path, title, vote_average, vote_count } = favMovie;
    let listItem = document.createElement('li');

    listItem.className = 'card';

    let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";

    listItem.innerHTML += `
        <img src=${imgSrc} alt=${title} class="poster">
        <p class="title">${title}</p>
        <section class="votes-favouriteIcon">
            <section class="vote">
                <p class="vote-count">Votes: ${vote_count}</p>
                <p class="vote-average">Rating: ${vote_average}</p>
            </section>
            <i class="favourite-icon fa-solid fa-xmark fa-2xl xmark" id="${title}"></i>
        </section>
        `;

    const removeFromWhishListBtn = listItem.querySelector(".xmark");
    removeFromWhishListBtn.addEventListener("click",(event) => {
        const {id} = event.target;

        removeMovieNameFromLocalStorage(id);
        fetchWishListMovie();
    })

    movieList.appendChild(listItem)
}
const fetchWishListMovie = async () => {
    movieList.innerHTML = "";
    const movieNamesList = getMovieNamesFromLocalStorage();
    for(let i=0;i<movieNamesList.length;i++){
        const movieName = movieNamesList[i];

        let movieDataFromName = await getMovieByName(movieName);
        showFavourites(movieDataFromName);
    }

}


// will display based on the active tab
function displayMovies(){
    if(allTab.classList.contains("active-tab")){
        renderMovies(movies);
        sortBottons.style = 'revert';
        pagination.style = 'revert';
    }
    else if(favouritesTab.classList.contains("active-tab")){
        fetchWishListMovie();
        sortBottons.style.display = 'none';
        pagination.style.display = 'none';
    }
}

// switch between tabs
function switchTab(event){
    // remove the active tab class from both the tabs
    allTab.classList.remove("active-tab");
    favouritesTab.classList.remove("active-tab");

    // add the active tab class to clicked tab
    event.target.classList.add("active-tab");

    // display the movies for that tab
    displayMovies()
}

allTab.addEventListener("click",switchTab);
favouritesTab.addEventListener("click",switchTab);
prevButton.addEventListener("click",prevPage);
sortByRatingButton.addEventListener("click",sortByRating);
sortByDateButton.addEventListener("click",sortByDate);

fetchMovies(currentPage)

