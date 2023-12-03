/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/tecnicas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.tecnicas.forEach(item => insertList(item.nome, item.descricao, item.nivel, item.video))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputTecnica, inputDescricao, inputNivel, inputVideo) => {
  console.log(`POSTITEM`);
  console.log(`inputTecnica: ${inputTecnica}`);
  console.log(`inputDescricao: ${inputDescricao}`);
  console.log(`inputNivel: ${inputNivel}`);
  console.log(`inputVideo: ${inputVideo}`);


  const formData = new FormData();
  formData.append('nome', inputTecnica);
  formData.append('descricao', inputDescricao);
  formData.append('nivel', inputNivel);
  formData.append('video', inputVideo);

  // List key/value pairs
  for (let [name, value] of formData) {
    console.log(`${name} = ${value}`); // key1 = value1, then key2 = value2
  }

  let url = 'http://127.0.0.1:5000/tecnica';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => {
      if (response.status === 200) {
        insertList(inputTecnica, inputDescricao, inputNivel, inputVideo);
        alert("Tecnica adicionada!");
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/tecnica?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, descricao, nivel e video 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputTecnica = document.getElementById("newTecnica").value;
  let inputDescricao = document.getElementById("newDescricao").value;
  let inputNivel = document.getElementById("newNivel").value;
  let inputVideo = document.getElementById("newVideo").value;

  console.log(`NEWITEM`);
  console.log(`inputTecnica: ${inputTecnica}`);
  console.log(`inputDescricao: ${inputDescricao}`);
  console.log(`inputNivel: ${inputNivel}`);
  console.log(`inputVideo: ${inputVideo}`);


  if (inputTecnica === '') {
    alert("Escreva o nome de uma tecnica!");
  } else {
    postItem(inputTecnica, inputDescricao, inputNivel, inputVideo);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nomeTecnica, descricao, nivel, video) => {
  var item = [nomeTecnica, descricao, nivel, video]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newTecnica").value = "";
  document.getElementById("newDescricao").value = "";
  document.getElementById("newNivel").value = "";
  document.getElementById("newVideo").value = "";

  removeElement()
}