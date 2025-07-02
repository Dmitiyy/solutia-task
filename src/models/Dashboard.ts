export interface EquipmentItem {
  id: string;
  name: string;
}

export enum ReservationStatus {
  Returned = "Returned",
  Pending = "Pending",
  Overdue = "Overdue",
}

export interface Reservation {
  id: string;
  employeeId: string;
  itemId: string;
  date: string; 
  status: ReservationStatus;
}