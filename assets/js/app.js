var app = {
    ambientes: ["http://localhost/sgo/"],
    ambiente: 0,
    debugger: true,
    setEvents: function(){
        get.item("#entrar").addEventListener('click',function(){
            if(get.item("#hash_pw").value!=="123"){
                return alert("Hash incorreto!");   
            } 
            questionario.getPerguntas(function(flag){
                questionario.renderize();
                if(!flag){
                    return alert("Não foi possivel capturar as questões");
                } 
                get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
                get.item("#captura").dataset.status = "step-atual";
                if(app.debugger)
                    return true;
                var fullscren = controlFullScreen(document.querySelector('body'));
                return fullscren.open();
            });
        },false);    

        get.item("#iniciar").addEventListener('click',function(){ 
            get.item(".step-captura[data-status='active']").dataset.status = "no-active";
            get.item("#instrucao-leitura").dataset.status = "active";
            setTimeout(captureToCanvas, 500);
        },false);  

        get.item("#confirmar").addEventListener('click',function(){ 
           questionario.next();
        },false);
    },
    resultadoLeitura: function(a){
        a = htmlEntities(a);

        if(!validarCodigo(a)){ //validação do token
            
            erro = "Código inválido";
            if(limparFeedback === null){
                get.item("#result").innerHTML=erro;
            } else {
                clearInterval(limparFeedback);
            }
            limparFeedback = setTimeout(function(){
                limparFeedback = null;
                get.item("#result").innerHTML="";    
            }, 500);
            return setTimeout(captureToCanvas, 500);
        }
        get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
        get.item("#pergunta").dataset.status = "step-atual";
    }, 

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
}
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};