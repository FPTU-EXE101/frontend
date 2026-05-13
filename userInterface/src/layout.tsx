import Navbar from './components/ui/navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/ui/footer';

const Mainlayout = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>

      <div>
      
        <Footer />
      </div>
    </div>
  );
}

export default Mainlayout