// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];


cargarEventListeners();

function cargarEventListeners() {
    // Cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //  Sumar cantidad a articulo
    carrito.addEventListener('click', sumarCurso);

    //  Restar cantidad a articulo
    carrito.addEventListener('click', restarCurso);

    // Muestra los cursos de Local Storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || [];

        carritoHTML();
    })

    // Vaciar el carrito 
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // reseteamos el arreglo

        limpiarHTML(); // Eliminamos todo el HTML
    })
}


// Funciones

//Agregar Curso
function agregarCurso(e) {
    e.preventDefault();

    if( e.target.classList.contains('agregar-carrito') ) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }    
}

// Elimina un curso del carrito
function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );

        carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
    }
}

function sumatotalpagar(){
var total = 0
    articulosCarrito.forEach(item => {       
        total = total + (item.cantidad * parseInt(item.sumprecio))
    });
    document.getElementById("precioTotal").innerHTML = "Total: $" + new Intl.NumberFormat('es-CO', { maximumSignificantDigits: 3 }).format(total);
}

// Lee el contenido del HTML al que le dimos click y extrae la información del curso
function leerDatosCurso(curso) {
    // console.log(curso);

    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h2').textContent,
        precio: curso.querySelector('.precio').textContent, 
        id: curso.querySelector('a').getAttribute('data-id'),
        sumprecio: curso.querySelector('.precio').getAttribute('data-precio'),
        cantidad: 1
    }

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id  );
    if(existe) {
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if( curso.id === infoCurso.id ) {
                curso.cantidad++;
                return curso; // retorna el objeto actualizado
            } else {
                return curso; // retorna los objetos que no son los duplicados
            }
        } );
        articulosCarrito = [...cursos];
    } else {
        // Agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    sumatotalpagar();

    carritoHTML();
}


function sumarCurso(e){
    if(e.target.classList.contains('sumarCurso')) {
        const cursoId = e.target.getAttribute('data-id');

        let articulo = articulosCarrito.find( curso => curso.id === cursoId );
        if (articulo !== undefined){
            articulo.cantidad = articulo.cantidad + 1
            
            carritoHTML()            
        }
    }
}


function restarCurso(e){
    if(e.target.classList.contains('restarCurso')) {
        const cursoId = e.target.getAttribute('data-id');

        let articulo = articulosCarrito.find( curso => curso.id === cursoId );
        if (articulo !== undefined){
            articulo.cantidad = articulo.cantidad - 1
        }

        if (articulo.cantidad === 0) 
        {
            articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );            
        }

        carritoHTML()
    }
}


// Muestra el Carrito de compras en el HTML
function carritoHTML() {

    // Limpiar el HTML
    limpiarHTML();    

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td style="padding: 20px;">${titulo}</td>
            <td>${precio}</td>
            <td style="text-align: center; width: 200%; ">  <a href="#restar" data-id="${id}" class="botonsumares restarCurso"> -</a>  ${cantidad}<a href="#sumar" data-id="${id}" class="botonsumares sumarCurso">+</a>   </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}" > X </a>
            </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    // Agregar el carrito de compras al storage
    sincronizarStorage();
}


// Elimina los cursos del tbody
function limpiarHTML() {
    // Forma lenta
    // contenedorCarrito.innerHTML = '';
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    };
    sumatotalpagar();
}


function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

