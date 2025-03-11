<script setup>
import '~/assets/css/style.css';

</script>

<template>
  <div class="listados">
    <div class="personajesContainer">
      <nav>
        <!--<RouterLink class="router" to="/"> inicio -</RouterLink> -->
        <RouterLink class="router" to="/paginaNaves"> ver naves -</RouterLink>
        <RouterLink class="router" to="/crearPersonaje"> crear personaje -</RouterLink>
        <RouterLink class="router" to="/trailers"> trailers -</RouterLink>
        <RouterLink class="router" to="/resetear"> resetear web</RouterLink>
        
      </nav>

        <ListaPersonajes />
      </div>
    </div>
</template>

<style scoped>

</style>
