import './styles/main.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Start from './components/Start';
import List from './components/List';
import testData from './test.json'

function App() {
  console.log(testData);
  return (
    <div className="container">
      <BrowserRouter basename="/">
        <Routes>
          {/* <Route path="/" element={<Outlet />}> */}
            <Route index element={<Start data={testData} />} />
            <Route path="/:id" element={<List data={testData} />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
