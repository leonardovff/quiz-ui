<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
<h1 id="filaqtd" style="text-align:center;font-size:10vw;color:red;font-weight: bolder;"></h1>

<h1 id="log" style="text-align:center;font-size:2vw;color:red;font-weight: bolder;"></h1>
<script type="text/javascript">
	var qtdfila = localStorage.getItem("filaSend")==null? 0:JSON.parse(localStorage.getItem("filaSend")).length;

	var log = localStorage.getItem("filaSend")==null? 0:localStorage.getItem("log");
	document.querySelector("#filaqtd").innerHTML = "Quantidade de repostas faltante na fila de envio: " + qtdfila;
	document.querySelector("#log").innerHTML = log;
</script>
</body>
</html>