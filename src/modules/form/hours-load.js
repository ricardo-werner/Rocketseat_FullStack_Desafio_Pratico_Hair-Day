import { openingHours } from "../../utils/opening-hours.js";
import dayjs from "dayjs";

const hours = document.getElementById("hours");

export function hoursLoad({ date }) { 
  const opening = openingHours.map((hour) => {
    //Recupera somente a hora
    const [schedulesHour] = hour.split(":");

    //Adiciona a hora na data e verificar se esa no passado.
    const isHourPast = dayjs(date).add(schedulesHour, "hour").isAfter(dayjs());

    // Define se o horário está disponível
    return {
      hour,
      available: isHourPast,
    }
  })


// Renderizar os horários.
opening.forEach(({ hour, available }) => { 
  const li = document.createElement("li");
  
  li.classList.add("hour");
  li.classList.add(available ? "hour-available" : "hour-unavailable");

  li.textContent = hour;
  hours.append(li);

})
};