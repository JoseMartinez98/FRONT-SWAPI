<script setup>
import '~/assets/css/style.css';
import ListaNaves from '~/components/ListaNaves.vue';
</script>

<template>
    <div class="listados">
        <div class="personajesContainer">
            <nav>
                <RouterLink class="router" to="/paginaPersonajes"> ver personajes -</RouterLink>
                <RouterLink class="router" to="/crearPersonaje"> crear personaje -</RouterLink>
                <RouterLink class="router" to="/trailers"> trailers -</RouterLink>
                <RouterLink class="router" to="/resetear"> resetear web</RouterLink>
                
            </nav>
            <VerNaves />
        </div>
    </div>
    
</template>
 