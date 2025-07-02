import { Container } from "inversify";
import { TYPES } from "./types";
import { CreateReservationStore } from "../stores/CreateReservationStore";
import { HistoryStore } from "../stores/HistoryStore";
import { ReservationApi } from "../api/reservationApi";

const container = new Container();

container.bind<CreateReservationStore>(TYPES.CreateReservationStore)
  .to(CreateReservationStore)
  .inSingletonScope();

container.bind<HistoryStore>(TYPES.HistoryStore)
  .to(HistoryStore)
  .inSingletonScope();

container.bind<ReservationApi>(TYPES.ReservationApi)
  .to(ReservationApi)
  .inSingletonScope();

export { container };