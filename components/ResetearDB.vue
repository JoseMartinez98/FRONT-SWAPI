<script setup>
import '~/assets/css/style.css';
import { ref } from 'vue';

const loading = ref(false);
const message = ref("");
const confirmReset = ref(false);
 //The functions of this component manage the confirm or cancel of "reset" and manage the reset of the data web to the default data database

const confirmarReseteo = () => {
    confirmReset.value = true;
};

const cancelarReseteo = () => {
    confirmReset.value = false;
};

const resetDatabase = async () => {
    loading.value = true;
    message.value = "Importando...";
    confirmReset.value = false;

    try {
        const response = await fetch('http://127.0.0.1:8000/api/importar-naves', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        message.value = data.message;
    } catch (error) {
        message.value = "Error al importar";
    } finally {
        loading.value = false;
        window.location.replace("http://localhost:3000/");
    }
};
</script>

<template>
    <div class="resetear">
        <p style="font-size: 60px;"> Este botón sirve para resetear la web a su forma predeterminada. Esto quiere decir que todos los datos que hayan sido modificados, 
            creados o eliminados desaparecerán para volver a los proporcionados por la base de datos original, perdiendo así todos los cambios 
        realizados por el usuario.</p>
        <button class="buttonLimpiar" @click="confirmarReseteo" :disabled="loading">
            {{ loading ? '....' : 'RESET' }}
        </button>

        <div v-if="confirmReset" class="confirmacion">
            <p>¿Estás seguro de que quieres resetear la base de datos?</p>
            <button class="si" @click="resetDatabase">Sí, resetear</button>
            <button class="no" @click="cancelarReseteo">Cancelar</button>
        </div>

        <div v-if="loading" class="overlay">
            <p>Reseteando datos...</p>
            <div class="lightsaber-container">
                <div class="hilt"></div> 
                <div class="blade"></div> 
            </div>
            <p> esto podria tardar unos minutos...</p>
        </div>
    </div>
</template>

<style>
.resetear{
    margin-top: 5%;
    margin-left: 20%;
    margin-right: 20%;
    margin-bottom: 20%;
    text-align: justify;
    color: yellow;
    align-items: center center;
}
.confirmacion {
    text-align: center;
    margin-top: 20px;
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    color: yellow;
}
.si, .no {
    margin: 10px;
    padding: 10px;
    cursor: pointer;
    background: yellow;
    color: black;
    border: none;
}
.si:hover {
    background: red;
    color: white;
}
.no:hover{
    background: rgb(44, 255, 2);
    color: white;
}
</style>
