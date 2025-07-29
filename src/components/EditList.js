import '../styles/EditList.css';
import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Checkbox from './Checkbox';
import AutoWidthInput from './AutoWidthInput';
import { ReactComponent as BackIcon } from '../images/back.svg';
import { ReactComponent as SaveIcon } from '../images/save.svg';
import backIcon from '../images/back.svg';
import saveIcon from '../images/save.svg';

const EditList = ({ data, saveData }) => {
  const { id } = useParams();
  // const list = data.lists.find(list => list.id === parseInt(id));
  const [list, setList] = useState(data.lists.find(list => list.id === parseInt(id)) || { id: parseInt(id), name: '', items: [] });
  const listRef = useRef(null);

  const saveList = () => {
    if (!list.name.trim()) {
      alert('Nazwa listy nie może być pusta!');
      return;
    }
    if (list.items.length === 0 || list.items[0]?.name.trim() === '' || list.items[0]?.amount === 0) {
      alert('Lista musi zawierać przynajmniej jeden element!');
      return;
    }
    const date = new Date();
    list.timestamp = date.valueOf();
    console.log('Saving list:', list);
    const updatedLists = data.lists.map(l => l.id === list.id ? list : l);
    const updatedData = { ...data, lists: updatedLists };
    saveData(updatedData);
  }

  const nextInput = (e) => {
    const inputs = listRef.current.querySelectorAll('input.edit-input-item');
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);

    if (currentIndex < inputs.length - 1) {
      inputs[currentIndex + 1].focus();
    } else if (currentIndex === inputs.length - 1) {
      const newItem = { name: '', amount: 0, checked: false };
      setList(prevList => {
        const updatedList = {
          ...prevList,
          items: [...prevList.items, newItem]
        };

        setTimeout(() => {
          const updatedInputs = listRef.current?.querySelectorAll('input.edit-input-item');
          updatedInputs?.[updatedInputs.length - 2]?.focus(); // fokusujemy .name, który jest przedostatni (ostatni to amount)
        }, 0);

        return updatedList;
      });
    }
  };

  const previousInput = (e) => {
    const inputs = listRef.current.querySelectorAll('input.edit-input-item');
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0 && inputs[currentIndex].value === '') {
      inputs[currentIndex - 1].focus();
    }
  };

  useEffect(() => {
    const enter = (e) => e.key === "Enter" && nextInput();
    const backspace = (e) => e.key === "Backspace" && previousInput();
    document.addEventListener("keydown", enter);
    document.addEventListener("keydown", backspace);
    return () => {
      document.removeEventListener("keydown", enter);
      document.removeEventListener("keydown", backspace);
    };
  }, []);

  const isEmpty = (updatedItems, index) => {
    const isEmpty = updatedItems[index].name === '' && updatedItems[index].amount === 0;
    if (isEmpty && updatedItems.length > 1) {
      const inputs = Array.from(listRef.current.querySelectorAll('input.edit-input-item'));
      const currentIndex = inputs.indexOf(document.activeElement);
      updatedItems.splice(index, 1);

      if (currentIndex > 0) {
        const newInputs = Array.from(listRef.current.querySelectorAll('input.edit-input-item'));
        const target = newInputs[Math.max(currentIndex - 1, 0)];
        target?.focus();
      }
    }
  }

  return (
    <div className="edit-list">
      <div className='list-header'>
        <Link to={`/${id}`}>
          <BackIcon className='back-icon' style={{ color: 'var(--color)' }} />
        </Link>
        <input className='list-title' type="text" defaultValue={list.name} onChange={(e) => {
          const updatedList = { ...list, name: e.target.value };
          setList(updatedList);
        }} />
        <div className='edit-buttons'>
          <Link to={`/${id}`} className='save-button btn' onClick={saveList}>
            {/* <img src={saveIcon} alt="Save" /> */}
            <SaveIcon style={{ color: 'var(--color)' }} />
          </Link>
        </div>
      </div>
      <div className='line'></div>
      <ul className='list-items' ref={listRef}>
        {list.items.map((item, index) => (
          <li key={index} className='list-item'>
            <Checkbox checked={true} disabled={true} />
            <AutoWidthInput
              className='item-name edit-input-item'
              placeholder='Podaj nazwę'
              value={item.name}
              onChange={(e) => {
                const updatedItems = [...list.items];
                updatedItems[index].name = e.target.value;

                isEmpty(updatedItems, index)
                setList(prev => ({ ...prev, items: updatedItems }));
              }} />
            <AutoWidthInput
              className='item-amount edit-input-item'
              placeholder='Podaj ilość'
              value={item.amount !== 0 ? `x${item.amount}` : ''}
              onChange={(e) => {
                const updatedItems = [...list.items];
                updatedItems[index].amount = parseInt(e.target.value.replace('x', '')) || 0;

                isEmpty(updatedItems, index);
                setList(prev => ({ ...prev, items: updatedItems }));
              }} />
          </li>
        ))}
      </ul>
      <button className='save-button' onClick={() => {
        console.log(list)
      }}>ListData</button>
    </div>
  );
};

export default EditList;