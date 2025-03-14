<script setup>
  import { ref, nextTick, defineEmits } from 'vue';
  import '~/assets/css/style.css';
  

  const audioVisible = ref(false);
  const audioPlaying = ref(false);
  const containerVisible = ref(false);
  const buttonReduced = ref(false);
  const emit = defineEmits();

  //The fuctions of this components are used to manage the audio at start from the web and the visibility property of container
  const reproducirAudio = () => {
  if (audioPlaying.value) {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audioPlaying.value = false;
    }
  } else {
    try {
      audioVisible.value = true;

      nextTick(() => {
        const audio = document.querySelector('audio');
        if (audio) {
          audio.volume = 0.10;
          audio.play()
          .then(()=>{
            audioPlaying.value = true;
          })
          .catch((error) => {
            console.error('Error reproduciendo el audio:', error);
          });
        }
      });

      if (!containerVisible.value) {
        containerVisible.value = true;
        emit('mostrarContenedor', containerVisible.value); 
      }

      if (!buttonReduced.value) {
        buttonReduced.value = true;
      }
    } catch (error) {
      console.error('Error en la ejecución de reproducirAudio:', error);
    }
  }
};

</script>

<template>
    <div>
      <button 
        @click="reproducirAudio"
        :class="{ 'small-button': buttonReduced }">
        {{ audioPlaying ? 'pause' : 'play' }}
      </button>

      <audio ref="audio" autoplay v-if="audioVisible">
        <source src="/audio/bsoSW.mp3" type="audio/mpeg" />
      </audio>
    </div>
</template>

<style scoped>
  button {
    margin-top: 400px;
    height: 250px; 
    width: 300PX;
    font-family: 'StarWars', sans-serif !important;
    padding: 5px;
    size: 100px;
    font-size: 70px;
    color: rgb(255, 248, 248);
    background-color: rgb(190, 45, 45);
    border-radius: 10px;
    border: 5px solid rgb(114, 10, 10);
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;

  }
  button:hover{
    border: 12px solid rgb(114, 10, 10);
    font-size: 50px;
  }
  .small-button {
    margin-top: 40px;
    height: 60px;
    width: 80px;
    font-size: 14px;
  }
  .small-button:hover {
    height: 60px;
    width: 80px;
    font-size: 10px;
  }
</style>
