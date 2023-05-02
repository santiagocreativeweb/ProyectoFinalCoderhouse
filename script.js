// ARRAY PRODUCTO 
let productos = [
    { id: 1, nombre: "Monitor Asus TUF 165hz", categoria: "monitores", precio: 132900, stock: 15, img: "monitor_asus_tuf_165hz.png"},
    { id: 2, nombre: "Monitor LG 75hz", categoria: "monitores", precio: 44800, stock: 10, img: "monitor_benq.png"},
    { id: 3, nombre: "Teclado Redragon Draconic", categoria: "teclados", precio: 15000, stock: 2, img:"teclado_draconic.png"},
    { id: 4, nombre: "Teclado Redragon Kumara K552", categoria: "teclados", precio: 15600, stock: 8, img:"teclado_redragon_kumara.png"},
    { id: 5, nombre: "MSI GeForce RTX 3080", categoria: "grafica", precio: 150500, stock: 3, img:"msi_geforce_3080.png"},
    { id: 6, nombre: "MSI GeForce GTX 1650 Super", categoria: "grafica", precio: 141000, stock: 6, img:"msi_geforce_gtx_1650.png"},
    { id: 7, nombre: "Intel Core i9-9900K", categoria: "procesador", precio: 81500, stock: 0, img:"intel_core_i9.png"}, 
    { id: 8, nombre: "Intel Core i7-8700K", categoria: "procesador", precio: 65575, stock: 1, img:"intel_core_i7.png"}
]

fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    console.log(data) 
  })
  .catch(error => console.error(error))


//Funcionabilidad al cargar la pagina 
document.addEventListener('DOMContentLoaded', () => {
   alert_bienvenida() 
   renderizarProductos(productos)
   carrito() 
   hacerVisibleCarrito()
  localStorage.clear() // la pagina se rompe sin este
})
// SWEETALERT
function alert_bienvenida(){
  Swal.fire({
    icon: 'success',
    title: 'PC COMPONENTS STORE',
    text: 'Bienvenido a PC COMPONENTS STORE',
    timer: 2500,
  })
}

function renderizarProductos(arrayProductos) {
    let contenedor = document.getElementById("contenedorProductos-items")
    contenedor.innerHTML = ""
    arrayProductos.forEach(producto => {
      let tarjetaProducto = document.createElement("div")
      tarjetaProducto.className = "item"
    
      tarjetaProducto.innerHTML = `
        <span class=titulo-item>${producto.nombre}</span>
        <img src=./img/productos/${producto.img} class=img-item>
        <span class=precio-item>$${producto.precio}</span>
        <button class=boton-item>Agregar al Carrito</button>
      `
      contenedor.appendChild(tarjetaProducto)
      
      let botonesAgregarAlCarrito = document.getElementsByClassName('boton-item')
      if (botonesAgregarAlCarrito != "") {
        for (let i = 0; i < botonesAgregarAlCarrito.length; i++){
            let button = botonesAgregarAlCarrito[i]
            button.addEventListener('click', agregarAlCarritoClicked)
        }
      }
      
      }
    )}

// LOCALSTORAGE 😈
let cart = JSON.parse(localStorage.getItem('carrito'))

//Variable que mantiene el estado visible del carrito
let carritoVisible = false

function carrito(){
    
//Agregremos funcionalidad a los botones eliminar del carrito
    let botonesEliminarItem = document.getElementsByClassName('btn-eliminar')
    for (let i = 0; i < botonesEliminarItem.length; i++){
        let button = botonesEliminarItem[i]
        button.addEventListener('click', eliminarItemCarrito)
    }

    
    //Agrego funcionalidad al boton sumar cantidad
    let botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad')
    for (let i = 0; i < botonesSumarCantidad.length; i++){
        let button = botonesSumarCantidad[i]
        button.addEventListener('click', sumarCantidad)
    }

     //Agrego funcionalidad al buton restar cantidad
    let botonesRestarCantidad = document.getElementsByClassName('restar-cantidad')
    for (let i = 0; i < botonesRestarCantidad.length; i++){
        let button = botonesRestarCantidad[i]
        button.addEventListener('click', restarCantidad)
    }

    //Agregamos funcionalidad al boton Agregar al carrito
    let botonesAgregarAlCarrito = document.getElementsByClassName('boton-item')
    for (let i = 0; i < botonesAgregarAlCarrito.length; i++){
        let button = botonesAgregarAlCarrito[i]
        button.addEventListener('click', agregarAlCarritoClicked)
    }
    
    //Agregamos funcionalidad al botón comprar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked)
}
//Eliminamos todos los elementos del carrito y lo ocultamos
function pagarClicked(){
    compraRealizada()
    //Elimino todos los elmentos del carrito
    let carritoItems = document.getElementsByClassName('carrito-items')[0]
    while (carritoItems.hasChildNodes()){
        carritoItems.removeChild(carritoItems.firstChild)
        localStorage.removeItem("carrito", JSON.stringify(cart))
    }
    actualizarTotalCarrito()
}

