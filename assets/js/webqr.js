var gCtx = null;
var gCanvas = null;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;
var get = {
    item: function(item, dom){
        return typeof(dom)!="undefined"?dom.querySelector(item):document.querySelector(item);
    },
    all: function(itens, dom){
        return typeof(dom)!="undefined"?dom.querySelectorAll(itens):document.querySelectorAll(itens);
    }
},
limparFeedback = null;

var vidhtml = '<video id="video" autoplay></video>';

function initCanvas(w,h)
{
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}


function captureToCanvas() {
    if(stype!=1)
        return;
    if(gUM)
    {
        try{
            gCtx.drawImage(v,0,0);
            try{
                qrcode.decode();
            }
            catch(e){       
                console.log(e,e.indexOf("found 0"));
                if(e.indexOf("found 0") === -1){
                    if(limparFeedback === null){
                        get.item("#result").innerHTML="- escaneando -";
                    } else {
                        clearInterval(limparFeedback);
                    }
                    lfimparFeedback = setTimeout(function(){
                        limparFeedback = null;
                        get.item("#result").innerHTML="";    
                    }, 500);

                }
                setTimeout(captureToCanvas, 500);
            };
        }
        catch(e){       
                console.log(e);
                setTimeout(captureToCanvas, 500);
        };
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
function success(stream) {
    if(webkit)
        v.src = window.URL.createObjectURL(stream);
    else
    if(moz)
    {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM=true;
    // setTimeout(captureToCanvas, 500);
}
        
function error(error) {
    gUM=false;
    return;
}
function validarCodigo(codigo){
    if((codigo.length != 14) || parseInt(codigo)){
        return false;
    } 
}
function load()
{
    console.log(validarCodigo("01009200005805"));
    initApp();
    if(isCanvasSupported() && window.File && window.FileReader)
    {
        initCanvas(800, 600);
        qrcode.callback = app.resultadoLeitura;
        //document.getElementById("mainbody").style.display="inline";
        setwebcam();
    }
    else
    {
        //document.getElementById("mainbody").style.display="inline";
        document.getElementById("outdiv").innerHTML='<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>'+
        '<br><p id="mp2">sorry your browser is not supported</p><br><br>'+
        '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
    }
}

function setwebcam()
{
    
    var options = true;
    if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
    {
        try{
            navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
                for (var i = devices.length - 1; i >= 0; i--) {
                    if (devices[i].kind === 'videoinput') {
                      if(devices[i].label.toLowerCase().search("front") >-1)
                        options={'deviceId': {'exact':devices[i].deviceId}, 'facingMode':'environment'} ;
                    }
                    console.log(devices[i].kind + ": " + devices[i].label +" id = " + devices[i].deviceId);
                }
              setwebcam2(options);
            });
        }
        catch(e)
        {
            console.log(e);
        }
    }
    else{
        console.log("no navigator.mediaDevices.enumerateDevices" );
        setwebcam2(options);
    }
    
}
function setwebcam2(options)
{
    if(stype==1)
    {
        // setTimeout(captureToCanvas, 500);    
        return;
    }
    var n=navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v=document.getElementById("video");
    //options.optional = [{sourceId: camId}];

    if(n.getUserMedia)
    {
        webkit=true;
        n.getUserMedia({video: options, audio: false}, success, error);
    }
    else
    if(n.webkitGetUserMedia)
    {
        webkit=true;
        n.webkitGetUserMedia({video:options, audio: false}, success, error);
    }

   // document.getElementById("webcamimg").style.opacity=1.0;

    stype=1;
    // setTimeout(captureToCanvas, 500);        
}