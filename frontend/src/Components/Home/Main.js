
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Main = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      
      <Header />
      
      
      <main className="flex-grow-1 pb-5">
        <Outlet />
      </main>
      
      
      <Footer />
    </div>
  );
};

export default Main;
