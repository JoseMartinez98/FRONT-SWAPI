<script setup>
import '~/assets/css/style.css';
import { ref, onMounted, watch } from 'vue';
import { fetchPersonajes, deletePersonaje } from '~/services/api.js';

const personajes = ref([]);
const currentPage = ref(1);
const lastPage = ref(null);
const activeIndex = ref(null);
const naveAEliminar = ref(null);
const searchPersonaje = ref('');

const loadPersonajes = async (page = 1, search = '') => {
  const { personajes: data, currentPage: pageNum, lastPage: last } = await fetchPersonajes(page, search);
  personajes.value = data;
  currentPage.value = pageNum;
  lastPage.value = last;
};

onMounted(() => loadPersonajes());

watch(searchPersonaje, async (newName) => {
  if (!newName) {
    loadPersonajes();
  } else {
    loadPersonajes(1, newName);
  }
});

const confirmarEliminacion = (id) => {
  naveAEliminar.value = id;
};

const cancelarEliminacion = () => {
  naveAEliminar.value = null;
};

const eliminarPersonaje = async (id) => {
  const success = await deletePersonaje(id);
  if (success) {
    personajes.value = personajes.value.filter(p => p.id_personajes !== id);
    naveAEliminar.value = null;
    alert('Personaje eliminado exitosamente');
  } else {
    alert('Hubo un error al intentar eliminar el personaje');
  }
};

// Paginación
const nextPage = () => currentPage.value < lastPage.value && loadPersonajes(currentPage.value + 1);
const prevPage = () => currentPage.value > 1 && loadPersonajes(currentPage.value - 1);
const firstPage = () => loadPersonajes(1);
const lastPageFunc = () => loadPersonajes(lastPage.value);

// Obtener imagen
const getImageUrl = (url) => {
  if (!url) return '/personajes/default.png';
  if (!url.startsWith('http')) {
    const carpeta = url.includes('nave') ? 'naves' : 'personajes';
    return `http://127.0.0.1:8000/${carpeta}/${url}`;
  }
  return url;
};

// Manejar activo
const toggleActive = (index) => {
  personajes.value.forEach((n, i) => (n.activo = i === index ? !n.activo : false));
  activeIndex.value = personajes.value[index].activo ? index : null;
};
</script>


<template>
<div>
  
  <div class="listaPj">
    <ul class="scale">
      <h1>Lista de personajes:</h1>
      <div class="busqueda">
        <input v-model="searchPersonaje" type="text" placeholder="Buscar personaje..." class="input-busqueda">
      </div>
      <li class="scaleLi" v-for="(personaje, index) in personajes" :key="personaje.id_personajes"
          :class="{ active: personaje.activo }" @click="toggleActive(index)">
        <div class="nombrePersonaje">
          <div><img class="imgPerfil" :src="getImageUrl(personaje.image_url)" alt="Imagen del personaje"/></div>
          {{ personaje.name }}
          <div v-if="naveAEliminar === personaje.id_personajes">
            <button class="sii" @click.stop="eliminarPersonaje(personaje.id_personajes)">Sí, eliminar</button>
            <button class="noo" @click.stop="cancelarEliminacion">Cancelar</button>
          </div>
          <button v-else class="botonEliminarNave" @click.stop="confirmarEliminacion(personaje.id_personajes)">Eliminar personaje</button>
        </div>
        <div class="personaje-container">
          <div class="info" v-show="personaje.activo">
            <div>- Género: {{ personaje.gender }}</div>
            <div>- Cumpleaños: {{ personaje.birth_year }}</div>
            <div>- Altura: {{ personaje.height }} cm</div>
            <div>- Peso: {{ personaje.mass }} kg</div>
          </div>
          <img class="img2" :src="getImageUrl(personaje.image_url)" alt="Imagen del personaje"/>
          <ul class="ulInfo">
            <li class="LiInfo2" v-for="nave in personaje.naves" :key="nave.naves">
              {{ nave.name }} <img class="imgPjNave" :src="nave.image_url" alt="Imagen de la nave"/>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
  <div class="paginacion">
    <button class="botonPasar" @click="firstPage" :disabled="currentPage === 1"> ⏮️ </button>
    <button class="botonPasar" @click="prevPage" :disabled="currentPage === 1">Anterior</button>
    <span>Página {{ currentPage }} de {{ lastPage }}</span>
    <button class="botonPasar" @click="nextPage" :disabled="currentPage === lastPage">Siguiente</button>
    <button class="botonPasar" @click="lastPageFunc" :disabled="currentPage === lastPage"> ⏭️ </button>
  </div>
</div>
</template>

<style scoped>

.busqueda{
  justify-content: center;
  align-items: center;
  display: flex;
}
.input-busqueda {
  width: 30%;
  padding: 10px;
  margin-left: 30%;
  margin-right: 30%;
  margin: 20px;
  font-size: 16px;
  border: 2px solid #ffffff;
  background-color: rgb(79, 78, 78);
  color: rgb(251, 255, 0) !important;
  border-radius: 5px;
  outline: none;
}
.input-busqueda:focus{
  outline: none;
  border: 2px solid yellow;
}

.botonPasar:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.scaleLi {
  background: url('~/assets/img/fondoSelector.jpg');
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: cover;
}

.scaleLi.active {
  background-image: url('~/assets/img/fondo3.jpg');
}

.scaleLi.active .ulInfo {
  min-width: 33%;
}

.scaleLi.active .ulInfo .LiInfo2 {
  background: url('~/assets/img/fondoSelector2.jpg') !important;
}
.sii {
  font-size: 15px;
  padding: 10px;
  background-color: red;
  color: black;
  border: 5px solid rgb(70, 2, 2);
  border-radius: 10px;
}
.noo {
  font-size: 15px;
  padding: 10px;
  background-color: green;
  color: black;
  border: 5px solid rgb(3, 78, 15);
  border-radius: 10px;
}
</style>
