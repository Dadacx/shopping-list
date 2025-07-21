import { Link } from 'react-router-dom';
import '../styles/ListCard.css';

const ListCard = ({ list }) => {
  return (
    <Link className='list-card' to={`/${list.id}`}>
        <h3 className='card-title'>{list.name}</h3>
        <ul className='card-items-list'>
          {list.items.map((item, index) => (
            <li key={index} className={`card-item ${item.checked ? 'checked' : ''}`}>
              <span className='item-name'>{item.name}</span>
              <span className='item-amount'>x{item.amount}</span>
            </li>
          ))}
        </ul>
        <div className='card-timestamp'>{new Date(list.timestamp).toLocaleString()}</div>
    </Link>
  );
};

export default ListCard;
