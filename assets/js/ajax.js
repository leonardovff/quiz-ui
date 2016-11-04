var ajax = {
    filaSend: null,
    log: null,
    salvarFila: function(fila){
    	if(typeof(fila)=="undefined") {
    		fila = ajax.filaSend;
    	}
    	localStorage.setItem("filaSend", JSON.stringify(fila));
    },
    adicionarNaFila: function(resposta){
    	ajax.filaSend.push(resposta);
    	ajax.salvarFila();
    },
	getPerguntas: function(psw,callback){
        var data = {
            hash: psw
        };
        $.ajax({
            url: app.ambientes[app.ambiente]+"votacao.asp?action=getQuestoes",
            method: "POST",
            data: data,
            dataType : "json",
            success: function(response){
                if(response.flag){
                    if(response.limpar){
                        ajax.clear();
                        questionario.clear();
                    }
                    questionario.perguntas = response.questoes;
                    questionario.alternativas = response.alternativas;
                    app.dataResposta = response.data;
                    app.regional = response.regional;
                    app.ocupacao = response.ocupacao;
                    app.hash = psw;
                    app.corPrimaria = response.corPrimaria;
                    app.corSecundaria = response.corSecundaria;
                }
                callback(response.flag);
            },
            error: function(){
                callback(false);
            }
        }).then(function(){
            // console.log("entrou");
        });
    },
    sendRespostas: function(resposta, callback){
        // console.log(resposta);
    	var data = {
            Regional: resposta.regional,
            COD_Ocupacao :  resposta.COD_Ocupacao,
            CodigoBarras :  resposta.codigo,
            COD_Alternativa: resposta.COD_Alternativa,
            hash: resposta.hash
        };
        $.ajax({
            url: app.ambientes[app.ambiente]+"votacao.asp?action=setRespostas",
            method: "POST",
            data: data,
            dataType : "json",
            success: function(response){
                callback(response.inserido);
            },
            error: function(erro){
                callback(false, erro);
            }
        }).then(function(){
            // console.log("entrou");
        });
    },
    envioEmBackground: function(){
    	if(ajax.filaSend.length>0){
            return ajax.sendRespostas(ajax.filaSend[0], function(flag, erro){
                if(flag){
                    ajax.filaSend.remove(0,0);
                    ajax.salvarFila();
                } else{
                    if(typeof(ajax.filaSend[0].qtdTentativas)=="undefined"){
                        ajax.filaSend[0].qtdTentativas = 0;
                    };
                    ajax.filaSend[0].qtdTentativas += 1;
                    if(ajax.filaSend[0].qtdTentativas == 3 || ajax.filaSend[0].qtdTentativas == 6|| 
                    ajax.filaSend[0].qtdTentativas >= 9){
                        ajax.registrarLog(ajax.filaSend[0], erro);
                        ajax.filaSend.push(ajax.filaSend.shift()); 
                        ajax.salvarFila();
                        if(ajax.filaSend[0].qtdTentativas>=9){
                            ajax.filaSend.remove(0,0);
                            ajax.salvarFila();
                        }
                    }
                }
	    		setTimeout(ajax.envioEmBackground,  config.tempoEnvioBackground);
	    	});
    	}
    	setTimeout(ajax.envioEmBackground,  config.tempoEnvioBackground);

    },
    registrarLog: function(obj,erro){
        var log = {
            data: obj,
            info: {
                ambiente: app.ambiente,
                ambientes: app.ambientes,
                config: config,
                debugger: app.debugger
            },
            erro: null
        }
        if(typeof(erro)!="undefined"){
            log.erro = {
                status: erro.status,
                responseText: erro.responseText,
                responseHeaders: erro.getAllResponseHeaders(),
            }
        }
        if(typeof(fila)=="undefined") {
            fila = ajax.filaSend;
        }
        ajax.log.push(log);
        localStorage.setItem("log", JSON.stringify(ajax.log));
    },
    clear: function(){
        app.log = [];
        app.filaSend = [];
        localStorage.removeItem("log");
        localStorage.removeItem("filaSend");
    },
    init: function(){
        var log = localStorage.getItem("log");
        log = log == null?[]:JSON.parse(log);
        ajax.log = log;
    	var filaSend = localStorage.getItem("filaSend");
    	filaSend = filaSend == null?[]:JSON.parse(filaSend);
    	ajax.filaSend = filaSend;
    	setTimeout(ajax.envioEmBackground, config.tempoEnvioBackground);
    }
}
ajax.init();