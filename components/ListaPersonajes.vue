<script setup>
import '~/assets/css/style.css';
import { ref, onMounted, watch } from 'vue'

const personajes = ref([])
const currentPage = ref(1)
const lastPage = ref(null)
const activeIndex = ref(null);
const naveAEliminar = ref(null)
const searchId = ref('')

const fetchPersonajes = async (page = 1) => {
  //Function used to get de API laravel to get all characters with pagination
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/personajes?page=${page}`)
    if (!response.ok) throw new Error('Error al obtener los datos')

    const data = await response.json()
    personajes.value = data.data.map(p => ({ ...p, activo: false }));
    currentPage.value = data.current_page
    lastPage.value = data.last_page
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(() => fetchPersonajes())

watch(searchId, async (newId) => {
//Function that use the API function to watch a specific character 
  if (!newId) {
    fetchPersonajes(); 
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/personajes/${newId}`);
    if (!response.ok) throw new Error('Personaje no encontrado');

    const personaje = await response.json();
    personajes.value = [{ ...personaje, activo: true }]; 
  } catch (error) {
    console.error('Error:', error);
    personajes.value = [];
  }
});



const deletePersonaje = async (id) => {
//Function that use the API function to delete a specific character 

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/personajes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar el personaje');

    personajes.value = personajes.value.filter(p => p.id_personajes !== id);
    naveAEliminar.value = null;
    alert('Personaje eliminado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al intentar eliminar el personaje');
  }
}

//The 2 follow function are used to confirm or cancel the option delete character
const confirmarEliminacion = (naveId) => {
  naveAEliminar.value = naveId;
}

const cancelarEliminacion = () => {
  naveAEliminar.value = null;
}

//The 4 follow function are used to manage the pagination
const nextPage = () => {
  if (currentPage.value < lastPage.value) {
    fetchPersonajes(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchPersonajes(currentPage.value - 1)
  }
}

const firstPage = () => {
  fetchPersonajes(1);
}

const lastPageFunc = () => {
  fetchPersonajes(lastPage.value);
}

//Function used to get de img from local folder
const getImageUrl = (url) => {
  if (!url) {
    return '/personajes/default.png'; 
  }
  
  if (!url.startsWith('http')) {
    const carpeta = url.includes('nave') ? 'naves' : 'personajes'; 
    return `http://127.0.0.1:8000/${carpeta}/${url}`; 
  }
  return url; 
}

//Function used to manage de property "activo" of characters 
const toggleActive = (index) => {
  const personaje = personajes.value[index];

  if (personaje.activo) {
    personaje.activo = false;
    activeIndex.value = null;
  } else {
    personajes.value.forEach((n) => (n.activo = false));
    personaje.activo = true;
    activeIndex.value = index;
  }
}
</script>

<template>
<div>
  
  <div class="listaPj">
    <ul class="scale">
      <h1>Lista de personajes:</h1>
      <div class="busqueda">
        <input v-model="searchId" type="text" placeholder="Buscar por id..." class="input-busqueda">
      </div>
      <li class="scaleLi" v-for="(personaje, index) in personajes" :key="personaje.id_personajes"
          :class="{ active: personaje.activo }" @click="toggleActive(index)">
        <div class="nombrePersonaje">
          <div><img class="imgPerfil" :src="getImageUrl(personaje.image_url)" alt="Imagen del personaje"/></div>
          {{ personaje.name }}
          <div v-if="naveAEliminar === personaje.id_personajes">
            <button class="sii" @click.stop="deletePersonaje(personaje.id_personajes)">Sí, eliminar</button>
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
  color: white;
  border-radius: 5px;
}

.botonPasar:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.scaleLi {
  background: url('~/assets/fondoSelector.jpg');
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: cover;
}

.scaleLi.active {
  background-image: url('~/assets/fondo3.jpg');
}

.scaleLi.active .ulInfo {
  min-width: 33%;
}

.scaleLi.active .ulInfo .LiInfo2 {
  background: url('~/assets/fondoSelector2.jpg') !important;
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
