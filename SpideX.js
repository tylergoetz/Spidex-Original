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
    trackList[trackCnt] = newNode;
    trackCnt++;
    newNode.className = 'w3-container w3-teal w3-hover-green';
    newNode.innerHTML = '<h1>New Track</h1>' +
                        '<p> Volume </p>' +
                        '<input type = "range" id="newNodeVolume" value = 1>';
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


    var octave = 4; //sets the current octave for the notes
    var note  = 49;    //find the current note based on 88-key keyboard, starts at C
    var freq = Math.pow(2, 1/12)*440; //alg for calculating note frequency based on octave and current note

    var keyList = [];

    for(var i = 0; i < 4;i++){
      var key = document.createElement('button');
      keyText = document.createTextNode('key' + i);
      key.appendChild(keyText);
      key.id = 'key' + i;
      key.class = 'n';
      keyList.push(key);
      key.note = 48+i;
      var jq = key.id;
      //console.log('key.note: ' + key.note)

      document.getElementById(newNode.id).appendChild(key);
      console.log(keyList);
    }
    $('body').on('click', 'button', function(){
      freq = Math.pow(2, 1/12)*440;
      os.frequency.value = freq;
      console.log(key.id + ', note: ' + key.note + ", freq: " + freq);
    });








  }
  else if(trackType == 'audio'){

  }
}

//THESE ARE TOO SPECIFIC, TAKE INPUT PARAMETER TYPE TO GENERICISE THE TOGGLE CAPABILITIES
function toggleSound(){
  if(playing == true){
    for(i = 0; i < nodeGainList.length; i++ ){
      nodeGainList[i].disconnect(masterGainNode);   //disconnect all nodes from the master to stop playback
    }
    playing = false;
    console.log(nodeGainList + ' disconnected.' )
  }
  else if(!playing){
    for(i = 0; i < nodeGainList.length; i++){
      nodeGainList[i].connect(masterGainNode);
    }
    playing = true;
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
}
