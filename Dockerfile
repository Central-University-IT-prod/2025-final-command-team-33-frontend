# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# Копируем package.json отдельно, чтобы кэшировать зависимости
COPY ./src/package.json ./src/package-lock.json ./

# Устанавливаем зависимости
RUN npm install --frozen-lockfile

# Теперь копируем весь код
COPY ./src .
COPY . .

# Собираем проект
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:latest
# Копируем билд фронта в папку, откуда Nginx будет раздавать файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем свой конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY ./ssl /etc/nginx/ssl

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
