FROM node:18

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install 

# ENV PORT=4000

EXPOSE 4000

CMD ["node", "index.js"]