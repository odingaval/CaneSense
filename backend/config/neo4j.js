const neo4j = require('neo4j-driver');
let driver = null;

if (process.env.NEO4J_URI) {
  try {
    driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME || 'neo4j', process.env.NEO4J_PASSWORD || '')
    );
    console.log('Neo4j driver initialized');
  } catch (err) {
    console.error('Failed to initialize Neo4j driver:', err.message);
  }
} else {
  console.log('NEO4J_URI not set — running with mock data');
}

module.exports = { driver };
