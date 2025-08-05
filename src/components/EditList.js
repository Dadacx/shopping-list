import '../styles/EditList.css';
import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import Checkbox from './Checkbox';
import AutoWidthInput from './AutoWidthInput';
import { showPopup } from './Popup/Popup';
import { ReactComponent as BackIcon } from '../images/back.svg';
import { ReactComponent as SaveIcon } from '../images/save.svg';

const EditList = ({ data, saveData }) => {
  const { id } = useParams();
  const [list, setList] = useState(data.lists.find(list => list.id === parseInt(id)));
  const listRef = useRef(null);

  const saveList = () => {
    if (!list.name.trim()) {
      alert('Nazwa listy nie może być pusta!');
      return;
    }

    list.timestamp = Date.now();
    console.log('Saving list:', list);
    const updatedLists = data.lists.map(l => l.id === list.id ? list : l);
    const updatedData = { ...data, lists: updatedLists };
    saveData(updatedData);
    showPopup({ message: "Lista została zapisana", type: "success", duration: 5000, border: true, icon: true });
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
          updatedInputs?.[updatedInputs.length - 2]?.focus();
        }, 0);

        return updatedList;
      });
    }
  };

  const handleBackspace = (e) => {
    const inputs = listRef.current.querySelectorAll('input.edit-input-item');
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    
    // Sprawdzamy czy aktualny input jest pusty
    const currentInputEmpty = document.activeElement.value === '';
    
    // Jeśli backspace na pierwszym inpucie i oba inputy są puste
    if (currentInputEmpty && currentIndex % 2 === 0) {
      const itemIndex = Math.floor(currentIndex / 2);
      const item = list.items[itemIndex];
      
      // Sprawdzamy czy oba pola (nazwa i ilość) są puste
      if (item.name === '' && item.amount === 0 && list.items.length > 1) {
        e.preventDefault();
        
        const updatedItems = [...list.items];
        updatedItems.splice(itemIndex, 1);
        
        setList(prev => ({ ...prev, items: updatedItems }));
        
        // Przenosimy focus na poprzedni input
        setTimeout(() => {
          const newInputs = listRef.current.querySelectorAll('input.edit-input-item');
          const newIndex = Math.min(currentIndex - 1, newInputs.length - 1);
          if (newIndex >= 0) {
            newInputs[newIndex].focus();
          }
        }, 0);
      } else if (currentIndex > 0) {
        // Standardowe zachowanie - przejście do poprzedniego inputa
        inputs[currentIndex - 1].focus();
      }
    } else if (currentIndex > 0 && currentInputEmpty) {
      // Standardowe zachowanie - przejście do poprzedniego inputa
      inputs[currentIndex - 1].focus();
    }
  };

  useEffect(() => {
    const enter = (e) => e.key === "Enter" && nextInput(e);
    const backspace = (e) => e.key === "Backspace" && handleBackspace(e);
    document.addEventListener("keydown", enter);
    document.addEventListener("keydown", backspace);
    return () => {
      document.removeEventListener("keydown", enter);
      document.removeEventListener("keydown", backspace);
    };
  }, [list.items]); // Dodajemy zależność, aby useEffect reagował na zmiany listy

  return (
    <div className="edit-list">
      <div className='list-header'>
        <Link to={`/${id}`} className='back'>
          <BackIcon className='back-icon' style={{ color: 'var(--color)' }} />
        </Link>
        <input className='list-title' type="text" placeholder='Podaj tytuł listy' defaultValue={list.name} onChange={(e) => {
          const updatedList = { ...list, name: e.target.value };
          setList(updatedList);
        }} />
        <div className='list-buttons'>
          <Link to={`/${id}`} className='save-button btn' onClick={saveList}>
            <SaveIcon style={{ color: 'var(--color)' }} />
          </Link>
        </div>
      </div>
      <div className='line'></div>
      <ul className='list-items' ref={listRef}>
        {list.items.map((item, index) => (
          <li key={index} className='list-item'>
            <Checkbox defaultChecked={true} disabled={true} />
            <AutoWidthInput
              className='item-name edit-input-item'
              placeholder='Podaj nazwę'
              value={item.name}
              onChange={(e) => {
                const updatedItems = [...list.items];
                updatedItems[index].name = e.target.value;
                setList(prev => ({ ...prev, items: updatedItems }));
              }} />
            <input
              className='item-amount edit-input-item'
              placeholder='Podaj ilość'
              value={item.amount !== 0 ? `x${item.amount}` : ''}
              onChange={(e) => {
                const updatedItems = [...list.items];
                updatedItems[index].amount = parseInt(e.target.value.replace('x', '')) || 0;
                setList(prev => ({ ...prev, items: updatedItems }));
              }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditList;