FROM node:22-alpine

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm@11.10.0

# Copiar los archivos de definición de paquetes
# Nota: pnpm usa pnpm-lock.yaml en lugar de package-lock.json
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Instalar las dependencias usando pnpm
RUN pnpm install

# Copiar el resto de tu código fuente
COPY . .

EXPOSE 3000

# Ejecutar en modo desarrollo con pnpm
CMD ["pnpm", "run", "dev", "--", "--host"]