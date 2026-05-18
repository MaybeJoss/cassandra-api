# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias de producción
RUN npm ci --only=production

# Copia el resto del código fuente (incluye app.js, cassandra-client.js)
COPY . .

# Expone el puerto que usará tu API
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "app.js"]