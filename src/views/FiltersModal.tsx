import { observer } from "mobx-react-lite";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePicker, { DateObject } from "react-multi-date-picker";
import { useInjection } from "inversify-react";
import type { CreateReservationStore } from "../stores/CreateReservationStore";
import { TYPES } from "../core/types";
import { ReservationStatus } from "../models/Dashboard";
import { useRef, useState } from "react";
import type { ReservationApi } from "../api/reservationApi";
import type { HistoryStore } from "../stores/HistoryStore";

interface Props {
  modalVisible: boolean;
  handleClose: () => void;
}

export const FiltersModal = observer(({ modalVisible, handleClose }: Props) => {
  const createReservationStore = useInjection<CreateReservationStore>(TYPES.CreateReservationStore);
  const reservationApi = useInjection<ReservationApi>(TYPES.ReservationApi);
  const historyStore = useInjection<HistoryStore>(TYPES.HistoryStore);

  const form = useRef(null);
  const [date, setDate] = useState<DateObject[]>();

  const saveChanges = () => {
    if (form.current) {
      const formData = new FormData(form.current);
      const status: Array<string> = [];

      const itemId = formData.get("itemId") as string; 
      const fullText = formData.get("full-text") as string; 
  
      const pending = formData.get("pending") as string; 
      const returned = formData.get("returned") as string; 
      const overdue = formData.get("overdue") as string; 

      [returned, pending, overdue].forEach(
        item => { if (item) status.push(item) }
      );
      
      reservationApi.filterItems(status, itemId, fullText, date ?? []);
      handleClose();
    }
  }

  const resetChanges = () => {
    setDate([]);
    historyStore.resetChanges();
    handleClose();
  }

  return (
    <Modal show={modalVisible} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={form}>
          <Form.Group>
            <Form.Label>Date range</Form.Label>
            <div>
              <DatePicker 
                range
                style={{ height: "37.6px", padding: "6px 12px" }}
                onChange={(value) => { setDate(value) }}
                value={historyStore.filters?.date}
              />
            </div>
          </Form.Group>
          
          <Form.Group className="mt-3">
            <Form.Label>Full-text search</Form.Label>
            <Form.Control name="full-text" defaultValue={historyStore.filters?.fullText} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Uniform</Form.Label>
            <Form.Select 
              defaultValue={historyStore.filters?.itemId || ""}
              name="itemId"
            >
              <option value="" disabled hidden />
              {
                createReservationStore.uniformItems.map(item => {
                  return (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  )
                })
              }
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Status</Form.Label>
            <div className="d-flex flex-wrap gap-3">
              <Form.Check 
                label={ReservationStatus.Overdue}
                value={ReservationStatus.Overdue}
                name="overdue"
                defaultChecked={
                  historyStore.filters?.status.includes(ReservationStatus.Overdue)
                }
              />
              <Form.Check 
                label={ReservationStatus.Returned}
                value={ReservationStatus.Returned}
                name="returned"
                defaultChecked={
                  historyStore.filters?.status.includes(ReservationStatus.Returned)
                }
              />
              <Form.Check 
                label={ReservationStatus.Pending}
                value={ReservationStatus.Pending}
                name="pending"
                defaultChecked={
                  historyStore.filters?.status.includes(ReservationStatus.Pending)
                }
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={() => {
          resetChanges()
        }}>
          Reset
        </Button>
        <Button variant="primary" onClick={() => {
          saveChanges()
        }}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
});