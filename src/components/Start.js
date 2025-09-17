import '../styles/Start.css';
import { useState } from 'react';
import NavBar from './NavBar';
import ListCard from './ListCard';
import HamburgerMenu from './HamburgerMenu';
import CopyToClipboard from './CopyToClipboard';
import { showPopup } from './Popup/Popup';
import { ReactComponent as AddListIcon } from '../images/add_list.svg';
import { ReactComponent as ExportIcon } from '../images/export.svg';
import { ReactComponent as DeleteIcon } from '../images/delete.svg';
import { ReactComponent as DupliceIcon } from '../images/duplice.svg';
// import { ReactComponent as PalleteIcon } from '../images/pallete.svg';
import { Link } from 'react-router-dom';

import useAndroidBackButton from '../hooks/useAndroidBackButton';

const Start = ({ data, saveData, theme, setTheme, changeTheme }) => {
    const [selectedLists, setSelectedLists] = useState([]);
    const [isHamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);

    const toggleHamburgerMenu = () => {
        setHamburgerMenuOpen(!isHamburgerMenuOpen);
    };

    const handleContextMenu = (e, id) => {
        e.preventDefault();
        setSelectedLists(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const exportSelectedLists = () => {
        const exportData = {
            id: 'shoppingList',
            lists_count: selectedLists.length,
            lists: data.lists.filter(list => selectedLists.includes(list.id)),
        };
        const jsonString = JSON.stringify(exportData);

        CopyToClipboard(
            jsonString,
            () => {
                showPopup({ message: "Zaznaczone listy zostały skopiowane do schowka", type: "success", duration: 5000, border: true, icon: true });
                setSelectedLists([]);
            },
            () => {
                showPopup({ message: "Nie udało się skopiować list", type: "error", duration: 5000, border: true, icon: true });
            }
        );
    };

    const deleteSelectedLists = () => {
        if (!window.confirm("Czy na pewno chcesz usunąć zaznaczone listy?")) return;
        const updatedLists = data.lists.filter(list => !selectedLists.includes(list.id));
        const updatedData = { ...data, lists: updatedLists };
        saveData(updatedData);
        showPopup({ message: "Zaznaczone listy zostały usunięte", type: "success", duration: 5000, border: true, icon: true });
        setSelectedLists([]);
    };

    const dupliceSelectedLists = () => {
        const updatedLists = data.lists.filter(list => selectedLists.includes(list.id)).map(list => ({
            ...list,
            id: data.next_id++,
        }));
        const updatedData = { ...data, lists: [...data.lists, ...updatedLists] };
        saveData(updatedData);
        showPopup({ message: "Zaznaczone listy zostały zduplikowane", type: "success", duration: 5000, border: true, icon: true });
        setSelectedLists([]);
    };

    useAndroidBackButton({ doubleBackToExit: true, isHamburgerMenuOpen, setHamburgerMenuOpen });

    return (
        <>
            <NavBar toggleMenu={toggleHamburgerMenu} />
            <div className={`hamburger-menu-container ${isHamburgerMenuOpen ? 'open' : ''}`} style={{ visibility: isHamburgerMenuOpen ? 'visible' : 'hidden' }}>
                <HamburgerMenu isOpen={isHamburgerMenuOpen} toggleMenu={toggleHamburgerMenu} theme={theme} setTheme={setTheme}
                    changeTheme={changeTheme} data={data} saveData={saveData} />
            </div>
            <div className='list-container'>
                {data.lists.map(list => {
                    return <ListCard key={list.id} list={list} handleContextMenu={handleContextMenu} selectedLists={selectedLists} setSelectedLists={setSelectedLists} />;
                })}
            </div>
            {data.lists.length === 0 && (<div className='error empty-list-message'>Brak list do wyświetlenia</div>)}
            {selectedLists.length === 0 ? <Link onClick={() => {
                const newList = { id: data.next_id, name: 'Lista bez tytułu', items: [{id: 1, name: '', amount: 0, checked: false }], timestamp: Date.now() };
                const updatedData = { ...data, lists: [...data.lists, newList], next_id: data.next_id + 1 };
                saveData(updatedData);
            }} to={`/edit/${data.next_id}`} className='add-list-button'>
                <AddListIcon style={{ color: 'var(--color)' }} />
            </Link> : <div className='selected-lists-menu'>
                <div className='btn export-btn' onClick={exportSelectedLists}>
                    <ExportIcon style={{ color: 'var(--color)', width: '30px', height: '30px' }} />
                    <div className='text'>Eksportuj</div>
                </div>
                <div className='btn delete-btn' onClick={deleteSelectedLists}>
                    <DeleteIcon style={{ color: 'var(--color)', width: '30px', height: '30px' }} />
                    <div className='text'>Usuń</div>
                </div>
                <div className='btn duplice-btn' onClick={dupliceSelectedLists}>
                    <DupliceIcon style={{ color: 'var(--color)', width: '30px', height: '30px' }} />
                    <div className='text'>Duplikuj</div>
                </div>
                {/* <div className='btn adjust-btn'>
                    <PalleteIcon style={{ color: 'var(--color)', width: '30px', height: '30px' }} />
                    <div className='text'>Dostosuj</div>
                </div> */}
            </div>}
        </>
    );
};

export default Start;