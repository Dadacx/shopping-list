import '../styles/Start.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import ListCard from './ListCard';
import HamburgerMenu from './HamburgerMenu';
import CopyToClipboard from './CopyToClipboard';
import SortMenu from './SortMenu';
import { showPopup } from './Popup/Popup';
import { ReactComponent as AddListIcon } from '../images/add_list.svg';
import { ReactComponent as ExportIcon } from '../images/export.svg';
import { ReactComponent as DeleteIcon } from '../images/delete.svg';
import { ReactComponent as DupliceIcon } from '../images/duplice.svg';
// import { ReactComponent as PalleteIcon } from '../images/pallete.svg';

import useAndroidBackButton from '../hooks/useAndroidBackButton';

const Start = ({ data, saveData, theme, setTheme, changeTheme }) => {
    const [selectedLists, setSelectedLists] = useState([]);
    const [isHamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
    const [isSortMenuOpen, setSortMenuOpen] = useState(false);
    const navigate = useNavigate();

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

    const sortLists = (type) => {
        var updatedList;
        if (type === 'a-z') {
            const sortedLists = [...data.lists].sort((a, b) => a.name.localeCompare(b.name));
            updatedList = { ...data, lists: sortedLists };
        } else if (type === 'z-a') {
            const sortedLists = [...data.lists].sort((a, b) => b.name.localeCompare(a.name));
            updatedList = { ...data, lists: sortedLists };
        } else if (type === 'oldest') {
            const sortedLists = [...data.lists].sort((a, b) => a.id - b.id);
            updatedList = { ...data, lists: sortedLists };
        } else if (type === 'newest') {
            const sortedLists = [...data.lists].sort((a, b) => b.id - a.id);
            updatedList = { ...data, lists: sortedLists };
        } else if (type === 'last-modified') {
            const sortedLists = [...data.lists].sort((a, b) => b.timestamp - a.timestamp);
            updatedList = { ...data, lists: sortedLists };
        }
        saveData(updatedList);
    }

    const addNewList = () => {
        const listName = window.prompt("Podaj nazwe listy (może być pusta)");
        if (listName !== null) {
            const newList = { id: data.next_id, name: listName || "Lista bez tytułu", items: [{ id: 1, name: '', amount: 0, checked: false }], timestamp: Date.now() };
            const updatedData = { ...data, lists: [...data.lists, newList], next_id: data.next_id + 1 };
            saveData(updatedData);
            navigate(`/edit/${newList.id}`);
        }
    }

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
            <NavBar toggleMenu={toggleHamburgerMenu} setSortMenuOpen={setSortMenuOpen} />
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
            {selectedLists.length === 0 ? <div onClick={addNewList} className='add-list-button'>
                <AddListIcon style={{ color: 'var(--color)' }} />
            </div> : <div className='selected-lists-menu'>
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
            <SortMenu isSortMenuOpen={isSortMenuOpen} setSortMenuOpen={setSortMenuOpen}>
                <SortMenu.Option onClick={() => sortLists('a-z')}>Od A-Z</SortMenu.Option>
                <SortMenu.Option onClick={() => sortLists('z-a')}>Od Z-A</SortMenu.Option>
                <SortMenu.Option onClick={() => sortLists('oldest')}>Od najstarszych</SortMenu.Option>
                <SortMenu.Option onClick={() => sortLists('newest')}>Od najnowszych</SortMenu.Option>
                <SortMenu.Option onClick={() => sortLists('last-modified')}>Od ostatnio modyfikowanych</SortMenu.Option>
            </SortMenu>
        </>
    );
};

export default Start;