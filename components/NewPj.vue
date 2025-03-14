<script setup>
import { ref } from 'vue'


//All the functions of this component are used to manage the data form post from user
const form = ref({
  name: '',
  gender: '',
  birth_year: '',
  height: '',
  mass: '',
  image: null
})

const message = ref('');

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'image/png') {
    form.value.image = file;
  } else {
    form.value.image = null;
    message.value = 'Solo se permiten imágenes en formato PNG';
  }
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('gender', form.value.gender);
  formData.append('birth_year', form.value.birth_year);
  formData.append('height', form.value.height);
  formData.append('mass', form.value.mass);

  if (form.value.image) {
    formData.append('image', form.value.image);
  } else {
    message.value = 'Debe subir una imagen en formato PNG';
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/personajes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al enviar el formulario');
    }

    const data = await response.json();
    message.value = 'Personaje creado exitosamente';
    form.value = {
      name: '',
      gender: '',
      birth_year: '',
      height: '',
      mass: '',
      image: null
    }
    
  } catch (error) {
    console.error('Error:', error);
    message.value = 'Hubo un error al crear el personaje';
  }
};
</script>

<template>
  <div class="form">
    <form @submit.prevent="submitForm">
      <div class="celda">
        <label>Nombre:</label>
        <input class="rellenar" v-model="form.name" type="text" />
      </div>
      <div class="celda">
        <label>Género:</label>
        <input class="rellenar" v-model="form.gender" type="text" />
      </div>
      <div class="celda">
        <label>Cumpleaños:</label>
        <input class="rellenar" v-model="form.birth_year" type="text" />
      </div>
      <div class="celda">
        <label>Altura:</label>
        <input class="rellenar" v-model="form.height" type="text" />
      </div>
      <div class="celda">
        <label>Peso:</label>
        <input class="rellenar" v-model="form.mass" type="text" />
      </div>
      <div class="celda">
        <label>Foto (PNG):</label>
        <input class="rellenar" type="file" @change="handleFileUpload" accept="image/png" />
      </div>
      <div class="celda2">
        <button class="enviar" type="submit">Enviar</button>
      </div>
      <p>{{ message }}</p>
    </form>
  </div>
</template>

<style scoped>
.form {
  color: yellow;
  text-shadow: 3px 3px 3px rgb(105, 105, 19);
  font-size: 40px;
  max-width: 80%;
  margin: auto;
  margin-top: 80px;
  margin-bottom: 80px;
  padding: 2rem;
  border: 2px solid yellow;
  box-shadow: 0 0 20px yellow;
  text-align: left;
  background: url('~/assets/fondoSelector.jpg');
  background-size: cover;
  background-position: center center;
}
.celda{
  display: flex;
  margin-top: 3%;
  margin-left: 5%;
  margin-bottom: 3%;
  margin-right: 5%;
  padding-right: 20px;
  justify-content: space-between;
}
.celda2{
  display: flex;
  margin-top: 5%;
  margin-bottom: 3%;
  align-items: center;
  justify-content: center;
}
.rellenar{
  border-bottom: 1px solid white;
  border-radius: 10px;
  font-size: 30px;
  padding: 10px;
  width: 850px;
  padding-right: 0%;
  margin-left: 5%;
  background-color: black;
  color: rgb(255, 255, 255);
}
.rellenar:focus{
  border: 2px solid yellow;
  box-shadow: 0 0 20px yellow;
}
.enviar{
  color: rgb(255, 255, 255);
  border: 5px solid rgb(3, 3, 121);
  border-radius: 10px;
  background-color: rgb(43, 43, 241);
  padding: 10px;
  width: 200px;
  height: 100px;
}

.enviar:hover{
border: 10px solid rgb(3, 3, 121);
background-color: black;
font-size: 35px;
color: yellow;
}
</style>