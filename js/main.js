"use strict";
const genreArray = [];
const bookmarksArr = JSON.parse(window.localStorage.getItem("bookmarks")) || [];

// Elements
const searchForm = document.querySelector(".js-form");

const movieList = document.querySelector(".movies__list");
const genresSelect = document.querySelector(".genres-select");
const searchInput = document.querySelector(".js-input");

const bookmarksList = document.querySelector(".bookmark-list");

// Movie Info Modal
const modal = document.querySelector(".modal");
const modalCloseBtn = document.querySelector(".modal__btn");

// Movie Bookmark Modal
const bookmarkBtn = document.querySelector(".bookmarks__btn");
const bookmarkModal = document.querySelector(".bookmark-modal");


// Movie Template
const movieTemplate = document.querySelector("#movie-template").content;

// Get Hour Function
function normalizeDate (dateFormat) {

  const date = new Date (dateFormat);
  const day = String(date.getDate()).padStart(2, 0);
  const month = String(date.getMonth() + 1).padStart(2, 0);
  const year = String(date.getFullYear()).padStart(2, 0);

  return (day + '.' + month + '.' + year);
}

function getMovieGenre(genre) {
  if (!genreArray.includes(genre)) {
    genreArray.push(genre);

    const genreOption = document.createElement("option");
    genreOption.textContent = genre;
    genreOption.value = genre;

    genresSelect.appendChild(genreOption);
  }
}

// Create New Movie Element
function createMovie(movie) {
  const elMovie = movieTemplate.cloneNode(true);

  elMovie.querySelector(".movie-img").src = movie.poster;
  elMovie.querySelector(".movie-img").width = "300";
  elMovie.querySelector(".movie-title").textContent = movie.title;

  movie.genres.forEach((genre) => {
    const newGenreLi = document.createElement("li");

    newGenreLi.textContent = genre;
    elMovie.querySelector(".genre-list").appendChild(newGenreLi);

    getMovieGenre(genre);
  });

  elMovie.querySelector(".movie-year").textContent = normalizeDate(movie.release_date);
  elMovie.querySelector(".item-btn").dataset.id = movie.id;
  elMovie.querySelector(".bookmark-btn").dataset.id = movie.id;

  movieList.appendChild(elMovie);
}

// Search Movie Function
function searchMovie(evt) {
  evt.preventDefault();

  movieList.innerHTML = null;

  const genreValue = genresSelect.value;
  const searchValue = searchInput.value.trim();
  searchInput.value = null;
  const newRegExp = new RegExp(searchValue, "gi");

  const foundFilms = films
    .filter((kino) => {
      if (genreValue === "All") {
        return kino;
      }

      return kino.genres.includes(genreValue);
    })
    .filter((kino) => {
      return kino.title.match(newRegExp);
    })

  foundFilms.forEach((kino) => {
    createMovie(kino);
  });
}

films.forEach((film) => {
  createMovie(film);
});

const bookmarkTemplate = document.querySelector(".bookmark-template").content;
const bookmarksFragment = document.createDocumentFragment();

function renderBookmarks(bookmarkMovie) {
  elBookmark = bookmarkTemplate.cloneNode(true);

  elBookmark.querySelector(".movie-name").textContent = bookmarkMovie.title;
  elBookmark.querySelector(".remove-btn").dataset.id = bookmarkMovie.id;

  bookmarksFragment.appendChild(elBookmark);
}

searchForm.addEventListener("submit", searchMovie);

movieList.addEventListener("click", function (evt) {
  if (evt.target.matches(".item-btn")) {
    modal.classList.add("modal__open");

    const foundMovie = films.find((movie) => movie.id === evt.target.dataset.id);

    modal.querySelector(".modal__title").textContent = foundMovie.title;
    modal.querySelector(".modal__text").textContent = foundMovie.overview;

    // Modal close function
    document.addEventListener("keyup", function (evt) {
      if (evt.keyCode === 27) {
        modal.classList.remove("modal__open");
      }
    });

    modal.addEventListener("click", function (evt) {
      if (evt.target === modal) {
        modal.classList.remove("modal__open");
      }
    });

    modalCloseBtn.addEventListener("click", function () {
      modal.classList.remove("modal__open");
    });
  }

  if (evt.target.matches(".bookmark-btn")) {
    const foundMovie = films.find((movie) => movie.id === evt.target.dataset.id);
    if (!bookmarksArr.includes(foundMovie)) {
      bookmarksArr.push(foundMovie);

      window.localStorage.setItem("bookmarks", JSON.stringify(bookmarksArr));
    }

    bookmarksList.innerHTML = null;

    bookmarksArr.forEach((movie) => renderBookmarks(movie));

    bookmarksList.appendChild(bookmarksFragment);
  }
});

bookmarksArr.forEach((movie) => renderBookmarks(movie));
bookmarksList.appendChild(bookmarksFragment);

// Bookmark Modal
bookmarkBtn.addEventListener("click", function () {
  bookmarkModal.classList.add("modal__open");

  bookmarkModal.addEventListener("click", function (evt) {
    if (evt.target === bookmarkModal) {
      bookmarkModal.classList.remove("modal__open");
    }
  });
});

// Remove Bookmark
bookmarksList.addEventListener("click", function (evt) {
  if (evt.target.matches(".remove-btn")) {
    const foundIndex = bookmarksArr.findIndex(
      (item) => item.id === evt.target.dataset.id
    );

    bookmarksArr.splice(foundIndex, 1);

    bookmarksArr.forEach((movie) => renderBookmarks(movie));

    bookmarksList.innerHTML = null;
    bookmarksList.appendChild(bookmarksFragment);

    window.localStorage.setItem("bookmarks", JSON.stringify(bookmarksArr));
  }
});