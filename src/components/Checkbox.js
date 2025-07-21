import '../styles/Checkbox.css';
import { useId } from 'react';

const Checkbox = ({ checked = false, onChange, size = "20px" }) => {
    const id = useId();

    return (
        <div className="checkbox-wrapper-23">
            <input
                type="checkbox"
                id={id}
                defaultChecked={checked}
                onChange={onChange}
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
