# E-commers

Este proyecto contiene un backend en Express y un frontend en React. Para iniciar el backend asegúrate de crear un archivo `.env` con las siguientes variables:

```
MONGO_URI=<cadena de conexión a MongoDB>
JWT_SECRET=<secreto para JWT>
EMAIL_USER=<usuario de correo para enviar verificaciones>
EMAIL_PASS=<contraseña del correo>
BASE_URL=<url pública del frontend>
ADMIN_CODE=<código especial para crear administradores>
```

Si al registrarse se proporciona un código que coincida con `ADMIN_CODE`, el usuario será creado con el rol de administrador.

