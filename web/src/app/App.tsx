import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home, PlayingRoom, CreatePack } from './Pages';
import { SocketLogger, Dialog, Toast } from 'components';
import { useStore } from 'store';

import './App.css';

export const App: FunctionComponent = observer(() => {
  const { app } = useStore();

  useEffect(() => {
    app.init();
    // eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<PlayingRoom />} />
        <Route path="/createPack" element={<CreatePack />} />
      </Routes>
      <SocketLogger />
      <Dialog />
      <Toast />
    </BrowserRouter>
  );
});
