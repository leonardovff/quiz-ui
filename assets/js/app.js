var app = {
    setEvents: function(){
        get.item("#entrar").addEventListener('click',function(){
            if(get.item("#hash_pw").value==="123"){
                get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
                get.item("#captura").dataset.status = "step-atual";
                // return true;
                var fullscren = controlFullScreen(document.querySelector('body'));
                return fullscren.open();
            } 
            alert("Hash incorreto!");
        },false);      
    },
    resultadoLeitura: function(a){
        htmlEntities(a);
        get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
        get.item("#pergunta").dataset.status = "step-atual";
    }

}
var controlFullScreen = function (el){
    return {
        open: function(){
            if (el.requestFullscreen) {
              el.requestFullscreen();
            } else if (el.msRequestFullscreen) {
              el.msRequestFullscreen();
            } else if (el.mozRequestFullScreen) {
              el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) {
              el.webkitRequestFullscreen();
            }
        },
        close: function(){
            if (el.exitFullscreen) {
              el.exitFullscreen();
            } else if (el.msExitFullscreen) {
              el.msExitFullscreen();
            } else if (el.mozExitFullscreen) {
              el.mozExitFullscreen();
            } else if (el.webkitExitFullscreen) {
              el.webkitExitFullscreen();
            } 
        }
    }
}
function initApp(){
    app.setEvents();
    var respostas = get.all("#pergunta ul>li");
    for (var i = 0; i < respostas.length; i++) {
        respostas[i].addEventListener('click',function(){
            if(this.className.toLowerCase().search('checked')==-1){
                if(get.all("#pergunta ul>li.checked").length>0){
                    get.item("#pergunta ul>li.checked").className = "";
                } else {
                    get.item("#pergunta").dataset.statusVotacao = "selected"
                }
                this.className = "checked";
            } 
        },false);
    }

    get.item("#fullscreen").addEventListener('click',function(){ 
        get.item(".step-captura[data-status='active']").dataset.status = "no-active";
        get.item("#instrucao-leitura").dataset.status = "active";
    },false);
   
    get.item("#confirmar").addEventListener('click',function(){ 
        get.item("#pergunta").dataset.statusVotacao = "obrigado";
    },false);
    
}