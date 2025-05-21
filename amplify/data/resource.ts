import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";


// Define the schema with the Secret model
const schema = a.schema({
  Todo: a.model({
    id: a.id().required(),
  }).authorization(allow => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
  },
});

