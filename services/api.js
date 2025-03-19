
export const fetchNaves = async (page = 1) => {
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

  export const fetchPersonajesDisponibles = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/allPersonajes`)
      if (!response.ok) throw new Error('Error al obtener los personajes disponibles')
  
      const data = await response.json()
      personajesDisponibles.value = data
    } catch (error) {
      console.error('Error:', error)
    }
  } 

  export const eliminarPiloto = async (naveId) => {
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
      deleteSelectedPilotos.value[naveId] = "null";
    } catch (error) {
      console.error('Error:', error)
    }
  }

  export const vincularPiloto = async (naveId, pilotoId) => {
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
      selectedPilotos.value[naveId] = "null";
    } catch (error) {
      console.error('Error:', error);
    }
  };

  