const axios = require('axios');

const ASTRA_ENDPOINT = process.env.ASTRA_ENDPOINT;
const ASTRA_TOKEN = process.env.ASTRA_TOKEN;
const ASTRA_KEYSPACE = process.env.ASTRA_KEYSPACE || 'default_keyspace';

// Endpoint de CQL
const CQL_ENDPOINT = `${ASTRA_ENDPOINT?.replace(/\/$/, '')}/api/rest/v2/cql`;

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
    payload.values = parameters;
  }

  try {
    const response = await axios.post(CQL_ENDPOINT, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',   // exactamente lo que espera la API
        'X-Cassandra-Token': ASTRA_TOKEN
      }
    });

    // Manejo de errores devueltos por la API
    if (response.data.errors && response.data.errors.length > 0) {
      const errorMsg = response.data.errors.map(e => e.message).join(', ');
      throw new Error(`CQL API error: ${errorMsg}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // Error HTTP (4xx, 5xx)
      throw new Error(`CQL API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    // Error de red o de código
    throw error;
  }
}

// El resto del código se mantiene igual
async function getUsuarios() {
  await executeQuery(`SELECT * FROM ${ASTRA_KEYSPACE}.usuarios`);
  return result.data || [];
}

async function insertUsuario(id, nombre, email) {
  const result = await executeQuery(
    'INSERT INTO default_keyspace.usuarios (id, nombre, email) VALUES (?, ?, ?)',
    [id, nombre, email]
  );
  return result;
}

module.exports = { executeQuery, getUsuarios, insertUsuario };