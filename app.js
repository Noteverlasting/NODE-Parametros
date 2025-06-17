// DEPENDENCIAS 

// Requerimos el modulo express
const express = require('express');
// Indicamos que app es una aplicacion de express
const app = express()
// Cargamos el archivo .env
process.loadEnvFile()
// Indicamos el puerto -En estos casos y por orden: Argumento 2 en terminal, "PORT" en .env o puerto 3000 
const PORT = process.argv[2] || process.env.PORT || 3000;
// Cargamos los datos de ventas.json
const jsonData = require('./ventas.json')


// MIDDLEWARE

// Vimos varios metodos o funciones asociadas a la respuesta (envian datos al navegador-cliente-):
// res.send -espera un string-
// res.json -espera un json-
// res.sendFile -espera la ruta de un fichero-

app.get("/", (req, res) => res.send("<h1>Express tests</h1>"))
// app.get("/api", (req, res) => res.json(jsonData))    //Sin considerar queries

// Teniendo en cuenta el query "orden=asc"
// app.get('/api', (req, res) => {
//     console.table(req.query); // para una ruta como "/api?orden=asc" La clave seria 'orden' y el valor 'asc'
//     console.log(req.query.orden); // para una ruta como "/api?orden=asc" nos devolveria 'asc'
//     let orden = ""
//     if (req.query.length > 0) {orden = req.query.orden.toLocaleLowerCase()}
//     if (orden == "desc") {
//         // Para finalizar la funcion y que no muestre también la respuesta que está fuera de este if.
//         // Si el sort devuelve positivo, b, se pondrá por delante de a, es decir, se ordenará de forma ascendente.
//         return res.json(jsonData.sort((a,b) => b.anyo - a.anyo))
//     } else if (orden == "asc") return res.json(jsonData.sort((a,b) => a.anyo - b.anyo))
    
//     res.json(jsonData)
// })

// Teniendo en cuenta los query "orden=asc" y "pais="asc"
app.get('/api', (req, res) => {
    console.table(req.query); // para una ruta como "/api?orden=asc" La clave seria 'orden' y el valor 'asc'
    console.log(req.query.orden); // para una ruta como "/api?orden=asc" nos devolveria 'asc'
    let orden = ""
    if (req.query.orden) {orden = req.query.orden.toLocaleLowerCase()}
    let pais = ""
    if (req.query.pais) {pais = req.query.pais.toLocaleLowerCase()}
    if (orden == "desc" && pais == "asc") {
        const resultado = jsonData.sort((a, b) => {
            // Primero ordena por año descendente
            const anyos = b.anyo - a.anyo;
            if (anyos !== 0) return anyos;
            // Si el año es igual, ordena por país ascendente
            return a.pais.localeCompare(b.pais);
        });

        return res.json(resultado);
    } 

    res.json(jsonData)

})

//OTRA OPCION
// app.get('/api', (req, res) => {
//     console.table(req.query);
//     console.log(req.query.orden);

//     let orden = "";
//     if (req.query.orden) {
//         orden = req.query.orden.toLowerCase();
//     }

//     if (orden === "desc") {
//         return res.json(jsonData.sort((a, b) =>
//             (b.anyo - a.anyo) || a.pais.localeCompare(b.pais)
//         ));
//     } else if (orden === "asc") {
//         return res.json(jsonData.sort((a, b) =>
//             (a.anyo - b.anyo) || a.pais.localeCompare(b.pais)
//         ));
//     }

//     res.json(jsonData);
// });

//     // EJERCICIO: queremos que salga la respuesta tal que asi: [{"pais": "Italia", "total-ventas": 3000}, {"pais": "Francia", "total-ventas": 4000}]
// app.get('/api/paises', (req, res) => {
//     // Creamos un objeto vacío para acumular los totales, que llegaran tal que asi:
//     // { "Italia": 3000, "Francia": 4000 }
//     let totales = {}
//     // Recorremos el array de ventas declarando variables para los indices, los paises y las ventas.
//     for (let i = 0; i < jsonData.length; i++) {
//         let linea = jsonData[i];
//         let pais = linea.pais;
//         let venta = linea.venta;
//     // Si la clave del pais existe en el objeto totales, le añadimos la venta. ej: totales["Italia"] += 2000 (ahora vale 3000)
//         if (totales[pais]) {
//             totales[pais] += venta;
//     // Si no estuviese en el objeto totales, lo añadimos con la venta. ej: totales["Italia"] = 1000
//         } else {
//             totales[pais] = venta;
//         }
//     }
//     // Creamos un array donde ir recopilando los datos de los paises y ventas
//     const resultado = [];
//     // Recorremos el objeto totales a traves de la clave pais y agregamos al array resultado un objeto con el pais y total de ventas
//     for (let pais in totales) {
//         resultado.push({
//             "pais": pais,
//             "total-ventas": totales[pais]
//         });
//     }

