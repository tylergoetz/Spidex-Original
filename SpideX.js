


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

//all onclick registered events must be set here

/////////////////////changeBPM////////////////////////////////////
function changeBPM(tempo){
    console.log('Changing tempos.');
    var newBPM = parseInt(prompt('Enter New Tempo'));
    if(newBPM >= 1 && newBPM <= 999){
      document.getElementById('BPM').innerHTML = 'BPM ' + newBPM;
    }
}

$(document).ready(function(){   //wait for jquey and javascript to load


//WEBAUDIO API
var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); //define the audio context
var oscillator = audioCtx.createOscillator(); //creates a simple oscillator for playback
var masterGainNode = audioCtx.createGain();         //allow control of the volume of the audiocontext
var oscGainNode = audioCtx.createGain();

//for now create a generic compressor to handle audio from multiple sources
var compNode = audioCtx.createDynamicsCompressor();
compNode.threshold.value = -50;
compNode.knee.value = 40;
compNode.ratio.value = 12;
compNode.reduction.value = -20;
compNode.attack.value = 0;
compNode.release.value = 0.25;

//connect the audio sources together for output
oscillator.connect(oscGainNode); //link osc to gainnode
oscGainNode.connect(masterGainNode);
masterGainNode.connect(compNode); //link gainnode to audiocontext.destination the generic output
compNode.connect(audioCtx.destination);


//TIMESCALE VARS
var tempo = 120; //default value



/*Workflow so far:
  Given a request for a new track---
    +Create given track type (osc, audiostream, etc)
      -add newTrack given name, to list of all tracks
      -create gainNode for given track, link to masterGainNode
      -add gainNode to nodeGainList
      -create audiostream, oscialltor, or midi track
          --requires more
      -
    +Create controller nodes for track (allows for individual mute, volume control)
      -prototyped slider controllers done
    +if track is midi controllabe i.e. vitrual instrument
      -create input-ready keyboard, allows for scheduled playback of the given input
*/



var nodeGainList = [oscGainNode];   //contains all gainnodes for connect/disconnect features, must be linked to masterGainNode


oscillator.type = 'sine';
oscillator.frequency.value = 420;
var playing = false;
var oscInit = false;
oscillator.start();
toggleSound();
toggleSound();
/*generateTrack
  Will generate a given track, performing as follows:
    -Create given track type
    -Create and link gainNode to master and add to nodeGainList
*/
var trackCnt = 0;
var trackList = [];
function generateTrack(trackType){
  console.log('Attempting to generate new track');
  if(trackType == 'midi'){
    var newNode = document.createElement('div');
    newNode.id = 'track' + trackCnt;
    newNode.className = 'track';
    trackList[trackCnt] = newNode;
    trackCnt++;
    newNode.className = 'w3-container w3-teal w3-hover-green';
    newNode.innerHTML = '<h1>New Track</h1>' +
                        '<p> Volume </p>';
    var newVol = document.createElement('input');
    newVol.type = 'range';
    newVol.id = 'newNodeVolume' + trackCnt;
    newVol.className = 'vol'
    newVol.value = 1;
    newVol.min = 0;
    newVol.max = 1;
    newVol.step = 0.1;
    newNode.appendChild(newVol);

    /*newNode.innerHTML = '<h1>New Track</h1>' +
                        '<p> Volume </p>' +
                        '<input type = "range" id="newNodeVolume"    value = 1>';
    */
    var newGainNode = audioCtx.createGain();
    newGainNode.id = 'gainNode' + trackCnt;

    newGainNode.connect(masterGainNode);
    nodeGainList.push(newGainNode);

    var insert;
    if(trackCnt == 1){
      insert = 'masterTrack';
      document.getElementById('main').insertBefore(newNode, document.getElementById(insert));
    }
    else if(trackCnt >= 1){
      insert = trackList[trackCnt-2]; //because of increment on, we want 2 back
      document.getElementById('main').insertBefore(newNode, document.getElementById(insert.id));
    }

    console.log('Inserting track before: ' + insert.id);


    newNode.onclick = function(event){
      console.log(newNode.id)
    }

    //track fade-in animation
    newNode.style.opacity = 0;                //simply for animation
    window.getComputedStyle(newNode).opacity; //same as above
    newNode.style.opacity = 1;                //same as above
    console.log('Current Track List: ' + trackList);


    /*create midi keyboard
    12 divs 7 base notes with 5 sharps
    c-b, with 5 sharps
    establish scale 7 iterations
    for now:
      -create osc to match notes
    */

    //WILL REMOVE osc
    var oscGN = audioCtx.createGain();
    var os = audioCtx.createOscillator();
    os.connect(oscGN);
    oscGN.connect(masterGainNode);
    nodeGainList.push(oscGN);
    os.type = 'sine';
    os.frequency.value =500;
    os.start();
    toggleSound();
    toggleSound();

    newVol.vol = oscGN;

    var octave = 4; //sets the current octave for the notes
    var note  = 49;    //find the current note based on 88-key keyboard, starts at C

    var keyList = [];
    var spc = document.createElement('br');
    newNode.appendChild(spc);
    for(var i = 0; i < 12;i++){ //create each key assigning unique id and class n
      var key = document.createElement('button');
      keyText = document.createTextNode('key' + i);
      key.appendChild(keyText);
      key.id = 'key' + i;
      key.className = 'n';
      keyList.push(key);
      key.note = 40+i;
      key.freq = 0;
      key.oscillators = os;
      var jq = key.id;
      document.getElementById(newNode.id).appendChild(key);
      //style the keys to emulate side-facing keyboard middle-c on top ascending notes down
      if((i%2) == 0 && i < 5){
        key.style.background = 'white';
      }
      else if(i%2 > 0 && i != 5 && i != 7 && i != 9 && i != 11){
        key.style.background = 'black';
      }
      else if(i%2 == 0 && i >= 5){
        key.style.background = 'black';
      }
      else {
        key.style.background = 'white';
      }
      var nodeBr = document.createElement('br');
      document.getElementById(newNode.id).insertBefore(nodeBr, key); //create a br for every new key
    }
    console.log(keyList);








  }
  else if(trackType == 'audio'){

  }
}

//THESE ARE TOO SPECIFIC, TAKE INPUT PARAMETER TYPE TO GENERICISE THE TOGGLE CAPABILITIES
function toggleSound(){
  if(playing){
    for(i = 0; i < nodeGainList.length; i++ ){
      nodeGainList[i].disconnect(masterGainNode);   //disconnect all nodes from the master to stop playback
    }
    playing = false;
    console.log(nodeGainList + ' disconnected.' )
    var elaspedTime = Date.now() - timeStart;
    console.log("Playback time = " + elaspedTime/1000 + " seconds.");
  }
  else if(!playing){
    for(i = 0; i < nodeGainList.length; i++){
      nodeGainList[i].connect(masterGainNode);
    }
    timeStart = Date.now();
    playing = true;
    console.log("Time: " + timeStart);
    console.log(nodeGainList + ' connected. Playing: ' + playing)

  }
}



function toggleRange(node){
  oscillator.frequency.value = oscRange.value;
}
function toggleVolume(node){
  oscGainNode.gain.value = oscVolume.value;
  if(node == 'master'){
    masterGainNode.gain.value = master.value;
  }
}



//////////////////LISTENERS//////////////////////////////////////
//LISTENER FOR MIDI TRACK KEYS, must be called here to listen for dynamic elements
$('#main').on('click', ".n", function(){
  var elem = this;
  var freq = Math.pow(2, (elem.note-49)/12)*440;
  elem.freq = freq;
  elem.oscillators.frequency.value = freq;
  console.log(elem.id + ', note: ' + elem.note + ", freq: " + freq);
});
//LISTENER FOR DYNAMIC TRACK VOLUME TOGGLE
$('#main').on('input', '.vol', function(){
  this.vol.gain.value = this.value;
});


//have to wait for the page to fully load before searching for DOM elements
window.onload= function(){
  //sidemenu modiification
  var aboutInfo = document.getElementById("about");
  aboutInfo.addEventListener('click', function(){
    console.log(aboutInfo.innerHTML);
    if(aboutInfo.innerHTML == "About" ){
      var infoBox = document.createElement('w3-container');
      infoBox.innerHTML = '<p> WebAudio API </p>'
      aboutInfo.appendChild(infoBox);
    }
    else{
      aboutInfo.innerHTML = 'About';
    }
  }, false);

  //Track generation
  var audioTrackRequest = document.getElementById('newAudioTrack');
  audioTrackRequest.addEventListener("click", function(){
    generateTrack('audio');
  }, false);

  var midiTrackRequest = document.getElementById('newMidiTrack');
  midiTrackRequest.addEventListener("click", function(){
    generateTrack('midi');
  }, false);



  //TIMESCALE CANVAS
  var timeCanvas = document.getElementById("timeCanvas");
  var ctx = timeCanvas.getContext("2d");
  ctx.fillStyle = 'gray';
  ctx.fillRect(0,0, 600, 100);

  //play/pause functionality
  var osc = document.getElementById("playbtn");
  osc.addEventListener("click" , function(){  /*note: cannot call functions straight have to define function*/
    toggleSound();
  }, false);
  //play pause by keyboard 'space'
  document.addEventListener('keyup', function(evt){
    var keyCode = evt.keyCode || e.which;
    if(evt.keyCode == 32){
      evt.preventDefault();
      toggleSound();
    }
  });

  //master fader
  var master = document.getElementById("masterVolume");
  master.oninput = function(){masterGainNode.gain.value = master.value};
  master.min = 0;
  master.max = 1
  master.step = 0.1;

  //WILL REMOVE protoyped to get idea of Workflow
  //define oscillator range toggle
  //dont use eventlistener for continous input on range elements
  var oscRange = document.getElementById("oscRange");
  oscRange.oninput = function(){toggleRange()};
  oscRange.min = 60;
  oscRange.max = 1000;


  //define oscillator volume toggle
  var oscVolume = document.getElementById("oscVolume");
  oscVolume.addEventListener("click", toggleVolume, false);
  oscVolume.min = 0;
  oscVolume.max = 1;
  oscVolume.step = 0.1;

  if(playing){

    console.log('changing time ');
  }


}

});
