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

  // 👇 Verificar si la Data API devolvió un error
  if (response.data.errors) {
    throw new Error(`Data API error: ${JSON.stringify(response.data.errors)}`);
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