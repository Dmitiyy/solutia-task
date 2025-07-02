import { injectable } from "inversify";
import { ReservationStatus, type Reservation } from "../models/Dashboard";
import { action, makeObservable, observable } from "mobx";
import type { DateObject } from "react-multi-date-picker";

type TFilters = {
  status: string[];
  itemId: string;
  fullText: string;
  date: string[];
};

@injectable()
export class HistoryStore {
  historyValues: Reservation[] = [
    { 
      id: "1", date: "2025/07/08", 
      employeeId: "12345", itemId: "pants", 
      status: ReservationStatus.Overdue 
    },
    { 
      id: "2", date: "2025/07/10", 
      employeeId: "12345", itemId: "jacket", 
      status: ReservationStatus.Pending 
    },
    { 
      id: "3", date: "2025/07/13", 
      employeeId: "12345", itemId: "shoes", 
      status: ReservationStatus.Returned 
    },
    { 
      id: "4", date: "2025/07/15", 
      employeeId: "12345", itemId: "hat", 
      status: ReservationStatus.Overdue 
    },
    { 
      id: "5", date: "2025/07/24", 
      employeeId: "12345", itemId: "hat", 
      status: ReservationStatus.Overdue 
    },
    { 
      id: "6", date: "2025/07/25", 
      employeeId: "12345", itemId: "hat", 
      status: ReservationStatus.Overdue 
    },
    { 
      id: "7", date: "2025/07/29", 
      employeeId: "12345", itemId: "hat", 
      status: ReservationStatus.Overdue 
    },
    { 
      id: "8", date: "2025/07/19", 
      employeeId: "12345", itemId: "hat", 
      status: ReservationStatus.Overdue 
    },
    { 
      id: "9", date: "2025/07/20", 
      employeeId: "12345", itemId: "hat", 
      status: ReservationStatus.Overdue 
    },
    { 
      id: "10", date: "2025/07/21", 
      employeeId: "12345", itemId: "hat", 
      status: ReservationStatus.Overdue 
    },
    { 
      id: "11", date: "2025/07/22", 
      employeeId: "12345", itemId: "hat", 
      status: ReservationStatus.Overdue 
    },
  ];

  filteredValues: Reservation[] = [];

  page: number = 1;
  limit: number = 10;
  filters: TFilters | null = null;

  constructor() {
    makeObservable(this, {
      historyValues: observable, 
      setHistoryValues: action,
      page: observable,
      limit: observable,
      goToNext: action,
      goToPrev: action,
      filters: observable,
      filterHistoryValues: action,
      filteredValues: observable,
      resetChanges: action
    });
  }

  setHistoryValues(employeeId: string, itemId: string, date: string[]) {
    const statuses = Object.values(ReservationStatus);
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    this.historyValues = [
      {
        employeeId, itemId, date: date[0], 
        status: randomStatus, id: `${this.historyValues.length + 1}`
      },
      ...this.historyValues,
    ]
  }

  goToNext() { 
    const values = this.filteredValues.length === 0 ? this.historyValues : this.filteredValues;

    const totalAmount = Math.ceil(values.length / this.limit);
    if (this.page < totalAmount) this.page += 1;
  }

  goToPrev() { if (this.page > 1) this.page -= 1 }

  filterHistoryValues(status: string[], itemId: string, fullText: string, date: DateObject[]) {
    if (
      status.length === 0 && 
      (!itemId || itemId.length === 0) &&
      fullText.length === 0 &&
      date.length === 0
    ) {
      this.filters = null;
      this.filteredValues = [];
      return;
    }

    this.filters = {
      status, itemId, fullText, date: date.map(item => item.toString())
    };

    this.page = 1;

    const lowerQuery = fullText.toLowerCase().trim();
    const start = new Date(date.map(item => item.toString())[0]);
    const end = new Date(date.map(item => item.toString())[1]);

    if (lowerQuery.length !== 0) {
      const values = this.filteredValues.length === 0 ? this.historyValues : this.filteredValues;

      this.filteredValues = values.filter((r) => {
        return (
          r.employeeId.toLowerCase().includes(lowerQuery) ||
          r.itemId.toLowerCase().includes(lowerQuery)
        );
      });
    }

    if (itemId && itemId.length !== 0) {
      const values = this.filteredValues.length === 0 ? this.historyValues : this.filteredValues;

      this.filteredValues = values.filter((r) => {
        return (
          r.itemId === itemId 
        );
      });
    }

    if (status.length !== 0) {
      const values = this.filteredValues.length === 0 ? this.historyValues : this.filteredValues;

      this.filteredValues = values.filter((r) => {
        return (
          status.includes(r.status)
        );
      });
    }

    if (date.length !== 0) {
      const values = this.filteredValues.length === 0 ? this.historyValues : this.filteredValues;

      this.filteredValues = values.filter((r) => {
        const date = new Date(r.date);
        return date >= start && date <= end;
      });
    }
  }

  resetChanges() {
    this.page = 1;
    this.filters = null;
    this.filteredValues = [];
  }
}