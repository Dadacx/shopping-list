import '../styles/List.css';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { showPopup } from './Popup/Popup';
import Checkbox from './Checkbox';
import { ReactComponent as BackIcon } from '../images/back.svg';
import { ReactComponent as EditIcon } from '../images/edit.svg';
import { ReactComponent as MoreIcon } from '../images/more.svg';

const List = ({ data, saveData }) => {
  const { id } = useParams();
  const list = data.lists.find(list => list.id === parseInt(id));

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  if (!list) {
    return <Navigate to="/" replace />;
  }

  const exportList = () => {
    const exportData = {
      id: 'shoppingList',
      lists_count: 1,
      lists: data.lists.filter(list => list.id === parseInt(id)),
    }
    const jsonString = JSON.stringify(exportData);

    var copyText = document.createElement("textarea");
    copyText.value = jsonString;
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);

    showPopup({ message: "Zawartość listy została skopiowana do schowka", type: "success", duration: 5000, border: true, icon: true });
    setDropdownOpen(false);
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
        <Link to="/" className='back'>
          <BackIcon style={{ color: 'var(--color)' }} className='back-icon' />
        </Link>
        <input className='list-title' type="text" value={list.name} readOnly />
        <div className='list-buttons'>
          {/* <Link to={`/edit/${id}`} className='btn edit-button'>
              <EditIcon style={{ color: 'var(--color)' }} />
            </Link> */}
          <div className={`list-dropdown ${isDropdownOpen ? 'open' : ''}`}>
            <MoreIcon style={{ color: 'var(--color)' }} className='list-dropbtn' onClick={() => setDropdownOpen(!isDropdownOpen)} />
            <div className="list-dropdown-content">
              <Link to={`/edit/${id}`} className='dropdown-item'>Edytuj</Link>
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
            <Checkbox defaultChecked={item.checked} onChange={() => {
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
    </div>
  );
};

export default List;