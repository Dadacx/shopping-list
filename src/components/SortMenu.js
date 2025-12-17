import '../styles/SortMenu.css';
import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as CloseIcon } from '../images/close.svg';

const SortMenu = ({ children, isSortMenuOpen, setSortMenuOpen, title="Sortuj" }) => {
    const menuRef = useRef(null);
    const [menuHeight, setMenuHeight] = useState(100000);

    const items = React.Children.toArray(children);

    const itemsWithSeparators = items.flatMap((child, index) => {
        if (index === items.length - 1) return child; // ostatni element bez separatora
        return [child, <div key={`sep-${index}`} className='sort-line'></div>];
    });

    useEffect(() => {
        if (menuRef.current) {
            const height = menuRef.current.offsetHeight;
            setMenuHeight(height + 5);
        }
    }, [children, isSortMenuOpen]);

    return (
        <div ref={menuRef} className={`sort-menu ${isSortMenuOpen ? 'open' : ''}`} style={{ "--sort-menu-height": `-${menuHeight}px` }}>
            <div className='sort-header'>
                <h1>{title}</h1>
                <CloseIcon style={{ color: 'var(--color)' }} className='close-sort-menu' onClick={() => setSortMenuOpen(false)} />
            </div>
            {itemsWithSeparators}
        </div>
    )
};

const Option = ({ onClick, children }) => {
    return (
        <div className="sort-option" onClick={onClick}>
            {children}
        </div>
    );
}

SortMenu.Option = Option;

export default SortMenu;
