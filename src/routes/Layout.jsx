import { Outlet } from 'react-router-dom';
import Header from "../component/pages/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;