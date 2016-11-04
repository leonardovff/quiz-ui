var app = {
    ambientes: ["http://10.83.3.192/sgo/","olimpiada.senai.br/oc2016/"],
    ambiente: 0,
    debugger: false,
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

        get.item("#inserir-manualmente").addEventListener('click',function(){ 
           app.abriCaixaCodigo();
        },false);

        get.item("#inserirCod>button[type='button']").addEventListener('click',function(){ 
           app.resultadoLeitura(get.item("#cod-usuario").value, function(erro){
                alert(erro);
                get.item("#inserirCod>button[type='reset']").click();
           });
        },false);

        get.item("#inserirCod>button[type='reset']").addEventListener('click',function(){ 
           stype = 1;
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
    abriCaixaCodigo: function(){
        get.item(".step-captura[data-status='active']").dataset.status = "no-active";
        get.item("#inserirCod").dataset.status = "active";
        stype = 0;
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
        var qtdDelegacao = (app.regional.Delegacao.match(/ /g) || []).length,
        stringDelegacao1 = app.regional.Delegacao,
        stringOcupacao1 = app.ocupacao.Ocupacao,
        stringOcupacao2 = app.ocupacao.Ocupacao,
        qtdOcupacao = (stringOcupacao1.match(/ /g) || []).length;
        console.log(qtdOcupacao);
        if(qtdOcupacao == 3 || qtdOcupacao == 2){
            stringOcupacao1 = substituirOcorrencia(stringOcupacao1,1);
            stringOcupacao2 = substituirOcorrencia(stringOcupacao2,2);
        }
        if(qtdOcupacao == 4){
            stringOcupacao1 = substituirOcorrencia(stringOcupacao1,2);
            stringOcupacao2 = substituirOcorrencia(stringOcupacao2,3);
        }
        get.all(".equipe-regional")[0].innerHTML = stringDelegacao1;
        get.all(".equipe-regional")[1].innerHTML = app.regional.Delegacao;
        get.all(".area")[0].innerHTML = stringOcupacao1;
        get.all(".area")[1].innerHTML = stringOcupacao2;
        //primaria
        get.item("#dir-baixo").style.backgroundColor = "#"+app.corPrimaria;
        get.item("#time").style.backgroundColor = "#"+app.corPrimaria;
        get.item("#esq-alto").style.backgroundColor = "#"+app.corPrimaria;
        get.item("#inserirCod>h6").style.backgroundColor = "#"+app.corPrimaria;
        get.item("#inserirCod>h4").style.backgroundColor = "#"+app.corPrimaria;
        get.item("#inserir-manualmente").style.backgroundColor = "#"+app.corPrimaria;

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
    resultadoLeitura: function(a, callbackErro){
        a = htmlEntities(a);
        if(!validarCodigo(a)){ //validação do token
            erro = "Código inválido";
            if(limparFeedback === null){
                get.item("#result").innerHTML=erro;
            } else {
                clearInterval(limparFeedback);
            }
            if(typeof(callbackErro)=="function"){
                callbackErro(erro);
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