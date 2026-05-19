const axios = require('axios');

const ASTRA_ENDPOINT = process.env.ASTRA_ENDPOINT;
const ASTRA_TOKEN = process.env.ASTRA_TOKEN;
const ASTRA_KEYSPACE = process.env.ASTRA_KEYSPACE || 'default_keyspace';

// Endpoint de CQL
const CQL_ENDPOINT = `${ASTRA_ENDPOINT}/v1/keyspaces/${ASTRA_KEYSPACE}/cql`;

const apiClient = axios.create({
  baseURL: CQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Cassandra-Token': ASTRA_TOKEN
  }
});

async function executeQuery(cql, parameters = []) {
  // Payload corregido: la API espera { cql: "...", parameters: [...] }
  const payload = { cql };
  if (parameters && parameters.length > 0) {
    payload.parameters = parameters;
  }

  try {
    const response = await apiClient.post('', payload);

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

async function getUsuarios() {
  const result = await executeQuery('SELECT * FROM usuarios');
  return result.data || [];
}

async function insertUsuario(id, nombre, email) {
  const result = await executeQuery(
    'INSERT INTO usuarios (id, nombre, email) VALUES (?, ?, ?)',
    [id, nombre, email]
  );
  return result;
}

module.exports = { executeQuery, getUsuarios, insertUsuario };