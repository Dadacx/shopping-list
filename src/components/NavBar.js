import '../styles/NavBar.css';
import menuIcon from '../images/menu.svg';

const NavBar = () => {
  return (
    <nav className="navbar">
        <div className="navbar-menu">
          <img className='navbar-menu-icon' src={menuIcon} alt="menu" />
        </div>
      <h2 className="navbar-title">Lista zakupów</h2>
    </nav>
  );
};

export default NavBar;
