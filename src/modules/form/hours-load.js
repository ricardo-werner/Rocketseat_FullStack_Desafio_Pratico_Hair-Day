import { openingHours } from "../../utils/opening-hours.js";
import dayjs from "dayjs";


export function hoursLoad({ date }) { 
  const opening = openingHours.map((hours) => {
    //Recupera somente a hora
    const [schedulesHour] = hours.split(":");


    //Adiciona a hora na data e verificar se esa no passado.
    const isHourPast = dayjs(date).add(schedulesHour, "hour").isAfter(dayjs());

    // Define se o horário está disponível

    return {
      hours,
      available: isHourPast,
    }
  })

  console.log(opening)
};