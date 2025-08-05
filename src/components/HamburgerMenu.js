import '../styles/HamburgerMenu.css';
import ThemeSwitch from './ThemeSwitch';
import { ReactComponent as BackIcon } from '../images/back.svg';
import { ReactComponent as ImportIcon } from '../images/import.svg';
import { useRef, useState } from 'react';
import { showPopup } from './Popup/Popup';

const HamburgerMenu = ({ isOpen, toggleMenu, theme, setTheme, changeTheme, data, saveData }) => {
    const [showImportTextarea, setShowImportTextarea] = useState(false);
    const importTextareaRef = useRef(null);

    const importLists = () => {
        const importData = importTextareaRef.current.value.trim();
        if (!importData) {
            showPopup({ message: "Wklej dane do importu", type: "error", duration: 5000, border: true, icon: true });
            return;
        }
        try {
            const importDataJSON = JSON.parse(importData);
            if (importDataJSON.id !== 'shoppingList') {
                return showPopup({ message: "Nieprawidłowy format danych do importu", type: "error", duration: 5000, border: true, icon: true });
            }
            console.log("Importing data:", importDataJSON);
            const importedLists = importDataJSON.lists.map(list => ({ ...list, id: data.next_id++ })) // Assign new IDs
            const updatedData = {
                ...data,
                lists: [...data.lists, ...importedLists],
            };
            saveData(updatedData);
            showPopup({ message: "Listy zakupów zostały zaimportowane", type: "success", duration: 5000, border: true, icon: true });
            setShowImportTextarea(false);

        } catch (error) {
            console.error('Błąd podczas importowania danych:', error);
            showPopup({ message: "Nieprawidłowy format danych do importu", type: "error", duration: 5000, border: true, icon: true });
        }
    }

    return (
        <div className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
            <div className="hamburger-menu-header">
                <ThemeSwitch theme={theme} setTheme={setTheme} changeTheme={changeTheme} />
                <BackIcon className="hamburger-menu-back-icon" onClick={toggleMenu} />
            </div>
            <div className="hamburger-menu-content">
                <div className='btn import-btn' onClick={() => { setShowImportTextarea(!showImportTextarea) }}>
                    <ImportIcon style={{ color: 'var(--color)', width: '30px', height: '30px' }} />
                    <div className='text'>Importuj listy zakupów</div>
                </div>
                {showImportTextarea && <div className='import-panel'>
                    <textarea ref={importTextareaRef} className='import-textarea' placeholder='Wklej tutaj dane listy zakupów' />
                    <button onClick={importLists}>Importuj</button>
                </div>}
            </div>
        </div>
    );
}

export default HamburgerMenu;