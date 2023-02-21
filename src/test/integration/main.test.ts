import { expect } from 'chai';
import { createMemStore } from '../../main';

interface StoreItem {
  id: string;
  name: string;
}

const store = createMemStore<
  StoreItem,
  { findByName(name: string): StoreItem | null }
>({
  idKey: 'id',
  name: 'Test',
  methods({ state }) {
    return {
      findByName(name) {
        for (const id in state) {
          if (state[id].name === name) {
            return state[id];
          }
        }
        return null;
      },
    };
  },
});

describe('Memory Store', async () => {
  it('should add items', () => {
    store.set([
      {
        id: '1',
        name: 'Test 1',
      },
      {
        id: '2',
        name: 'Test 2',
      },
      {
        id: '3',
        name: 'Test 3',
      },
    ]);
  });
  it('should check if items were added', () => {
    const items = store.findAll();
    expect(items).to.be.a('array');
    expect(items.length).to.eq(3);
  });
  it('should update an item', () => {
    store.set({
      id: '2',
      name: 'Test 4',
    });
  });
  it('should check if item was updated', () => {
    const item = store.findById('2');
    if (!item) {
      throw Error('Item does not exist');
    }
    expect(item).to.have.property('name').to.eq('Test 4');
  });
});
