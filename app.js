const express = require('express');
const { getUsuarios, insertUsuario } = require('./cassandra-client');

const app = express();
app.use(express.json());

// Endpoint de salud
app.get('/health', (req, res) => {
  if (!process.env.ASTRA_ENDPOINT || !process.env.ASTRA_TOKEN) {
    return res.status(500).json({ status: 'error', message: 'Missing Astra config' });
  }
  res.json({ status: 'ok', database: 'Astra DB (Data API)' });
});

// Endpoint listar usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint crear usuario
app.post('/api/usuarios', async (req, res) => {
  console.log('Body recibido:', req.body);
  const { id, nombre, email } = req.body || {};
  if (!id || !nombre || !email) {
    return res.status(400).json({ error: 'Faltan campos: id, nombre, email' });
  }
  try {
    await insertUsuario(id, nombre, email);
    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    console.error('Error en insertUsuario:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`);
});