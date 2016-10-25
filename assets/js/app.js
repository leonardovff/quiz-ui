var validarCodigo = (function(){
    function calculaVerificador(codigo){
        var digito = 1,
        somatorio = null,
        fator = null,
        numeroEncontrado;
        retorno = "";
        while (digito < 3){
            somatorio = 0;
            for (var contador = 1; contador < 13; contador++) {
                if(digito == 1){
                    fator = contador;
                } else {
                    fator = 13 - contador;
                }
                somatorio += fator * parseInt(codigo.substring(contador-1,contador))
            }
            //CALCULA O DIGITO VERIFICADOR COMO A
            //DISTANCIA ENTRE SOMATORIO E O PROXIMO MULTIPLO DE 10
            numeroEncontrado = 10 - (somatorio % 10)
            if(numeroEncontrado == 10){
                numeroEncontrado = 0
            }
            retorno += "" + numeroEncontrado;
            digito += 1;
        }
        return retorno;
    }
    return function(codigo){
        if((codigo.length != 14) || parseInt(codigo)<=0){
            return false;
        } 
        //VERIFICA SE O DIGITO VERIFICADOR ESTA CORRETO
        if(parseInt(calculaVerificador(codigo.substring(0,12)))
        != parseInt(codigo.substring(12,14))){
            return false;
        }
        return true;
    }
}())
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

        get.item("#iniciar").addEventListener('click',function(){ 
            get.item(".step-captura[data-status='active']").dataset.status = "no-active";
            get.item("#instrucao-leitura").dataset.status = "active";
            setTimeout(captureToCanvas, 500); 
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
    get.item("#confirmar").addEventListener('click',function(){ 
        get.item("#pergunta").dataset.statusVotacao = "obrigado";
    },false);
    
}