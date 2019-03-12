/*
    Brasil - Universidade Federal de Mato Grosso
    Ciência da Computação – Campus Universitário do Araguaia
    Aluno: Kalmon Valadão Tavares
	Professor: Ms. Robson Silva Lopes
	Compilar: node criptoaritmetica.js -i sen+more=money -p 500 -g 250 -a 1 -s 2 -m 1
*/
// --------------------------- Criptoaritmética ---------------------------

//Declaração de variaveis GLOBAIS.
var Sun1,
    Sun2,
    Result,
    Populacao,
    Geracao,
    Crossover,
    Mutacao,
    Torneio,
    MetodoCruzamen,
    Texto,
    Media=0,
    MetodoAvalicao,
    Nivel=0,
    Cidade = new Array(),
    CidadeTemp = new Object();


//Retorna o texto, então faço um split para obter cada parte da soma.
Texto = TratamentoTexto(GET_$('i'));
Sun1 = GET_$('i').split("+")[0];
Sun2 = GET_$('i').split("+")[1];
Result = Sun2.split("=")[1];
Sun2 = Sun2.split("=")[0];
Populacao = GET_$('p');
Geracao = GET_$('g');
Crossover = GET_$('c');
Mutacao = GET_$('m');
Torneio = GET_$('t');
MetodoCruzamen = parseInt(GET_$('s'));
MetodoAvalicao = parseInt(GET_$('a'));

console.log("Texto1:"+Sun1+" + Texto2:"+Sun2+" =: "+Result);
console.log(" | População(-p): "+Populacao+
            " | Geração(-g):"+Geracao+
            " | Crossover(-c):"+Crossover+
            " | Mutação(-m):"+Mutacao+
            " | Torneio(-t):"+Torneio+
            " | Frase(-i):"+Texto+
            " | Met. Cruzamento(-s):"+MetodoCruzamen+
            " | Met. Avaliação(-a):"+MetodoAvalicao);

// ----------- CHAMADA DE FUNÇÕES DO SISTEMA -----------
PreencherCidade();

MetodoCruzamento();

MelhorResult();



