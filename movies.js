
const listMovies= $('.list-movies');
const Search = $('.search-form');
const inputSearch = $('.search');
const genreBox = $('.genres-box');
const genres_movies = 
  [
        {
          "id": 28,
          "name": "Action"
        },
        {
          "id": 12,
          "name": "Adventure"
        },
        {
          "id": 16,
          "name": "Animation"
        },
        {
          "id": 35,
          "name": "Comedy"
        },
        {
          "id": 80,
          "name": "Crime"
        },
        {
          "id": 99,
          "name": "Documentary"
        },
        {
          "id": 18,
          "name": "Drama"
        },
        {
          "id": 10751,
          "name": "Family"
        },
        {
          "id": 14,
          "name": "Fantasy"
        },
        {
          "id": 36,
          "name": "History"
        },
        {
          "id": 27,
          "name": "Horror"
        },
        {
          "id": 10402,
          "name": "Music"
        },
        {
          "id": 9648,
          "name": "Mystery"
        },
        {
          "id": 10749,
          "name": "Romance"
        },
        {
          "id": 878,
          "name": "Science Fiction"
        },
        {
          "id": 10770,
          "name": "TV Movie"
        },
        {
          "id": 53,
          "name": "Thriller"
        },
        {
          "id": 10752,
          "name": "War"
        },
        {
          "id": 37,
          "name": "Western"
        }
      ];
const clearBtn = $('.clear');
const nextPage = $('.next-movies')
const prevPage = $('.prev-movies')
const moreBtn =$('.more')
let idSearch = [];
let currentPage = 1;
getGenres();
getMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`);
handleChangeMovies();
      function getGenres(){
        genres_movies.forEach(function(genre){
          let t = document.createElement('div');
          t.classList.add('genre');
          t.innerText = genre.name;
          t.id = genre.id;
          t.onclick = function(){
            currentPage = 1;
            if(idSearch.includes(genre.id)){
              idSearch.forEach(function(id,index){
                if(id == genre.id){
                  idSearch.splice(index,1);
                }
              })
            } else {
              idSearch.push(genre.id);
            }       
            getMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_genres=${idSearch.join(",")}`);
            // Xử lý ẩn hiện màu button
            highlight(t); 
            // Xử lý nút Clear button
            clearBtn.onclick = function(){
              clearBtn.classList.remove('active')
              idSearch.forEach(function(id){
                document.getElementById(id).classList.remove('active')
              })
              idSearch =[];
              getMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`);
            }           
          }
          genreBox.append(t);
        })
      }
      
      function highlight(genre){
        if(idSearch.length > 0) {
          clearBtn.classList.add('active'); 
        }
        if(genre){
          genre.classList.toggle('active')
        }
      }
      function handleChangeMovies(){
        let movieHeight = 430;
        listMovies.style.height = `${movieHeight*2}px`;
        moreBtn.onclick = function(){         
          listMovies.style.height =  `${movieHeight*4 + 50}px`;
          moreBtn.style.display = 'none';
        }
        nextPage.onclick = function(){
          let currentSearchValue = inputSearch.value;
          console.log(currentPage)
          if(idSearch.length > 0) {
            currentPage++;
            getMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${currentPage}&with_genres=${idSearch.join(",")}`);
          } 
          else if(currentSearchValue){
            currentPage++;
            getMovies(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=${currentPage}&query=${currentSearchValue}`)
          }
          else {
            currentPage++;
            getMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${currentPage}`);
          }
        }
      }
      function getMovies(url){
        fetch(url)
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          showMovies(data.results);
          console.log(data)
        })
      }
      function showMovies(data){
        listMovies.innerHTML='';
        let html = "";
        data.forEach(function(movie){
        html += `
        <div class="movie" id='${movie.id}'>
                    <div class="poster-box">
                        <img class="movie_poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="">
                        <div class="movie_background ">
                            <span><i class="fa fa-play"></i></span>
                        </div>
                        <span class="movie_point">${movie.vote_average}</span>
                    </div>
                    <h4 class="movie_title">${movie.title}</h4>
                </div>
        `
        listMovies.innerHTML = html;
        document.getElementById(movie.id).onclick = function(){
          console.log(1)
        }
        console.log(document.getElementById(movie.id))
      })
      
}
function showMovies(data) {
  listMovies.innerHTML = '';

  data.forEach(movie => {
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
      <div class="poster-box" id='${movie.id}'>
          <img class="movie_poster" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="">
          <div class="movie_background ">
              <span><i class="fa fa-play"></i></span>
          </div>
          <span class="movie_point">${movie.vote_average}</span>
      </div>
      <h4 class="movie_title">${movie.title}</h4>
      
      `

      listMovies.appendChild(movieEl);

      document.getElementById(movie.id).addEventListener('click', () => {
        console.log(movie.id)
        openNav(movie.id)
      })
  })
}
Search.onsubmit = function(e){
    e.preventDefault();
    currentPage = 1;
    const SearchValue = inputSearch.value;
    idSearch.forEach(function(id){
      document.getElementById(id).classList.remove('active')
    })
    idSearch = [];

    if(SearchValue){
        getMovies(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${SearchValue}`)
    } else {
        getMovies(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`);
    }
    
}
const overlayContent = $('.overlay-content')
function openNav(id) {
  fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    if(data){
      document.getElementById("myNav").style.width = "100%";
      if(data.results.length >0) {
        var embed = [];
        data.results.forEach((video, idx) => {           
            embed.push(`
              <iframe width="800" height="410" src="https://www.youtube.com/embed/${video.key}?enablejsapi=1" title="${video.name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          `)
        })
        var content = embed.join('');
        overlayContent.innerHTML = content;
      }
    }
    toggleVideo('',overlayContent)
  })
}
function toggleVideo(state,parentElement) {
  // if state == 'hide', hide. Else: show video
  var iframe = parentElement.getElementsByTagName("iframe")[0].contentWindow;
  parentElement.style.display = state == 'hide' ? 'none' : '';
  func = state == 'hide' ? 'pauseVideo' : 'playVideo';
  iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
}
/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
  toggleVideo('hide',overlayContent)
}