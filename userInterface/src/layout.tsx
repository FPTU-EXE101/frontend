import Navbar from './components/ui/navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/ui/footer';

const Mainlayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}

export default Mainlayout