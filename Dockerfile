FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build
RUN npx prisma generate


EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate dev && npm run start:dev"]