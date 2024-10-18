# Entrega 2.1:

### Modificar las rutas de la API para pruebas con iOS Bundled:
##### En hybrid-frontend/app/beers/BeersIndex.jsx  y hybrid-frontend/app/beers/BeerShow.jsx
* Modificarn en las llamada a la API: 'http://192.168.1.89:3001" por 'http://<LOCAL_IP>:3001" 
##### Lo mismo en hybrid-frontend/app/login.jsx , hybrid-frontend/app/logout.jsx , hybrid-frontend/app/Signup.jsx

# En hybrid-frontend:
* 1. Dependencias: npm install
* 2. Iniciar Expo: npx expo start --clear   

# En backend:
* 1. Dependencias: bundle install
* 2. Base de datos: rails db:create db:migrate db:seed
* 3. Iniciar servidor: rails server -b 0.0.0.0 -p 3001