function Crossover_PMX(){
	//Descobrir qual parte vamos corta, 0>=Index<=Texto.lenght(alfabeto) && Index1 != Index2 , assim criamos um limite de corte que no minino 1 digito.
	var index1,
		index2,
		temp;
	//Index1+Index2: Não suje essa variaveis, elas são chamadas em TratamentoFilhos() > NumbIsCross()
	index1 = RandInt(0,Texto.length);
	do{
		index2 = RandInt(0,Texto.length);
	}while(index1==index2);

	//Organização para evitar falha na hora de corta a string.
	if(index2<index1){
		temp = index2;
		index2 = index1;
		index1 = temp;
	}
	
	//Crio filhos exatamente iguais aos pais.
	var Filho1=new Object(PaisSelect()),
		Filho2=new Object(PaisSelect()),
		Filho1Num = new Array(),
		Filho2Num = new Array();

	//Se um dos filhos for null, solicito uma nova seleção de filhos, e caso o erro repita 100 vezes, vamos chamar o sorteio novamente.
	for(var cont=0;"{}" == JSON.stringify(Filho1) || "{}" == JSON.stringify(Filho2);cont++){
		Filho1=new Object(PaisSelect());
		Filho2=new Object(PaisSelect());
		if(cont>100){
			console.log("Error de seleção, pais vazios.");
			PreencherCidade();
            cont=0;
            Filho1=new Object(PaisSelect());
		    Filho2=new Object(PaisSelect());
		}
	}

	//Descubro se os dois filhos (copias dos pais) são iguais.
	for(var cont =0;PessoaEquals(Filho1,Filho2);cont++){
		Filho2=PaisSelect();
		cont++;
		if(cont>100){
			console.log("Atingimos o limite de tentativa de cruzamento, vamos gerar novos cidadões e repetir a tentativa de cruzamento!");
			cont=0;
			PreencherCidade();
		}
	}

	// Seleciono as letras que devem ter seus numeros trocados, neste momento o cruzamento ira acontecer.
	temp =index1;
	for(var cont=0,temp2, letra;temp<=index2;temp++ & cont++){
		letra = Texto.substring(temp, temp+1);
		temp2 = Filho1[letra];
		Filho1[letra] = Filho2[letra];
		Filho2[letra] = temp2;

		//Ex: Filho1Num[0] = 9;
		Filho1Num[cont] = Filho1[letra];
		Filho2Num[cont] = Filho2[letra];
    }

	//Tratamento de caracteres repetidos.
	Filho1 = TratarCruzamento(Filho1,Filho1Num,[index1,index2]);
    Filho2 = TratarCruzamento(Filho2,Filho2Num,[index1,index2]);
	
	//Resetando suas configurações.
	Filho1 = ConfigPessoa(Filho1);
	Filho2 = ConfigPessoa(Filho2);
	
	temp=new Object();
	temp=MutacaoGet(Filho1);
	Filho1 = TratarMutação(temp);
	Cidade.push(new Object(Filho1));
	
	temp=MutacaoGet(Filho2);
	Filho2 = TratarMutação(temp);
	Cidade.push(new Object(Filho2));

	function MutacaoGet(obj){
		var corte,
			letra,
			Nums = new Array(),
			NumsCheck= new Array(),
			NumRand,
			NumRandCheck= new Array();
		//Fazer mutação Nº de vezes
		for(var cont=0; cont<Mutacao;cont++){
			corte = RandInt(0,Texto.length);
			//Descobrir se ja não selecionamos essa letra.
			while(NumsCheck[corte]==true){
				corte = RandInt(0,Texto.length);
			}
			NumsCheck[corte]=true;			
			letra = Texto.substring(corte, corte+1);

			NumRand = RandInt(0,10);
			while(NumRandCheck[NumRand]==true){
				NumRand = RandInt(0,10);
			}
			NumRandCheck[NumRand]=true;
			obj[letra] = NumRand;

			obj.mutacao.push(letra);
			Nums.push(obj[letra]);
		}
		return obj;
	}

	//Remove todos numeros repetidos, preservando dos numeros que foram obtidos atraves do Crossover.
	//corte = null, significa que estamos tratando a mutação, então não olhamos pra marca de corte.
	function TratarCruzamento(Filho,FilhoNum,corte){
		var NumOK = NumberosDisponiveis(Filho),
			temp;
		for(var i=0;i<Texto.length;i++){
			letra = Texto.substring(i, i+1);
			for(var j=0;j<FilhoNum.length;j++){
				if(FilhoNum[j]==Filho[letra] && (i<corte[0] || i>corte[1])){
					temp = RandInt(0,NumOK.length);
					Filho[letra] = NumOK[temp];
					//Agora que usei o numero, removo ele.
					NumOK.splice(temp, 1);
				}
			}
		}
		return Filho;
	}

	function TratarMutação(Filho){
		var NumOK = NumberosDisponiveis(Filho),
		temp;
		var LetrasMut = new Array();
		LetrasMut = Filho.mutacao;
		for(var i=0;i<Texto.length;i++){
			letra = Texto.substring(i, i+1);
			for(var j=0;j<LetrasMut.length;j++){
				if(Filho[LetrasMut[j]]==Filho[letra] && LetrasMut[j]!=letra){
					temp = RandInt(0,NumOK.length);
					Filho[letra] = NumOK[temp];
					//Agora que usei o numero, removo ele.
					NumOK.splice(temp, 1);
				}
			}
		}
	}

	//Quais numeros estãos disponiveis?
	//Retorna uma array contendo numeros ainda não usados.
	function NumberosDisponiveis(MyArray){
		var Numeros = new Array();
		//Criação de Array com numeros aindas disponiveis para sorteio.
		for(var i=0;i<10;i++){
			if(!NumRepeat(i)){
				Numeros.push(i);
			}			
		}

		//Descubro se o numero ja esta em uso.
		//TRUE = Existe, FALSE=Pode ser usado.
		function NumRepeat(Num){
			var letra;
			for(var j=0;j<Texto.length;j++){
				letra = Texto.substring(j, j+1);
				if(MyArray[letra]==Num){
					return true;
				}
			}
			return false;
		}
		return Numeros;
	}

	//Esta função cria um grafico de aptidão, quanto maior mais chance de ser selecionado pela roleta!
	function PaisSelect(){
		if(Torneio!=null || Torneio<0){
			var grafico = new Array(),
			obj;
			//Vamos andar e verificar a qualidade de todos.
			for(var i=0,ArrayNumb= new Array();i<Cidade.length;i++){
				//Aqui vemos ver se ja não foi atribuido essa qualidade ao grafo.
				if(ArrayNumb[Cidade[i].qualidade]!=true){
					ArrayNumb[Cidade[i].qualidade]=true;
					//	---- EXEMPLO ----
					//Qualidade:40 && grafico=0, então de de grafico[0] a grafico[40] e adicionado a qualidade 40.
					for(var cont =0; cont<Cidade[i].qualidade;cont++){
						grafico[grafico.length]=Cidade[i].qualidade;
						cont++;
					}
				}
			}
			
			//Sorteamos uma posição no grafico, lembrando que essa posição contem a qualidade que precisamos!
			var qualidade =RandInt(0,grafico.length);
			qualidade = grafico[qualidade];

			//Cidade aonde ira conter os pais com a qualidade selecionada!
			var CidadeTemp = new Array();
			for(var i=0;i<Cidade.length;i++){
				if(qualidade==Cidade[i].qualidade){
					CidadeTemp.push(new Object(Cidade[i]));
				}
			}
			

			//Sorteo os dois elmentos.
			qualidade = RandInt(0,CidadeTemp.length);
			obj = new Object(CidadeTemp[qualidade]);
		}else{
			var CidadeTemp= new Array(),
				obj= new Object();
			for(var i=0; i<Torneio;i++){
				CidadeTemp.push(Cidade[RandInt(0,Cidade.length)]);
			}
			for(var i =0; i<Torneio;i++){
				if(obj.aptidao<CidadeTemp[i].aptidao || obj.aptidao == null){
					obj = CidadeTemp[i];
				}
			}
		}
				
		//Retorno os pais que serão usados no cruzamento.
		return obj;
	}
}

