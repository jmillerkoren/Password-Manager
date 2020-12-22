# building react app
FROM node:alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./package.json

RUN npm install
RUN npm install react-scripts@3.0.1 -g

COPY . ./
RUN npm run build

# setting up nginx server to serve built static files
FROM nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf



