var ajax = {
    filaSend: null,
    tempoEnvioBackground: 10000,
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
                questionario.total = response.questoes.length;
                callback(true);
            },
            error: function(){
                callback(false);
            }
        }).then(function(){
            console.log("entrou");
        });
    },
    sendRespostas: function(votacao, callback){
    	var data = {
            Regional: 'AL',
            COD_Ocupacao :  76,
            CodigoBarras :  "95012300000338",
            COD_Alternativa: 80
        };
        $.ajax({
            url: app.ambientes[app.ambiente]+"votacao.asp?action=setRespostas",
            method: "POST",
            data: data,
            dataType : "json",
            success: function(response){
                // questionario.perguntas = response.questoes;
                // questionario.total = response.questoes.length;
                callback(true);
            },
            error: function(){
                callback(false);
            }
        }).then(function(){
            console.log("entrou");
        });
    },
    envioEmBackground: function(){
    	if(ajax.filaSend.length>0){
	    	return ajax.sendRespostas(ajax.filaSend[0], function(flag){
	    		if(flag){
	    			ajax.filaSend[0].remove(0,0);
	    		} 
	    		setTimeout(ajax.envioEmBackground,  ajax.tempoEnvioBackground);
	    	});
    	}
    	setTimeout(ajax.envioEmBackground,  ajax.tempoEnvioBackground);

    },
    init: function(){
    	var filaSend = localStorage.getItem("filaSend");
    	filaSend = filaSend == null?[]:filaSend = JSON.parse(filaSend);
    	ajax.filaSend = filaSend;
    	setTimeout(ajax.envioEmBackground, ajax.tempoEnvioBackground);
    }
}
ajax.init();