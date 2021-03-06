/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

 import React from 'react'
 import * as enzyme from 'enzyme'
 import MoveItemTray from 'jsx/move_item/MoveItemTray'

 QUnit.module('MoveItemTray component')

 const defaultProps = () => ({
   title: 'Move Item',
   item: {
     id: '10',
     title: 'Foo Bar',
   },
   moveOptions: {
     siblings: [
       { id: '12', title: 'Making Cake'},
       { id: '30', title: 'Very Hard Quiz'}
     ]
   },
   focusOnExit: () => {},
   formatSaveUrl: () => {},
   onMoveSuccess: () => {},
   onExited: () => {},
   applicationElement: () => document.getElementById('fixtures')
 })

 test('renders the MoveItemTray component', () => {
   const tree = enzyme.mount(<MoveItemTray {...defaultProps()} />)
   ok(tree.exists())
 })

 test('renders one MoveSelect component on initial open', () => {
   const tree = enzyme.shallow(<MoveItemTray {...defaultProps()} />)
   const node = tree.find('MoveSelect')
   equal(node.length, 1);
 })

 test('open sets the state.open to true', () => {
  const tree = enzyme.mount(<MoveItemTray {...defaultProps()} />)
  const instance = tree.instance()
  instance.open()
  ok(instance.state.open)
})

test('close sets the state.open to false', () => {
  const tree = enzyme.mount(<MoveItemTray {...defaultProps()} />)
  const instance = tree.instance()
  instance.close()
  notOk(instance.state.open)
})

test('closing the tray calls onExited', (assert) => {
  const done = assert.async()
  const props = defaultProps()
  props.onExited = sinon.spy()
  const tree = enzyme.mount(<MoveItemTray {...props} />)
  const instance = tree.instance()
  instance.close()
  setTimeout(() => {
    ok(props.onExited.calledOnce)
    done()
  }, 500)
})

test('onMoveSelect calls onMoveSuccess with move data', (assert) => {
  const done = assert.async()
  const props = defaultProps()
  props.onMoveSuccess = sinon.spy()
  const tree = enzyme.mount(<MoveItemTray {...props} />)
  const instance = tree.instance()
  instance.onMoveSelect({ order: ['1', '2', '3'], groupId: '5', itemId: '2' })
  setTimeout(() => {
    ok(props.onMoveSuccess.calledWith, { data: ['1', '2', '3'], groupId: '5', itemId: '2' })
    done()
  })
})

test('calls onFocus on the result of focusOnExit on close', (assert) => {
  const done = assert.async()
  const focusItem = { focus: sinon.spy() }
  const props = defaultProps()
  props.focusOnExit = () => focusItem
  const tree = enzyme.mount(<MoveItemTray {...props} />)
  const instance = tree.instance()
  instance.close()
  setTimeout(() => {
    ok(focusItem.focus.calledOnce)
    done()
  }, 500)
})