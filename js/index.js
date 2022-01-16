const buttonEl = document.getElementById('button');
const messageEl = document.getElementById('message');
const titleEl = document.getElementById('real-time-title');

const translateButton = document.getElementById('translateButton');
const translationOutput = document.getElementById('translatedText')

// set initial state of application variables
messageEl.style.display = 'none';
let isRecording = false;
let socket;
let recorder;

// runs real-time transcription and handles global variables
const run = async () => {
  if (isRecording) {
    if (socket) {
      socket.send(JSON.stringify({ terminate_session: true }));
      socket.close();
      socket = null;
    }

    if (recorder) {
      recorder.pauseRecording();
      recorder = null;
    }
  } else {
    const response = await fetch('http://localhost:5000'); // get temp session token from server.js (backend)
    const data = await response.json();

    if (data.error) {
      alert(data.error)
    }

    const { token } = data;

    // establish wss with AssemblyAI (AAI) at 16000 sample rate
    socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

    // handle incoming messages to display transcription to the DOM
    const texts = {};
    socket.onmessage = (message) => {
      let msg = '';
      const res = JSON.parse(message.data);
      texts[res.audio_start] = res.text;
      const keys = Object.keys(texts);
      keys.sort((a, b) => a - b);
      for (const key of keys) {
        if (texts[key]) {
          msg += ` ${texts[key]}`;
        }
      }
      messageEl.innerText = msg;
    };

    socket.onerror = (event) => {
      console.error(event);
      socket.close();
    }

    socket.onclose = event => {
      console.log(event);
      socket = null;
    }

    socket.onopen = () => {
      // once socket is open, begin recording
      messageEl.style.display = '';
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          recorder = new RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
            recorderType: StereoAudioRecorder,
            timeSlice: 250, // set 250 ms intervals of data that sends to AAI
            desiredSampRate: 16000,
            numberOfAudioChannels: 1, // real-time requires only one channel
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: (blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                const base64data = reader.result;

                // audio data must be sent as a base64 encoded string
                if (socket) {
                  socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                }
              };
              reader.readAsDataURL(blob);
            },
          });

          recorder.startRecording();
        })
        .catch((err) => console.error(err));
    };
  }

  isRecording = !isRecording;
  buttonEl.innerText = isRecording ? 'Stop' : 'Record';
  titleEl.innerText = isRecording ? 'Click stop to end recording!' : 'Click start to begin recording!'
};

buttonEl.addEventListener('click', () => run());


// TRANSLATION STUFF
const LangBox = document.getElementById('CurrentLang');

const English = document.getElementById('SelectBoxEnglish');
const Arabic = document.getElementById('SelectBoxArabic');
const Dutch = document.getElementById('SelectBoxDutch');
const French = document.getElementById('SelectBoxFrench');
const German = document.getElementById('SelectBoxGerman');
const Italian = document.getElementById('SelectBoxItalian');
const Japanese = document.getElementById('SelectBoxJapanese');
const Korean = document.getElementById('SelectBoxKorean');
const Marathi = document.getElementById('SelectBoxMarathi');
const Polish = document.getElementById('SelectBoxPolish');
const Russian = document.getElementById('SelectBoxRussian');
const Spanish = document.getElementById('SelectBoxSpanish');
const Vietnamese = document.getElementById('SelectBoxVietnamese');
let currentLang = 'en';

English.addEventListener('click', () => updateLang(English.innerText, English.getAttribute("value")));
Arabic.addEventListener('click', () => updateLang(Arabic.innerText, Arabic.getAttribute("value")));
Dutch.addEventListener('click',() => updateLang(Dutch.innerText,Dutch.getAttribute("value")));
French.addEventListener('click',() => updateLang(French.innerText,French.getAttribute("value")));
German.addEventListener('click',() => updateLang(German.innerText,German.getAttribute("value")));
Italian.addEventListener('click',() => updateLang(Italian.innerText,Italian.getAttribute("value")));
Japanese.addEventListener('click',() => updateLang(Japanese.innerText,Japanese.getAttribute("value")));
Korean.addEventListener('click',() => updateLang(Korean.innerText,Korean.getAttribute("value")));
Marathi.addEventListener('click', () =>updateLang(Marathi.innerText,Marathi.getAttribute("value")));
Polish.addEventListener('click', () =>updateLang(Polish.innerText,Polish.getAttribute("value")));
Russian.addEventListener('click',() => updateLang(Russian.innerText,Russian.getAttribute("value")));
Spanish.addEventListener('click', () =>updateLang(Spanish.innerText,Spanish.getAttribute("value")));
Vietnamese.addEventListener('click',() => updateLang(Vietnamese.innerText,Vietnamese.getAttribute("value")));

translate.engine = "google";
translate.key = '';


translateButton.addEventListener('click', async () => {

  const text = await translate(messageEl.innerText, currentLang);
  translationOutput.innerText = text;

})

function updateLang(language,symbol){
  currentLang = symbol;
  LangBox.innerText = language;
}