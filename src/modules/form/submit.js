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

// 1. Define a *função* de submit (sem anexá-la ao window)
const handleFormSubmit = async (event) => {
  event.preventDefault();

  // O "Lock" (para cliques duplos rápidos)
  if (form.dataset.submitting === "true") {
    return;
  }
  form.dataset.submitting = "true";

  try {
    // --- Lógica de Validação ---
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
    // --- Fim da Validação ---

    const hourValue = selectedRadio.value;
    const [hour] = hourValue.split(":");
    const when = dayjs(selectedDate.value).add(hour, "hour");
    const id = String(new Date().getTime());

    await scheduleNew({
      id,
      name,
      when: when.toISOString(),
    });

    alert("Agendamento realizado com sucesso!!"); // <-- SÓ VAI APARECER 1X

    // --- Lógica de UI Otimista ---
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
    if (hourNumber < 12) { // Manhã
      periodMorning.appendChild(item);
    } else if (hourNumber >= 12 && hourNumber < 18) { // Tarde
      periodAfternoon.appendChild(item);
      S
    } else { // Noite
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
    // Libera o lock
    setTimeout(() => {
      form.dataset.submitting = "false";
    }, 300);
  }
}

// --- INÍCIO DA CORREÇÃO DEFINITIVA (Controle de Referência do HMR) ---

// 2. Verifica se JÁ EXISTE uma função de submit antiga no 'window'
if (window.currentSubmitHandler) {
  // Se sim, remove o LISTENER ANTIGO (usando a referência salva)
  console.log("HMR detectado: Removendo listener de submit antigo...");
  form.removeEventListener("submit", window.currentSubmitHandler);
}

// 3. Anexa o NOVO listener
console.log("Anexando novo listener de submit...");
form.addEventListener("submit", handleFormSubmit);

// 4. GUARDA a referência da função que ACABAMOS de anexar
//    para que possamos removê-la na PRÓXIMA recarga do HMR.
window.currentSubmitHandler = handleFormSubmit;

// --- FIM DA CORREÇÃO ---