//     res.json(resultado);
// });

// SOLUCION DE FERRAN:
app.get('/api/paises', (req, res) => {
    // Creamos un array para almacenar los datos y un objeto para almacenar los totales de ventas
    let resultado = []
    let ventasPais = {}

    for (let i = 0; i < jsonData.length; i++) {
        // Vamos a ir obteniendo los objetos gestionandolos con su clave pais y guardamos los valores
        let pais = jsonData[i].pais
        // Lo mismo con las ventas
        let venta = jsonData[i].venta
        // Si no hay ningun valor en ventasPais, le asignaremos valor 0 a su par.
        if (!ventasPais[pais]) ventasPais[pais] = 0
        // Y a cada clave pais que haya en el objeto ventasPais le sumamos la venta que se va acumulando
        ventasPais[pais] += venta
 }
    // Le hacemos un push al objeto resultado con cada pais y su total de ventas
    for (let pais in ventasPais) resultado.push( {"pais": pais,"total-ventas": ventasPais[pais]} )

    res.json(resultado)
})


// Ahora marcamos una ruta nueva, en este caso para saber los datos del año 2022 en concreto
app.get('/api/anyo/2022', (req, res) => {
    let resultado = []
    for (let objeto of jsonData){
        if(objeto['anyo'] == 2022){
            resultado.push(objeto)
        }
    }
    res.json(resultado)
})


// Ruta con parametros de la URL 
app.get('/api/paises/:nombrePais', (req, res) =>{

    // req.params es un objeto que contiene los valores de los parametros de la URL. ejemplo [Object: null prototype] { nombrePais: 'Francia' }
    let nombrePais = req.params.nombrePais.toLocaleLowerCase()
    let resultado = []
    // OF valores dentro de un array
    // IN claves dentro de un objeto
    for (let objeto of jsonData){
        let pais = objeto.pais.toLocaleLowerCase()
        if (pais == nombrePais) resultado.push(objeto)
    }
    // vamos a utilizar la sintaxis de programacion funcional con .filter()
    // .filter() devuelve un nuevo array con los elementos que cumplan la condicion, en este caso: 
    // el "dato" dentro del objeto jsonData debe tener el valor pais coincidente con nombrePais 
    let resultadoFilter = jsonData.filter(dato => dato.pais.toLowerCase() == nombrePais)

    // Si no existe el pais, devolvemos un codigo 404 + mensaje. Le ponemos un return para que la linea finalice la funcion.
    if (resultadoFilter.length == 0) return res.status(404).json({"mensaje" : `No hay datos sobre ${nombrePais}`})
    res.status(200).json(resultado)
})

app.get('/api/anyos/:anyo', (req, res) =>{

    let anyo = req.params.anyo

    let resultanyo = jsonData.filter(dato => dato.anyo == anyo)

    if (resultanyo.length == 0) return res.status(404).json({"mensaje" : `No hay datos sobre el año ${anyo}`})
    res.status(200).json(resultanyo)
})

app.get('/api/paises/:nombrePais/:anyo', (req, res) =>{

    let nombrePais = req.params.nombrePais.toLocaleLowerCase()
    let anyo = req.params.anyo

    let resultadoFilter = jsonData.filter(dato => dato.pais.toLocaleLowerCase() == nombrePais && dato.anyo == anyo)

    if (resultadoFilter.length == 0) return res.status(404).json({"mensaje" : `No hay datos sobre ${nombrePais} en el año ${anyo}`})
    res.status(200).json(resultadoFilter)
})







app.listen(PORT, () => console.log(`Servidor levantado en http://localhost:${PORT}`))