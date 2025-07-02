import { ReservationStatus } from "../../models/Dashboard";
import Badge from 'react-bootstrap/Badge';

interface Props {
  status: ReservationStatus;
}

export const StatusBadge = ({ status }: Props) => {
  let color = "";

  switch(status) {
    case ReservationStatus.Overdue:
      color = "danger";
      break;
    case ReservationStatus.Pending:
      color = "warning";
      break;
    case ReservationStatus.Returned:
      color = "primary";
      break;
    default:
      return;
  }

  return (
    <Badge bg={color}>{status}</Badge>
  );
}