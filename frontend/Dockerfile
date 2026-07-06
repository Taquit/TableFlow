FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el directorio de Prisma primero para generar el cliente
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar el resto del código fuente
COPY . .

EXPOSE 4000

# Comando para arrancar la aplicación en desarrollo
CMD ["npm", "run", "dev"]