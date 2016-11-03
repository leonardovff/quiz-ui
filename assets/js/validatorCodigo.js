var validarCodigo = (function(){
    function calculaVerificador(codigo){
        var digito = 1,
        somatorio = null,
        fator = null,
        numeroEncontrado;
        retorno = "";
        while (digito < 3){
            somatorio = 0;
            for (var contador = 1; contador < 13; contador++) {
                if(digito == 1){
                    fator = contador;
                } else {
                    fator = 13 - contador;
                }
                somatorio += fator * parseInt(codigo.substring(contador-1,contador))
            }
            //CALCULA O DIGITO VERIFICADOR COMO A
            //DISTANCIA ENTRE SOMATORIO E O PROXIMO MULTIPLO DE 10
            numeroEncontrado = 10 - (somatorio % 10)
            if(numeroEncontrado == 10){
                numeroEncontrado = 0
            }
            retorno += "" + numeroEncontrado;
            digito += 1;
        }
        return retorno;
    }
    return function(codigo){
        if((codigo.length != 14) || parseInt(codigo)<=0){
            return false;
        } 
        'VERIFICA SE O DIGITO VERIFICADOR ESTA CORRETO'
        if(parseInt(calculaVerificador(codigo.substring(0,12)))
        != parseInt(codigo.substring(12,14))){
            return false;
        }
        return true;
    }
}())