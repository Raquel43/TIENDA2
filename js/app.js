// Variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const listaCursos = document.querySelector("#lista-cursos");

const btnVaciarCarrito = document.querySelector("#vaciar-carrito");
const btnBuscador = document.querySelector("#submit-buscador");
const btnVerTodo = document.querySelector("#verTodo");
const btnPulsar = document.querySelector("#buscador");
let articulosCarrito = [];



init();

function init() {
  cargarEventListeners();
  // TODO
  //cargarCursos();
}

/**
 * Configurar los eventos de usuario
 */
function cargarEventListeners() {
  // Cuando agregas un curso presionando "Agregar al Carrito"
  listaCursos.addEventListener("click", agregarCurso);

  // Elimina cursos del carrito
  carrito.addEventListener("click", eliminarCurso);

  // Muestra los cursos de Local Storage cuando se carga la página en el navegador
  document.addEventListener("DOMContentLoaded", () => {
    // Si la primera condición falla, inicializa la variable a []
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    generarCarritoHTML();
  });

  // Vaciar el carrito cuando se pulsa en el icono x del carrito
  btnVaciarCarrito.addEventListener("click", () => {
    articulosCarrito = []; // reseteamos el arreglo
    limpiarHTML(); // Eliminamos todo el HTML
    localStorage.removeItem("carrito");
    document.querySelector("#num-cursos").innerHTML = "0"; // Inicializar cantidad cursos
  });

  btnBuscador.addEventListener("click",displayMatches);
  btnVerTodo.addEventListener("click",getCursos);
  btnPulsar.addEventListener("keypress",pulsar);

}
/**
 * Lee los cursos del json y pinta el HTML central correspondiente
 * pFilterTitle: puede tener opcionalmente un parámetro para filtrar los cursos
 */
// TODO
function cargarCursos(pFilterTitle) {

}

/**
 * Lee el contenido del HTML al que le dimos click y lo añade al carritoo
 */
function agregarCurso(e) {
  // Previene de queno se envie el formulario al pulsar el botón de "Agregar carrito"
  e.preventDefault();
  let curso; // Contendrá la información html del curso en concerto a agregar

  // Comprueba que existen tarjetas (card) de cursos en la parte central
  if (e.target.classList.contains("agregar-carrito")) {
    // el curso (clase "card") es el abuelo de botón
    curso = e.target.parentElement.parentElement;
  } else {
    console.error("Error leyedo datos, no hay cursos");
    return false;
  }

  // Crear un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    profesor: curso.querySelector(".profesor").textContent,
    precio: curso.querySelector(".u-pull-right").textContent,
  //id: curso.querySelector(".id").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  // Revisa si un elemento ya existe en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    // Si ya existe el curso en el carrito, sólo actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; // retorna el objeto actualizado
      } else {
        return curso; // retorna los objetos que no son los duplicados
      }
    });
    console.log("agregarCurso -> cursos", cursos);
    // La variable "cursos" contiene un array de cursos actualizados
    // Pasamos los cursos al nuevo carrito
    articulosCarrito = cursos; //articulosCarrito = [...cursos];
  } else {
    // Agrega el nuevo curso al array de carrito
    articulosCarrito.push(infoCurso); //articulosCarrito = [...articulosCarrito, infoCurso];
  }

  console.log(articulosCarrito);
  generarCarritoHTML();
  mostrarAlert();
}

/**
 * Elimina un curso del carrito
 */
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    // Elimina del arreglo de articulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);

    generarCarritoHTML(); // Iterar sobre el carrito y mostrar su HTML
  }
}

