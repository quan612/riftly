FROM node:16.15.0-alpine
 
WORKDIR /usr/src/app
COPY . .
 
# Install production dependencies.
# RUN npm ci --only=production
RUN npm install


RUN npm run build
CMD [ "npm", "start" ]
EXPOSE 3000