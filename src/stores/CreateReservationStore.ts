import { inject, injectable } from "inversify";
import { action, computed, makeObservable, observable } from "mobx";
import type { EquipmentItem } from "../models/Dashboard"; 
import type { DateObject } from "react-multi-date-picker";
import { HistoryStore } from "./HistoryStore";
import { TYPES } from "../core/types";
import { ReservationApi } from "../api/reservationApi";

@injectable()
export class CreateReservationStore {
  date: string[] = [];

  uniformItems: EquipmentItem[] = [
    { id: "shirt", name: "Shirt" },
    { id: "pants", name: "Pants" },
    { id: "jacket", name: "Jacket" },
    { id: "hat", name: "Hat" },
    { id: "shoes", name: "Shoes" },
  ];

  @inject(TYPES.HistoryStore)
  private historyStore!: HistoryStore;

  @inject(TYPES.ReservationApi)
  private reservationApi!: ReservationApi;

  constructor() {
    makeObservable(this, {
      date: observable,
      setDate: action,
      reservedDates: computed,
      viewModel: computed
    });
  }

  get viewModel() {
    return {
      createReservationApi: this.reservationApi.createReservation
    }
  }

  setDate(date: DateObject[] | null) {
    if (date) this.date = date.map(item => item.toString());
  }

  get reservedDates() {
    return this.historyStore.historyValues.map(item => item.date);
  }
}