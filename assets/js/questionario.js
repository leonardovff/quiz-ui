var questionario = {
    perguntas: null,
    total: null,
    indice: 1,
    respostas: null,
    respostasAtual: [],
    tempoEnvio: 10000,
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
    renderize: function(){
    	var respostaSelecionada = get.item("#questao>ul>li.checked");
    	if(respostaSelecionada != null) respostaSelecionada.className = "";
    	get.item("#questao").dataset.codQuestao = questionario.perguntas[questionario.indice].Cod;
    	get.item("#questao h3").innerHTML = (questionario.perguntas[questionario.indice].Pergunta);
    	get.item("#questao>ul>li:first-child").dataset.content = (questionario.perguntas[questionario.indice].LegendaMenos)
    	get.item("#questao>ul>li:last-child").dataset.content = (questionario.perguntas[questionario.indice].LegendaMais)
    	get.item("#pergunta").dataset.statusVotacao = "waint";
    },
    next: function(){
    	questionario.respostasAtual.push({
    		codQuestao: get.item("#questao").dataset.codQuestao,
    		resposta: get.item("#questao>ul>li.checked").dataset.value,
    		
    	});
    	console.log(questionario.indice + 1, questionario.total);
    	if(questionario.indice + 1 >= questionario.total) {
    		//acabou as questões
    		respostas.push({
    			codigo: 95012300000338, 
    			respostas: questionario.respostasAtual,
    			regional: 'AL',
    			COD_Ocupacao: 76
    		})
    		questionario.salvarRespostas();
    		return get.item("#pergunta").dataset.statusVotacao = "obrigado";
    	}
    	questionario.indice += 1;
    	questionario.renderize();
    },
    salvarRespostas: function(respostas){
    	localStorage.setItem("respostas", JSON.stringify(respostas));
    },
    send: function(votacao, callback){
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
                questionario.perguntas = response.questoes;
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
    envioEmBackground: function(){
    	if(questionario.respostas.length>0){
	    	return questionario.send(questionario.respostas[0], function(flag){
	    		if(flag){
	    			questionario.respostas[0].remove(0,0);
	    		} 
	    		setTimeout(questionario.envioEmBackground,  questionario.tempoEnvio);
	    	});
    	}
    	setTimeout(questionario.envioEmBackground,  questionario.tempoEnvio);

    },
    init: function(){
    	var respostas = localStorage.getItem("respostas");
    	if(respostas == null){
			respostas = [];
    	} else {
    		JSON.parse(respostas);
    	}
    	questionario.respostas = respostas;
    	setTimeout(questionario.envioEmBackground, questionario.tempoEnvio);
    }
}
questionario.init();