//Funcion que controla el boton clickeado de agregar al carrito
function agregarAlCarritoClicked(event){
    let button = event.target
    let item = button.parentElement
    let titulo = item.getElementsByClassName('titulo-item')[0].innerText
    let precio = item.getElementsByClassName('precio-item')[0].innerText
    let imagenSrc = item.getElementsByClassName('img-item')[0].src
    agregarItemAlCarrito(titulo, precio, imagenSrc)
    hacerVisibleCarrito()
    localStorage.setItem('carrito', 'Se agrego un producto') 
}

//Funcion que hace visible el carrito
function hacerVisibleCarrito(){
    carritoVisible = true
    let carrito = document.getElementsByClassName('carrito')[0]
    carrito.style.marginRight = '0'
    carrito.style.opacity = '1'

    let items = document.getElementById('contenedorProductos-items')
    items.style.width = '60%'
}

//Funcion que agrega un item al carrito
function agregarItemAlCarrito(titulo, precio, imagenSrc){
    let item = document.createElement('div')
    item.classList.add = ('item')
    let itemsCarrito = document.getElementsByClassName('carrito-items')[0]

    //controlamos que el item que intenta ingresar no se encuentre en el carrito
    let nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo')
    for (let i = 0; i < nombresItemsCarrito.length;i++){
        if(nombresItemsCarrito[i].innerText==titulo){
            item_repetido() //sweet alert
            return
        }
    }

    let itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>`
    item.innerHTML = itemCarritoContenido
    itemsCarrito.append(item)

//Agregamos la funcionalidad eliminar al nuevo item
  item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito)

//Agregmos al funcionalidad restar cantidad del nuevo item
  let botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0]
  botonRestarCantidad.addEventListener('click',restarCantidad)

//Agregamos la funcionalidad sumar cantidad del nuevo item
  let botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0]
  botonSumarCantidad.addEventListener('click',sumarCantidad)

//Actualizamos total
  actualizarTotalCarrito()
}
//Aumento en uno la cantidad del elemento seleccionado
function sumarCantidad(event){
    let buttonClicked = event.target
    let selector = buttonClicked.parentElement
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value
    cantidadActual++
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual
    actualizarTotalCarrito()
}
//Resto en uno la cantidad del elemento seleccionado
function restarCantidad(event){
    let buttonClicked = event.target
    let selector = buttonClicked.parentElement
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value
    cantidadActual--
    if(cantidadActual>= 1){
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual
        actualizarTotalCarrito()
    }
}

//Elimino el item seleccionado del carrito
function eliminarItemCarrito(event){
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    localStorage.removeItem('carrito', JSON.stringify(cart))
    //Actualizamos el total del carrito
    actualizarTotalCarrito()
}

//Actualizamos el total de Carrito
function actualizarTotalCarrito(){
    //seleccionamos el contenedor carrito
    let carritoContenedor = document.getElementsByClassName('carrito')[0]
    let carritoItems = carritoContenedor.getElementsByClassName('carrito-item')
    let total = 0
    //recorremos cada elemento del carrito para actualizar el total
    for (let i=0; i < carritoItems.length;i++){
        let item = carritoItems[i]
        let precioElemento = item.getElementsByClassName('carrito-item-precio')[0]
        //quitamos el simobolo peso y el punto de milesimos.
        let precio = parseFloat(precioElemento.innerText.replace('$','').replace('.','')) // gracias modzilla 
        let cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0]
        let cantidad = cantidadItem.value
        total = total + (precio * cantidad)
    }
    total = Math.round(total * 100)/100

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$'+total.toLocaleString("es") + ",00"
}

// ALERTAS
// Compra Realizada
function compraRealizada() {
    const alertaConfirmacion = Swal.fire({
      title: 'Estas seguro?',
      text: "No se podra cancelar el pago, una vez realizado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Pagar'
    })
  
    const alertaCompra = alertaConfirmacion.then((result) => {
      if (result.isConfirmed) {
        return Swal.fire({
          icon: 'success',
          title: 'Compra Realizada!',
          text: 'Muchas Gracias por confiar en nosotros',
          timer: 2500,
        })
      }
    })
    // 
    return Promise.all([alertaConfirmacion, alertaCompra])
  }
  
  // Item Repetido
  function item_repetido(){
    Swal.fire({
      icon: 'error',
      title: 'El item ya se encuentra en el carrito',
      timer: 2500,
    })
  
}

// gracias modzilla // gracias modzilla // gracias modzilla 