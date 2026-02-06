/**
 * Event listening example
 *
 * This example shows how to listen for and handle
 * real-time events from OpenClaw Gateway.
 */

import { OpenClawClient } from '../src/index';

async function main() {
  const client = new OpenClawClient({
    gatewayUrl: 'ws://localhost:18789',
    token: process.env.OPENCLAW_TOKEN || '',
    clientId: 'event-listener',
    clientVersion: '1.0.0',
    platform: 'node',
    mode: 'cli',
  });

  try {
    console.log('Connecting to OpenClaw Gateway...');
    await client.connect();
    console.log('Connected! Listening for events...\n');

    // Add multiple event listeners
    const listeners = [
      client.addEventListener((event) => {
        console.log('[RAW EVENT]', JSON.stringify(event, null, 2));
      }),

      client.addEventListener((event) => {
        if (event.event === 'agent.event') {
          console.log('[AGENT EVENT]', event.payload);
        }
      }),

      client.addEventListener((event) => {
        if (event.event === 'chat.event') {
          console.log('[CHAT EVENT]', event.payload);
        }
      }),
    ];

    // Keep the process running to listen for events
    console.log('Press Ctrl+C to exit\n');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down...');
      listeners.forEach((remove) => remove());
      client.disconnect();
      process.exit(0);
    });

    // Keep alive
    await new Promise(() => {});

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
