import '../styles/List.css';
import { Link, useParams } from 'react-router-dom';
import Checkbox from './Checkbox';
import { ReactComponent as BackIcon } from '../images/back.svg';
import { ReactComponent as EditIcon } from '../images/edit.svg';

const List = ({ data, saveData }) => {
  const { id } = useParams();
  const list = data.lists.find(list => list.id === parseInt(id));

  return (
    <div className="list">
      <div className='list-header'>
        <Link to="/" className='back'>
          {/* <img className='back-icon' src={backIcon} alt="Back" /> */}
          <BackIcon style={{ color: 'var(--color)' }} className='back-icon' />
        </Link>
        <input className='list-title' type="text" value={list.name} readOnly />
        <div className='list-buttons'>
            <Link to={`/edit/${id}`} className='btn edit-button'>
              <EditIcon style={{ color: 'var(--color)' }} />
            </Link>
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