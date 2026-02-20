import { db, collection, addDoc, getDocs, deleteDoc, doc } from "./firebase.js";

// Elementos
const loginDiv = document.getElementById("loginDiv");
const adminDiv = document.getElementById("adminDiv");
const btnLogin = document.getElementById("btnLogin");
const msgLogin = document.getElementById("msgLogin");

const form = document.getElementById("agendaForm");
const lista = document.getElementById("listaTrabalhos");

// Usuário e senha (pode mudar para Firebase Auth depois)
const USUARIO = "felipe";
const SENHA = "0305";

// Função de login
btnLogin.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if(email === USUARIO && senha === SENHA) {
        loginDiv.style.display = "none";
        adminDiv.style.display = "block";
        renderizarLista();
    } else {
        msgLogin.textContent = "Email ou senha incorretos!";
    }
});

// Função de formatação de data
function formatarDataBR(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
}

// Renderizar lista
async function renderizarLista() {
    lista.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "trabalhos"));

    querySnapshot.forEach((documento) => {
        const trabalho = documento.data();
        const id = documento.id;
        const diasRestantes = calcularDiasRestantes(trabalho.data);

        let statusTexto = "";
        let cor = "";

        if(diasRestantes > 3) { statusTexto = `⏳ Faltam ${diasRestantes} dias`; cor = "green"; }
        else if(diasRestantes >= 0) { statusTexto = `⚠ Faltam ${diasRestantes} dias`; cor = "orange"; }
        else { statusTexto = `❌ Atrasado há ${Math.abs(diasRestantes)} dias`; cor = "red"; }

        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${trabalho.nome}</strong><br>
            📅 Entrega: ${formatarDataBR(trabalho.data)}<br>
            📚 Matéria: ${trabalho.materia}<br>
            👨‍🏫 Professor: ${trabalho.professor}<br>
            <span style="color:${cor}; font-weight:bold;">${statusTexto}</span><br>
            <button onclick="removerTrabalho('${id}')">Excluir</button>
        `;
        lista.appendChild(li);
    });
}

// Adicionar trabalho
form.addEventListener("submit", async (e) => {
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

// Remover trabalho
async function removerTrabalho(id) {
    await deleteDoc(doc(db, "trabalhos", id));
    renderizarLista();
}
window.removerTrabalho = removerTrabalho;

// Calcular dias restantes
function calcularDiasRestantes(dataEntrega) {
    const hoje = new Date();
    const data = new Date(dataEntrega);
    hoje.setHours(0,0,0,0);
    data.setHours(0,0,0,0);
    const diferenca = data - hoje;
    return Math.ceil(diferenca / (1000*60*60*24));
}
