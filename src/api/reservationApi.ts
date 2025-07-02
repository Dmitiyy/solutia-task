import { inject, injectable } from "inversify";
import { TYPES } from "../core/types";
import type { HistoryStore } from "../stores/HistoryStore";
import type { DateObject } from "react-multi-date-picker";

@injectable()
export class ReservationApi {
  @inject(TYPES.HistoryStore)
  private historyStore!: HistoryStore;

  createReservation = async (employeeId: string, itemId: string, date: string[]) => {
    //* Here we make a request to BE 
    this.historyStore.setHistoryValues(employeeId, itemId, date);
  }

  goToNext() {
    //* Here we make a request to BE 
    this.historyStore.goToNext();
  }

  goToPrev() {
    //* Here we make a request to BE 
    this.historyStore.goToPrev();
  }

  filterItems(status: string[], itemId: string, fullText: string, date: DateObject[]) {
    //* Here we make a request to BE 
    this.historyStore.filterHistoryValues(status, itemId, fullText, date);
  }
}