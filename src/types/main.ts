export type MemStoreQuery<Item> = (item: Item) => unknown;

export interface MemStoreState<Entity> {
  [id: string]: Entity;
}

export type MemStoreEventType = 'add' | 'update' | 'remove';

export type MemStoreEventHandler<Entity> = (
  type: MemStoreEventType,
  entity: Entity,
) => void;

export type MemStoreMethodsFunction<Entity, Methods = unknown> = (data: {
  state: MemStoreState<Entity>;
  self: MemStore<Entity, unknown>;
  config: MemStoreConfig<Entity, Methods>;
}) => Methods;

/**
 * Configuration object for the mem-cache handler.
 */
export interface MemStoreConfig<Entity, Methods> {
  idKey: keyof Entity;
  /**
   * Name of the handler. Used for organizing logs and errors.
   */
  name: string;
  validation?: (
    entity: Entity,
    config: MemStoreConfig<Entity, Methods>,
    self: MemStore<Entity, Methods>,
  ) => boolean;
  /**
   * Custom methods for the mem-cache handler.
   */
  methods?: MemStoreMethodsFunction<Entity, Methods>;
}

export interface MemStore<Entity, Methods> {
  /**
   * Returns a name of the handler.
   */
  name(): string;
  /**
   * Returns all items that match the query.
   */
  find(query: MemStoreQuery<Entity>): Entity[];
  /**
   * Returns a first items which matches the query.
   */
  findOne(query: MemStoreQuery<Entity>): Entity | null;
  /**
   * Returns all items.
   */
  findAll(): Entity[];
  /**
   * Returns all items with matching IDs.
   */
  findAllById(ids: string[]): Entity[];
  /**
   * Returns item with matching ID.
   */
  findById(id: string): Entity | null;
  /**
   * Add new item or update existing.
   */
  set(entity: Entity | Entity[]): void;
  /**
   * Remove existing item by its ID.
   */
  remove(id: string | string[]): void;
  clear(): void;
  /**
   * Subscribe to events. This method returns a function which should be
   * called to unsubscribe the handler.
   */
  subscribe(handler: MemStoreEventHandler<Entity>): () => void;
  /**
   * Custom methods specified in the handler configuration object.
   */
  methods: Methods;
}
