import '../styles/NavBar.css';
import { ReactComponent as MenuIcon } from '../images/menu.svg';

const NavBar = ({ toggleMenu }) => {
  return (
    <nav className="navbar">
        <div className="navbar-menu" onClick={toggleMenu}>
          <MenuIcon className='navbar-menu-icon' style={{ color: 'var(--color)' }} />
        </div>
      <h2 className="navbar-title">Lista zakupów</h2>
    </nav>
  );
};

export default NavBar;
