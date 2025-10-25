import { schedulesDay } from "./load.js";
import { scheduleCancel } from "../../services/schedule-cancel.js";

const periods = document.querySelectorAll(".period");

// Gera evento de click para cada lista (manhã, tarde e noite).

periods.forEach((period) => {
  // Captura o evento do click na lista.
  period.addEventListener("click", async (event) => { 
    if (event.target.classList.contains("cancel-icon"));
    // Obtém a li pai do elemento clicado.
    const item = event.target.closest("li");

    // Pega o id do agendamento para remover.
    const { id } = item.dataset;

    //Confirma se o usuário quer cancelar.
    if (id) { 
      const isConfirm =
        confirm("Tem certeza que desejar cancelar o agendamento?");
      
      if (isConfirm) {
        console.log("REMOVER")
        // Faz a requisição na API para cancelar e recarrega os agendamentos.
        await scheduleCancel({ id })
        schedulesDay();
      }
    }
  })
})