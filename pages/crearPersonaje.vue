<script setup>
    import '~/assets/css/style.css';
    import NewPj from '../components/NewPj.vue';
   
</script>
<script>
export default {
  head() {
    return {
      title: 'SWAPI / Crear Personaje'
    };
  }
};
</script>
<template>
<div class="listados">
    <div class="personajesContainer">
      <nav>
        <RouterLink class="router" to="/paginaNaves"> ver naves -</RouterLink>
        <RouterLink class="router" to="/paginaPersonajes"> ver personajes -</RouterLink>
        <RouterLink class="router" to="/trailers"> trailers -</RouterLink>
        <RouterLink class="router" to="/resetear"> resetear web </RouterLink>
      </nav>
        <NewPj/>
      </div>
    </div>
</template>

<style>
</style>