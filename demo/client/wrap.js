import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from '../../src';

export default store => Root =>
  <Provider store={store}>
    <RouterProvider store={store}>
      <Root />
    </RouterProvider>
  </Provider>;
