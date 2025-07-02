import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Route, Routes } from 'react-router';
import { CreateReservation } from './views/CreateReservation';
import { Navigation } from './views/Navigation';
import { Toaster } from 'react-hot-toast';
import { History } from './views/History';
import { Calendar } from './views/Calendar';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./theme.css";

function App() {
  return (
    <>
      <Container className="mt-4">
        <Row className="row-gap">
          <Col lg={3} md={4}>
            <div 
              className="bg-white rounded-4 d-flex flex-column p-3 gap-2 height-up-to-md"
            >
              <Navigation />
            </div>
          </Col>
          <Col lg={9} md={8}>
            <div 
              className="bg-white rounded-4 p-3 height-up-to-md" 
            >
              <Routes>
                <Route path="/" element={<CreateReservation />} />
                <Route path="/history" element={<History />} />
                <Route path="/calendar" element={<Calendar />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
      <Toaster />
    </>
  )
}

export default App
