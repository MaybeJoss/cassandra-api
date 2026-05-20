const axios = require('axios');

const ASTRA_ENDPOINT = (process.env.ASTRA_ENDPOINT || '').replace(/\/$/, '');
const ASTRA_TOKEN = process.env.ASTRA_TOKEN;
const ASTRA_KEYSPACE = process.env.ASTRA_KEYSPACE || 'default_keyspace';

// Base de la API REST de Astra
const BASE = `${ASTRA_ENDPOINT}/api/rest/v2/keyspaces/${ASTRA_KEYSPACE}`;

const headers = {
  'Content-Type': 'application/json',
  'X-Cassandra-Token': ASTRA_TOKEN
};

// Obtener todos los usuarios
async function getUsuarios() {
  const response = await axios.get(`${BASE}/usuarios/rows`, { headers });
  // La respuesta tiene { count, data: [...] }
  return response.data.data || [];
}

// Insertar un nuevo usuario
async function insertUsuario(id, nombre, email) {
  await axios.post(`${BASE}/usuarios`, { id, nombre, email }, { headers });
}

// Por si algún otro código requiere executeQuery (ya no se usa, pero lo exportamos vacío por compatibilidad)
async function executeQuery() {
  throw new Error('executeQuery no está implementado. Usa getUsuarios/insertUsuario.');
}

module.exports = { executeQuery, getUsuarios, insertUsuario };