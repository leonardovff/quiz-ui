var app = {
    ambientes: ["http://10.83.3.192/sgo/","olimpiada.senai.br/oc2016/"],
    ambiente: 0,
    debugger: true,
    codigo: null,
    regional: null,
    ocupacao: null,
    hash: null,
    corPrimaria: null,
    corSecundaria: null,
    dataResposta: null,
    setEvents: function(){
        get.item("#entrar").addEventListener('click',function(){
            app.login();
        },false);    

        get.item("#iniciar").addEventListener('click',function(){ 
            app.initCapturaCodigo();
        },false);  

        get.item("#confirmar").addEventListener('click',function(){ 
            console.log("entrou");
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
    login: function(callback){
        var hash = get.item("#hash_pw").value;
        get.item("#entrar").className="loading";
        ajax.getPerguntas(hash, function(flag){
            if(!flag){
                alert("Não foi possivel capturar as questões, hash incorreto");
                if(!app.debugger)
                    window.location.reload();
                return false;
            } 
            get.item("#entrar").className="";
            app.uploadLayot();
            app.init(callback);
        });
        if(app.debugger)
            return true;
        var fullscren = controlFullScreen(document.querySelector('body'));
        fullscren.open();
        delete fullscren;
    },
    uploadLayot: function(){
        get.all(".equipe-regional")[0].innerHTML = "Nome equipe<br>"+ app.regional.Delegacao;
        get.all(".equipe-regional")[1].innerHTML = "Nome equipe<br>"+ app.regional.Delegacao;
        get.all(".area")[0].innerHTML = app.ocupacao.Ocupacao;
        get.all(".area")[1].innerHTML = app.ocupacao.Ocupacao;
        //primaria
        get.item("#dir-baixo").style.backgroundColor = "#"+app.corPrimaria;
        get.item("#esq-alto").style.backgroundColor = "#"+app.corPrimaria;
        //secundaria
        get.item("#esq-baixo").style.backgroundColor = "#"+app.corSecundaria;
        get.item("#dir-alto").style.backgroundColor = "#"+app.corSecundaria;
        get.item("#agradecimento").style.backgroundColor = "#"+app.corSecundaria;
        get.item("#questao").style.backgroundColor = "#"+app.corSecundaria;
        get.item("head").innerHTML += '<style type="text/css">#pergunta ul>li.checked{color:#'+app.corSecundaria+';}</style>';
        console.log("#"+app.corSecundaria);
    },
    initCapturaCodigo: function(){
        get.item(".step-captura[data-status='active']").dataset.status = "no-active";
        get.item("#instrucao-leitura").dataset.status = "active";
        setTimeout(captureToCanvas, 500);
    },
    init: function(callback){

        get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
        get.item("#captura").dataset.status = "step-atual";
        get.item(".step-captura[data-status='active']").dataset.status = "no-active";
        get.item("#instrucao-inicio").dataset.status = "active";
        if(typeof(callback)==="function") callback();
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
        app.codigo = a;
        questionario.start();
    }, 

}
function initApp(){
    app.setEvents();
    testar();
}
function testar(){
    get.item("#hash_pw").value = "xupekx";
    app.login(function(){
        app.resultadoLeitura("95012300000338");
        // testarResponder();
        // AL - 2,3,5,3,5
        // BA - 1,4,5,3,5
    });
}
function testarResponder(){
    setTimeout(function(){
        for (var i = 0; i < 5; i++) {
            var arr = [75,88,99,119,108];
            get.item('#questao>ul>li[data-cod-alternativa="'+arr[i]+'"]').className = "alternativas checked";
            questionario.next();
        }
    }, 2000);
}