//Encamilho para metodo de cruzamento de pais.
function MetodoCruzamento(){
    //Nivel+1 para sabermos que não são os pais, e um o fruto de um cruzamento do nivel 1.
	Nivel++;
	switch(MetodoCruzamen){
		case 1:
			KillError("-s [1:Não definido,2]");
			break;
		case 2:
			console.log("Cruzamento em andamento!");
			console.log("- Crossover PMX");
			console.log("- - Geração: "+Geracao);
			if(Torneio==1){
				console.log("- - - Torneio");
			}else{
				console.log("- - - Roleta");
			}
			while(Geracao>=0){
				Crossover_PMX();
				Geracao=Geracao-1;
			}
			break;
		default:
			KillError("-s [1,2]");
	}
	QualidadeCheck();
}

//Adicionamos o nivel de qualidade na frase.
function QualidadeCheck(){
	console.log("Avaliando pessoas!");
	var palavra1,
		palavra2,
		palavrafinal,
		resultado,
		caracter;
	for(var cont=0; cont < Cidade.length; cont++){
		palavra1=Sun1;
		palavra2=Sun2;
		palavrafinal = Result;
		if(Cidade[cont].soma == null){
			for(var cont2=0; cont2<Sun1.length; cont2++){
				caracter = Sun1[cont2];
				palavra1 = palavra1.replace(Sun1[cont2], Cidade[cont][caracter]);
			}
			for(var cont2=0; cont2<Sun2.length; cont2++){
				caracter = Sun2[cont2];
				palavra2 = palavra2.replace(Sun2[cont2], Cidade[cont][caracter]);
			}
			
			//Soma das palavras, e preciso converte para inteiro.
			palavra1 = parseInt(palavra1, 10);
			palavra2 = parseInt(palavra2, 10);
			resultado = palavra1+palavra2;
			Cidade[cont].soma = resultado;

			//Para que o .length funcione e consiga navegar pelos caracteres da soma, e necessario converte para String.
			resultado = String(resultado);

			//Caminhar por todos caracteres da soma.
			for(var cont2=0; cont2<resultado.length; cont2++){
				//Caminha por todos caracteres do texto (Ex: 15263 ira se torna 'dlsjqi')
				for(var cont3=0;cont3<Texto.length;cont3++){
					// Pelo o caractere vejo qual numero o representa, caso o numero seja o mesmo que eu esteja procurando, troco o numero pelo caractere.
					if(Cidade[cont][Texto[cont3]]==resultado[cont2]){
						resultado = resultado.replace(resultado[cont2], Texto[cont3]);
					}
				}
            }
            
            Cidade[cont].stexto = resultado;
            
			//saber % de acerto de cada palavra	+ Aptidão
			Cidade[cont] = new Object(AvaliacaoMetodo(Cidade[cont]));
			if(Cidade[cont].aptidao==0){
				KillError("RESULTADO ENCONTRADO");
			}
		}
	}


	function AvaliacaoMetodo(obj){
		var taxa_acerto=0,temp;
		switch(MetodoAvalicao){
			case 1:
				//(SEND+MORE)-MONEY
				//Pego a soma do alfabeto e subtraio menos a palavra MONEY gerada pelo alfabeto, verificar se ocorre a igualdade.
				//Caso taxa == 0, então encontramos o resultado!
				var letra,
					frase=Result;
				//Converte frase MONEY para 12546 usando o alfabeto da cidade.
				for (var cont=0; cont < frase.length; cont++){
					letra = frase.substring(cont, cont+1);
					if(obj[letra] != null){
						frase = frase.replace(letra,obj[letra]);
					}
				}
				frase = parseInt(frase, 10);
				obj.aptidao = frase - obj.soma;
				if(obj.aptidao<0){
					obj.aptidao = obj.aptidao*-1;
				}

				//Vamos força a finalização do programa, pois encontramos o resultado.
				obj.qualidade = parseInt((1/obj.aptidao)*10000);
				return obj;
				break;
            case 2:
                KillError(" -a [1,2:Não corrigido,3,4]");
				// SOMA DE BIT A BIT E SUBTRAÇÃO
				//Pego a soma do alfabeto e subtraio menos a palavra MONEY gerada pelo alfabeto, verificar se ocorre a igualdade.
				//Caso taxa == 0, então encontramos o resultado!
				var letra, frase=Result;
				//Converte frase MONEY para EX: 17892 usando o alfabeto da cidade.
				for (var cont=0; cont < frase.length; cont++){
					letra = frase.substring(cont, cont+1);
					frase = frase.replace(letra,Cidade[letra]);
				}
				//Somar bit a bit resultado da palavra MONEY.
				for (cont=0; cont < frase.length; cont++){
					taxa_acerto += parseInt(frase.substring(cont, cont+1), 10);
				}

				//Soma Cidade.soma BIT  a BIT
				temp=0;
				var cidade_soma = String(Cidade.soma);
				for (cont=0; cont < cidade_soma.length; cont++){
					temp += parseInt(cidade_soma.substring(cont, cont+1), 10);
				}

				//Obter diferença do desejado e do numero gerado.
				taxa_acerto = taxa_acerto - temp;
				if(taxa_acerto<0){
					taxa_acerto = taxa_acerto*-1;
				}

				//Verificar se este foi o melhor obtido!
				if(CidadeTOP.qualidade>taxa_acerto || CidadeTOP.qualidade==null){
					Cidade.qualidade = taxa_acerto;
					CidadeTOP = Cidade;
				}
				return Cidade;
				break;
			case 3:
				//METODO NÃO ENTENDIDO
				KillError(" -a [1,2,3:Não definido,4]");
				break;
            case 4:
                KillError(" -a [1,2,3,4:Não corrigido]");
				//METODO DE % DE IGUALDADE ENTRE O QUE ESPERAVA 
				//Comparar caractere por caractere e vejo a % de igualdade.
				//Caso chege a 100, encontramos nosso resultado.
				var resultado = Cidade.stexto;
				Cidade.aptidao = 0;
				for(var cont2=0; cont2<resultado.length; cont2++){
					if(resultado[cont2]==Result[cont2]){
						Cidade.aptidao = Cidade.aptidao+(1/Result.length)*100;
					}
				}

				//Verificar se este foi o melhor obtido!
				if(CidadeTOP.aptidao<Cidade.aptidao || CidadeTOP.aptidao==null){
					CidadeTOP = Cidade;
				}
				//Vamos força a finalização do programa, pois encontramos o resultado.
				if(Cidade.aptidao==100){
					KillError("RESULTADO ENCONTRADO");
				}else{
					Cidade.qualidade = Cidade.aptidao;
				}
				return Cidade;
				break;
			default:
				KillError(" -a [1,2,3:Não definido,4]");
		}
	}
}

