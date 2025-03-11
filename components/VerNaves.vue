<script setup>
import '~/assets/css/style.css';
import { ref, onMounted, watch } from 'vue';

const naves = ref([]);  
const currentPage = ref(1); 
const lastPage = ref(null); 
const personajesDisponibles = ref([]);
const selectedPilotos = ref({});
const deleteSelectedPilotos = ref({});
const activeIndex = ref(null);
const confirmDelete = ref(false);
const naveAEliminar = ref(null);
const searchId = ref('');

const fetchNaves = async (page = 1) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/naves?page=${page}`);
    if (!response.ok) throw new Error('Error al obtener los datos');

    const data = await response.json();
    naves.value = data.data.map(p => ({ ...p, activo: false }));
    currentPage.value = data.current_page; 
    lastPage.value = data.last_page;

  } catch (error) {
    console.error('Error:', error);
  }
}

watch(searchId, async (newId) => {
  if (!newId) {
    fetchNaves(); 
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/naves/${newId}`);
    if (!response.ok) throw new Error('Nave no encontrada');

    const nave = await response.json();
    naves.value = [{ ...nave, activo: true }];
  } catch (error) {
    console.error('Error:', error);
    naves.value = [];
  }
});

const confirmarEliminacion = (naveId) => {
  naveAEliminar.value = naveId;
  confirmDelete.value = true;
};

const cancelarEliminacion = () => {
  confirmDelete.value = false;
  naveAEliminar.value = null;
};

const eliminarNave = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/naves/${naveAEliminar.value}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar la nave');
    await fetchNaves(currentPage.value, naveAEliminar.value);
    confirmDelete.value = false;
    naveAEliminar.value = null;
    alert('Nave eliminada exitosamente');
  } catch (error) {
    console.error('Error:', error);
    alert('Hubo un error al intentar eliminar la nave');
  }
};

const fetchPersonajesDisponibles = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/allPersonajes`);
    if (!response.ok) throw new Error('Error al obtener los personajes disponibles');
    const data = await response.json();
    personajesDisponibles.value = data;
  } catch (error) {
    console.error('Error:', error);
  }
};

const eliminarPiloto = async (naveId) => {
  const pilotoId = deleteSelectedPilotos.value[naveId]
  if (!pilotoId) {
    alert('Por favor, selecciona un piloto para eliminar.')
    return
  }
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/naves/${naveId}/piloto/${pilotoId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Error al eliminar piloto')
    const nave = naves.value.find(n => n.id_naves === naveId)
    if (nave) {
      nave.personajes = nave.personajes.filter(p => p.id_personajes !== pilotoId)
    }
    deleteSelectedPilotos.value[naveId] = null
  } catch (error) {
    console.error('Error:', error)
  }
}


const vincularPiloto = async (naveId, pilotoId) => {
  if (!pilotoId) {
    alert('Por favor, selecciona un piloto para vincular.')
    return
  }
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/naves/${naveId}/piloto/${pilotoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Error al vincular piloto')
    const nuevoPiloto = personajesDisponibles.value.find(p => p.id_personajes === pilotoId)
    const nave = naves.value.find(n => n.id_naves === naveId)
    if (nave && nuevoPiloto) {
      nave.personajes.push(nuevoPiloto)
    }
    selectedPilotos.value[naveId] = null
  } catch (error) {
    console.error('Error:', error)
  }
}


const nextPage = () => {
  if (currentPage.value < lastPage.value) {
    fetchNaves(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    fetchNaves(currentPage.value - 1)
  }
}
const firstPage = () => {
    fetchNaves(1)
}

const lastPageFunc = () => {
    fetchNaves(lastPage.value)
}



const convertToBase15 = (number) => {
  const simbolos = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ß', 'Þ', '¢', 'μ', '¶'];
  if (number === 0) return '0';
  let result = '';
  while (number > 0) {
    const resto = number % 15;
    result = simbolos[resto] + result;
    number = Math.floor(number / 15);
  }
  return result;
};

const getImageUrl = (url) => {
  if (!url) return '/naves/default.png';
  return url.startsWith('http') ? url : `http://127.0.0.1:8000/${url}`;
};

