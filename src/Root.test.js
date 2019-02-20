import React from 'react';
import { shallow } from 'enzyme';
import Root from './Root';
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();

xit('renders without crashing', () => {
  const store = mockStore();
  shallow(<Root store={store} />);
});
