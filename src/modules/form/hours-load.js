import { openingHours } from "./../../utils/opening-hours.js";
import dayjs from "dayjs";

const hours = document.getElementById("hours");

export function hoursLoad({ date, dailySchedules }) {

  function hourHeaderAdd(title) {
    const header = document.createElement("h3");
    header.classList.add("hour-period");
    header.id = `period-${title.toLowerCase()}`;
    header.textContent = title;
    hours.append(header);
  }

  try {
    hours.innerHTML = "";

    const unavailableHours = dailySchedules.map((schedule) =>
      dayjs(schedule.when).format("HH:mm")
    );

    const opening = openingHours.map((hour) => {
      const [scheduleHour] = hour.split(":");
      const isHourPast = dayjs(date).add(scheduleHour, "hour").isBefore(dayjs());
      const available = !unavailableHours.includes(hour) && !isHourPast;

      return {
        hour,
        available,
      };
    });

    let isFirstAvailableFound = false;

    // --- INÍCIO DA RESTRUTURAÇÃO (forEach) ---
    opening.forEach(({ hour, available }) => {
      if (hour === "9:00") {
        hourHeaderAdd("Manhã");
      } else if (hour === "13:00") {
        hourHeaderAdd("Tarde");
      } else if (hour === "18:00") {
        hourHeaderAdd("Noite");
      }

      // 1. Cria o <label> (que é o "botão" e o container)
      // Note que removemos a 'for', pois o input estará DENTRO.
      const labelContainer = document.createElement('label');

      // 2. Adiciona as classes de estilo ao LABEL (seu '.hour' e '.hour-available')
      labelContainer.classList.add("hour");
      labelContainer.classList.add(available ? "hour-available" : "hour-unavailable");

      // 3. Cria o <input type="radio"> (O CÉREBRO)
      const radioInput = document.createElement('input');
      radioInput.type = 'radio';
      radioInput.name = 'hour';
      radioInput.value = hour;
      radioInput.className = 'hour-radio'; // A classe que vamos esconder

      // 4. Cria o <span> para o texto visível (ex: "16:00")
      const hourText = document.createElement('span');
      hourText.className = 'hour-text'; // Damos uma classe para o texto
      hourText.textContent = hour;

      // 5. Adiciona o 'tabindex' (Nossa lógica antiga, que estava correta)
      radioInput.tabIndex = -1; // Padrão

      // 6. Lógica de 'disabled' e 'tabindex="0"'
      if (!available) {
        radioInput.disabled = true;
        labelContainer.setAttribute("aria-disabled", "true");
      }
      else if (!isFirstAvailableFound) {
        radioInput.tabIndex = 0; // Marca como ponto de entrada
        isFirstAvailableFound = true;
      }

      // 7. Monta a estrutura:
      labelContainer.appendChild(radioInput); // <input> dentro do <label>
      labelContainer.appendChild(hourText);   // <span> dentro do <label>

      // 8. Adiciona o <label> (container) ao <div> 'hours'
      hours.append(labelContainer);

      // --- FIM DA RESTRUTURAÇÃO ---
    });

  } catch (error) {
    alert("Ocorreu um erro ao renderizar os blocos de horários.");
    console.error("Erro detalhado em hoursLoad:", error);
  }
}