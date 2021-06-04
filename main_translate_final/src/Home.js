import MicIcon from '@material-ui/icons/Mic';
import {  } from './App'
import './App.css';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import 'bootstrap/dist/css/bootstrap.min.css';
import {withStyles} from '@material-ui/core/styles';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'


export default function useSpokenLang(props) {
  // setting state for two paragraphs on page. First will be spoken text picking up 
  // language automatically and displaying on the page. Second will be displayed language
  // of your choosing picked from a dropdown menu on the page, and dictated out in the language
  // you've chosen.
  const [spokenLang,setspokenLang] = useState('Press the talk button to begin...');
  const [translatedLang, settranslatedLang] = useState('Translated text will apear here.');
  // styling for paragraphs
  const WhiteTextTypography = withStyles({
    root: {
      color: "#FFFFFF"
    }
  })(Typography, spokenLang);
  // default Language is French
  const [lang,setlang]=useState('fr');

  // changing languages from dropdown

  const handleSelect=(e)=>{
    console.log(e);
    setlang(e);
    console.log(lang)
  }
  // function for using AWS translation SDK. Using it from port 3355 
  // which can be changed if need be in TranslateServerBackend 2/index.js, 
  // along with running http/https preferences.
  const Log = props.Log;
  const setLog = props.setLog;
  recognition.onresult =async function(event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        setspokenLang(event.results[i][0].transcript)
        //Each entry of the speech input is appended to a list for logging.
        Log.push(event.results[i][0].transcript)
        setLog(Log)
        console.log(Log)
        let response = await fetch('https://localhost:3355/translate',{
          method: "post",
          headers:{
              "Content-Type" : 'application/json'
          },
          body:JSON.stringify({
              translate_parameters: {
                  "Text": event.results[i][0].transcript,
                  "SourceLanguageCode": "auto",
                  "TargetLanguageCode": lang
              }
          })
        })
        let data = await response.json();
       
        let newlang = settranslatedLang(data.TranslatedText);
        //calling dictating function
        sp(data.TranslatedText);
      }
    }
  }
  //dictating text to speech function.
  function sp(translatedText){
    let u = new SpeechSynthesisUtterance();
    
    let resulted = translatedText
    u.text = resulted;
    u.lang = lang;
    u.rate = 0.8;
    //u.onend = function(event) { alert('Finished in ' + event.elapsedTime + ' seconds.'); }
    speechSynthesis.speak(u);
  }; 
  return (
    <div id="textDiv">
      <Button onClick = {toggleStartStop}
        variant="contained"
        size="large"
        color="primary"
        startIcon={<MicIcon/>}
        id="mic"
      >Talk
      </Button>
      <div>
          <WhiteTextTypography  variant="h4" id="firstP" className="firstPar" paragraph>
            {spokenLang} 
          </WhiteTextTypography>
          <div>Pick a Language</div>
          <DropdownButton
              alignRight
              title= {lang}
              id="dropdown-menu-align-right"
              onSelect={handleSelect}
                >
              <Dropdown.Item eventKey="es">Spanish</Dropdown.Item>
              <Dropdown.Item eventKey="en">English</Dropdown.Item>
              <Dropdown.Item eventKey="de">Dutch</Dropdown.Item>
              <Dropdown.Item eventKey="fr">French</Dropdown.Item>
              <Dropdown.Item eventKey="ru">Russian</Dropdown.Item>
              <Dropdown.Item eventKey="no">Norwegian</Dropdown.Item>
            </DropdownButton>
          
          <WhiteTextTypography variant="h4" id="secondP" className="secondPar" paragraph> 
          {translatedLang}
          </WhiteTextTypography>
            
        </div>
    </div>
  );
};
// speech recognition boilerplate to make it work.
let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;// eslint-disable-next-line
let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList; 


let recognizing;
let recognition = new SpeechRecognition();
recognition.continuous = true;
reset();
recognition.onend = reset;


function reset() {
  recognizing = false;
}
// turning off and on speech recognition.
function toggleStartStop(useSpokenLang) {
  if (recognizing) {
    recognizing=false;
    console.log(recognizing)
    recognition.stop();
    
  } else {
    recognition.start();
    recognizing = true;
    console.log(recognizing);
  }
}
