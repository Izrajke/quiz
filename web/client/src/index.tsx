import 'normalize.css';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'mobx-react';

import './index.css';
import { App } from './app/App';
import { store } from './store';

ReactDOM.render(
  <StrictMode>
    <Provider {...store}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root'),
);
