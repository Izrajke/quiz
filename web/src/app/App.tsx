import type { FunctionComponent } from 'react';

import { Provider } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home, PlayingRoom } from './Pages';
import { SocketLogger, Dialog, Toast } from 'components';

import { store } from '../store';

import './App.css';

export const App: FunctionComponent = observer(() => {
  return (
    <Provider {...store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={`/room/:id`} element={<PlayingRoom />} />
        </Routes>
        <SocketLogger />
        <Dialog />
      </BrowserRouter>
      <Toast />
    </Provider>
  );
});
