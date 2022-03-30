// Обновление лого альбома(если оно есть)
function updateArtworkDisplay() {
  const albumcoverName =
    'https://radio.tkofficial.ru/image/logo.jpg?' + new Date().getTime()
  const url = `url(${albumcoverName})`;
  document.querySelector('#np_track_artwork').src = albumcoverName;
  const elem = document.querySelector('#background');
  elem.style.backgroundImage = url;
}
// Интервал каждые 10 секунд
/*document.addEventListener('DOMContentLoaded', function() {
	setInterval(updateArtworkDisplay, 10 * 1000);
	updateArtworkDisplay();
});*/

/* const f = fetch(
  'https://radio.tkofficial.ru/library/nowplaying_title.txt?' +
    new Date().getTime(),
  {
    mode: 'no-cors',
    credentials: 'include',
  }
  ); 
  console.log(f);
  */

let fullname;
let nametrack;
let recentnametrack;

// Обновление исполнителя и название трека
function updateTitleDisplay() {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      if (fullname != xmlhttp.responseText) {
        fullname = xmlhttp.responseText;
        let s = fullname;
        s = s.split('\n');
        // Трек который играет сейчас
        nametrack = s[0].split('-');
        // Разделяю трек на исполнителя и название трека
        document.querySelector('#np_current_track').innerHTML = nametrack[1];
        document.querySelector('#np_current_artist').innerHTML = nametrack[0];
        //
        marqueeChanger('#np_current_track');
        marqueeChanger('#np_current_artist');
        // Предыдущий трек
        let t = '',
          i;
        for (i = 1; i < 2; i++) {
          t += s[i];
          if (i !== s.length - 1) t += '<br>';
        }
        document.querySelector('#np_recent_track').innerHTML = s[1];
        marqueeChanger('#np_recent_track');
        // Обновление лого альбома
        updateArtworkDisplay();
      }
    }
  };
  xmlhttp.open(
    'GET',
    'https://radio.tkofficial.ru/library/nowplaying_title.txt?' +
      new Date().getTime(),
    true
  );
  //xmlhttp.withCredentials = true;
  xmlhttp.send();
}

const overflowed = function (elemName) {
  const overFl = document.querySelector(elemName);
  return overFl.scrollWidth > overFl.offsetWidth;
};

const marqueeChanger = (elemName) => {
  if (overflowed(elemName)) {
    marquee(elemName);
    document.querySelector(elemName);
  } else {
    document.querySelector(elemName);
    $(elemName).marquee('destroy');
  }
};

const marqueeHover = (sBuffer) => {
  $(sBuffer).marquee('pause');
  $(sBuffer).hover(
    function () {
      $(sBuffer).marquee('resume');
    },
    function () {
      $(sBuffer).marquee('destroy');
      marquee(sBuffer);
    }
  );
};

const marquee = (sBuffer) => {
  $(sBuffer).marquee({
    duration: 3000,
    startVisible: true,
    gap: 150,
    duplicated: true,
    delayBeforeStart: 1000,
  });

  $(sBuffer).bind('finished', function () {
    $(this).marquee('destroy');
    marquee(sBuffer);
  });
  marqueeHover(sBuffer);
};

// Интервал каждые 2 секунды
document.addEventListener('DOMContentLoaded', function () {
  setInterval(updateTitleDisplay, 2 * 1000);
  updateTitleDisplay();
});