//Criamos a primeira cidade com pessoas, resultado dela sera um objeto com todas pessoas geradas.
//Primeira geração e aleatoria, vamos na sorte.
function PreencherCidade(){
	console.log("Preenchendo cidade com pessoas sorteadas!");
	var cont,
		obj,
		checknum,
        temp,
        p=Populacao;
    do{
        cont=0;
        obj=new Object();
		checknum=new Array();
        while(cont < Texto.length){
            temp = RandInt(0,10);
            if(checknum[temp]==null){
                obj[Texto[cont]]=temp;
                checknum[temp]=true;
                cont++;
                //console.log("Add: "+temp);
            }else{
                //console.log("Rep: "+temp);
            }
		}
        if(!AddPessoaCidade(obj)){
            p--;
        }
    }while(p!=0);
    QualidadeCheck();
}

//Função checa se não existe a mesma pessoa dentro da cidade.
function AddPessoaCidade(obj){
    obj = ConfigPessoa(obj);
    for(var cont=0, max =Cidade.length; cont<max ;cont++){
        if(PessoaEquals(Cidade[cont],obj)){
            //Existe uma pessoa igual a esta na cidade.
            return true;
        }
    }
	Cidade.push(new Object(obj));
    return false;
}

//Atribui os parametros comuns as pessoas.
function ConfigPessoa(obj){
	obj.mutacao = new Array();
	obj.qualidade=null;
	obj.aptidao=null;
	obj.soma=null;
	obj.stexto=null;
	obj.nivel=Nivel;
	return obj;
}

