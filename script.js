// Modo visualização: esconde o formulário de edição
import { db, collection, addDoc, getDocs, deleteDoc, doc } from "./firebase.js";

const form = document.getElementById("agendaForm");
const lista = document.getElementById("listaTrabalhos");

// Se existir formulário, esconde
if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const novoTrabalho = {
            nome: document.getElementById("trabalho").value,
            data: document.getElementById("data").value,
            materia: document.getElementById("materia").value,
            professor: document.getElementById("professor").value
        };

        await addDoc(collection(db, "trabalhos"), novoTrabalho);

        renderizarLista();
        form.reset();
    });
}

function calcularDiasRestantes(dataEntrega) {
    const hoje = new Date();
    const data = new Date(dataEntrega);

    // Zera horas para cálculo mais preciso
    hoje.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);

    const diferenca = data - hoje;
    const dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

    return dias;
}
function formatarDataBR(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
}
async function renderizarLista() {
    lista.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "trabalhos"));

    const trabalhos = [];

    querySnapshot.forEach((documento) => {
        trabalhos.push({
            id: documento.id,
            ...documento.data()
        });
    });

    // 🔥 Ordena por data (mais perto de vencer primeiro)
    trabalhos.sort((a, b) => new Date(a.data) - new Date(b.data));

    // Agora renderiza já ordenado
    trabalhos.forEach((trabalho) => {
        const diasRestantes = calcularDiasRestantes(trabalho.data);

        const li = document.createElement("li");

        let statusTexto = "";
        let cor = "";

        if (diasRestantes > 3) {
            statusTexto = `⏳ Faltam ${diasRestantes} dias`;
            cor = "green";
        } else if (diasRestantes >= 0) {
            statusTexto = `⚠ Faltam ${diasRestantes} dias`;
            cor = "orange";
        } else {
            statusTexto = `❌ Atrasado há ${Math.abs(diasRestantes)} dias`;
            cor = "red";
        }

        li.innerHTML = `
    <strong>${trabalho.nome}</strong><br>
    📅 Entrega: ${formatarDataBR(trabalho.data)}<br>
    📚 Matéria: ${trabalho.materia}<br>
    👨‍🏫 Professor: ${trabalho.professor}<br>
    <span style="color:${cor}; font-weight:bold;">
      ${statusTexto}
    </span><br>
  `;

        lista.appendChild(li);
    });

    const diasRestantes = calcularDiasRestantes(trabalho.data);

    const li = document.createElement("li");

    let statusTexto = "";
    let cor = "";

    if (diasRestantes > 3) {
        statusTexto = `⏳ Faltam ${diasRestantes} dias`;
        cor = "green";
    }
    else if (diasRestantes >= 0) {
        statusTexto = `⚠ Faltam ${diasRestantes} dias`;
        cor = "orange";
    }
    else {
        statusTexto = `❌ Atrasado há ${Math.abs(diasRestantes)} dias`;
        cor = "red";
    }

    li.innerHTML = `
            <strong>${trabalho.nome}</strong><br>
            📅 Entrega: ${formatarDataBR(trabalho.data)}<br>
            📚 Matéria: ${trabalho.materia}<br>
            👨‍🏫 Professor: ${trabalho.professor}<br>
            <span style="color:${cor}; font-weight:bold;">
                ${statusTexto}
            </span><br>
        `;

    lista.appendChild(li);
};

const todoList = document.getElementById("todoList");

async function carregarTodoList() {
    todoList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "trabalhos"));
    // ⬆️ usa o MESMO nome da coleção que você usa no admin.js

    querySnapshot.forEach((doc) => {
        const dados = doc.data();

        const li = document.createElement("li");
        li.classList.add("todo-item");

        li.innerHTML = `
      <strong>${dados.titulo || dados.nome}</strong>
      <div class="todo-details">
        <small>📅 ${dados.data || ""} ${dados.hora || ""}</small>
      </div>
    `;

        li.addEventListener("click", () => {
            li.classList.toggle("expanded");
        });

        todoList.appendChild(li);
    });
}

carregarTodoList();

async function removerTrabalho(id) {
    try {
        await deleteDoc(doc(db, "trabalhos", id));
        await renderizarLista();
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o trabalho.");
    }
}

renderizarLista();