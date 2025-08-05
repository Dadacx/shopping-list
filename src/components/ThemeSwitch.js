import '../styles/ThemeSwitch.css'

const ThemeSwitch = ({ theme, setTheme, changeTheme }) => {
  const change_theme = (e) => {
    if (e.target.checked) {
      setTheme("dark")
      document.querySelector("body").setAttribute("data-theme", "dark")
      changeTheme("dark");
    } else {
      setTheme("light")
      document.querySelector("body").setAttribute("data-theme", "light")
      changeTheme("light");
    }
  }

  return (
    <>
      <input type="checkbox" id="toggle" className="toggle--checkbox"  checked={theme === "dark" ? true : false} onChange={change_theme} />
      <label htmlFor="toggle" className="toggle--label">
        <span className="toggle--label-background"></span>
      </label>
    </>
  );
}
export default ThemeSwitch;