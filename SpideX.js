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
var gainNode = audioCtx.createGain();         //allow control of the volume of the audiocontext

//connect the audio sources together for output
oscillator.connect(gainNode); //link osc to gainnode
gainNode.connect(audioCtx.destination); //link gainnode to audiocontext.destination the generic output


oscillator.type = 'sine';
oscillator.frequency.value = 500;
var oscPlaying = false;
oscillator.start();

function toggleSound(){
  if(oscPlaying == true){
    gainNode.disconnect(audioCtx.destination);
    oscPlaying = false;
  }
  else{
    gainNode.connect(audioCtx.destination);
    oscPlaying = true;
  }
}


//have to wait for the page to fully load before searching for DOM elements
window.onload= function(){
var osc = document.getElementById("playbtn");
osc.addEventListener("click" , toggleSound, false);
}

//oscillator.stop(audioCtx.currentTime + 2);
