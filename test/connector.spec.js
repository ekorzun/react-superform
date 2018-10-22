import React from 'react';
import ReactDOM from 'react-dom';
import { configure, mount } from 'enzyme';
import { expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() });

import './helpers/browser'

import SuperForm from '../src'

class App extends React.Component {
  render() {
    return (
      <SuperForm
        
      />
    )
  }
}

const ConnectedApp = App



describe('App component testing', () => {

  let wrapper


  it('loading state', done => {
    wrapper = mount(<ConnectedApp />)
    expect(wrapper.find('.loading')).to.have.lengthOf(1)
    done()
  })

})