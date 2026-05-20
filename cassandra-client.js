const axios = require('axios');

const ASTRA_ENDPOINT = process.env.ASTRA_ENDPOINT;
const ASTRA_TOKEN = process.env.ASTRA_TOKEN;
const ASTRA_KEYSPACE = process.env.ASTRA_KEYSPACE || 'default_keyspace';

// Endpoint de CQL
//const CQL_ENDPOINT = `${ASTRA_ENDPOINT?.replace(/\/$/, '')}/api/rest/v2/cql`;
const CQL_ENDPOINT = `${ASTRA_ENDPOINT}/api/rest/v2/cql`;

const apiClient = axios.create({
  baseURL: CQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Cassandra-Token': ASTRA_TOKEN
  }
});

async function executeQuery(cql, parameters = []) {
  const payload = { cql };
  if (parameters && parameters.length > 0) {
    payload.parameters = parameters;
  }

  try {
    // Petición manual con JSON.stringify y headers explícitos para evitar charset
    const response = await axios.post(
      CQL_ENDPOINT,
      JSON.stringify(payload),          // ← convertimos a string JSON
      {
        headers: {
          'Content-Type': 'application/json',   // sin charset
          'X-Cassandra-Token': ASTRA_TOKEN
        }
      }
    );

    if (response.data.errors && response.data.errors.length > 0) {
      const errorMsg = response.data.errors.map(e => e.message).join(', ');
      throw new Error(`CQL API error: ${errorMsg}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `CQL API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      );
    }
    throw error;
  }
}

async function getUsuarios() {
  const result = await executeQuery('SELECT * FROM default_keyspace.usuarios');
  return result.data || [];
}

async function insertUsuario(id, nombre, email) {
  const result = await executeQuery(
    'INSERT INTO default_keyspace.usuarios (id, nombre, email) VALUES (?, ?, ?)',
    [id, nombre, email]
  );
  return result;
}

async function insertUsuario(id, nombre, email) {
  const result = await executeQuery(
    'INSERT INTO default_keyspace.usuarios (id, nombre, email) VALUES (?, ?, ?)',
    [id, nombre, email]
  );
  return result;
}

module.exports = { executeQuery, getUsuarios, insertUsuario };