import { fetchMovieAvailability, fetchMovieList } from "./api.js";
import {city} from './city.js'

const movie_click = document.querySelector(".movie-click");

const wraper = document.querySelector(".wraper");

let booked_ticket = [];
const booker_div = document.getElementById("booker");
const search_div = document.getElementById('city-container');
const search_inp = document.getElementById('search');
const nav = document.getElementsByTagName('nav')[0]

// ..........................Responsive...........................

let prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  let currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.querySelector('.nav-list').style.top = "3.4rem";
  } else {
    document.querySelector('.nav-list').style.top = "-50px";
    
  }
  prevScrollpos = currentScrollPos;
}

function addList() {
  let d = document.createElement('div')
  d.innerHTML = `<div><a id="nav-item" href="index.html">Home</a></div>
                <div id="event"><a id="nav-item" href="#">Events</a></div>
                <div><a id="nav-item" href="form.html">Add Events</a></div>`
}



let global_cnt = 0;
let inputArr = [];
let currCity = "";

// ......................................Search>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

search_inp.addEventListener('keyup',(e) => {
  search_div.innerHTML = "";
  let cityName = e.target.value.toLowerCase();
  let arr = [];
  if(cityName.length >= 3) {
    if(search_div.style.padding !== "5px") {
      search_div.style.padding = "5px"
    }
     arr = city.filter(item => {
      let temp = item.toLowerCase()
      if(temp.includes(cityName)){
        return item
      }
    })
  }
  if(cityName.length >= 3 && arr.length == 0) {
    let li = document.createElement('li');
    li.innerText = "No result found";
    search_div.append(li);
    li.addEventListener('click',()=>{
      search_inp.value = "";
      search_div.innerHTML = "";
      search_div.style.padding = "0px"
    });
    return;
  }
  
  arr.map(item => {
    let li = document.createElement('li');
    li.innerText = item;
    search_div.append(li);
    li.addEventListener('click',setLocation);
    
    return;
  })

  
})


function setLocation() {
  let text = this.innerText;
  currCity = text;
  search_inp.value = text;
  search_div.innerHTML = "";
  search_div.style.padding = "0px"

  if(isEventClicked) {
    
    filterEvent(currCity);
  }
}

// ...........................Fetching data from TMDB.................

let trendingUrl = "https://api.themoviedb.org/3/movie/now_playing?api_key=d1950b63a946509d3f1564443462539c&language=en-US&page=1"

async function fetchMovie(trendingUrl) {
  let dPromise = await fetch(trendingUrl);
  let data = await dPromise.json();
  let dataArr = data.results;
  let n = Math.floor(Math.random()*7)
  setBackground(dataArr[n])
  fillMovieToDiv(dataArr,'row_1')
  
}

fetchMovie(trendingUrl)

function setBackground(data) {
  let div = document.querySelector('.top-trending');
  let cover_div = document.querySelector('#top-trending-title');
  let title = document.querySelector('#cover-title');
  
  
  div.style.backgroundSize = "cover"
  div.style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${data.poster_path}')`;
  
  
  title.innerHTML = data.title;
  

}

function fillMovieToDiv(arr,id) {
  
  let mContainer = document.querySelector(`#${id}`)


  arr.map((ele)=> {
    
    
    let im = document.createElement('img');
    im.className = 'movie-card-img';
    im.src = `https://image.tmdb.org/t/p/original/${ele.poster_path}`


    
    mContainer.append(im)

  })
}


// ......................................fetch popular-movie.............................

let popular = "https://api.themoviedb.org/3/movie/top_rated?api_key=d1950b63a946509d3f1564443462539c&language=en-US&page=1"

async function fetchMovieCopy(trendingUrl,id) {
  let dPromise = await fetch(trendingUrl);
  let data = await dPromise.json();
  let dataArr = data.results;
  
  fillMovieToDiv(dataArr,id)
  
}
fetchMovieCopy(popular,'row_2')


let popularTv = "https://api.themoviedb.org/3/tv/top_rated?api_key=d1950b63a946509d3f1564443462539c&language=en-US&page=1"
fetchMovieCopy(popularTv,'row_3')

// ........................................book Movie .................................

let book_div = document.querySelector('.book-movie-div');

fetchMovieList().then((res) => {
  
  res.forEach((element) => {
    
    let img = document.createElement("img");
    img.className = "movie-card-img";
    img.src = `${element.imgUrl}`
    book_div.append(img);
    img.addEventListener("click", function () {

      let movieName = element.name;
      afterMovieClicked(this,movieName)
      
    });

    
  });
});

function afterMovieClicked(ele,movie) {
 
  let tempIm = document.createElement('img')
  tempIm.className = "movir-card-img"
  tempIm.classList.add('movie-click-img');
  tempIm.src = ele.src
  
  movie_click.insertBefore(tempIm,movie_click.firstChild);
  bookMovie(movie);

}

function bookMovie(movieName) {

  let h3 = document.createElement('h3');
  h3.innerText = "Seat Selector";

  let grid_holder = document.createElement('div');
  grid_holder.id = "booker-grid-holder";
  
  let book_btn = document.createElement('button');
  book_btn.innerText = "Book my seats"
  book_btn.id = "book-ticket-btn"
  book_btn.className = "v-none"
  book_btn.addEventListener("click", bookBtn); 

  booker_div.append(h3,grid_holder,book_btn)
 
 
  fetchMovieAvailability(movieName).then((data) => {
    grid_holder.innerHTML = "";
    buildGrid(data,grid_holder,book_btn);
  });
}

