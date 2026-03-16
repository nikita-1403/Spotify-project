
let currentSong = new Audio();
let songs;
function secondsToMinutesSeconds(totalSeconds) {
    if (typeof totalSeconds !== 'number' || totalSeconds < 0) {
        throw new Error('Input must be a non-negative number.');
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
}
async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (track, pause = false) => {

    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()

        play.src = "icon\pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


async function main() {



    //get the list of all the songs
    songs = await getSongs()
    playMusic(songs[0], true)

    //show all the song in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width = "34" src = "icon\music.svg" alt = "" >
            <div class="info">
                <div>${song}</div>
                <div> Nikita </div>
            </div >
            <div class="playNow">
                <span>Play Now</span>
                <img class="invert" src="icon\play.svg" alt="">
            </div></li > `;
    }
    //attach an event listesner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    //attach event listener to next play previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "icon\pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "icon\play.svg"
        }
    })
    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })
    //add an eveent lister to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent =  (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })
    //aDD EVENT LISTNER FOR HAMBURGER
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left ="0"
    })
    //FOR CLOSE ADD EVENT
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left ="-120%"
    })
    //add event listner to previous and next
    previous.addEventListener("click", ()=>{
        console.log("previous clicked")
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
        playMusic(songs[index-1])
        }
    })
    next.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<songs.length){
        playMusic(songs[index+1])
        }
    })
    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to",e.target.value,"/100")
        currentSong.volume = parseInt(e.target.value)/100

    })


}
main()