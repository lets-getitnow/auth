import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";

// Define the Lambda function
export const readerLambda = defineFunction({
  name: "readerLambda",
  entry: "../functions/readerLambda.ts",
});

// Define the schema with the Secret model
const schema = a.schema({
  Secret: a.model({
    id: a.id().required(),
    value: a.string().required(),
    createdAt: a.string().required(),
    updatedAt: a.string().required(),
  }).authorization(allow => [allow.group('admin')]),
  readSecrets: a
    .query()
    .returns(a.string())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(readerLambda)),
}).authorization(allow => [allow.resource(readerLambda).to(['query'])])

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
  },
});

