var ajax = {
    filaSend: null,
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
	getPerguntas: function(callback){
        var data = {
            Regional: "AL",
            COD_Ocupacao :  76,
            CodigoBarras :  "95012300000338",
            action: "getQuestoes"
        };
        $.ajax({
            url: app.ambientes[app.ambiente]+"votacao.asp",
            method: "GET",
            data: data,
            dataType : "json",
            success: function(response){
                questionario.perguntas = response.questoes;
                questionario.alternativas = response.alternativas;
                app.dataResposta = response.data;
                callback(true);
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
            COD_Alternativa: resposta.COD_Alternativa
        };
        $.ajax({
            url: app.ambientes[app.ambiente]+"votacao.asp?action=setRespostas",
            method: "POST",
            data: data,
            dataType : "json",
            success: function(response){
                callback(response.inserido);
            },
            error: function(){
                callback(false);
            }
        }).then(function(){
            // console.log("entrou");
        });
    },
    envioEmBackground: function(){
    	if(ajax.filaSend.length>0){
	    	return ajax.sendRespostas(ajax.filaSend[0], function(flag){
                // console.log(ajax.filaSend.length,ajax.filaSend[0])
                if(flag){
	    			ajax.filaSend.remove(0,0);
                    ajax.salvarFila();
	    		} 
	    		setTimeout(ajax.envioEmBackground,  config.tempoEnvioBackground);
	    	});
    	}
    	setTimeout(ajax.envioEmBackground,  config.tempoEnvioBackground);

    },
    init: function(){
    	var filaSend = localStorage.getItem("filaSend");
    	filaSend = filaSend == null?[]:JSON.parse(filaSend);
    	ajax.filaSend = filaSend;
    	setTimeout(ajax.envioEmBackground, config.tempoEnvioBackground);
    }
}
ajax.init();