import type { Handler } from 'aws-lambda';
import type { Schema } from '../data/resource';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/readerLambda';

export const handler: Handler = async (event) => {
  console.log('readerLambda invoked');

  // Configure Amplify Data client for Lambda
  const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
  Amplify.configure(resourceConfig, libraryOptions);
  const client = generateClient<Schema>();
  console.log('Amplify Data client generated.');

  // List all Secret models
  console.log('Listing all Secret models...');
  const { errors, data: secrets } = await client.models.Secret.list();
  if (errors && errors.length > 0) {
    console.error('Error listing secrets:', errors);
    throw new Error('Error listing secrets: ' + errors.map(e => e.message).join(', '));
  }

  // Log secrets data (WARNING: redact in production if sensitive)
  console.log('Secrets data:', secrets);

  // Return the array as plain JSON to avoid returning typed objects/classes
  const plainSecrets = JSON.parse(JSON.stringify(secrets));
  return plainSecrets || [];
}; 