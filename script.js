"use strict";
const imageContainer = document.getElementById("current-image-container");
const image = document.querySelector("img");
const title = document.querySelector(".title");
const topText = document.querySelector(".intro");
const content = document.querySelector(".content");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const dateContainer = document.querySelector(".date-container");
const searchBtn = document.getElementById("search");

let storeDates = JSON.parse(localStorage.getItem("storeDates")) || [];
if (storeDates) {
  storeDates.forEach((item) => {
    let list = document.createElement("li");
    list.textContent = item;
    list.classList.add("list-item");
    document.querySelector("ul").append(list);
  });
}

function getCurrentImageOfTheDay(date) {
  const today = new Date().toISOString().split("T")[0];
  if (date > today) {
    alert("Can't Look that far in future!");
    throw new Error("Can't Look that far in future!");
  }

  fetch(
    `https://api.nasa.gov/planetary/apod?date=${date}&api_key=3Z7v0c7ujdqdEPeMOhAdKpv34xW3nsISzs6GEsQH`
  )
    .then((response) => {
      if (!response.ok)
        throw new Error(`Something Went wrong ${response.status}`);
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      topText.textContent = `Picture on ${date}`;
      title.textContent = data.title;
      content.textContent = data.explanation;
      image.src = data.url;
    })
    .catch((err) => {
      console.error(err);
    });
}
getCurrentImageOfTheDay(new Date().toISOString().split("T")[0]);

function saveSearch(store) {
  storeDates.push(store);
  localStorage.setItem("storeDates", JSON.stringify(storeDates));
}

function addSearchToHistory(store) {
  let list = document.createElement("li");
  list.classList.add("list-item");
  list.textContent = store;
  document.querySelector("ul").append(list);
}

function getImageOfTheDay(e) {
  e.preventDefault();
  let store = searchInput.value;
  if (store) {
    saveSearch(store);
    addSearchToHistory(store);
  }
  getCurrentImageOfTheDay(store);
}

searchBtn.addEventListener("click", getImageOfTheDay);

document.querySelector("ul").addEventListener("click", (event) => {
  if (event.target.classList.contains("list-item")) {
    getCurrentImageOfTheDay(event.target.textContent);
  }
});
