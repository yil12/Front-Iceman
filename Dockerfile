# ===============================
# ETAPA 1: Build de React (CRA)
# ===============================
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Build de producción
RUN npm run build


# ===============================
# ETAPA 2: Nginx
# ===============================
FROM nginx:alpine

# Borramos config por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos el build de React
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]