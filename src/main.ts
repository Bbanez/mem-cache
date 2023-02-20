import { v4 as uuidv4 } from 'uuid';
import type {
  MemStore,
  MemStoreConfig,
  MemStoreEntity,
  MemStoreEventHandler,
  MemStoreEventType,
  MemStoreState,
} from './types';

export function createMemStore<
  Entity extends MemStoreEntity,
  Methods = unknown,
>(config: MemStoreConfig<Entity, Methods>): MemStore<Entity, Methods> {
  let state: MemStoreState<Entity> = {};
  const subscriptions: {
    [id: string]: MemStoreEventHandler<Entity>;
  } = {};

  function triggerEvent(type: MemStoreEventType, entity: Entity) {
    const ids = Object.keys(subscriptions);
    for (let i = 0; i < ids.length; i++) {
      const sub = subscriptions[ids[i]];
      try {
        sub(type, entity);
      } catch (e) {
        console.error('triggerEvent', e);
      }
    }
  }

  const self: MemStore<Entity, Methods> = {
    name() {
      return '' + config.name;
    },

    find(query) {
      const output: Entity[] = [];
      const ids = Object.keys(state);
      for (let i = 0; i < ids.length; i++) {
        const item = state[ids[i]];
        if (query(item)) {
          output.push(item);
        }
      }
      return output;
    },

    findOne(query) {
      const ids = Object.keys(state);
      for (let i = 0; i < ids.length; i++) {
        const item = state[ids[i]];
        if (query(item)) {
          return item;
        }
      }
      return null;
    },

    findAll() {
      const output: Entity[] = [];
      const ids = Object.keys(state);
      for (let i = 0; i < ids.length; i++) {
        const item = state[ids[i]];
        output.push(item);
      }
      return output;
    },

    findAllById(ids) {
      const output: Entity[] = [];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        if (state[id]) {
          output.push(state[id]);
        }
      }
      return output;
    },

    findById(id) {
      if (state[id]) {
        return state[id];
      }
      return null;
    },

    set(entity) {
      const entities = entity instanceof Array ? entity : [entity];
      for (let i = 0; i < entities.length; i++) {
        const target = entities[i];
        if (!config.validation || config.validation(target, config, self)) {
          const existing = state[target.id];
          if (existing) {
            state[target.id] = target;
            triggerEvent('update', target);
          } else {
            state[target.id] = target;
            triggerEvent('add', target);
          }
        }
      }
    },

    remove(input) {
      const ids = input instanceof Array ? input : [input];
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const entity = state[id];
        if (entity) {
          delete state[id];
          triggerEvent('remove', entity);
        }
      }
    },

    clear() {
      state = {};
    },

    subscribe(handler) {
      const id = uuidv4();
      subscriptions[id] = handler;
      return () => {
        delete subscriptions[id];
      };
    },
    methods: undefined as never,
  };

  if (config.methods) {
    self.methods = config.methods({
      state,
      self,
      config,
    });
  }
  return self;
}
