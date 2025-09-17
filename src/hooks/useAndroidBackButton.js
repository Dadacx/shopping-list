import { useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router'
import { Toast } from '@capacitor/toast'; // opcjonalnie

export default function useAndroidBackButton(options = {}) {
    const navigate = useNavigate();
    const doubleBackToExit = options.doubleBackToExit || false;
    const isHamburgerMenuOpen = options.isHamburgerMenuOpen || false;
    const setHamburgerMenuOpen = options.setHamburgerMenuOpen || (() => { });
    const lastBack = useRef(null);
    const handlerRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const onBack = async (event) => {
            if (location.pathname.startsWith('/edit')) {
                return; // nie rób nic, EditList obsłuży sam
            }
            if (isHamburgerMenuOpen) {
                setHamburgerMenuOpen(false);
                return;
            }
            // jeśli webview ma historię cofania -> wracamy w React Router
            if (event.canGoBack) {
                navigate(-1);
                return;
            }

            // jeśli jesteśmy na "root"
            if (doubleBackToExit) {
                const now = Date.now();
                if (lastBack.current && now - lastBack.current < 2000) {
                    await App.exitApp(); // wyjście z aplikacji
                    return;
                }
                lastBack.current = now;
                await Toast.show({ text: 'Naciśnij ponownie, aby wyjść' });
                return;
            }

            // jeśli nie chcemy wyjścia ani double-back, to po prostu nic
        };

        const maybeHandle = App.addListener('backButton', onBack);
        Promise.resolve(maybeHandle).then((h) => {
            handlerRef.current = h;
        });

        return () => {
            try {
                handlerRef.current?.remove?.();
            } catch (e) { }
        };
    }, [navigate, doubleBackToExit, isHamburgerMenuOpen]);
}
