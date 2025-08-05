import { useRef, useEffect } from 'react';

const AutoWidthInput = ({ value = '', placeholder = '', onChange, maxWidth, ...props }) => {
  const inputRef = useRef(null);
  const mirrorRef = useRef(null);

  useEffect(() => {
    if (mirrorRef.current && inputRef.current) {
      mirrorRef.current.textContent = value !== '' ? value : placeholder;

      const spanWidth = mirrorRef.current.offsetWidth;
      const parentWidth = inputRef.current.parentElement.parentElement.clientWidth || Infinity;
      const maxAllowedWidth = maxWidth || parentWidth - 60;

      mirrorRef.current.style.maxWidth = maxAllowedWidth + 'px';
      inputRef.current.style.width = Math.min(spanWidth, maxAllowedWidth) + 'px';
    }
  }, [value, placeholder, maxWidth]);

  return (
    <div
      className="auto-width-input"
      style={{
        position: 'relative',
        display: 'inline-block',
        maxWidth: maxWidth ? maxWidth + 'px' : 'calc(100% - 60px)',
      }}
    >
      <input
        {...props}
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={{
          font: 'inherit',
          boxSizing: 'content-box',
          width: '1ch', // bazowa szerokość zanim JS zadziała
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
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default AutoWidthInput;
