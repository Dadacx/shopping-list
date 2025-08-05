import '../styles/Checkbox.css';
import { useId } from 'react';

const Checkbox = ({ checked, defaultChecked = false, onChange, className, size = "20px", disabled = false, readOnly = false }) => {
    const id = useId();

    return (
        <div className={`checkbox-wrapper-23 ${className}`}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                defaultChecked={defaultChecked}
                onChange={onChange}
                disabled={disabled}
                readOnly={readOnly}
            />
            <label htmlFor={id} style={{ '--size': size }}>
                <svg viewBox="0 0 50 50">
                    <path d="M5 30 L 20 45 L 45 5"></path>
                </svg>
            </label>
        </div>
    );
};

export default Checkbox;
