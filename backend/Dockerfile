FROM node:22-alpine

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm@11.10.0

# --- CONFIGURACIÓN NUEVA ---
# Le decimos a pnpm que guarde su caché estrictamente en el directorio de trabajo
# para evitar conflictos de volúmenes con Docker Compose
RUN pnpm config set store-dir /app/.pnpm-store
# ---------------------------

# Copiar los archivos de definición de paquetes
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Instalar las dependencias usando pnpm
RUN pnpm install

# Copiar el esquema de Prisma ANTES del resto del código
COPY prisma ./prisma/

# Generar el cliente de Prisma (usando pnpm exec en lugar de npx)
RUN pnpm exec prisma generate

# Copiar el resto del código fuente del backend
COPY . .

EXPOSE 4000

# Comando para arrancar el servidor en desarrollo
CMD ["pnpm", "run", "dev"]