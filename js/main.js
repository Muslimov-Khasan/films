const elForm=document.querySelector(".form");
const elList=document.querySelector(".film__list");
const elTemplate=document.querySelector("#film__template").content;
const elSelect=document.querySelector(".film__select");

const renderGenre=(array)=>{
    const genres=[];


    array.forEach(film=>{
        film.genres.forEach(genre=>{
            if(!genres.includes(genre)){
                genres.push(genre)
            }
        })
    })
    return genres;
}

const renderSelect = (genres, element)=>{
    element.innerHTML = null;
    genres.forEach(genre=>{
        const elNewOption =document.createElement("option");
        elNewOption.value = genre;
        elNewOption.textContent = genre;
        element.appendChild(elNewOption);
    });
}


const addTime=(time)=>{

    const date=new Date(time);
    const day=String(date.getDate()).padStart(2,0);
    const month=String(date.getMonth()+1).padStart(2,0);
    const year=date.getFullYear();

    return day+"."+month+"."+year;
}

renderSelect(renderGenre(films), elSelect);

const renderFilm = (array,element)=>{
    element.innerHTML = null;
    
    array.forEach(film => {
        const elNewFilm = elTemplate.cloneNode(true);
        elNewFilm.querySelector(".film__title").textContent = film.title;
        elNewFilm.querySelector(".film__img").src=film.poster;
        elNewFilm.querySelector(".film__text").textContent=film.overview;
        elNewFilm.querySelector(".film__time").textContent=addTime(film.release_date);
        element.appendChild(elNewFilm);
    });
}
renderFilm(films,elList)


elForm.addEventListener("submit",(evt)=>{
    evt.preventDefault();

    const elSecondArray = [];

    films.forEach(film => {
        if(film.genres.includes(elSelect.value)){
            elSecondArray.push(film);
        }
    });
    renderFilm(elSecondArray,elList);
})