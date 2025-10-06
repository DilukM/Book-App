// Mock for graphql-upload module
const { GraphQLScalarType } = require('graphql');

module.exports = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue: (value) => value,
  serialize: (value) => value,
  parseLiteral: () => null,
});
