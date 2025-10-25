import dayjs from "dayjs";

// Seleciona as sessões manhã, tarde e noite
const periodMorning = document.getElementById("period-morning");
const periodAfternoon = document.getElementById("period-afternoon");
const periodNight = document.getElementById("period-night");

export function schedulesShow({ dailySchedules }) {
  try {
    // Limpa as listas
    periodMorning.innerHTML = "";
    periodAfternoon.innerHTML = "";
    periodNight.innerHTML = "";

    // Renderiza os agendamentos por período.
    dailySchedules.forEach((schedule) => {
      const item = document.createElement("li");
      const time = document.createElement("strong");
      const name = document.createElement("span");

      // Adiciona o id do agendamento.
      item.setAttribute("data-id", schedule.id);

      time.textContent = dayjs(schedule.when).format("HH:mm");
      name.textContent = schedule.name;

      // --- Início da Alteração de Acessibilidade ---

      // 1. Cria o <button>
      const cancelButton = document.createElement("button");
      cancelButton.classList.add("cancel-button"); // Classe para estilizar o botão

      // 2. Cria o aria-label dinâmico para o botão
      cancelButton.setAttribute(
        "aria-label",
        `Cancelar agendamento de ${schedule.name} às ${time.textContent}`
      );

      // 3. Cria o ícone <img>
      const cancelIcon = document.createElement("img");
      cancelIcon.classList.add("cancel-icon");
      cancelIcon.setAttribute("src", "./src/assets/cancel.svg");

      // 4. Define o 'alt' da imagem como vazio (decorativo)
      cancelIcon.setAttribute("alt", "");

      // 5. Adiciona o ícone DENTRO do botão
      cancelButton.appendChild(cancelIcon);

      // --- Fim da Alteração ---

      // Adiciona o tempo, nome e o NOVO BOTÃO no item.
      item.append(time, name, cancelButton);

      // Obtém somente a hora.
      const hour = dayjs(schedule.when).hour();

      // Renderiza o agendamento na sessão(manhã, tarde ou noite).
      if (hour <= 12) {
        periodMorning.appendChild(item);
      } else if (hour > 12 && hour <= 18) {
        periodAfternoon.appendChild(item);
      } else {
        periodNight.appendChild(item);
      }
    })

  } catch (error) {
    alert("Não foi possível exibir os agendamentos");
    console.log(error);
  }
}