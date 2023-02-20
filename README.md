# Simple in Memory Store

Save data in memory with some nice to have utilities.

## Get started

- Install package: `npm i --save @banez/mem-store`
- Create store collections:

```ts
import { createMemStore } from '@banez/mem-store';

const todos = createMemStore({
  name: 'Todo',
});
```
