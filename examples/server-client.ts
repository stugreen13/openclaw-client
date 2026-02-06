/**
 * Server-side client example
 *
 * This example demonstrates using ServerOpenClawClient
 * for automatic connection lifecycle management.
 */

import { createServerClient } from '../src/index';

async function main() {
  // Create server client from environment variables
  // Expects: OPENCLAW_GATEWAY_URL and OPENCLAW_TOKEN
  const serverClient = createServerClient();

  try {
    console.log('Executing server operations...\n');

    // Use withClient for automatic connection management
    const result = await serverClient.withClient(async (client) => {
      // All operations run within a single connection
      const [agents, models, sessions] = await Promise.all([
        client.listAgents(),
        client.listModels(),
        client.listSessions({ limit: 5 }),
      ]);

      return {
        agentCount: agents.agents.length,
        modelCount: models.models.length,
        sessionCount: Array.isArray(sessions) ? sessions.length : 0,
      };
    });

    console.log('Results:', result);

    // You can call withClient multiple times
    // Each call gets a fresh connection
    const config = await serverClient.withClient(async (client) => {
      return client.getConfig();
    });

    console.log('\nConfig retrieved successfully');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
