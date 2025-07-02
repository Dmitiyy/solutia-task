import { useInjection } from "inversify-react";
import { observer } from "mobx-react-lite";
import { DateObject, Calendar as ReactCalendar } from 'react-multi-date-picker';
import type { CreateReservationStore } from "../stores/CreateReservationStore";
import { TYPES } from "../core/types";
import { useNavigate } from "react-router";

export const Calendar = observer(() => {
  const createReservationStore = useInjection<CreateReservationStore>(TYPES.CreateReservationStore);
  const navigate = useNavigate();

  const handleClick = (value: DateObject) => {
    createReservationStore.setDate([value]);
    navigate("/");
  }

  return (
    <>
      <h2 className="fs-5 mb-3">Available Dates</h2>

      <ReactCalendar
        onChange={handleClick}
        mapDays={({ date }) => {
          const formatted = date.format("YYYY/MM/DD");
          if (createReservationStore.reservedDates.includes(formatted)) {
            return {
              disabled: true, 
              style: { 
                backgroundColor: "#ffdddd", 
                color: "#d00",
                borderRadius: "50%",
              },
            };
          }
        }}
      />
    </>
  )
})