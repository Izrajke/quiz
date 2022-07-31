import type { FunctionComponent } from 'react';
import { useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CreatePack, Home, Library, PlayingRoom, ViewPackTypes } from './Pages';
import { Dialog, SocketLogger, Toast } from 'components';
import { useStore } from 'store';

import './App.css';

export const App: FunctionComponent = observer(() => {
  const { app } = useStore();

  useEffect(() => {
    app.init();
    // eslint-disable-next-line
  }, []);

  // TODO: Продумать лоадер какой-то
  if (!app.isInit) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<PlayingRoom />} />
        <Route path="pack">
          <Route
            path="create"
            element={<CreatePack viewType={ViewPackTypes.create} />}
          />
          <Route
            path=":id"
            element={<CreatePack viewType={ViewPackTypes.view} />}
          />
        </Route>
        <Route path="/library" element={<Library />} />
      </Routes>
      <SocketLogger />
      <Dialog />
      <Toast />
    </BrowserRouter>
  );
});