const toggleActive = (index) => {
  const nave = naves.value[index];

  if (nave.activo) {
    nave.activo = false;
    activeIndex.value = null;
  } else {
    naves.value.forEach((n) => (n.activo = false));
    nave.activo = true;
    activeIndex.value = index;
  }
}

onMounted(() => {
  fetchNaves();
  fetchPersonajesDisponibles();
});
</script>

<template>
  <div>
    <div class="listaPj">
      <ul class="scale">
        <h1>lista de naves:</h1>
        <div class="busqueda">
          <input v-model="searchId" type="text" placeholder="Buscar por id..." class="input-busqueda">
        </div>
        <li class="scaleLi" v-for="(nave, index) in naves" 
            :key="nave.id_naves"
            :class="{ active: nave.activo }"
            @click="toggleActive(index)">

          <div class="nombreNave">
            <div>
              <img class="imgPerfil" :src="getImageUrl(nave.image_url)" alt="Imagen de la nave" />
            </div>
            {{ nave.name }}
            <div class="ocultarPerfil"> {{ convertToBase15(nave.cost_in_credits) }}</div>

            <div v-if="naveAEliminar === nave.id_naves">
              <button class="sii" @click.stop="eliminarNave">Sí, eliminar</button>
              <button class="noo" @click.stop="cancelarEliminacion">Cancelar</button>
            </div>
            <button v-else class="botonEliminarNave" @click.stop="confirmarEliminacion(nave.id_naves)">Eliminar Nave</button>
          </div>

          <div class="info" v-show="nave.activo">
            <div><strong>precio:</strong> {{ convertToBase15(nave.cost_in_credits) }}</div>
            <div><strong>capacidad:</strong> {{ nave.passengers }} personas </div>
            <div><strong>fabricante:</strong> {{ nave.manufacturer }}cm</div>
          </div>

          <img class="img" :src="getImageUrl(nave.image_url)" alt="Imagen de la nave" />
          <ul class="ulInfo">
            <li class="LiInfo" v-for="personaje in nave.personajes" :key="personaje.id_personajes">
              {{ personaje.name }} <img class="imgPjNave" :src="personaje.image_url" alt="Imagen del personaje" />
            </li>
            <div class="selector">
              <div>
                <select class="optionAñadir opciones" v-model="selectedPilotos[nave.id_naves]" @click.stop>
                  <option class="opciones" :value="null" disabled>Selecciona un piloto</option>
                  <option class="opciones" v-for="personaje in personajesDisponibles.filter(p => !nave.personajes.some(vinculado => vinculado.id_personajes === p.id_personajes))" :key="personaje.id_personajes" :value="personaje.id_personajes">
                    {{ personaje.name }}
                  </option>
                </select>
                <button class="botonVincular" @click.stop="vincularPiloto(nave.id_naves, selectedPilotos[nave.id_naves])">vincular</button>
              </div>
              <div>
                <select class="optionEliminar" v-model="deleteSelectedPilotos[nave.id_naves]" @click.stop>
                  <option class="opciones" :value="null" disabled>Selecciona un piloto</option>
                  <option class="opciones" v-for="personaje in nave.personajes" :key="personaje.id_personajes" :value="personaje.id_personajes">
                    {{ personaje.name }}
                  </option>
                </select>
                <button class="botonEliminar" @click.stop="eliminarPiloto(nave.id_naves)">eliminar</button>
              </div>
            </div>
          </ul>
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

.paginacion {
  margin-top: 20px;
  color: yellow;
  height: 25%;
}

.botonPasar:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.sii{
  font-size: 15px;
  padding: 10px;
  background-color: red;
  color: black;
  border: 5px solid rgb(70, 2, 2);
  border-radius: 10px;
}
.noo{
  font-size: 15px;
  padding: 10px;
  background-color: green;
  color: black;
  border: 5px solid rgb(3, 78, 15);
  border-radius: 10px;
  transform: none;
}
.noo:hover{
  color: white;
  transform: none;
  scale: (1.0) !important;
}
.sii:hover{
  color: white;
  transform: none;
  scale: (1.0) !important;
}

select.optionAñadir option, select.optionEliminar option {
  appearance: none !important;
  background-color: black !important;
  color: rgb(255, 255, 0) !important;
  border: none !important;
}

</style>