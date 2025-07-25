let alimentoId = '';
let alimentoNombre = '';
let heartLink = null;

function volver() {
    const alimentoArticle = document.getElementById('alimento');
    alimentoArticle.style.display = 'none';
}

function addAlimento() {
    const alimentoArticle = document.getElementById('alimento');
    const nombre = document.getElementById('nombreReceta').value.trim();
    const desc = document.getElementById('desc').value.trim();
    if (nombre !== '' && desc !== '') {
        alimentoArticle.style.display = 'grid';
    }
}

function addPesoBruto(event, id, nombre, link) {
    event.preventDefault();
    const popUp = document.getElementById('pop-up-pb');
    popUp.style.display = 'block';
    document.getElementById('peso').value = '';
    const radios = document.querySelectorAll('input[name="unidad"]');
    radios.forEach(radio => radio.checked = false);
    alimentoId = id;
    alimentoNombre = nombre;
    heartLink = link;
}

function closePopUp(event) {
    event.preventDefault();
    const popUp = document.getElementById('pop-up-pb');
    popUp.style.display = 'none';
}

function submitPesoBruto() {
    const peso = document.getElementById('peso').value.trim();
    const unidadSeleccionada = document.querySelector('input[name="unidad"]:checked');
    const unidad = unidadSeleccionada ? unidadSeleccionada.value : null;
    console.log(alimentoId);
    console.log(alimentoNombre);

    if (peso && unidad) {
        fetch('../controllers/Cesta.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `accion=annadir&id=${alimentoId}&nombre=${alimentoNombre}&peso=${peso}&unidad=${unidad}`
        })
        .then(correctoCesta)
        .catch(erroresCesta);

        // Cambiar el ícono a corazón relleno
        if(heartLink) {
            const heartIcon = heartLink.querySelector('i');
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
        }

        closePopUp(event);
    } else {
        document.getElementById("error").textContent = 'Por favor, introduce un peso válido y selecciona una medida.';
    }
}

function eliminarAlimento(event, idAlimento){
    event.preventDefault();
    fetch('../controllers/Cesta.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `accion=eliminarAlimento&id=${idAlimento}`
        })
        .then(correctoCesta)
        .catch(erroresCesta);

    const link = document.querySelector(`#alimento a[data-id="${idAlimento}"]`);
    if(link) {
        const heartIcon = link.querySelector('i');
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
    }
}

function eliminarCesta(){
    const heartIcons = document.querySelectorAll('#alimento a[data-id] i.fas');
        
        heartIcons.forEach(icon => {
            icon.classList.remove('fas');
            icon.classList.add('far');
        });
    fetch('../controllers/Cesta.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: `accion=vaciar`
        })
        .then(correctoCesta)
        .catch(erroresCesta);
}

function correctoCesta(res){
    if(res.ok){
        res.text().then(recibidoCesta);
    }
}

function erroresCesta(){
    alert('Error en la conexión');
}

function recibidoCesta(datos){
    console.log(datos);
    let datosConvertidos = JSON.parse(datos);
    console.log(datosConvertidos);
    const ul = document.querySelector('.alimentosRecetas');
    ul.textContent = '';

    if(Object.keys(datosConvertidos).length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No hay alimentos en la cesta';
        ul.appendChild(li);
    }
    else {
        for(let id in datosConvertidos) {
            const { nombre, peso, unidad } = datosConvertidos[id];
            const li = document.createElement('li');
            li.textContent = `${nombre}: ${peso} ${unidad}`;

            const btn = document.createElement('button');
            btn.textContent = 'Eliminar';
            btn.onclick = (event) => eliminarAlimento(event, id);

            li.appendChild(btn);
            ul.appendChild(li);
        }
    }
}

function verCesta() {
    const cesta = document.getElementById('cesta');
    cesta.style.display = 'block';
    fetch('../controllers/Cesta.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'accion=obtener'
    })
    .then(correctoCesta)
    .catch(erroresCesta);
}

function closeCesta() {
    const cesta = document.getElementById('cesta');
    cesta.style.display = 'none';
}