import React from 'react';
import { Provider } from 'react-redux';

export default store => Root =>
  <Provider store={store}>
    <Root />
  </Provider>;
