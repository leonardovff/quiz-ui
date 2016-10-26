var questionario = {
    perguntas: null,
    alternativas: null,
    total: null,
    indice: 0,
    respostas: null,
    position: null,
    renderize: function(){
    	var stringAlternativas = "",
    	COD_Questao = questionario.perguntas[questionario.indice].COD;
    	// console.log(questionario.perguntas[questionario.indice].COD);
    	for (var i = 0, lim = questionario.alternativas.length; i < lim; i++){ 
    		if(questionario.alternativas[i].COD_Questao == COD_Questao){
    			stringAlternativas += '<li class="alternativas" data-COD-Alternativa="'+questionario.alternativas[i].COD+'">';
				stringAlternativas += questionario.alternativas[i].Alternativa+'</li>';
    		}
    	}
    	get.item("#questao>ul").innerHTML = stringAlternativas;
    	get.item("#questao>ul>li:first-child").dataset.content = questionario.perguntas[questionario.indice].LegendaMenos;
    	get.item("#questao>ul>li:last-child").dataset.content = questionario.perguntas[questionario.indice].LegendaMais;
    	get.item("#questao").dataset.codQuestao = questionario.perguntas[questionario.indice].COD;
    	get.item("#questao h3").innerHTML = (questionario.perguntas[questionario.indice].Pergunta);
    	get.item("#pergunta").dataset.statusVotacao = "waint";
    },
    next: function(){
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
			return get.item("#pergunta").dataset.statusVotacao = "obrigado";
    	}
    	questionario.indice += 1;
    	questionario.renderize();
    },
    destroy: function(){

    },
    start: function(){
    	questionario.indice = 0;
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