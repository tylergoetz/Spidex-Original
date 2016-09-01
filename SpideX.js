/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}


//WEBAUDIO API
var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); //define the audio context
var oscillator = audioCtx.createOscillator(); //creates a simple oscillator for playback
var masterGainNode = audioCtx.createGain();         //allow control of the volume of the audiocontext
var oscGainNode = audioCtx.createGain();

//connect the audio sources together for output
oscillator.connect(oscGainNode); //link osc to gainnode
oscGainNode.connect(masterGainNode);
masterGainNode.connect(audioCtx.destination); //link gainnode to audiocontext.destination the generic output

/*Workflow so far:
  Given a request for a new track---
    +Create given track type (osc, audiostream, etc)
    +Create controller nodes for track (allows for individual mute, volume control)
    +if track is midi controllabe i.e. vitrual instrument
      -create input-ready keyboard, allows for scheduled playback of the given input
*/

//Work in progress of prototyping basic oscillator track
oscillator.type = 'sine';
oscillator.frequency.value = 60;
var oscPlaying = false
var oscInit = false;

function toggleSound(){
  if(!oscInit){
    oscillator.start();
    oscInit = true;
  }
  if(oscPlaying == true){
    oscGainNode.disconnect(masterGainNode);
    oscPlaying = false;
  }
  else{
    oscGainNode.connect(masterGainNode);
    oscPlaying = true;
  }
}

function toggleRange(){
  oscillator.frequency.value = oscRange.value;
}
function toggleVolume(){
  oscGainNode.gain.value = oscVolume.value;
}

//have to wait for the page to fully load before searching for DOM elements
window.onload= function(){

var osc = document.getElementById("playbtn");
osc.addEventListener("click" , toggleSound, false);

var oscRange = document.getElementById("oscRange");
oscRange.addEventListener("click", toggleRange, false);
oscRange.min = 60;
oscRange.max = 1000;

var oscVolume = document.getElementById("oscVolume");
oscVolume.addEventListener("click", toggleVolume, false);
oscVolume.min = 0;
oscVolume.max = 2;
oscVolume.step = 0.1;
}

//oscillator.stop(audioCtx.currentTime + 2);
