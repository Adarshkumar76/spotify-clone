let currentSong = new Audio();
let songs;
let currfolder;

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    let element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = " ";
  for (const song of songs) {
    songUl.innerHTML += `<li>
        <img class="invert" src="/svgs/music.svg" alt="music">
          <div class="info">
            <div > ${song.replaceAll("%20", " ")}</div>
              <div>Adarsh</div>
              </div>
              <div class="playNow">
              <span>Play Now</span>
              <img src="/svgs/play.svg" class="invert" alt="play">
          </div>
        </li>`;
  }

  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((element) => {
    element.addEventListener("click", () => {
      playMusic(element.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/svgs/pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let i = 0; i < array.length; i++) {
    const e = array[i];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];

      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
        <div  class="play">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#000000" fill="true" >
            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"               stroke-linejoin="round" />
          </svg>
        </div>
          <img src="/songs/${folder}/cover.jpeg"  alt="img "/>
          <h2>${response.title}</h2>
          <p>${response.descriptions} </p>
      </div>`;
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getSongs("songs/hindi");

  playMusic(songs[0], true);

  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/svgs/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/svgs/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    let duration = currentSong.duration;
    let currentTime = currentSong.currentTime;
    let minutes = Math.floor(currentTime / 60);
    let seconds = Math.floor(currentTime % 60);
    let minutesDuration = Math.floor(duration / 60);
    let secondsDuration = Math.floor(duration % 60);
    document.querySelector(".songTime").innerHTML = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}/${minutesDuration}:${
      secondsDuration < 10 ? "0" : ""
    }${secondsDuration}`;
    document.querySelector(".circle").style.left =
      (currentTime / duration) * 100 + "%";
  });
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let newTime = (e.offsetX / e.target.clientWidth) * currentSong.duration;
    currentSong.currentTime = newTime;
  });

  document.querySelector(".hamburger").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = 0;
  });
  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = -120 + "%";
  });

  previous.addEventListener("click", (e) => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", (e) => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
    console.log(songs[index + 1]);
  });

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseFloat(e.target.value / 100);
    });

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if(e.target.src.includes("/svgs/volume.svg")){
      e.target.src = "/svgs/mute.svg";
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }else{
      e.target.src = "/svgs/volume.svg";
      currentSong.volume = 0.1;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
    }
    
  })
}

main();
