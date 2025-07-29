import { useRef, useEffect } from 'react';

const AutoWidthInput = ({ value = '', placeholder = '', onChange, ...props }) => {
  const inputRef = useRef(null);
  const mirrorRef = useRef(null);

  useEffect(() => {
    if (mirrorRef.current && inputRef.current) {
      // mirrorRef.current.textContent = value || placeholder;
      mirrorRef.current.textContent = (value && value !== '') ? value : placeholder;
      inputRef.current.style.width = mirrorRef.current.offsetWidth + 'px';
    }
  }, [value, placeholder]);

  return (
    <div className='auto-width-input' style={{ position: 'relative', display: 'inline-block' }}>
      <input
        {...props}
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={{
          font: 'inherit',
          boxSizing: 'content-box',
          width: '1ch',
          ...props.style,
        }}
      />
      <span
        ref={mirrorRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          visibility: 'hidden',
          whiteSpace: 'pre',
          font: 'inherit',
        }}
      />
    </div>
  );
};

export default AutoWidthInput;
