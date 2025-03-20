// services/api.js
const API_URL = 'http://127.0.0.1:8000/api';
const error = "Complete el formulario correctamente";


//APIs PARA PAGINA DE PERSONAJES
export const fetchPersonajes = async (page = 1, search = '') => {
  try {
    const url = search
      ? `${API_URL}/personajes?search=${search}`
      : `${API_URL}/personajes?page=${page}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener los datos');

    const data = await response.json();
    return {
      personajes: data.data.map(p => ({ ...p, activo: false })),
      currentPage: data.current_page,
      lastPage: data.last_page
    };
  } catch (error) {
    console.error('Error:', error);
    return { personajes: [], currentPage: 1, lastPage: 1 };
  }
};

export const deletePersonaje = async (id) => {
  try {
    const response = await fetch(`${API_URL}/personajes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Error al eliminar el personaje');

    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};


//APIs PARA PAGINA DE NAVES
export const fetchNaves = async (page = 1, search = '') => {
  try {
    const url = search
     ? `${API_URL}/naves?search=${search}`
      : `${API_URL}/naves?page=${page}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener las naves');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { data: [], current_page: 1, last_page: 1 };
  }
};

export const eliminarNave = async (naveId) => {
  try {
    const response = await fetch(`${API_URL}/naves/${naveId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar la nave');
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const fetchPersonajesDisponibles = async () => {
  try {
    const response = await fetch(`${API_URL}/allPersonajes`);
    if (!response.ok) throw new Error('Error al obtener los personajes disponibles');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

export const eliminarPiloto = async (naveId, pilotoId) => {
  try {
    const response = await fetch(`${API_URL}/naves/${naveId}/piloto/${pilotoId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar piloto');
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export const vincularPiloto = async (naveId, pilotoId) => {
  try {
    const response = await fetch(`${API_URL}/naves/${naveId}/piloto/${pilotoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al vincular piloto');
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};


//API RESETEO WEB
export const resetDatabase = async (loading, message, confirmReset) => {
  loading.value = true;
  message.value = "Importando...";
  confirmReset.value = false;

  try {
      const response = await fetch(`${API_URL}/importar-naves`, {
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


//API CREAR PERSONAJE
export const submitForm = async (form, message) => {
  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('gender', form.value.gender);
  formData.append('birth_year', form.value.birth_year);
  formData.append('height', String(form.value.height));
  formData.append('mass', String(form.value.mass));

  if (form.value.image) {
    formData.append('image', form.value.image);
  } else {
    message.value = {error};
    return;
  }

  try {
    const response = await fetch(`${API_URL}/personajes`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw {error};
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
    };
    
  } catch (error) { 
    message.value = {error};
  }
}