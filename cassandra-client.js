const axios = require('axios');

const ASTRA_ENDPOINT = process.env.ASTRA_ENDPOINT;
const ASTRA_TOKEN = process.env.ASTRA_TOKEN;
const ASTRA_KEYSPACE = process.env.ASTRA_KEYSPACE || 'default_keyspace';

const apiClient = axios.create({
  baseURL: `${ASTRA_ENDPOINT}/api/json/v1/${ASTRA_KEYSPACE}`,
  headers: {
    'Content-Type': 'application/json',
    'X-Cassandra-Token': ASTRA_TOKEN
  }
});

async function executeQuery(cql, args = []) {
  const response = await apiClient.post('', {
    query: cql,
    args: args
  });

  // Se verifica si la API devolvió algún error en el array 'errors'[reference:0].
  if (response.data.errors && response.data.errors.length > 0) {
    const errorMsg = response.data.errors.map(e => e.message).join(', ');
    throw new Error(`Data API error: ${errorMsg}`);
  }

  return response.data;
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