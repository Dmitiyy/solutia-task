import { NavLink } from 'react-router';

export const Navigation = () => {
  const navLinkClass = (isActive: boolean) => {
    return [
      "text-decoration-none",
      "d-flex align-items-center rounded-3 p-2 ps-3",
      `text-${isActive ? "primary" : "black"}`,
      `bg-${isActive ? "secondary" : "transparent"}`
    ].join(" ");
  };

  return (
    <>
      <NavLink 
        to="/"
        className={({ isActive }) => navLinkClass(isActive)}
      >
        <i className={`bi bi-patch-plus-fill fs-5 me-3`} />
        Create Reservation
      </NavLink>

      <NavLink 
        to="/history"
        className={({ isActive }) => navLinkClass(isActive)}
      >
        <i className={`bi bi-box-seam-fill fs-5 me-3`} />
        Overview & History
      </NavLink>

      <NavLink 
        to="/calendar"
        className={({ isActive }) => navLinkClass(isActive)}
      >
        <i className={`bi bi-calendar-fill fs-5 me-3`} />
        Available Dates
      </NavLink>
    </>
  )
}