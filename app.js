const express = require('express');
const { getUsuarios, insertUsuario } = require('./cassandra-client');

const app = express();
app.use(express.json());

// Endpoint de salud (verifica que las variables de entorno estén)
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
  const { id, nombre, email } = req.body;
  try {
    await insertUsuario(id, nombre, email);
    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`);
});