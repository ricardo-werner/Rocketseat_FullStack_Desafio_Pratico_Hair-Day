import { schedulesDay } from "./load.js";
import { scheduleCancel } from "../../services/schedule-cancel.js";

const periods = document.querySelectorAll(".period");

// Gera evento de click para cada lista (manhã, tarde e noite).
periods.forEach((period) => {
  period.addEventListener("click", async (event) => {

    // --- INÍCIO DA CORREÇÃO ---
    // 1. Procura pelo BOTÃO mais próximo de onde o usuário clicou.
    // Isso funciona se ele clicar no <button> ou no <img> dentro dele.
    const cancelButton = event.target.closest(".cancel-button");

    // 2. Se o clique não foi em um botão de cancelar, ignora.
    if (!cancelButton) {
      return;
    }

    // 3. Obtém o <li> pai do BOTÃO.
    const item = cancelButton.closest("li");

    // 4. Pega o id (que agora é uma string) do dataset.
    const { id } = item.dataset;
    // --- FIM DA CORREÇÃO ---

    //Confirma se o usuário quer cancelar.
    if (id) {
      const isConfirm = confirm("Tem certeza que desejar cancelar o agendamento?");

      if (isConfirm) {
        console.log("REMOVER", id);
        // Faz a requisição na API para cancelar e recarrega os agendamentos.
        await scheduleCancel({ id }); // 'id' aqui é uma string
        schedulesDay();
      }
    }
  });
});