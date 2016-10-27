var questionario = {
    perguntas: null,
    perguntasFiltradas: null,
    alternativas: null,
    total: null,
    indice: 0,
    respostas: null,
    position: null,
    intervaloResposta: null,
    renderize: function(){
        // console.log(questionario.perguntasFiltradas, questionario.indice, questionario.total);
        var stringAlternativas = "",
        COD_Questao = questionario.perguntasFiltradas[questionario.indice].COD;
        
        for (var i = 0, lim = questionario.alternativas.length; i < lim; i++){ 
    		if(questionario.alternativas[i].COD_Questao == COD_Questao){
    			stringAlternativas += '<li class="alternativas" data-COD-Alternativa="'+questionario.alternativas[i].COD+'">';
				stringAlternativas += questionario.alternativas[i].Alternativa+'</li>';
    		}
    	}
        get.item("#questao>ul").innerHTML = stringAlternativas;
        get.item("#questao>ul>li:first-child").dataset.content = questionario.perguntasFiltradas[questionario.indice].LegendaMenos;
        get.item("#questao>ul>li:last-child").dataset.content = questionario.perguntasFiltradas[questionario.indice].LegendaMais;
        get.item("#questao").dataset.codQuestao = questionario.perguntasFiltradas[questionario.indice].COD;
        get.item("#questao h3").innerHTML = (questionario.perguntasFiltradas[questionario.indice].Pergunta);
        questionario.atualizarTime(config.tempoResponder);
        get.item("#pergunta").dataset.statusVotacao = "waint";
        //delay espera para a tela aparecer com a animação
        setTimeout(function(){
            questionario.startTimeResponder();
        },1000);
    },
    next: function(){
        if(questionario.intervaloResposta!=null){  
            clearInterval(questionario.intervaloResposta);
        } 
    	var respostas = {
    		codQuestao: get.item("#questao").dataset.codQuestao,
    		COD_Alternativa: get.item("#questao>ul>li.checked").dataset.codAlternativa,	
    		regional: app.regional,
    		COD_Ocupacao:  app.COD_Ocupacao,
    		codigo: app.codigo, 
    	}
    	ajax.adicionarNaFila(respostas);
    	questionario.respostas.push(respostas);
		questionario.salvarRespostas();
    	// console.log(questionario.indice + 1, questionario.total);
    	if(questionario.indice + 1 >= questionario.total) {
    		//acabou as questões
            return questionario.destroy();
    	}
    	questionario.indice += 1;
    	questionario.renderize();
    },
    destroy: function(msgFeedback){
        if(typeof(msgFeedback) === "undefined") {
            msgFeedback = config.msgObrigado;
        }
        get.item("#agradecimento").innerHTML = msgFeedback;        
        get.item("#pergunta").dataset.statusVotacao = "obrigado";      
        get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
        get.item("#pergunta").dataset.status = "step-atual";      
        setTimeout(function(){
            app.init();
            get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
            get.item("#captura").dataset.status = "step-atual";
        }, config.tempoFeedback*1000);
    },
    filtrar: function(){
        var arr = [],
        questoesRespondidas = null;
        for (var i = 0, lim = questionario.perguntas.length; i < lim; i++) {
            var questoesRespondidas = questionario.respostas.filter(function(value){
                if(value.codigo == app.codigo && 
                value.COD_Ocupacao == app.COD_Ocupacao && 
                value.regional == app.regional && 
                value.codQuestao == questionario.perguntas[i].COD)
                    return true;
            });
            if(questoesRespondidas.length == 0){
                arr.push(questionario.perguntas[i]);
            }
        }
        questionario.perguntasFiltradas = arr;
    },
    atualizarTime: function(tempo){
        get.item("#time").innerHTML = tempo;
    },
    startTimeResponder: function(){
        var tempo = config.tempoResponder;
        questionario.intervaloResposta = setInterval(function(){
            tempo -= 1;
            questionario.atualizarTime(tempo);
            if(tempo <= 0){
                if(questionario.intervaloResposta!=null){
                    clearInterval(questionario.intervaloResposta);
                }
                questionario.destroy(config.msgFimTempo);
            }
        }, 1000);
    },
    start: function(){
        questionario.filtrar();
        questionario.indice = 0;
        questionario.total = questionario.perguntasFiltradas.length;
        if(questionario.total == 0 ){
            questionario.destroy(config.msgSemPergunta);
            return false;
        }
    	questionario.renderize();
        get.item("#todo>section[data-status='step-atual']").dataset.status = "no-active";
        get.item("#pergunta").dataset.status = "step-atual";
    },
    salvarRespostas: function(respostas){
    	if(typeof(respostas)=="undefined") {
    		respostas = questionario.respostas;
    	}
    	localStorage.setItem("respostas", JSON.stringify(respostas));
    },
    
    init: function(){
    	var respostas = localStorage.getItem("respostas");
    	respostas = respostas == null?[]:JSON.parse(respostas);
    	questionario.respostas = respostas;
    }
}
questionario.init();