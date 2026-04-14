FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

ENV EXPO_NO_TELEMETRY=1

CMD ["npx", "expo", "start", "--web", "--port", "3000", "--non-interactive"]
