import dayjs from "dayjs";

import { scheduleNew } from "../../services/schedule-new.js";
import { schedulesDay } from "../schedules/load.js";

const form = document.querySelector("form");
const clientName = document.getElementById("client");
const selectedDate = document.getElementById("date");

// Date atual para formatar o input.
const inputToday = dayjs(new Date()).format("YYYY-MM-DD");

//Carrega a data atual.
selectedDate.value = inputToday

// Define a data mínima como sendo a data atual.
selectedDate.min = inputToday;


form.onsubmit = async (event) => {
  event.preventDefault();

  try {
    // Recuperando o nome do cliente.
    const name = clientName.value.trim();

    if (!name) {
      return alert("Informe o nome do cliente");
    }

    // --- INÍCIO DA MUDANÇA (Seletor Mais Robusto) ---

    // 1. Recupera o *input* que está selecionado, procurando pelo ATRIBUTO 'name'.
    const selectedRadio = document.querySelector("input[name='hour']:checked");

    // 2. Verifica se algum rádio foi selecionado.
    if (!selectedRadio) {
      return alert("Selecione o horário!!") // Este é o alerta que você viu
    }

    // 3. Pega o valor (ex: "21:00") de dentro do rádio.
    const hourValue = selectedRadio.value

    // 4. Recupera somente a hora (ex: "21")
    const [hour] = hourValue.split(":");

    // --- FIM DA MUDANÇA ---


    //Insere a hora na data.
    const when = dayjs(selectedDate.value).add(hour, "hour");

    // Gera o ID como STRING
    const id = String(new Date().getTime());

    // Faz o agendamento.
    await scheduleNew({
      id,
      name,
      when,
    })

    // Recarrega os agendamentos e limpa o input do cliente.
    await schedulesDay();
    clientName.value = "";

  } catch (error) {
    alert("Não foi possível realizar o agendamento");
    console.log(error);
  }
}