function buildGrid(data,div,btn) {
  let j = 0;
  let cnt = 0;
  for (let i = 1; i <= 2; i++) {
    let left_grid = document.createElement("div");
    left_grid.className = "booking-grid";
    if (i == 1) {
      j = 1;
      cnt = 12;
    } else {
      j = 13;
      cnt = 24;
    }
    for (let k = j; k <= cnt; k++) {
      let cell = document.createElement("div");
      cell.id = `booking-grid-${k}`;

      if (!data.includes(k)) {
        cell.style.backgroundColor = "green";
        cell.className = "available-seat";
        cell.addEventListener("click", function () {
          if (cell.classList.contains("selected-seat")) {
            global_cnt -= 1;
            if (global_cnt == 0) {
              btn.className = "v-none";
            }
            let index = booked_ticket.indexOf(k);
            if (index > -1) booked_ticket.splice(index, 1);

            cell.classList.remove("selected-seat");
          } else {
            cell.classList.add("selected-seat");
            global_cnt += 1;
            booked_ticket.push(k);

            if (global_cnt >= 1) btn.classList.remove("v-none");
          }
        });
      } else {
        cell.style.backgroundColor = "red";
        cell.className = "unavailable-seat";
      }
      cell.innerHTML = `${k}`;
      left_grid.append(cell);
    }
    div.append(left_grid)
  }
}

function creatForm() {
  let form = document.createElement("form");
  form.id = "customer-detail-form";
  form.innerHTML = `<label for="email">Email: </label>
    <input type="email" required><br>
    <label for="phone">Phone number: </label>
    <input type="number" required><br>
    <input type="submit" value="Purchase">`;

  return form;
}
let formElement = creatForm();

function bookBtn() {
  booker_div.innerHTML = "";
  let newDiv = document.createElement("div");
  newDiv.id = "confirm-purchase";
  let newh3 = document.createElement("h3");

  newh3.innerHTML = `Confirm your booking for seat number ${booked_ticket.join()}`;

  newDiv.append(newh3, formElement);
  booker_div.append(newDiv);
}



function finalSubmit() {
 
  booker_div.innerHTML = ""
  
  let email = formElement[0].value;
  let no = formElement[1].value;
  let success_div = document.createElement("div");
  success_div.id = "Success";
  let seat = booked_ticket.length > 1 ? "Seat Numbers" : "Seat Number";
  success_div.innerHTML = `<strong>Booking Details</strong> <br><br> ${seat}: ${booked_ticket.join()} <br><br>
    Email : ${email} <br><br>Phone Number : ${no}<br>`;
    let btn = document.createElement('button');
  btn.innerText = "Done"
  btn.id = "book-ticket-btn"

  btn.addEventListener('click',()=> {
    movie_click.removeChild(movie_click.getElementsByTagName('img')[0]);
    booker_div.innerHTML = ""
  })
  success_div.append(btn)
  
  booker_div.append(success_div);
  
  

}

function createMovieClick() {
  let d = document.createElement('div')
  d.id = "booker"
  let h = document.createElement('h3')
  h.className = "v-none"
  let d2 = document.createElement('div')
  d2.id = "booker-grid-holder"
  let bt = document.createElement('button');
  bt.id = 'book-ticket-btn'
  bt.className = "v-none"
  bt.innerText = "Book my seats";
  d.append(h,d2,bt);
  return d;
}

formElement[2].addEventListener("click", function (e) {
  let formEle = document.getElementById("customer-detail-form");
  if (formEle.checkValidity()) {
    e.preventDefault();
    finalSubmit();
  }
});

// ...................................EVENTS...................

const eventDiv = document.getElementById('event');
let event_container = document.querySelector('.events-container')

let isEventClicked = false;

eventDiv.addEventListener('click', eventFunction);

function eventFunction() {
  isEventClicked = true;
  // wraper.innerHTML = "";
  let newDiv = document.createElement('div');
  newDiv.classList.add('movie-click');
 

  let tempArr = localStorage.getItem('myData');

  if(tempArr) {
    let data = JSON.parse(tempArr);
    data.map(ele => {
      setCard(newDiv,ele,event_container)
    })
  }
}

function setCard(newDiv,ele,mainDiv) {
  let randomNum = Math.floor(Math.random()*3);
  let temp = document.createElement('div');
  temp.classList.add('event-holder');
  temp.innerHTML= `<img class = "movie-img" src = "./img/${randomNum}.jpg" alt = "image"></img>
               <h4>City : ${ele.address.charAt(0).toUpperCase() + ele.address.slice(1)} </h4>
               <h3> Date : ${ele.date} </h3>
               <h3> Time : ${ele.time} </h3>
               <h3> Price : ${ele.price} Rs onward</h3>
               `;
  
 
  newDiv.append(temp);
  mainDiv.append(newDiv)
 

}

function filterEvent(cityName) {
  if(!isEventClicked) return;
  

  let newDiv = document.createElement('div');
  newDiv.classList.add('movie-click');
  // wraper.innerHTML = ""
  event_container.innerHTML = ""
  let tempArr = localStorage.getItem('myData');

  if(tempArr) {
    let data = JSON.parse(tempArr);
    let temp = []

    temp = data.filter(ele => {
      let text = ele.address.toLowerCase();
      let city = cityName.toLowerCase();
      if(text.includes(city)) {
        
        setCard(newDiv,ele,event_container);
        return ele;
      }
      
    })
    
    if(temp.length ==0) {
      event_container.innerHTML = `<h2>Sorry no result found</h2>
      <button id="back-btn">Back</button>`
      document.getElementById('back-btn').addEventListener('click',eventFunction)
    }
  }

}


// ...................................FormData...................



