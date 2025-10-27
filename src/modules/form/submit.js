import dayjs from "dayjs";
import { scheduleNew } from "../../services/schedule-new.js";

// Seleciona os elementos (como antes)
const periodMorning = document.getElementById("period-morning");
const periodAfternoon = document.getElementById("period-afternoon");
const periodNight = document.getElementById("period-night");

const form = document.querySelector("form");
const clientName = document.getElementById("client");
const selectedDate = document.getElementById("date");

const inputToday = dayjs(new Date()).format("YYYY-MM-DD");
selectedDate.value = inputToday;
selectedDate.min = inputToday;


// --- INÍCIO DA CORREÇÃO (Alerta Duplo) ---

// 1. Criamos a função de 'submit' separadamente
const handleFormSubmit = async (event) => {
  event.preventDefault(); // Previne o envio (como antes)

  try {
    // Toda a sua lógica de validação e submit (exatamente como estava)
    const name = clientName.value.trim();
    if (!name) {
      return alert("Informe o nome do cliente");
    }

    const selectedRadio = document.querySelector("input[name='hour']:checked");
    if (!selectedRadio) {
      return alert("Selecione o horário!!");
    }

    const hourValue = selectedRadio.value;
    const [hour] = hourValue.split(":");
    const when = dayjs(selectedDate.value).add(hour, "hour");
    const id = String(new Date().getTime());

    // 1. Faz o agendamento
    await scheduleNew({
      id,
      name,
      when: when.toISOString(),
    });

    // 2. Mostra o alerta de sucesso (APENAS UMA VEZ)
    alert("Agendamento realizado com sucesso!!");

    // 3. Lógica de "UI Otimista" (exatamente como estava)
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

    const hourNumber = dayjs(when).hour();
    if (hourNumber <= 12) {
      periodMorning.appendChild(item);
    } else if (hourNumber > 12 && hourNumber <= 18) {
      periodAfternoon.appendChild(item);
    } else {
      periodNight.appendChild(item);
    }

    // 4. Limpa o input
    clientName.value = "";

  } catch (error) {
    alert("Não foi possível realizar o agendamento");
    console.log(error);
  }
}

// 2. A "Guarda" (Flag)
// Só adiciona o 'listener' se ele ainda não foi adicionado
if (!form.dataset.submitListenerAttached) {
  form.addEventListener("submit", handleFormSubmit);

  // 3. Marcamos o formulário para que o 'listener' não seja adicionado de novo
  form.dataset.submitListenerAttached = "true";
}

// --- FIM DA CORREÇÃO ---