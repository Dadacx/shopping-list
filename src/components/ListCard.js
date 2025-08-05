import '../styles/ListCard.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Checkbox from './Checkbox';

const ListCard = ({ list, handleContextMenu, selectedLists, setSelectedLists }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (selectedLists.length === 0) {
      navigate(`/${list.id}`);
    } else {
      setSelectedLists(prev =>
      prev.includes(list.id)
        ? prev.filter(item => item !== list.id)
        : [...prev, list.id]
    )
    }
  };

  return (
    <div className='list-card' onClick={handleClick} onContextMenu={(e) => handleContextMenu(e, list.id)}>
      {/* <div style={{ position: 'absolute', top: 0, left: 0 }}>{list.id}</div> */}
      {selectedLists.length > 0 && (<Checkbox checked={selectedLists.includes(list.id)} readOnly={true} className='list-checkbox' />)}
      <h3 className='card-title'>{list.name}</h3>
      <ul className='card-items-list'>
        {list.items.map((item, index) => (item.name !== '' || item.amount > 0) && (
          <li key={index} className={`card-item ${item.checked ? 'checked' : ''}`}>
            {item.name !== '' && <span className='item-name'>{item.name}</span>}
            {item.amount > 0 && <span className='item-amount'>x{item.amount}</span>}
          </li>
        ))}
      </ul>
      <div className='card-timestamp'>{new Date(list.timestamp).toLocaleString()}</div>
    </div>
  );
};

export default ListCard;