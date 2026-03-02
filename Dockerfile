FROM node:20.15.1-alpine3.20 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 
 
FROM nginx:1.22.1-alpine as prod-stage

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/location.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
