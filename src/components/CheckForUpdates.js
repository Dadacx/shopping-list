import { useEffect, useState } from 'react';
import pkg from '../../package.json';
import { showPopup } from './Popup/Popup';

const CheckForUpdates = () => {
   const [updateAvailable, setUpdateAvailable] = useState(false);

   useEffect(() => {
       const checkForUpdates = async () => {
           const response = await fetch('https://dadacx.github.io/shopping-list/package.json');
           const data = await response.json();
           const isUpdateAvailable = data.version !== pkg.version;
           if (isUpdateAvailable) {
               showPopup({ message: `Dostępna jest nowa wersja aplikacji! Kliknij tutaj, aby ją pobrać.`, type: "info", duration: 10000, border: true, icon: true, onClick: () => window.open('https://github.com/Dadacx/shopping-list/releases/latest', '_blank') });
           }
           setUpdateAvailable(isUpdateAvailable);
       };

       checkForUpdates();
   }, []);

   return (
       <>
           {updateAvailable && (
               <div onClick={() => window.open('https://github.com/Dadacx/shopping-list/releases/latest', '_blank')} className='update-info'>Dostępna jest nowa wersja aplikacji!<br />Kliknij tutaj, aby ją pobrać.</div>
           )}
       </>
   );
}

export default CheckForUpdates;