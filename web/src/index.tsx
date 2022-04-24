import 'normalize.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import './index.css';

import { store } from 'store';
import { App } from './app/App';

ReactDOM.render(
  <StrictMode>
    <Provider {...store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root'),
);