//Remove caracteres inuteis + repetição.
function TratamentoTexto(Texto){
	var cont=0,letra,frase;
	Texto = Texto.replace("+", "");
	Texto = Texto.replace("=", "");
	while(cont <= Texto.length){
		letra = Texto.substring(cont, cont+1);
		frase = Texto.replace(letra, "");
		Texto = letra+frase.replace(letra, "");
		cont++;
	}
	return Texto;
}

//Extrair paramentros.
function GET_$(parment){
	parment = "-"+parment;
	var cont,
		temp=null,
		args = process.argv.slice(2);
	for(cont=0;cont<args.length && temp==null;cont+=2){
		if(args[cont]==parment){
			temp = args[cont+1];
		}
	}
	return temp;
}

//Função para sortear numero. (Max:Valor maximo) (min:Valor minimo).
function RandInt(min,max){
	return Math.floor(Math.random() * max) + min;
}

//Finaliza execução caso seja encontrado um error, entrada mensagem de erro.
function KillError(msg){
	MelhorResult();
	console.log('\x1b[33m%s\x1b[0m',"!!!!!----------   EXECUÇÃO FINALIZADA   ----------!!!!!");
	console.log(msg);
	process.exit();
}

//Função compara dois objetos, so pode ser usada para pessoas com pessoas.
function PessoaEquals(obj1,obj2){
	var letra;
	for(var cont=0; cont<Texto.length; cont++){
		letra = Texto.substring(cont, cont+1);
		if(obj1[letra]!=obj2[letra]){
			return false;
		}
    }
    //Loop terminado, então os dados são iguais!
	return true;
}

//Imprime na tela o melhor resultado.
function MelhorResult(){
	console.info(Cidade);
	var CidadeTOP = new Object();
    for(var cont=0;cont<Cidade.length;cont++){
        if(CidadeTOP.aptidao>Cidade[cont].aptidao || CidadeTOP.aptidao == null){
            CidadeTOP = new Object(Cidade[cont]);
        }
    }
	console.log("Individuo mais qualificado:");
	console.info(CidadeTOP);
	console.log("Nº Pessoas: "+Cidade.length);
}
