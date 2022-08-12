import type { FunctionComponent } from 'react';
import { useEffect } from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import { Dialog, SocketLogger, Toast, Layout } from 'components';
import { useStore } from 'store';

import { CreatePack, Home, Library, PlayingRoom, ViewPackTypes } from './Pages';

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
      <Layout>
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
      </Layout>
      <SocketLogger />
      <Dialog />
      <Toast />
    </BrowserRouter>
  );
});
