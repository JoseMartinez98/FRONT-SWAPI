<script setup>
    import '~/assets/css/style.css';

</script>

<template>
<div class="listados">
    <div class="personajesContainer">
      <nav>
        <RouterLink class="router" to="/paginaNaves"> ver naves -</RouterLink>
        <RouterLink class="router" to="/paginaPersonajes"> ver personajes -</RouterLink>
        <RouterLink class="router" to="/crearPersonaje"> crear personaje -</RouterLink>
        <RouterLink class="router" to="/trailers"> trailers </RouterLink>
        
      </nav>

        <ResetearDB/>
      </div>
    </div>
</template>

<style>
</style>