import { useInjection } from 'inversify-react';
import Form from 'react-bootstrap/Form';
import { CreateReservationStore } from '../stores/CreateReservationStore';
import { TYPES } from '../core/types';
import { Calendar } from 'react-multi-date-picker';
import Button from 'react-bootstrap/Button';
import { observer } from 'mobx-react-lite';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';

export const CreateReservation = observer(() => {
  const createReservationStore = useInjection<CreateReservationStore>(TYPES.CreateReservationStore);
  const [validated, setValidated] = useState<boolean>(false);

  const reservedSet = new Set(createReservationStore.reservedDates);
  const hasNewDate = createReservationStore.date.some(
    (d) => !reservedSet.has(d)
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setValidated(true);

    if (
      !createReservationStore.date ||
      createReservationStore.date.length === 0 ||
      !hasNewDate
    ) {
      return;
    }

    const form = event.currentTarget as HTMLFormElement;

    if (form.checkValidity() === true) {
      const formData = new FormData(form);

      const employeeId = formData.get("employeeId") as string; 
      const itemId = formData.get("itemId") as string; 

      createReservationStore.viewModel.createReservationApi(
        employeeId, itemId, 
        [createReservationStore.date[createReservationStore.date.length - 1]]
      );

      form.reset();
      setValidated(false);
      createReservationStore.setDate([]);
      toast.success("Uniforms have been reserved");
    }
  };

  const isDateInvalid =
    validated &&
    (!createReservationStore.date ||
      createReservationStore.date.length === 0 || !hasNewDate);

  return (
    <>
      <h2 className="fs-5">Create reservation</h2>
      <Form onSubmit={handleSubmit} validated={validated} noValidate className="mt-3">
        <Form.Group>
          <Form.Label>Employee ID</Form.Label>
          <Form.Control placeholder="Enter your ID" required name="employeeId" />
          <Form.Control.Feedback type="invalid">
            This is a required field
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Uniform</Form.Label>
          <Form.Select 
            aria-label="Choose what to wear today" 
            defaultValue="" required 
            name="itemId"
          >
            <option value="" disabled hidden>
              Choose what to wear today
            </option>
            {
              createReservationStore.uniformItems.map(item => {
                return (
                  <option key={item.id} value={item.id}>{item.name}</option>
                )
              })
            }
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            This is a required field
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Pick a date</Form.Label>
          <Calendar
            multiple
            onChange={(values) => { createReservationStore.setDate(values) }}
            value={[createReservationStore.date[0]]}
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
          <div 
            className="invalid-feedback" 
            style={{ display: isDateInvalid ? "block" : "none" }}
          >
            This is a required field
          </div>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Create a reservation
        </Button>
      </Form>
    </>
  )
})