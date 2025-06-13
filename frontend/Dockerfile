FROM node:latest AS base
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

FROM base AS builder
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]