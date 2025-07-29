import '../styles/NavBar.css';
import menuIcon from '../images/menu.svg';
import { ReactComponent as MenuIcon } from '../images/menu.svg';

const NavBar = () => {
  return (
    <nav className="navbar">
        <div className="navbar-menu">
          {/* <img className='navbar-menu-icon' src={menuIcon} alt="menu" /> */}
          <MenuIcon className='navbar-menu-icon' style={{ color: 'var(--color)' }} />
        </div>
      <h2 className="navbar-title">Lista zakupów</h2>
    </nav>
  );
};

export default NavBar;