// Muestra el Carrito de compras en el HTML
function generarCarritoHTML() {
  limpiarHTML();

  let cantidadTotal = 0;
  let cantidadCurso = 0;
  let precioDescuento = 0;
  let  cantidadPrecio = 0;


  // Recorre el carrito y genera el HTML para cada item
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, profesor, precio, cantidad, id } = curso; // Usamos destructuring
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${profesor}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}" > X </a>
            </td>
        `;
    cantidadTotal += cantidad;
    precioDescuento = parseInt(precio);
    cantidadPrecio = precioDescuento*cantidad;
    cantidadCurso += cantidadPrecio;
    // Agrega el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);

  });

  // Pintar fila total
  if (cantidadTotal > 0) {
    
        const row = document.createElement("tr");
    /*template*/
    row.innerHTML = `
        <td colspan="3">Total</td>
        <td>${cantidadCurso}€</td>
        <td>${cantidadTotal}</td>
        <td></td>
    `;
    contenedorCarrito.appendChild(row);
  }


  // Agregar el carrito de compras al storage
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));

  calcularNumeroCursos();
}

/**
 * Función aux. Elimina los cursos del tbody
 * */
function limpiarHTML() {
  contenedorCarrito.innerHTML = "";
}

function limpiarJson(container){
  container.innerHTML = " ";
}
/**
 * Busca por nombre
 */
// TODO
function searchCursos(e) {

}

/**
 * Calcula el total de cursos que existen en el carrito
 */
// TODO
function calcularNumeroCursos() {
}
//Función del filtro que al pulsar intro te busca la palabra
function pulsar(e) {
  if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      displayMatches();
  }
}
/**
 * Muestra el mensaje de confirmación de que se añadido un nuevo curso
 */
function mostrarAlert() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Curso añadido al carrito",
    showConfirmButton: false,
    timer: 1500,
  });
}

function mostrarAlert3(palabra) {
  Swal.fire({
    position: "center",
    icon: "info",
    title: "Curso no encontrado " + palabra,
    showConfirmButton: false,
    timer: 1500,
  });
}

function mostrarAlert2(palabra) {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Curso encontrado " + palabra,
    showConfirmButton: false,
    timer: 1500,
  });
}
function getCursos() {
 
  fetch("./data/cursos.json")
      .then((response) => response.json())
      .then((articulos) => {
        const container = document.getElementById("list-content");
        limpiarJson(container);
  
          for (let articulo of articulos) {
        
           
            //alert("He encontrado tu curso de "+palabra);
            const row = document.createElement("div");
              row.classList.add("card");
            /*template*/
            row.innerHTML =`
            <img src="img/${articulo.img}" class="imagen-curso u-full-width">
            <div class="info-card">
                <h4>${articulo.title}</h4>
                <p class="profesor">${articulo.teacher}</p>
                <div id="stars">${pintaEstrella(articulo.ratings)}
            
            </div>
                <p class="precio">${articulo.price}€ <span class="u-pull-right ">${articulo.priceOffer}€</span></p>
                <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${articulo.id}">Agregar Al Carrito</a>
           
        `;
            container.appendChild(row);
              
          }
  
      });
}

function pintaEstrella(star){
  var que = "";

  var decimal = (star % 1==0)?false:true;
  for(let i=1;i<=5;i++){
    if(decimal == false){
      que += (i<=star)?`<i class="fa fa-star borde yellow"></i>`:`<i class="far fa-star"></i>`;
    }else{
      if(i<=star){
        que += `<i class="fa fa-star borde yellow"></i>`;
      }else if(i==Math.trunc(star)+1){
        que += `<i class="fas fa-star-half borde yellow"></i>`;
      }else{
        que += `<i class="far fa-star"></i>`;
      }
    }
  }
  return que;
}
const search = document.querySelector('#buscador');
search.addEventListener('keyup', displayMatches);
const suggestions = document.querySelector('#list-content');

const productos = [];
fetch("./data/cursos.json")
    .then(cursos =>cursos.json())
    .then(data => productos.push(...data));
console.log("que cursos tengo?",productos);

function findMatches(palabra,productos) {
  return productos.filter(articulo => {
      const regex = new RegExp(palabra, 'gi');
     return articulo.title.match(regex);
  });
}
function displayMatches(e) {
  const matchedArray = findMatches(e.target.value, productos);
  const html = matchedArray.map(articulo => {
      return `
      <div class="card">
      <img src="img/${articulo.img}" class="imagen-curso u-full-width">
      <div class="info-card">
          <h4>${articulo.title}</h4>
          <p class="profesor">${articulo.teacher}</p>
          <div id="stars">${pintaEstrella(articulo.ratings)}</div>
          <p class="precio">${articulo.price}€ <span class="u-pull-right ">${articulo.priceOffer}€</span></p>
          <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${articulo.id}">Agregar Al Carrito</a>
      </div>
      </div>
      
  `;
  }).join('');
  console.log(html);
  suggestions.innerHTML = html;
}

/*function buscar(palabra){
 
  fetch("./data/cursos.json")
  .then((response) => response.json())
  .then((articulos) => {
    
     const container =  document.querySelector("#list-content");

      for (let articulo of articulos) {
        
        palabra = document.getElementById("buscador").value;
        let frase = articulo.title;
         let fraseSinComilla = frase.replace(/,/g,"");
         let arrayFrase = fraseSinComilla.split(" ");
        console.log(arrayFrase);
       for(i=0; i<arrayFrase.length; i++){
       
        if(arrayFrase[i].toLowerCase() == palabra.toLowerCase() || arrayFrase[i].toUpperCase() == palabra.toUpperCase()){
       limpiarJson(container);
       
      //alert("He encontrado tu curso de "+palabra);
      const row = document.createElement("div");
        row.classList.add("card");
      /*template*/
      /*row.innerHTML +=`
      <img src="img/${articulo.img}" class="imagen-curso u-full-width">
      <div class="info-card">
          <h4>${articulo.title}</h4>
          <p class="profesor">${articulo.teacher}</p>
          <div id="stars">${pintaEstrella(articulo.ratings)}
      
      </div>
          <p class="precio">${articulo.price}€ <span class="u-pull-right ">${articulo.priceOffer}€</span></p>
          <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${articulo.id}">Agregar Al Carrito</a>
      </div>
  `;
      container.appendChild(row);
   
        
                   
         
         mostrarAlert2(palabra);
         return true;
        
      }
       
      
       
      
    
  }
 
 
}
return  mostrarAlert3(palabra);
  });
 
}*/


getCursos();
//pulsar();
//<i class="fa fa-star borde yellow"></i><i class="fas fa-star-half borde yellow"></i><i class="far fa-star"></i><i class="far fa-star"></i>