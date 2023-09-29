//CLASS DE DESPESAS
class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.descricao = descricao
		this.tipo = tipo
		this.valor = valor

	}

	//Metodo para verificar dar dados recebidos---- this refere ao objecto todo!
	validarDados(){
		for(var i in this){
			if(this[i] == undefined || this[i] == "" || this[i] == null){
				return false
			}
		}
		return true
	}
	
}

class BD{

		constructor(){
			let id = localStorage.getItem("id")

			if(id === null){
				localStorage.setItem("id", 0)
			}
		}

		getProximoID(){
			let proximoid = localStorage.getItem("id")
			return parseInt(proximoid) + 1

		}

		gravar(d){
			let id = this.getProximoID()

			localStorage.setItem(id, JSON.stringify(d))

			localStorage.setItem("id", id)
		}

		recuperarTodosRegistas(){

			//array despesas
			let lista_despesas = Array()


			let id = localStorage.getItem("id")

			//recuperar despesas em local storage
			for(let i = 1; i <= id; i++){

				//Converter elements recuperados JSON em objectos literais
				let despesa = JSON.parse(localStorage.getItem(i))
				

				if(despesa === null){
					continue
				}

				despesa.id = i
				lista_despesas.push(despesa)
			}
			return lista_despesas
		}

		pesquisar(despesa){

			let despesas_filtradas = Array()
			despesas_filtradas = this.recuperarTodosRegistas()

			console.log(despesas_filtradas)

			//FILTROS
			//ano
			if(despesa.ano != ""){
				
				despesas_filtradas = despesas_filtradas.filter(function(x){return x.ano == despesa.ano })
			}

			//mes
			if(despesa.mes != ""){
				
				despesas_filtradas = despesas_filtradas.filter(function(x){return x.mes == despesa.mes })
			}

			//dia
			if(despesa.dia != ""){
				
				despesas_filtradas = despesas_filtradas.filter(function(x){return x.dia == despesa.dia })
			}

			//tipo
			if(despesa.tipo != ""){
				
				despesas_filtradas = despesas_filtradas.filter(function(x){return x.tipo == despesa.tipo })
			}

			//descricao
			if(despesa.descricao != ""){
				
				despesas_filtradas = despesas_filtradas.filter(function(x){return x.descricao == despesa.descricao })
			}

			//valor
			if(despesa.valor != ""){
				
				despesas_filtradas = despesas_filtradas.filter(function(x){return x.valor == despesa.valor })
			}


			return despesas_filtradas
		}

		remover(id){
			localStorage.removeItem(id)
		}

}

let bd = new BD()


//FUNÇÃO PARA BUSCAR VALORES DE DOM
function registoDespesa(){

	let ano = document.getElementById("ano")
	let mes = document.getElementById("mes")
	let dia = document.getElementById("dia")
	let tipo = document.getElementById("tipo")
	let descricao = document.getElementById("descricao")
	let valor = document.getElementById("valor")

	var despesas = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

//APOS VERIFICAR, VALIDA DADOS----SISTEMA DE ALTERACAO DE VALORES DE MODAL CONSOANTE TRUE OU FALSE

	var modalGlobal = new bootstrap.Modal(document.getElementById("modalGlobal"))

	var modal_titulo = document.getElementById("modal_titulo")
	var modal_conteudo = document.getElementById("modal_conteudo")
	var modal_background = document.getElementById("modal_background")
	var modal_botao = document.getElementById("modal_botao") 


	if(despesas.validarDados()){

		bd.gravar(despesas)
		modal_titulo.innerHTML = "Sucesso Registo"
		modal_conteudo.innerHTML = "Você registou o elemento com sucesso!"
		modal_background.className = "modal-header text-success"
		modal_botao.className = "btn btn-success"
		modal_botao.innerHTML = "Voltar"

		modalGlobal.show()

		//limpeza de campos após aprovação
		ano.value = ""
		mes.value = ""
		dia.value = ""
		tipo.value = ""
		descricao.value = ""
		valor.value = ""

	}else{

		modal_titulo.innerHTML = "Erro Registo"
		modal_conteudo.innerHTML = "Existem campos obrigatorios que não foram preenchidos"
		modal_background.className = "modal-header text-danger"
		modal_botao.className = "btn btn-danger"
		modal_botao.innerHTML = "Voltar e corrigir"

		modalGlobal.show()
		
	}

}


function carregaListaDespesas(despesas = Array(), filtro = false){

	if(despesas.length == 0 && filtro == false){
	despesas = bd.recuperarTodosRegistas()
	}

	//selecionar elemento tbody da tabela
	var tabeladespesas = document.getElementById("tabelaDespesa")
	tabeladespesas.innerHTML = ""

	//precorrer array de despesas

	despesas.forEach(function(d){

		//criar linha
		let linha = tabeladespesas.insertRow()

		//criar celula
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
	
		switch(d.tipo){
			case "1" : d.tipo = "Alimentação"
			break;
			case "2" : d.tipo = "Educação"
			break;
			case "3" : d.tipo = "Lazer"
			break;
			case "4" : d.tipo = "Saude"
			break;
			case "5" : d.tipo = "Transporte"
			break;
		}

		linha.insertCell(1).innerHTML = `${d.tipo}`
		linha.insertCell(2).innerHTML = `${d.descricao}`
		linha.insertCell(3).innerHTML = `${d.valor}`


		//BOTAO DE APAGAR
		let btn = document.createElement("button")
		btn.className = "btn btn-danger"
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}` //d é a variavel do for que precorre os objectos
		btn.onclick = function(){ 
			

			let id = this.id.replace("id_despesa_","")

			//alert(id)

			bd.remover(id)

			window.location.reload()
		}
		linha.insertCell(4).append(btn)

		console.log(d)

	})


}

function pesquisarDespesas(){
	let ano = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)

	

	carregaListaDespesas(despesas, true)


}


