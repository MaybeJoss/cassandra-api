const axios = require('axios');

const ASTRA_ENDPOINT = process.env.ASTRA_ENDPOINT;
const ASTRA_TOKEN = process.env.ASTRA_TOKEN;
const ASTRA_KEYSPACE = process.env.ASTRA_KEYSPACE || 'default_keyspace';

// Usamos el endpoint de CQL, no el de JSON API
const CQL_ENDPOINT = `${ASTRA_ENDPOINT}/v1/keyspaces/${ASTRA_KEYSPACE}/cql`;

const apiClient = axios.create({
  baseURL: CQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Cassandra-Token': ASTRA_TOKEN
  }
});

async function executeQuery(cql, args = []) {
  // El payload espera un campo "query" con la sentencia CQL
  const payload = { query: cql };
  if (args && args.length > 0) {
    payload.args = args;
  }
  const response = await apiClient.post('', payload);

  // Verificar si hay errores en la respuesta
  if (response.data.errors && response.data.errors.length > 0) {
    const errorMsg = response.data.errors.map(e => e.message).join(', ');
    throw new Error(`CQL API error: ${errorMsg}`);
  }

  return response.data;
}

async function getUsuarios() {
  const result = await executeQuery('SELECT * FROM usuarios');
  // La respuesta viene en result.data (array de filas)
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