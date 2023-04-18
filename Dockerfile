FROM node:16.19-alpine as node

WORKDIR /usr/src/app/frontend

# A wildcard is used to ensure both package files are copied
COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=node /usr/src/app/frontend/dist/school-management-system-sms /usr/share/nginx/html
