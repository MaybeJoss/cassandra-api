// cassandra-client.js
const axios = require('axios');

const ASTRA_ENDPOINT = process.env.ASTRA_ENDPOINT;
const ASTRA_TOKEN = process.env.ASTRA_TOKEN;
const ASTRA_KEYSPACE = process.env.ASTRA_KEYSPACE || 'default_keyspace';

async function initDatabase() {
  try {
    // Crear keyspace si no existe
    await executeQuery(`CREATE KEYSPACE IF NOT EXISTS ${ASTRA_KEYSPACE}
                        WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}`);
    // Usar el keyspace
    await executeQuery(`USE ${ASTRA_KEYSPACE}`);
    // Crear tabla usuarios si no existe
    await executeQuery(`CREATE TABLE IF NOT EXISTS usuarios (
                        id text PRIMARY KEY,
                        nombre text,
                        email text
                      )`);
    console.log('Base de datos y tabla inicializadas');
  } catch (err) {
    console.error('Error inicializando la base de datos:', err.message);
  }
}

module.exports = { executeQuery, getUsuarios, insertUsuario, initDatabase };

const apiClient = axios.create({
  baseURL: `${ASTRA_ENDPOINT}/api/json/v1/${ASTRA_KEYSPACE}`,
  headers: {
    'Content-Type': 'application/json',
    'X-Cassandra-Token': ASTRA_TOKEN
  }
});

// Función para ejecutar comandos (CQL) a través de la Data API
async function executeQuery(cql, args = {}) {
  const response = await apiClient.post('', {
    query: cql,
    args: args
  });
  return response.data;
}

// Ejemplo: obtener todos los registros de una tabla
async function getUsuarios() {
  const result = await executeQuery('SELECT * FROM usuarios');
  return result.data;
}

// Ejemplo: insertar un usuario
async function insertUsuario(id, nombre, email) {
  const result = await executeQuery(
    'INSERT INTO usuarios (id, nombre, email) VALUES (?, ?, ?)',
    { id, nombre, email }
  );
  return result;
}

module.exports = { executeQuery, getUsuarios, insertUsuario };