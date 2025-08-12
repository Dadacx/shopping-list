import './styles/main.css'
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { PopupManager } from './components/Popup/Popup';
import Start from './components/Start';
import List from './components/List';
import EditList from './components/EditList';

function App() {
  const getData = () => {
    const data = localStorage.getItem('shoppingListData');
    return data ? JSON.parse(data) : null;
  };

  const [data, setData] = useState(getData());
  const [theme, setTheme] = useState(data?.theme || "light")


  const saveData = (data) => {
    console.log("Saving data to localStorage:", data);
    localStorage.setItem('shoppingListData', JSON.stringify(data));
    setData(data);
    // console.log("Data saved:", data);
  };
  const changeTheme = (theme) => {
    const tmpData = { ...data };
    tmpData.theme = theme;
    saveData(tmpData);
  };

  document.querySelector("body").setAttribute("data-theme", theme)

  if (!data) {
    const defaultData = {
      "theme": "light",
      "next_id": 1,
      "lists": []
    }
    setData(defaultData);
    saveData(defaultData);
  }

  console.log(data);
  return (
    <div className="container">
      <PopupManager />
      <BrowserRouter basename="/">
        <Routes>
          {/* <Route path="/" element={<Outlet />}> */}
          <Route index element={<Start data={data} saveData={saveData} theme={theme} setTheme={setTheme} changeTheme={changeTheme} />} />
          <Route path="/:id" element={<List data={data} saveData={saveData} />} />
          <Route path="/edit/:id" element={<EditList data={data} saveData={saveData} />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
