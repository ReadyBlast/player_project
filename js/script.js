const audio = new Audio();
const imgSrc = document.getElementById('play');

const volume = document.getElementById('volume');
volume.addEventListener(
  'change',
  function () {
    audio.volume = this.value / 100;
  },
  false
);

const playpause = () => {
  if (!audio.paused) {
    audio.src = '#';
    audio.pause();
    imgSrc.src = 'img/play.svg';
  } else {
    audio.src = 'https://tkofficial.ru:3080/stream-192.mp3';
    audio.play();
    imgSrc.src = 'img/pause.svg';
  }
};
