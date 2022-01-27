import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home, PlayingRoom } from './Pages';
import { SocketLogger, Dialog } from 'components';

import { useStore } from '../store';

import './App.css';

export const App: FunctionComponent = observer(() => {
  const { app } = useStore();

  useEffect(() => {
    app.init();
  }, [app]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={`/room/${app.roomId}`} element={<PlayingRoom />} />
      </Routes>
      <SocketLogger />
      <Dialog />
    </BrowserRouter>
  );
});
