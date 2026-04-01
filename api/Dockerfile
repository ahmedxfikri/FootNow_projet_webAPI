FROM node:20-bookworm-slim

WORKDIR /app

# OpenSSL for Prisma & Build tools for bcrypt
RUN apt-get update && apt-get install -y openssl ca-certificates libssl-dev build-essential python3 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["sh", "entrypoint.sh"]


# COPY . .
# EXPOSE 3070
#CMD ["npm", "run", "dev"]
