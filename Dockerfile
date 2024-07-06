FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Build the app.
RUN npm run build

# Expose port 3000 for the app.
EXPOSE 3000

CMD ["npm", "start"]