import '../styles/NavBar.css';
import { ReactComponent as MenuIcon } from '../images/menu.svg';
import { ReactComponent as SortIcon } from '../images/sort.svg';

const NavBar = ({ toggleMenu, setSortMenuOpen }) => {
  return (
    <nav className="navbar">
        <div className="navbar-menu" onClick={toggleMenu}>
          <MenuIcon className='navbar-menu-icon' style={{ color: 'var(--color)' }} />
        </div>
      <h2 className="navbar-title">Lista zakupów</h2>
      <div className="navbar-sort" onClick={setSortMenuOpen}>
          <SortIcon className='navbar-sort-icon' style={{ color: 'var(--color)' }} />
        </div>
    </nav>
  );
};

export default NavBar;
