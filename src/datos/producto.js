
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
        "name":"pastel",
        "descripcion":"bla bla bla",
        "stock":20,
        "precio":200
      
    },
    {
        "id":"2",
        "name":"canelones",
        "descripcion":"bla bla bla  ",
        "stock":15,
        "precio":300
    },
    {
        "id":"3",
        "name":"tarta",
        "descripcion":"de verduras",
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
        "name":"hamburguesa",
        "description":"cocion: frita con papas fritas",
        "precio":300,
        "stock":80
        
    },
    {
        "id":"33",
        "name":"helado",
        "description":"postre mousse helada",
        "precio":200,
        "stock":80
        
    },
    {
        "id":"56",
        "name":"flan",
        "description":"postre mousse helada",
        "precio":200,
        "stock":80
        
    }
);

function middleExisteArray(req,res,next){       // chekea que el array no este vacio
    if (arrayProducto !== undefined || arrayProducto !== null || arrayProducto!==""){
        next();      
    } else {
        next(new Error('no hay productos ingresados en la bd'));
    }      
}

function validateCamposProductos(req,res,next){
    const {name,description, stock, precio} = req.body;

    if (name=== undefined || name=== null || name===""){
       next(new Error ('no ha completado el campo "name"'))
    } else if (description=== undefined || description === null || description===""){
       next(new Error ('no ha completado el campo "description"'))
    } else if (stock=== undefined || stock === null|| stock===""){
       next(new Error ('no ha completado el campo "stock"'))
    } else if (precio=== undefined || precio === null ||precio===""){
       next(new Error ('no ha completado el campo "precio"'))
    } else{
       next();
    } 
   
}
function validateCamposModificacion(req,res,next){
    const {name,newName,description, stock, precio} = req.body;

    if (name=== undefined || name=== null || name===""){
       next(new Error ('no ha completado el campo "name"'))
    } else if (newName=== undefined || newName === null || newName===""){
       next(new Error ('no ha completado el campo "newName"'))
    }else if (description=== undefined || description === null || description===""){
        next(new Error ('no ha completado el campo "description"'))
    } else if (stock=== undefined || stock === null|| stock===""){
       next(new Error ('no ha completado el campo "stock"'))
    } else if (precio=== undefined || precio === null ||precio===""){
       next(new Error ('no ha completado el campo "precio"'))
    } else{
       next();
    } 
   
} //innecesario.. usar validaatecamposproducto y sumarle el newname en el handler

function buscarProductoXNombre(nombre){
    let plato="";
    for (const producto of arrayProducto) {
        if (producto.name ===nombre){
             plato= producto;
            return plato;
        }
    } 
    return false;
}

function buscarProductoXID(id){ //para borrar producto
   // console.log(arrayProducto);
    for (const producto of arrayProducto) {
        if (producto.id === id){
            const position=arrayProducto.indexOf(producto);
            arrayProducto.splice(position, 1);      
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
    if (listado !== null || listado !== undefined || listado!==""){
        res.status(200).json(listado);
    } else {
        res.status(404).json("Error, no hay listado disponible");
    }

}

function pushProducto(name,description,stock,precio){
    const newProduct = new Producto(name, description,stock,precio);
    newProduct.generarId()
    arrayProducto.push(newProduct);
    if (newProduct===null || newProduct=== undefined|| newProduct===""){
        return false
    }else {
        return newProduct
    }
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
function validarProducto(req,res,next){
    const nameP= req.body.name;
    for (const p of arrayProducto) {
        if (nameP===p.name){
             next();
        }        
    }
    return  next(new Error('no existe el producto que intenta ingresar'));
}

function hayStock(n,cantidad){         
        for (const p of arrayProducto) { 
            if (n===p.name && p.stock>0 || p.stock>cantidad) {  
                return true
            } 
        } return false
}

function cambiarStock(n, cantidad){  //el admin modifica el stock en array de producto no de pedido
        for (const p of arrayProducto) { 
            if (n===p.name){
                p.stock+=cantidad;             
                return true;
            }            
        } return false;
}


module.exports ={
    arrayProducto,
    middleExisteArray,
    verProductos,
    existeP,
    validarProducto,
    hayStock,
    cambiarStock,
    pushProducto,
    validateCamposProductos,
    buscarProductoXNombre,
    buscarProductoXID,
    validateCamposModificacion
}

