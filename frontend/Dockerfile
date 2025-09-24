# frontend/Dockerfile
# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files first for caching of npm install
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app (public/, src/, etc.)
COPY . .

# Build the React app
RUN npm run build

# ---- Production stage ----
FROM nginx:alpine
# Copy the build output to Nginx's default html folder
COPY --from=build /app/build /usr/share/nginx/html

# (Optional) If you have custom nginx.conf for API proxying, copy it
COPY nginx.conf /root/Desktop/ecs-project/frontend/nginx.conf

# Expose port 80 and run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

