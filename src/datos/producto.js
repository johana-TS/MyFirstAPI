
class Producto  {
    constructor(name,description,stock,precio){
     this.id='',  
     this.name= name,
     this.description=description,     
     this.stock=stock,
     this.precio=precio
    } 
 }

Producto.prototype.generarId= function generarId() {
    const id= new Date().getTime();      
    this.id=id;                                       
}
const arrayProducto=[];

arrayProducto.push({  "id":"1",
        "name":" PASTEL DE SALMÓN Y ESPINACAS",
        "descripcion":"bla bla bla",
        "stock":20,
        "precio":200
      
    },
    {
        "id":"2",
        "name":"CANELONES DE POLLO ESTILO ROSSINI",
        "descripcion":"bla bla bla  ",
        "stock":15,
        "precio":300
    },
    {
        "id":"3",
        "name":"SOLOMILLO WELLINGTON DE CERDO CON CHAMPIÑONES",
        "descripcion":"hamburguesa simple, solo agregado de queso",
        "stock":50,
        "precio":250

    },
    {
        "id":"4",
        "name":"milanga",
        "descripcion":" coccion a horno",
        "stock":100,
        "precio":250

    },
    {
        "id":"45",
        "name":"milanga",
        "description":"cocion: frita con papas fritas",
        "precio":"300",
        "stock":80
        
    }
);

function middleExisteArray(req,res,next){       // chekea que el array no este vacio
    if (arrayProducto !== undefined || arrayProducto !== null){
        next();      
    } else {
        next(new Error('no hay productos ingresados en la bd'));
    }      
}

function validateCamposProductos(req,res,next){
    const {name,description, stock, precio} = req.body;
    if (name=== undefined || name=== null){
       next(new Error ('no ha completado el campo "name"'))
    } else if (description=== undefined || description === null){
       next(new Error ('no ha completado el campo "description"'))
    } else if (stock=== undefined || stock === null){
       next(new Error ('no ha completado el campo "stock"'))
    } else if (precio=== undefined || precio === null){
       next(new Error ('no ha completado el campo "precio"'))
    } else{
       next();
    } 
    next(); 
}

function buscarProductoXNombre(nombre){
    let plato="";
    for (const producto of arrayProducto) {
        if (producto.name ===nombre){
             plato= producto;
            return plato;
        }
    } 
    return undefined;
}

function buscarProductoXID(id){
    console.log(arrayProducto);
    for (const producto of arrayProducto) {
        if (producto.id === id){
            const position=arrayProducto.indexOf(producto);
           arrayProducto.splice(position, 1);;
            //console.log(elementoEliminado);
           
            return true;
        }
    }
    return false;
}

function verProductos(req, res) {
    let listado="<div> <ul>";   
    for (const producto of arrayProducto) {
        listado+= `<li>plato: ${producto.name} - Descripcion: ${producto.descripcion} </li>`;
    }
    listado+=' </ul></div>';        
    res.status(200).send(listado);
}

function pushProducto(name,description,stock,precio){
    let newProduct = new Producto(name, description,stock,precio);
    newProduct.generarId()
    arrayProducto.push(newProduct);
  
    return true
}

function existeP(req,res,next){
    const name= req.body.name;
    for (const p of arrayProducto) {
        if (name===p.name){
            next(new Error('ya existe el producto que intenta ingresar'));
        }        
    }
    next();
}
function existeProducto(name){
    
    for (const p of arrayProducto) {
        if (name===p.name){
            return true;
        } 
    }
    return false
   
}


function hayStock(n, cantidad){   //cantidad es la solicitada por el usuario
                                 // lo llamo por el nombre 'n'
    if (existeProducto(n)){ //lo llamo por el nom bre
        for (const p of arrayProducto) { //tengo doble verificacion... hay q cambiarlo
            if (n===p.name && p.stock>cantidad) {    //aca!
                return true
            }else {
                return false
            }
        }
    }return false
}

function cambiarStock(n, cantidad){  //el admin modifica el stock
    if (existeProducto(n)){
        for (const p of arrayProducto) {
            if (n===p.name){
                p.stock=cantidad;
                return p
            }
            
        }return p;
    }
}


module.exports ={
    middleExisteArray,
    verProductos,
    existeP,
    existeProducto,
    hayStock,
    cambiarStock,
    pushProducto,
    validateCamposProductos,
    buscarProductoXNombre,
    buscarProductoXID
}