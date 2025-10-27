import dayjs from "dayjs";

import { scheduleNew } from "../../services/schedule-new.js";
// import { schedulesDay } from "../schedules/load.js"; // NÃO PRECISAMOS MAIS DISSO

// --- NOVA ADIÇÃO ---
// Precisamos ter acesso às listas para adicionar o novo item
const periodMorning = document.getElementById("period-morning");
const periodAfternoon = document.getElementById("period-afternoon");
const periodNight = document.getElementById("period-night");
// --- FIM DA NOVA ADIÇÃO ---

const form = document.querySelector("form");
const clientName = document.getElementById("client");
const selectedDate = document.getElementById("date");

const inputToday = dayjs(new Date()).format("YYYY-MM-DD");
selectedDate.value = inputToday;
selectedDate.min = inputToday;

form.onsubmit = async (event) => {
  event.preventDefault();

  try {
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

    // 1. Faz o agendamento (o POST para a API)
    await scheduleNew({
      id,
      name,
      when: when.toISOString(), // Garante que 'when' é uma string
    });

    // 2. Mostra o alerta de sucesso (como antes)
    alert("Agendamento realizado com sucesso!!");

    // --- INÍCIO DA LÓGICA DE "UI OTIMISTA" ---
    // 3. Em vez de recarregar, criamos o <li> manualmente

    const item = document.createElement("li");
    const time = document.createElement("strong");
    const nameSpan = document.createElement("span"); // Renomeado de 'name' para 'nameSpan'

    item.setAttribute("data-id", id);
    time.textContent = dayjs(when).format("HH:mm");
    nameSpan.textContent = name;

    // Cria o botão de cancelar (lógica que fizemos para o schedulesShow)
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

    // Adiciona tudo ao item <li>
    item.append(time, nameSpan, cancelButton);

    // Adiciona o <li> na lista correta (Manhã, Tarde ou Noite)
    const hourNumber = dayjs(when).hour(); // Pega a hora (número)

    if (hourNumber <= 12) {
      periodMorning.appendChild(item);
    } else if (hourNumber > 12 && hourNumber <= 18) {
      periodAfternoon.appendChild(item);
    } else {
      periodNight.appendChild(item);
    }
    // --- FIM DA LÓGICA ---

    // 4. Limpa o input do cliente (como antes)
    clientName.value = "";

  } catch (error) {
    alert("Não foi possível realizar o agendamento");
    console.log(error);
  }
}