<script setup>
import '~/assets/css/style.css';
import Reproducir from '~/components/Reproducir.vue';
import { ref, } from 'vue';


const containerVisible = ref(false);


</script>

<template>
<div class="body">
  <header>
  
  <div class="musica">
    <Reproducir @mostrarContenedor="containerVisible = true" />
  </div>
</header>
<KeepAlive>
  <div class="container" :class="{'show': containerVisible}">
    <nav class="navIndex">
        <RouterLink class="router" to="/paginaNaves"> ver naves -</RouterLink>
        <RouterLink class="router" to="/paginaPersonajes"> ver personajes -</RouterLink>
        <RouterLink class="router" to="/crearPersonaje"> crear personaje -</RouterLink>
        <RouterLink class="router" to="/trailers">trailers -</RouterLink>
        <RouterLink class="router" to="/resetear"> resetear web</RouterLink>
        
        <img src="~/assets/nave.png" alt="Nave Izquierda" class="nave nave-izquierda">
        <img src="~/assets/nave2.png" alt="Nave Derecha" class="nave nave-derecha">
    </nav>
  </div>
</KeepAlive>
  <main> 
    <KeepAlive>
      <RouterView/>
    </KeepAlive>   
  </main>
  
</div>

</template>

<style scoped>

</style>
