var app = {
    ambientes: ["http://10.83.3.192/sgo/"],
    ambiente: 0,
    debugger: true,
    codigo: null,
    regional: 'AL',
    COD_Ocupacao: 76,
    setEvents: function(){
        get.item("#entrar").addEventListener('click',function(){
            app.init();
        },false);    

        get.item("#iniciar").addEventListener('click',function(){ 
            get.item(".step-captura[data-status='active']").dataset.status = "no-active";
            get.item("#instrucao-leitura").dataset.status = "active";
            setTimeout(captureToCanvas, 500);
        },false);  

        get.item("#confirmar").addEventListener('click',function(){ 
           questionario.next();
        },false);
        get.item('body').addEventListener('click', function(event) {
            if (event.target.className.toLowerCase() === 'alternativas') {        
                if(get.all("#pergunta ul>li.checked").length>0){
                    get.item("#pergunta ul>li.checked").className = "alternativas";
                } else {
                    get.item("#pergunta").dataset.statusVotacao = "selected"
                }
                event.target.className = "alternativas checked";
            }
        });

    },
    init: function(callback){
        if(get.item("#hash_pw").value!=="123"){
            return alert("Hash incorreto!");   
        } 
        ajax.getPerguntas(function(flag){
            if(!flag){
                return alert("Não foi possivel capturar as questões");
            } 
            get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
            get.item("#captura").dataset.status = "step-atual";
            if(typeof(callback)==="function") callback();
            if(app.debugger)
                return true;
            var fullscren = controlFullScreen(document.querySelector('body'));
            return fullscren.open();
        });
    },
    resultadoLeitura: function(a){
        a = htmlEntities(a);

        if(!validarCodigo(a)){ //validação do token
            questionario.reset();
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
        app.codigo = a;
        get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
        get.item("#pergunta").dataset.status = "step-atual";
    }, 

}
function initApp(){
    app.setEvents();
    // testar();
}
function testar(){
    get.item("#hash_pw").value = "123";
    app.init(function(){
        app.codigo = "95012300000338";
        questionario.reset();  
        get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
        get.item("#pergunta").dataset.status = "step-atual";
    });

}
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};