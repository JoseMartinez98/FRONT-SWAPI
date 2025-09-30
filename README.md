# FRONT-SWAPI

Frontend en **Vue.js** para consumir los datos expuestos por el backend de SWAPI y mostrarlos de forma interactiva.

![Vue](https://img.shields.io/badge/framework-Vue-green) ![Licencia MIT](https://img.shields.io/badge/license-MIT-green)

---

## 🔍 Índice

1. [Descripción](#descripción)
2. [Tecnologías usadas](#tecnologías-usadas)
3. [Características principales](#características-principales)
4. [Instalación](#instalación)
5. [Configuración](#configuración)
6. [Uso / Navegación](#uso--navegación)
7. [Licencia](#licencia)
8. [Contacto](#contacto)

---

## 📝 Descripción

Este proyecto frontend en **Vue.js** consume la API proporcionada por **BACK-SWAPI** para mostrar datos de Star Wars (personajes, planetas, naves, etc.) de forma visual, con filtros, paginación y una interfaz amigable para el usuario.

El frontend maneja estados de carga, errores y permite navegar fácilmente entre vistas.

---

## 🧰 Tecnologías usadas

* Vue 3 con composición API
* Vite (para desarrollo y build)
* JavaScript (ES6+)
* Axios para llamadas HTTP
* Vue Router (navegación entre vistas)
* (Opcional) Pinia o Vuex para estado global
* TailwindCSS / Bootstrap / CSS nativo (ajustar según uso real)

---

## 🚀 Características principales

* Listado de recursos: personajes, planetas, naves, etc.
* Vistas de detalle para cada recurso.
* Paginación de resultados.
* Búsqueda y filtros.
* Manejo de estados: loading, errores, sin resultados.
* Navegación SPA con Vue Router.
* Diseño responsivo para escritorio y móvil.

---

## 📥 Instalación

```bash
# Clona el repositorio
git clone https://github.com/JoseMartinez98/FRONT-SWAPI.git
cd FRONT-SWAPI

# Instala dependencias
npm install
# o yarn install

# Inicia el servidor de desarrollo
npm run dev
```

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz con la URL del backend:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
```

En tu código puedes acceder con:

```js
import.meta.env.VITE_API_BASE_URL
```

---

## 📡 Uso / Navegación

* **Inicio**: listado de personajes (o recurso principal).
* **Filtros**: búsqueda por nombre o parámetros específicos.
* **Detalles**: vista individual con atributos y relaciones.
* **Navegación**: enlaces entre recursos relacionados.
* **Paginación**: botones *Anterior* / *Siguiente* para cambiar de página.

Ejemplo de llamada en Vue con Axios:

```js
import axios from 'axios';

axios.get(`${import.meta.env.VITE_API_BASE_URL}/people/1`)
  .then(res => console.log(res.data));
```

---


## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.
Consulta el archivo `LICENSE` para más detalles.

---

## 📬 Contacto

* Autor: José Martínez
* GitHub: [@JoseMartinez98](https://github.com/JoseMartinez98)
* Email: [josesw98@.com](mailto:tuemail@ejemplo.com)


---

## 🏷️ Estado del proyecto

Actualmente en desarrollo.
Próximas mejoras planificadas:

* Mejoras en diseño y UX.
* Animaciones con Vue transitions.
* Soporte PWA / offline.
* Pruebas end-to-end con Cypress.
