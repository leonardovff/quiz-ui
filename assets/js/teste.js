function testar(){
    return true; 
    get.item("#hash_pw").value = "";
    app.login(function(){
        get.item("#iniciar").click();
        //get.item("#inserir-manualmente").click();
        app.resultadoLeitura("");
        testarResponder();
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