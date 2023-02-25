# Base image
FROM node:18-alpine

# Create app directory 
WORKDIR /user/src/app
 
# Bundle app source
COPY . .
  
# Expose port 3000
EXPOSE 3000

# Creates a "dist" folder with the production build
RUN npm run build
 
USER node
 
# Start the server using the production build
CMD ["npm", "run", "start:prod"]