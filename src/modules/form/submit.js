import dayjs from "dayjs";
import { scheduleNew } from "../../services/schedule-new.js";

// Seleciona os elementos
const periodMorning = document.getElementById("period-morning");
const periodAfternoon = document.getElementById("period-afternoon");
const periodNight = document.getElementById("period-night");

const form = document.querySelector("form");
const clientName = document.getElementById("client");
const selectedDate = document.getElementById("date");

const inputToday = dayjs(new Date()).format("YYYY-MM-DD");
selectedDate.value = inputToday;
selectedDate.min = inputToday;


const handleFormSubmit = async (event) => {
  event.preventDefault();

  // 1. Verifica o "lock" global. Se estiver "true", sai imediatamente.
  if (form.dataset.submitting === "true") {
    console.warn("Submit já em progresso. Ignorando chamada duplicada.");
    return;
  }

  // 2. Ativa o "lock".
  form.dataset.submitting = "true";

  try {
    // --- INÍCIO DA VALIDAÇÃO ---
    // (Movemos a liberação do lock para DENTRO da validação)

    const name = clientName.value.trim();
    if (!name) {
      alert("Informe o nome do cliente");
      form.dataset.submitting = "false"; // Libera o lock
      return;
    }

    const selectedRadio = document.querySelector("input[name='hour']:checked");
    if (!selectedRadio) {
      alert("Selecione o horário!!");
      form.dataset.submitting = "false"; // Libera o lock
      return;
    }

    // --- FIM DA VALIDAÇÃO ---

    const hourValue = selectedRadio.value;
    const [hour] = hourValue.split(":");
    const when = dayjs(selectedDate.value).add(hour, "hour");
    const id = String(new Date().getTime());

    await scheduleNew({
      id,
      name,
      when: when.toISOString(),
    });

    alert("Agendamento realizado com sucesso!!");

    const item = document.createElement("li");
    const time = document.createElement("strong");
    const nameSpan = document.createElement("span");

    item.setAttribute("data-id", id);
    time.textContent = dayjs(when).format("HH:mm");
    nameSpan.textContent = name;

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("cancel-button");
    cancelButton.setAttribute(
      "aria-label",
      `Cancelar agendamento de ${name} às ${time.textContent}`
    );

    const cancelIcon = document.createElement("img");
    cancelIcon.classList.add("cancel-icon");
    cancelIcon.setAttribute("src", "./src/assets/cancel.svg");
    cancelIcon.setAttribute("alt", "");
    cancelButton.appendChild(cancelIcon);

    item.append(time, nameSpan, cancelButton);

    // --- CORREÇÃO DA LÓGICA DO `hourNumber` ---
    const hourNumber = dayjs(when).hour();
    if (hourNumber < 12) { // Manhã (até 11:59)
      periodMorning.appendChild(item);
    } else if (hourNumber >= 12 && hourNumber < 18) { // Tarde (12:00 - 17:59)
      periodAfternoon.appendChild(item);
    } else { // Noite (18:00 em diante)
      periodNight.appendChild(item);
    }
    // --- FIM DA CORREÇÃO ---

    // Limpa o formulário
    clientName.value = "";
    selectedRadio.checked = false;

  } catch (error) {
    alert("Não foi possível realizar o agendamento");
    console.log(error);
  } finally {
    // 3. Desativa o "lock" global (agora o 'finally' funciona)
    // Os 'returns' da validação já liberam o lock.
    // Este 'finally' libera o lock em caso de SUCESSO ou ERRO.
    setTimeout(() => {
      form.dataset.submitting = "false";
    }, 300);
  }
}

// Anexamos o listener (A lógica de 'guarda' anterior foi removida)
form.addEventListener("submit", handleFormSubmit);