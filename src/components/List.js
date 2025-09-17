import '../styles/List.css';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CopyToClipboard from './CopyToClipboard';
import { showPopup } from './Popup/Popup';
import Checkbox from './Checkbox';
import { ReactComponent as BackIcon } from '../images/back.svg';
import { ReactComponent as EditIcon } from '../images/edit.svg';
import { ReactComponent as MoreIcon } from '../images/more.svg';
import { ReactComponent as CloseIcon } from '../images/close.svg';

const List = ({ data, saveData }) => {
  const { id } = useParams();
  const list = data.lists.find(list => list.id === parseInt(id));

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isSortMenuOpen, setSortMenuOpen] = useState(false);
  const navigate = useNavigate();

  if (!list) {
    return <Navigate to="/" replace />;
  }

  const sortList = (type) => {
    var updatedList;
    if (type === 'a-z') {
      const sortedItems = [...list.items].sort((a, b) => a.name.localeCompare(b.name));
      updatedList = { ...list, items: sortedItems };
    } else if (type === 'z-a') {
      const sortedItems = [...list.items].sort((a, b) => b.name.localeCompare(a.name));
      updatedList = { ...list, items: sortedItems };
    } else if (type === 'a-z-checked') {
      const sortedItems = [...list.items].sort((a, b) => {
        if (a.checked === b.checked) {
          return a.name.localeCompare(b.name);
        }
        return a.checked ? 1 : -1;
      });
      updatedList = { ...list, items: sortedItems };
    } else if (type === 'z-a-checked') {
      const sortedItems = [...list.items].sort((a, b) => {
        if (a.checked === b.checked) {
          return b.name.localeCompare(a.name);
        }
        return a.checked ? 1 : -1;
      });
      updatedList = { ...list, items: sortedItems };
    } else if (type === 'oldest') {
      const sortedItems = [...list.items].sort((a, b) => a.id - b.id);
      updatedList = { ...list, items: sortedItems };
    }

    saveData({ ...data, lists: data.lists.map(l => l.id === list.id ? updatedList : l) });
  };

  const exportList = () => {
    const exportData = {
      id: 'shoppingList',
      lists_count: 1,
      lists: data.lists.filter(list => list.id === parseInt(id)),
    };
    const jsonString = JSON.stringify(exportData);

    CopyToClipboard(
      jsonString,
      () => {
        showPopup({ message: "Zawartość listy została skopiowana do schowka", type: "success", duration: 5000, border: true, icon: true });
        setDropdownOpen(false);
      },
      () => {
        showPopup({ message: "Nie udało się skopiować listy", type: "error", duration: 5000, border: true, icon: true });
      }
    );
  };

  const deleteList = () => {
    if (!window.confirm("Czy na pewno chcesz usunąć tę listę?")) return;
    const updatedLists = data.lists.filter(list => list.id !== parseInt(id));
    const updatedData = { ...data, lists: updatedLists };
    saveData(updatedData);
    showPopup({ message: "Lista została usunięta", type: "success", duration: 5000, border: true, icon: true });
  };

  return (
    <div className="list">
      <div className='list-header'>
        <div onClick={() => navigate(-1)} className='back'>
          <BackIcon style={{ color: 'var(--color)' }} className='back-icon' />
        </div>
        <input className='list-title' type="text" value={list.name} readOnly />
        <div className='list-buttons'>
          {/* <Link to={`/edit/${id}`} className='btn edit-button'>
              <EditIcon style={{ color: 'var(--color)' }} />
            </Link> */}
          <div className={`list-dropdown ${isDropdownOpen ? 'open' : ''}`}>
            <MoreIcon style={{ color: 'var(--color)' }} className='list-dropbtn' onClick={() => setDropdownOpen(!isDropdownOpen)} />
            <div className="list-dropdown-content">
              <Link to={`/edit/${id}`} className='dropdown-item'>Edytuj</Link>
              <div className='dropdown-item' onClick={() => {setSortMenuOpen(true); setDropdownOpen(false);}}>Sortuj</div>
              <div className='dropdown-item' onClick={exportList}>Eksportuj</div>
              <div className='dropdown-item' onClick={deleteList}>Usuń</div>
              {/* <div className='dropdown-item'>Dostosuj</div> */}
            </div>
          </div>
        </div>
      </div>
      <div className='line'></div>
      <ul className='list-items'>
        {list.items.map((item, index) => (item.name !== '' || item.amount > 0) && (
          <li key={index} className={`list-item ${item.checked ? 'checked' : ''}`}>
            <Checkbox checked={item.checked} onChange={() => {
              const updatedItems = [...list.items];
              updatedItems[index].checked = !updatedItems[index].checked;
              const updatedList = { ...list, items: updatedItems };
              saveData({ ...data, lists: data.lists.map(l => l.id === list.id ? updatedList : l) });
            }} />
            {item.name !== '' && <span className='item-name'>{item.name}</span>}
            {item.amount > 0 && <span className='item-amount'>x{item.amount}</span>}
          </li>
        ))}
      </ul>
      <div className={`sort-menu ${isSortMenuOpen ? 'open' : ''}`}>
        <div className='sort-header'>
          <h1>Sortuj</h1>
          <CloseIcon style={{ color: 'var(--color)' }} className='close-sort-menu' onClick={() => setSortMenuOpen(false)} />
        </div>
        <div className='sort-option' onClick={() => sortList('a-z')}>Od A-Z</div>
        <div className='sort-line'></div>
        <div className='sort-option' onClick={() => sortList('z-a')}>Od Z-A</div>
        <div className='sort-line'></div>
        <div className='sort-option' onClick={() => sortList('a-z-checked')}>Od A-Z (Zaznaczone)</div>
        <div className='sort-line'></div>
        <div className='sort-option' onClick={() => sortList('z-a-checked')}>Od Z-A (Zaznaczone)</div>
        <div className='sort-line'></div>
        <div className='sort-option' onClick={() => sortList('oldest')}>Od najstarszych</div>
      </div>
    </div>
  );
};

export default List;