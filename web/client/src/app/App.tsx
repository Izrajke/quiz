import { useEffect } from 'react';
import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home, PlayingRoom } from './Pages';

import { useStore } from '../store/store';

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
    </BrowserRouter>
  );
});
