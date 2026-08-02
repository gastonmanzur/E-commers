# E-commers

Este proyecto contiene un backend en Express y un frontend en React. Para iniciar el backend asegúrate de crear un archivo `.env` con las siguientes variables:

```
MONGO_URI=<cadena de conexión a MongoDB>
JWT_SECRET=<secreto para JWT>
EMAIL_USER=<usuario de correo para enviar verificaciones>
EMAIL_PASS=<contraseña del correo>
BASE_URL=<url pública del frontend>
```

Todas las cuentas creadas mediante el registro público, incluido el acceso con
Google, reciben el rol `cliente`. No existe un código, formulario ni endpoint
público para crear administradores.

## Administradores

La creación de administradores se realiza de forma controlada por una persona con
acceso autorizado a MongoDB Atlas o Compass. Para promover a un usuario existente,
modifica únicamente su campo `role` de `"cliente"` a `"admin"`. No modifiques
automáticamente el campo `verified` ni otros datos de la cuenta.

Después del cambio, el usuario debe cerrar sesión y volver a ingresar para que el
frontend reciba el rol actualizado. El mismo procedimiento permite conservar y
administrar los roles de los administradores existentes sin exponer su asignación
en el registro público.

Tras registrarte recibirás un correo con un enlace para verificar tu cuenta. Hasta que no confirmes tu email no podrás iniciar sesión.

## Subida de imágenes

Los administradores pueden subir imágenes de productos y promociones mediante el endpoint `/api/upload`. Envía un objeto JSON con el campo `data` que contenga la imagen en formato Base64. El servicio responde con la URL que debes guardar en el producto o promoción.

## Órdenes de compra

Al comprar el carrito se crea una orden mediante `/api/orders`. Los usuarios pueden consultar sus órdenes en `/api/orders/my` y los administradores todas las órdenes en `/api/orders`.

## Filtrado por género

Los productos cuentan con el campo `gender` con valores `femenino`, `masculino` o `unisex`. El listado de productos permite filtrar por género usando el parámetro `gender` en la URL.

## Ejecución del frontend

Para evitar el aviso `Cross-Origin-Opener-Policy policy would block the window.postMessage call`, inicia el frontend con el servidor de desarrollo de Vite y no abras `index.html` directamente.

```bash
cd frontend
npm run dev
```
