<script setup>
import '~/assets/css/style.css';
import { ref, onMounted } from 'vue'

const naves = ref([]) 
const currentPage = ref(1) 
const lastPage = ref(null) 
const personajesDisponibles = ref([])
const selectedPilotos = ref({})
const deleteSelectedPilotos = ref({})

const fetchNaves = async (page = 1) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/naves?page=${page}`)
    if (!response.ok) throw new Error('Error al obtener los datos')

    const data = await response.json()
    naves.value = data.data
    currentPage.value = data.current_page
    lastPage.value = data.last_page


    naves.value.forEach(nave => {
      if (!selectedPilotos.value[nave.id_naves]) {
        selectedPilotos.value[nave.id_naves] = null
      }
      if (!deleteSelectedPilotos.value[nave.id_naves]) {
        deleteSelectedPilotos.value[nave.id_naves] = null
      }
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

const fetchPersonajesDisponibles = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/allPersonajes`)
    if (!response.ok) throw new Error('Error al obtener los personajes disponibles')

    const data = await response.json()
    personajesDisponibles.value = data
  } catch (error) {
    console.error('Error:', error)
  }
} 

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

    await fetchNaves(currentPage.value)
    deleteSelectedPilotos.value[naveId] = null;
  } catch (error) {
    console.error('Error:', error)
  }
}
 
const vincularPiloto = async (naveId, pilotoId) => {
  if (!pilotoId) {
    alert('Por favor, selecciona un piloto para vincular.');
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/naves/${naveId}/piloto/${pilotoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Error al vincular piloto');

    await fetchNaves(currentPage.value);
    selectedPilotos.value[naveId] = null;
  } catch (error) {
    console.error('Error:', error);
  }
};

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
}
const getImageUrl = (url) => {
  if (!url) return '/naves/default.png'; 
  return url.startsWith('http') ? url : `http://127.0.0.1:8000/${url}`;
};


onMounted(() => {
  fetchNaves()
  fetchPersonajesDisponibles()
})
</script>

<template>
  <div>
    <div class="listaNv">
      <h1>editar naves:</h1>
      <ul>
        <li class="naveSelected" v-for="nave in naves" :key="nave.id_naves">
          {{ nave.name }} - precio: {{ convertToBase15(nave.cost_in_credits) }} <img class="img" :src="getImageUrl(nave.image_url)" alt="Imagen de la nave" />
          
          <!-- Lista de pilotos de la nave -->
          <ul>
            <li  v-for="personaje in nave.personajes" :key="personaje.id_personajes">
               {{ personaje.name }}  <img class="img2" :src="personaje.image_url" alt="Imagen del personaje" />
            </li>
            <!-- Selector de pilotos para eliminar -->
            <div class="selector">
                    <div>
                    <select class="optionEliminar" v-model="deleteSelectedPilotos[nave.id_naves]">
                      <option :value="null" disabled>Selecciona un piloto</option>
                      <option class="optionEliminar" v-for="personaje in nave.personajes" :key="personaje.id_personajes" :value="personaje.id_personajes">
                        {{ personaje.name }}
                      </option>
                    </select>
                    <button class="botonEliminar" @click="eliminarPiloto(nave.id_naves)">Eliminar</button>
                  </div>
                  <div>
                    <select class="optionAñadir" v-model="selectedPilotos[nave.id_naves]">
                      <option :value="null" disabled> selecciona un piloto</option>
                      <option class="optionAñadir" v-for="personaje in personajesDisponibles.filter(p => !nave.personajes.some(vinculado => vinculado.id_personajes === p.id_personajes))" :key="personaje.id_personajes" :value="personaje.id_personajes">
                        {{ personaje.name }}
                      </option>
                    </select>
                    <button class="botonVincular" @click="vincularPiloto(nave.id_naves, selectedPilotos[nave.id_naves])">vincular</button>
                  </div>
                </div>
          </ul>

       
        </li>
      </ul> 
            <!-- Paginación -->
    <div class="paginacion">
      <button class="botonPasar" @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>página {{ currentPage }} de {{ lastPage }}</span>
      <button class="botonPasar" @click="nextPage" :disabled="currentPage === lastPage">Siguiente</button>
    </div>
    </div>
  </div>
</template>

<style scoped>

label{
  color: rgb(255, 255, 255);
  margin: 20px;
}
.selector{
align-items: center;
display: flex;
justify-content: space-between;
margin-left: 10%;
margin-right: 10%;
}
.optionEliminar:hover{
  cursor: pointer;
  background-color: rgb(247, 50, 15);
  color: rgb(0, 0, 0);
  border-radius: 5px;
  border: rgb(157, 37, 16) solid;
}
.optionAñadir:hover{
  cursor: pointer;
  background-color: green;
  color: rgb(255, 255, 255);
}


.botonPasar:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style> 
