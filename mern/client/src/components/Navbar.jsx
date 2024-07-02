import { NavLink } from "react-router-dom";
import deliverySvg from '../assets/delivery-truck.gif';
import { useLocation } from 'react-router-dom';
import { Space, Tooltip, Typography } from "antd";
const { Title } = Typography;
export default function Navbar() {
  const location = useLocation(); // Access location object

  // Check if the pathname includes '/create'
  const isDBRoute = location.pathname.includes('/create');
  return (
    <div>
      <nav className="flex justify-between items-center mb-6 ">
        <NavLink to="/"><Space align="center"> <img alt="MongoDB logo" className="h-20 inline" src={deliverySvg}></img> <span className="mt-5 text-white">CARGO MUNSHI </span></Space></NavLink>
        {!isDBRoute && 
        <Tooltip title="DB related operations can be performed here">
        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/create">
          DataBase Interaction
        </NavLink>
        </Tooltip>}
      </nav>
    </div>
  );
}
