/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async (route_name, myTable) => {
  let url = 'http://127.0.0.1:5000/' + route_name;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(`data: ${JSON.stringify(data['tecnicas'])}`);
      //data.tecnicas.forEach(item => insertList(item.nome, item.descricao, item.nivel, item.video))
      data[route_name].forEach(item => insertList(item, myTable, route_name))
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
getList('tecnicas', 'myTableTecnica');

getList('alunos', 'myTableAlunos');


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/

const postItem = async (item_obj, route_name, myTable) => {

  item_keys = Object.keys(item_obj);
  item_values = Object.values(item_obj);

  const formData = new FormData();

  for (let [key, value] of Object.entries(item_obj)) {
    console.log(`key: ${key} value: ${value}`);
    formData.append(key, value);
  }

  let url = 'http://127.0.0.1:5000/' + route_name;
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => {
      if (response.status === 200) {
        insertList(item_obj, myTable, route_name);
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
const removeElement = (route_name) => {
  let close = document.getElementsByClassName("close");
  let i;

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(route_name, nomeItem)
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
const deleteItem = (route_name, item) => {
  console.log(item)

  let url = 'http://127.0.0.1:5000/' + route_name + '?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

const getNivelValue = (newNivel) => {
  var radio_btns = document.getElementsByName(newNivel), i;
  for (i = 0; i < radio_btns.length; i++)
    if (radio_btns[i].checked)
      return radio_btns[i].value;
  return null;
}

const getItemObj = (route_name, ...args) => {
  if (route_name === 'tecnica') {
    return ({
      'nome': document.getElementById(args[0]).value,
      'descricao': document.getElementById(args[1]).value,
      'nivel': getNivelValue(args[2]),
      'video': document.getElementById(args[3]).value
    });
  } else if (route_name === 'aluno') {
    return ({
      'nome': document.getElementById(args[0]).value,
      'data_de_nascimento': document.getElementById(args[1]).value,
      'data_de_inicio': document.getElementById(args[2]).value,
      'graduacao': document.getElementById(args[3]).value
    });

  } else {
    console.log('Unknown item type!')
  }

}


/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item em uma tabela especifica
  --------------------------------------------------------------------------------------
*/
const newItem = (route_name, myTable, ...args) => {
  console.log(`In newItem. route_name: ${route_name} myTable:${myTable} args:${args}`)

  const item_obj = getItemObj(route_name, ...args);

  console.log(`In newItem. item_obj: ${JSON.stringify(item_obj)}`)

  if (args[0] === '') {
    alert("Escreva o nome da entrada!");
  } else {

    postItem(item_obj, route_name, myTable)
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar campos de entrada no formulário
  --------------------------------------------------------------------------------------
*/

const clearInputFields = (myTable) => {

  console.log(`myTable: ${myTable}`)

  if (myTable === 'myTableTecnica') {
    document.getElementById("newTecnica").value = "";
    document.getElementById("newDescricao").value = "";
    document.getElementsByName("newNivel")[0].checked = true;
    document.getElementById("newVideo").value = "";
  } else if (myTable === 'myTableAluno') {

  } else {
    console.log('Unknow item type');
  }

}


/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/

const insertList = (item_obj, myTable, route_name) => {
  var item = Object.values(item_obj);

  var table = document.getElementById(myTable);
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1));

  clearInputFields(myTable);

  removeElement(route_name);
}

const setTab = (tab_content, tab_button) => {

  const tabcontents = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }

  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }


  tab_content.style.display = "block";
  tab_button.classList.add("active");

}

const newTecnicaTab = document.getElementById("newTecnica_tab");
const newTecnicaContent = document.getElementById("newTecnica_content");

const newAlunoTab = document.getElementById("newAluno_tab");
const newAlunoContent = document.getElementById("newAluno_content");


newTecnicaTab.addEventListener("click", () => {
  setTab(newTecnicaContent, newTecnicaTab);
});

newAlunoTab.addEventListener("click", () => {
  setTab(newAlunoContent, newAlunoTab);
});

newTecnicaTab.click();