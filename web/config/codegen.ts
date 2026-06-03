import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  ignoreNoDocuments: true,
  schema: '../api/src/schema.gql',
  documents: 'src/**/*.graphql',
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },
    },
  },
};

export default config;
