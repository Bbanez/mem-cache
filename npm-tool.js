const { createConfig } = require('@banez/npm-tool');
const { createFS } = require('@banez/fs');

const fs = createFS({ base: process.cwd() });

module.exports = createConfig({
  bundle: {
    extend: [
      {
        title: 'Remove tests',
        task: async () => {
          await fs.deleteDir(['dist', 'test']);
        },
      },
    ],
  },
});
