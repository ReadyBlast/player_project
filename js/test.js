// Массив гифок
const gifs = [
  'https://radio.tkofficial.ru/image/gifs/giphy1.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy2.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy3.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy4.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy5.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy6.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy7.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy8.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy9.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy10.webp',
  'https://radio.tkofficial.ru/image/gifs/giphy11.webp',
];

let background = document.getElementById('background');
let logo = document.getElementById('logo');
let image = document.getElementById('image');
let waves = document.getElementById('waves');
let wavesCtx = waves.getContext('2d');
let volume = document.getElementById('vol-control');
let startBtn = document.getElementById('playpause');
let drawbutton = document.getElementById('draw');

const randomBackground = () =>
  `url(${gifs[Math.floor(Math.random() * gifs.length)]})`;

// Изменение бэкграунда
const changeBackground = () => {
  image.style.backgroundImage = randomBackground();
  glow.style.backgroundImage = image.style.backgroundImage;
  changeBackgroundSize();
};

let stylebackground;

// Изменение заполнения бэкграунда
const changeBackgroundSize = () => {
  stylebackground = Math.floor(Math.random() * 11);
  if (stylebackground <= 8) {
    image.style.backgroundSize = 'cover';
    background.style.backgroundSize = 'cover';
  } else if (stylebackground >= 9) {
    image.style.backgroundSize = 'initial';
    background.style.backgroundSize = 'initial';
  }
  //console.log(background.style.backgroundSize, image.style.backgroundSize, stylebackground);
};

let audioCtx, audioAnalyser, audioSrc, gainNode, glowData, backgroundData;

// Инициализация AudioContext и его модулей
const setup = () => {
  audioCtx = new AudioContext();
  audioAnalyser = audioCtx.createAnalyser();
  audioSrc = audioCtx.createMediaElementSource(audio);
  /*lowpassNode = audioCtx.createBiquadFilter();
	audioSrc.connect(lowpassNode);
	lowpassNode.connect(audioCtx.destination);
	lowpassNode.type = "lowpass";
	lowpassNode.frequency.value = 60;*/
  gainNode = audioCtx.createGain();
  if (localStorage.getItem('input')) {
    gainNode.gain.value = volume.value / 100;
  } else {
    gainNode.gain.value = 0.1;
  }
  audioSrc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  audioSrc.connect(audioAnalyser);
  audio.crossOrigin = 'anonymous';
  audioAnalyser.fftSize = 256; // Фурье хуйре
  audioAnalyser.smoothingTimeConstant = 0.75;
  glowData = new Uint8Array(audioAnalyser.frequencyBinCount); // Массив для drawGlowandChangeBackground();
  backgroundData = new Uint8Array(audioAnalyser.frequencyBinCount); // Массив для drawWaves();
  audio.volume = 0.4;
};

// Плавное переключение громкости
function SetVolume(val) {
  volume.value = val;
  gainNode.gain.value = volume.value / 100;
  localStorage.setItem('input', volume.value);
}

let frequencyThreshold;
// Установка минимальных значений, при которых срабатывают эффекты свечения и изменения фона
const drawGlowandChangeBackground = () => {
  audioAnalyser.getByteTimeDomainData(glowData);
  const totalFrequency = glowData.reduce((a, b) => a + b);
  const averageFrequency = totalFrequency / glowData.length;
  if (backgroundData[1] > 250.5) {
    logo.classList.add('active');
  } else if (backgroundData[1] > 210.5) {
    logo.classList.remove('active');
  }
  if (averageFrequency > 128.5) {
    background.classList.add('active');
  } else {
    background.classList.remove('active');
  }
  /*if (averageFrequency > 148) {
		if(frequencyThreshold == true)
		{
			//console.log(averageFrequency);
			changeBackground();
			frequencyThreshold = false;
		}
	}
	if (averageFrequency < 115.5) 
	{
		frequencyThreshold = true;
		console.log(averageFrequency);
	}*/
  //
  if (backgroundData[1] > 250.5) {
    if (frequencyThreshold == true) {
      changeBackground();
      frequencyThreshold = false;
    }
  } else if (backgroundData[1] < 235.5) {
    frequencyThreshold = true;
    //console.log(backgroundData[1]);
  }
  /*if (averageFrequency < 94) 
	{
		changeBackground();
		//console.log(glowData);
	}*/
};

// Рисуем бары
const drawWaves = () => {
  waves.width = window.innerWidth;
  waves.height = window.innerHeight;
  audioAnalyser.getByteFrequencyData(backgroundData);
  const actualArrayLength = backgroundData.length - 50;
  let w = 0,
    h = 0,
    x = 0,
    y = 0;
  w = waves.width / actualArrayLength;
  const fillLine = (X) => {
    wavesCtx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    wavesCtx.fillRect(X, y, w, h);
  };
  for (let i = 0; i < actualArrayLength; i++) {
    h = (waves.height / 4 / 255) * backgroundData[i];
    y = 0;
    fillLine(x);
    y = waves.height - h;
    fillLine(waves.width - w - x);
    x += w;
  }
};

// Рисуем свечение и бары
const draw = () => {
  requestAnimationFrame(draw); //Планирование анимации
  drawGlowandChangeBackground();
  drawWaves();
};

// Кнопка PlayPause
const box = document.querySelector('.box');
box.addEventListener('click', (e) => {
  e.target.classList.toggle('pause');
});

// Действие кнопки PlayPause
const playpause = () => {
  if (!audio.paused) {
    audio.src =
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';
    audio.pause();
  } else {
    audio.src = 'https://tkofficial.ru:3080/stream-192.mp3';
    audio.play();
  }
};

const init = () => {
  setup(); // Инициализация AudioContext
  draw();
  playpause();
  startBtn.setAttribute('onclick', 'playpause()');
};
changeBackground();

window.onload = function () {
  if (localStorage.getItem('input')) {
    //if there is a stored value, apply it to the input
    volume.value = localStorage.getItem('input');
  }
};
