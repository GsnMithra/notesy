FROM node:latest

WORKDIR /app
COPY . .

RUN npm i

EXPOSE 3000

CMD ["npm", "run", "dev"] 
