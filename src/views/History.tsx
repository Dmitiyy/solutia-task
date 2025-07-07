import { observer } from "mobx-react-lite";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import { StatusBadge } from "./shared/StatusBadge";
import { useInjection } from "inversify-react";
import { HistoryStore } from "../stores/HistoryStore";
import { TYPES } from "../core/types";
import { useMemo, useState } from "react";
import { FiltersModal } from "./FiltersModal";
import type { ReservationApi } from "../api/reservationApi";

export const History = observer(() => {
  const historyStore = useInjection<HistoryStore>(TYPES.HistoryStore);
  const reservationApi = useInjection<ReservationApi>(TYPES.ReservationApi);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const startIndex = useMemo(
    () => (historyStore.page - 1) * historyStore.limit,
    [historyStore.page, historyStore.limit]
  );
  
  const paginatedValues = useMemo(() => {
    const endIndex = startIndex + historyStore.limit;
    const values = historyStore.filters 
    ? historyStore.filteredValues : historyStore.historyValues;

    return values.slice(startIndex, endIndex);
  }, [
    historyStore.historyValues, 
    historyStore.filteredValues, 
    startIndex, 
    historyStore.limit,
    historyStore.filters
  ]);

  return (
    <>
      <h2 className="fs-5 mb-3">Equipment Overview & History</h2>

      <div className="d-flex justify-content-end">
        <Button 
          variant="outline-primary" 
          className="align-items-center d-flex"
          onClick={() => { setModalVisible(true) }}
        >
          <i className="bi bi-filter fs-5 me-2" />
          Filter
        </Button>
      </div>

      {
        paginatedValues.length !== 0 ? (
          <>
            <div className="overflow-x-scroll">
              <Table striped hover className="mt-3">
                <thead>
                  <tr>
                    <th></th>
                    <th>Date</th>
                    <th>Employee ID</th>
                    <th>Uniform</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    paginatedValues.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td>{ index + 1 }</td>
                          <td>{ item.date }</td>
                          <td>{ item.employeeId }</td>
                          <td>{ item.itemId }</td>
                          <td>
                            <StatusBadge status={item.status} /> 
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
            </div>

            <div className="mt-3 d-flex align-items-center justify-content-center gap-3">
              <Button onClick={() => { reservationApi.goToPrev() }}>
                <i className="bi bi-arrow-left" />
              </Button>
              <h3 className="fs-5">{historyStore.page}</h3>
              <Button onClick={() => { reservationApi.goToNext() }}>
                <i className="bi bi-arrow-right" />
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center fs-5">There are no items</p>
        )
      }

      <FiltersModal 
        modalVisible={modalVisible} 
        handleClose={() => { setModalVisible(false) }}
      />
    </>
  )
})