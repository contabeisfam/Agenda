import { db, collection, addDoc, getDocs, deleteDoc, doc } from "./firebase.js";
const form = document.getElementById("agendaForm");
const lista = document.getElementById("listaTrabalhos");

// 🔐 BLOQUEIO DE ACESSO
const senhaCorreta = "0305";
const senha = prompt("Digite a senha para acessar:");

if (senha !== senhaCorreta) {
    form.style.display = "none";
    alert("Acesso restrito! Você só pode visualizar.");
}


function calcularDiasRestantes(dataEntrega) {
    const hoje = new Date();
    const data = new Date(dataEntrega);

    // Zera horas para cálculo mais preciso
    hoje.setHours(0,0,0,0);
    data.setHours(0,0,0,0);

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

    querySnapshot.forEach((documento) => {
        const trabalho = documento.data();
        const id = documento.id;

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
            <button onclick="removerTrabalho('${id}')">Excluir</button>
        `;

        lista.appendChild(li);
    });
}

async function removerTrabalho(id) {
    try {
        await deleteDoc(doc(db, "trabalhos", id));
        await renderizarLista();
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o trabalho.");
    }
}

form.addEventListener("submit", async function(e) {
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

renderizarLista();