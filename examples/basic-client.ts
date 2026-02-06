/**
 * Basic client example
 *
 * This example shows how to connect to OpenClaw Gateway,
 * list agents, and handle events.
 */

import { OpenClawClient } from '../src/index';

async function main() {
  // Create client instance
  const client = new OpenClawClient({
    gatewayUrl: 'ws://localhost:18789',
    token: process.env.OPENCLAW_TOKEN || '',
    clientId: 'example-client',
    clientVersion: '1.0.0',
    platform: 'node',
    mode: 'cli',
  });

  try {
    // Connect to the gateway
    console.log('Connecting to OpenClaw Gateway...');
    const hello = await client.connect();
    console.log('Connected!', {
      protocol: hello.protocol,
      serverVersion: hello.server.version,
      connectionId: hello.server.connId,
    });

    // Add event listener
    const removeListener = client.addEventListener((event) => {
      console.log('Event received:', event.event, event.payload);
    });

    // List available agents
    console.log('\nListing agents...');
    const { agents, defaultId } = await client.listAgents();
    console.log(`Default agent: ${defaultId}`);
    console.log('Available agents:');
    agents.forEach((agent) => {
      console.log(`  - ${agent.id}: ${agent.name || 'Unnamed'}`);
    });

    // List available models
    console.log('\nListing models...');
    const { models } = await client.listModels();
    console.log('Available models:');
    models.forEach((model) => {
      console.log(`  - ${model.id} (${model.provider})`);
    });

    // Get configuration
    console.log('\nGetting configuration...');
    const config = await client.getConfig();
    console.log('Config keys:', Object.keys(config));

    // Clean up
    removeListener();
    client.disconnect();
    console.log('\nDisconnected');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
