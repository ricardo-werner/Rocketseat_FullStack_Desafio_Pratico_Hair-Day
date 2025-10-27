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

// --- INÍCIO DA CORREÇÃO (Alerta Duplo com "Lock") ---

// 1. O "Lock" (trava). Começa destravado.
let isSubmitting = false;

const handleFormSubmit = async (event) => {
  event.preventDefault(); 

  // 2. Verifica a trava
  if (isSubmitting) {
    console.warn("Submit já em progresso. Ignorando chamada duplicada.");
    return; // Sai imediatamente se já estiver enviando
  }

  // 3. Ativa a trava
  isSubmitting = true;

  try {
    // ... toda a sua lógica de validação e submit (exatamente como estava) ...
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

  } catch(error) {
    alert("Não foi possível realizar o agendamento");
    console.log(error);
  } finally {
    // 4. Desativa a trava (no 'finally', para garantir que rode mesmo se der erro)
    // Usamos um pequeno timeout para evitar cliques/submits duplos muito rápidos
    setTimeout(() => {
      isSubmitting = false;
    }, 300); // 300 milissegundos
  }
}

// 5. Anexamos o listener (removemos a guarda do 'dataset' que não funcionou)
form.addEventListener("submit", handleFormSubmit);

// --- FIM DA CORREÇÃO ---