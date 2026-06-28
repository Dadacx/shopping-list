import '../styles/EditList.css';
import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Checkbox from './Checkbox';
import AutoWidthInput from './AutoWidthInput';
import { showPopup } from './Popup/Popup';
import { ReactComponent as BackIcon } from '../images/back.svg';
import { ReactComponent as SaveIcon } from '../images/save.svg';

import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const EditList = ({ data, saveData }) => {
  const { id } = useParams();
  const [list, setList] = useState(JSON.parse(JSON.stringify(data.lists.find(l => l.id === parseInt(id)))));
  const [transfrList, setTransfrList] = useState([]);
  const listRef = useRef(null);
  const transferSelectRef = useRef(null);
  const transferMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const saveList = () => {
    if (!list.name.trim()) {
      alert('Nazwa listy nie może być pusta!');
      return;
    }

    list.timestamp = Date.now();
    console.log('Saving list:', list);
    const trimmedItems = list.items.map(item => ({ ...item, name: item.name.trim() })); // usuwanie spacji z nazw produktów
    const updatedLists = data.lists.map(l => l.id === list.id ? { ...list, items: trimmedItems } : l);
    const updatedData = { ...data, lists: updatedLists };
    saveData(updatedData);
    showPopup({ message: "Lista została zapisana", type: "success", duration: 5000, border: true, icon: true });
    navigate(-1)
  }

  const nextInput = (e) => {
    const inputs = listRef.current.querySelectorAll('input.edit-input-item');
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);

    if (currentIndex < inputs.length - 1) {
      inputs[currentIndex + 1].focus();
    } else if (currentIndex === inputs.length - 1) {
      const newItem = { id: list.items[list.items.length - 1].id + 1, name: '', amount: 0, checked: false };
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

  const test = (inputElement, position = 'end') => {
    if (!inputElement) return;
    inputElement.focus();

    // Ustawiamy kursor w następnym ticku event loop, żeby focus zdążył się ustawić
    setTimeout(() => {
      const dlugoscTekstu = inputElement.value ? inputElement.value.length : 0;
      if (position === 'start') {
        inputElement.setSelectionRange(0, 0);
      } else if (position === 'end') {
        inputElement.setSelectionRange(dlugoscTekstu, dlugoscTekstu);
      } else if (position === 'selectAll') {
        inputElement.setSelectionRange(0, dlugoscTekstu);
      }
    }, 0);
  }

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

        // setList(prev => ({ ...prev, items: updatedItems }));

        // Przenosimy focus na poprzedni input
        setTimeout(() => {
          setList(prev => ({ ...prev, items: updatedItems }));

          // jeśli to pierwszy input, nie robimy nic więcej
          if (currentIndex === 0) {
            document.activeElement.blur();
            return;
          };

          const newInputs = listRef.current.querySelectorAll('input.edit-input-item');
          const newIndex = Math.min(currentIndex - 1, newInputs.length - 1);
          if (newIndex >= 0) {
            e.preventDefault();
            // newInputs[newIndex].focus();
            test(newInputs[newIndex]);
          }
        }, 0);
      } else if (currentIndex > 0) {
        e.preventDefault();
        // Standardowe zachowanie - przejście do poprzedniego inputa
        // inputs[currentIndex - 1].focus();
        test(inputs[currentIndex - 1]);
      }
    } else if (currentIndex > 0 && currentInputEmpty) {
      e.preventDefault();
      // Standardowe zachowanie - przejście do poprzedniego inputa
      // inputs[currentIndex - 1].focus();
      test(inputs[currentIndex - 1]);
    }
  };

  useEffect(() => {
    const enter = (e) => e.key === "Enter" && nextInput(e);
    const backspace = (e) => e.key === "Backspace" && handleBackspace(e);
    const arrowNav = (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      const inputs = listRef.current.querySelectorAll('input.edit-input-item');
      const currentIndex = Array.from(inputs).indexOf(document.activeElement);
      const active = document.activeElement;
      if (!active || active.tagName !== 'INPUT') return;

      const start = active.selectionStart;
      const end = active.selectionEnd;
      const valueLen = (active.value || '').length;

      // Left / Right: przechodzimy tylko gdy caret jest na krawędzi
      if (e.key === 'ArrowRight' && start === end && start === valueLen) {
        if (currentIndex < inputs.length - 1) {
          e.preventDefault();
          const next = inputs[currentIndex + 1];
          test(next, 'start');
        }
        return;
      }

      if (e.key === 'ArrowLeft' && start === end && start === 0) {
        if (currentIndex > 0) {
          e.preventDefault();
          const prev = inputs[currentIndex - 1];
          test(prev, 'end');
        }
        return;
      }

      // Up / Down: poruszamy się wierszami; fokusujemy pole z ilością i ustawiamy caret na końcu
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const cols = 2; // name, amount
        const row = Math.floor(currentIndex / cols);
        const totalRows = Math.ceil(inputs.length / cols);

        let targetRow = row;
        if (e.key === 'ArrowUp') {
          if (row === 0) return;
          targetRow = row - 1;
        } else if (e.key === 'ArrowDown') {
          if (row >= totalRows - 1) return;
          targetRow = row + 1;
        }

        const targetIndex = targetRow * cols + 1; // zawsze fokusuj pole z ilością
        const target = inputs[targetIndex];
        if (target) {
          e.preventDefault();
          test(target, 'end');
        }
      }
    };
    document.addEventListener("keydown", enter);
    document.addEventListener("keydown", backspace);
    document.addEventListener("keydown", arrowNav);
    return () => {
      document.removeEventListener("keydown", enter);
      document.removeEventListener("keydown", backspace);
      document.removeEventListener("keydown", arrowNav);
    };
  }, [list.items]);

  const hasChanges = (list, originalList) => {
    const cleanOriginal = {
      ...originalList,
      items: originalList.items.map(item => ({ ...item }))
    };
    return JSON.stringify(list) !== JSON.stringify(cleanOriginal);
  };

  function close() {
    if (hasChanges(list, data.lists.find(list => list.id === parseInt(id)))) {
      if (window.confirm("Masz niezapisane zmiany. Czy na pewno chcesz wyjść?")) navigate(-1)
    } else {
      navigate(-1)
    }
  }

  function transferItems() {
    const date = Date.now();
    const targetListId = parseInt(transferSelectRef.current.value);
    const targetList = data.lists.find(l => l.id === targetListId);
    const updatedTargetList = {
      ...targetList,
      items: [...targetList.items, ...transfrList.map(item => ({ ...item, checked: false }))],
      timestamp: date
    };
    const updatedList = {
      ...list,
      items: list.items.filter(item => !transfrList.includes(item)),
      timestamp: date
    }
    const updatedLists = data.lists.map(l => {
      if (l.id === list.id) {
        return updatedList;
      } else if (l.id === targetListId) {
        return updatedTargetList;
      }
      return l;
    });
    setList(updatedList);
    const updatedData = { ...data, lists: updatedLists };
    saveData(updatedData);
    setTransfrList([]);
    showPopup({ message: "Produkty zostały przeniesione", type: "success", duration: 5000, border: true, icon: true });
  }

  useEffect(() => {
    if (Capacitor.getPlatform() === 'web') return;

    const handler = App.addListener('backButton', (event) => {
      // zamiast cofania/wyjścia wołamy Twoją funkcję
      console.log(handler)
      close();
    });

    return () => {
      handler.remove(); // sprzątamy gdy wychodzisz z tego komponentu
    };
  }, [list, data]); // dodajemy list i data do zależności, bo close ich używa

  return (
    <div className="edit-list">
      <div className='list-header'>
        <div className='back' onClick={close}>
          <BackIcon className='back-icon' style={{ color: 'var(--color)' }} />
        </div>
        <input className='list-title' type="text" placeholder='Podaj tytuł listy' defaultValue={list.name} onChange={(e) => {
          const updatedList = { ...list, name: e.target.value };
          setList(updatedList);
        }} />
        <div className='list-buttons'>
          <div className='save-button btn' onClick={saveList}>
            <SaveIcon style={{ color: 'var(--color)' }} />
          </div>
        </div>
      </div>
      <div className='line'></div>
      <ul className='list-items' ref={listRef}>
        {list.items.map((item, index) => (
          <li key={index} className='list-item'>
            <Checkbox onChange={(e) => { e.target.checked ? setTransfrList([...transfrList, item]) : setTransfrList(transfrList.filter(i => i !== item)) }} />
            <AutoWidthInput
              className={`item-name edit-input-item ${item.checked ? 'checked' : ''}`}
              placeholder='Podaj nazwę'
              value={item.name}
              onChange={(e) => {
                const updatedItems = [...list.items];
                updatedItems[index].checked = false
                updatedItems[index].name = e.target.value;
                setList(prev => ({ ...prev, items: updatedItems }));
              }} />
            <input
              className={`item-amount edit-input-item ${item.checked ? 'checked' : ''}`}
              placeholder='Podaj ilość'
              enterKeyHint="done"
              value={item.amount !== 0 ? `x${item.amount}` : ''}
              onChange={(e) => {
                const updatedItems = [...list.items];
                updatedItems[index].checked = false
                updatedItems[index].amount = parseInt(e.target.value.replace('x', '')) || 0;
                setList(prev => ({ ...prev, items: updatedItems }));
              }} />
          </li>
        ))}
      </ul>

        <div className={`transfer-menu`} style={{ bottom: transfrList.length > 0 ? '0px' : undefined }} ref={transferMenuRef}>
          <div className='transfer-header'>
            <h1 style={{margin: '0'}}>Przenieś zaznaczone do:</h1>
          </div>
          <select className='transfer-select' ref={transferSelectRef}>
            {data.lists.filter(l => l.id !== list.id).map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          <button className='confirm-transfer-btn' onClick={transferItems}>Przenieś</button>
        </div>
    </div>
  );
};

export default EditList;