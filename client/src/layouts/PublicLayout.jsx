import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

export default function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <Outlet />
    </>
  );
}
