const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const apiKey = '37f82e5a1b9cd3c66ff3594478032bf7';
const session_id = 'e06815cd40088621e4ba6379df0592ad403418c1';
const list_id = 7111533;

// get Element
const listHeader = $('.list-header');
const nextBtn=$('.next-btn');
const prevBtn=$('.prev-btn');
const headerBar = $('.header-bar');


function parentElement(inputElement){
    while(inputElement.parentElement){
        if(inputElement.parentElement.matches('.header')){
            return inputElement.parentElement;
        } else {
            inputElement = inputElement.parentElement;
        }
    }
}
async function getSliderMovies(){
    let url = `https://api.themoviedb.org/3/list/${list_id}?api_key=${apiKey}&language=en-US`;
    let res = await fetch(url);
    return await res.json();
}
function getSliderKeyVideos(id){

    // let url = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`;
    // let res = await fetch(url);
    // let video = res.json();
    // return video;
    return fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                return data;
            })
}
function btnNextPrev(currentSlider,allSlider){
    nextBtn.onclick = function(){
        currentSlider++;
        if(currentSlider <5){
            Array.from(allSlider).forEach(function(slider){
                slider.style.transform = `translateX(${-100*currentSlider}%)`;                       
            })
        } else {
            Array.from(allSlider).forEach(function(slider){
                slider.style.transform = "";                       
            })
            currentSlider=0;
        }
    }
    prevBtn.onclick = function(){
        currentSlider--;
        if(currentSlider == -1 ){
            Array.from(allSlider).forEach(function(slider){
                slider.style.transform = "translateX(-400%)";                       
            })
            currentSlider=4;
        } else {
            Array.from(allSlider).forEach(function(slider){
                slider.style.transform = `translateX(${-100*currentSlider}%)`;                                 
            })
            
        }
    } 
}
function handleWatchTrailer(btnTrailers){
    function toggleVideo(state,headerTrailer) {
        // if state == 'hide', hide. Else: show video
        var iframe = headerTrailer.getElementsByTagName("iframe")[0].contentWindow;
        headerTrailer.style.display = state == 'hide' ? 'none' : '';
        func = state == 'hide' ? 'pauseVideo' : 'playVideo';
        iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
    }
    //xử lý watch Trailer
    Array.from(btnTrailers).forEach(function(btn){
        let headerTrailer = parentElement(btn).querySelector('.header-trailer');
        let closeBtn = headerTrailer.querySelector('.close-tab');
        btn.onclick = function(){                   
            headerTrailer.classList.add('active');
            headerBar.style.display='none';
            nextBtn.style.display='none';
            prevBtn.style.display='none';  
            toggleVideo('',headerTrailer);
                       
        }
        closeBtn.onclick = function(){
            headerTrailer.classList.remove('active');
            headerBar.style.display='';
            nextBtn.style.display='';
            prevBtn.style.display='';  
            toggleVideo('hide',headerTrailer);
        }
    })
}
async function MainSlider(){
    let ListSliderMovies = await getSliderMovies();
    
    let listKey = [];    
    // render slider 
    let html ="";
    ListSliderMovies.items.forEach(async function(movie,index){
        let keys = await getSliderKeyVideos(movie.id);
        for(var i=0; i< keys.results.length ; i++){
            if(keys.results[i].type == "Trailer") {                      
                listKey.push(keys.results[i].key)
                break;
            }
        }
        html +=  `
            <div class="header slider${index+1}"  >
            <div class="header-trailer">
                    <a href="javascript:;" class="close-tab"><i class="ti-close"></i></a>
                    <iframe class="videos" width="700" height="400" src="https://www.youtube.com/embed/${listKey[index]}?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen ></iframe>
            </div>
            <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" alt="" class="image_main">
            <div class="header-content">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="">
            <div class="header-content-box">
            <h2 class="header-content-box-title">${movie.title}</h2>
            <div class="vote_average"><span class="imdb">IMDb</span> <span class="imdb_point">: ${movie.vote_average}</span> <i class="fa fa-star" ></i></div>
            <div class="release_day"><i class="fa fa-clock-o" ></i> <span> : ${movie.release_date}</span></div>
            <p class="header-content-box-description">${movie.overview}</p>
            <div class="header-content-watch">
            <button class="now">Watch Now</button>
            <button class="trailer"  >Watch Trailer</button>
            </div>
            </div>
            </div>
            
            </div>
            `
            listHeader.innerHTML = html;


            // Xử lý các sự kiện trong slider
            const allSlider = document.querySelectorAll('.header');
            let currentSlider = 0;
            const btnTrailers = $$('.trailer')
            // xử lý nút next và prev 
            btnNextPrev(currentSlider,allSlider);
            //Xử lý onclick vào watch trailer
            handleWatchTrailer(btnTrailers);
                
        }) 

}
MainSlider();

//-----------------------Content-------------------------