
# waterJugChallenge
[Volver al README](../README.md)

Esta API resuelve el problema de medir exactamente Z galones utilizando dos jarras de X e Y galones. La API está construida con Express.js y utiliza las librerías: helmet, morgan, cors, node-cache, nodemon para la etapa de desarrollo y para los tests jest y supertest.

## Endpoints

### 1. Crear una solución
- **Endpoint:**: `/api/jugs/create`
- **Método:**: `POST`
- **Descripción:**: Crea una solución para medir exactamente Z galones con jarras de X e Y galones.
- **Request (json):**:
  ```json
  {
    "x_capacity": 2,
    "y_capacity": 10,
    "z_amount_wanted": 4
  }
  ```
- **Response (json):**
```json
{
  "solution": [
    {
      "step": 1,
      "action": "Fill bucket X",
      "bucketX": 2,
      "bucketY": 0
    },
    {
      "step": 2,
      "action": "Transfer from bucket X to Y",
      "bucketX": 0,
      "bucketY": 2
    },
    {
      "step": 3,
      "action": "Fill bucket X",
      "bucketX": 2,
      "bucketY": 2
    },
    {
      "step": 4,
      "action": "Transfer from bucket X to Y",
      "bucketX": 0,
      "bucketY": 4,
      "status": "Solved"
    }
  ]
}
```

## Configuracion y ejecucion:
### Requerimientos:
- Node.js version 18 o superior
### Inicializar la applicacion:
- Clonar el repositorio en alguna carpeta de su computadora.
- En la terminal de bash o powershell situarse en el directorio raíz (donde se encuentra el archivo `package.json`): 
```bash
> cd waterJugChallenge
```
- Instalar las dependencias
```bash
> npm install
```
Puede elegir entre declarar una variable de entorno o inicializar el servidor directamente, por defecto se iniciará en el puerto 3001.
- Inicializar el servidor:
```bash
> npm start
```
- Para ejecutar los tests el comando es: 
```bash
> npm test
```
### Puede correr test unitarios o un test de integración

#### Test unitarios:
Los test unitarios son tres:

- 01 : validateJug, checkFeasibility
- 02 : jugService

Para correr los tests unitarios el comando es `npm test-xx`. Por ejemplo: para el test Nº 1:
```bash
> npm test 01
```

El test de integracion (03) puede ejecutarse de manera individual:

```bash
> npm test 03
```
Pueden ejecutarse todos los test simplemente con el comando `npm test`

## Explicación del Algoritmo
El algoritmo para resolver el problema de las jarras de agua se basa en los siguientes pasos:

Calcular el MCD (Máximo Común Divisor) de X e Y:
El MCD de dos números es el mayor número que puede dividir a ambos sin dejar un residuo.

Verificar que Z sea múltiplo del MCD de X e Y:
Si Z no es múltiplo del MCD, es imposible medir Z galones con las jarras.

Asegurarse de que Z sea menor o igual a la capacidad máxima de las jarras:
Si Z es mayor que la capacidad de ambas jarras, es imposible medir Z galones.

Simulación del proceso:
Llenar y vaciar las jarras en una secuencia de pasos hasta que una de las jarras contenga exactamente Z galones.

El algoritmo utiliza un enfoque iterativo para llenar y transferir agua entre las jarras, registrando cada paso hasta alcanzar la cantidad deseada o determinar que no es posible.

### En la aplicacion se implementó:

Validación por medio de middlewares:
Las validaciones están a cargo de una clase "Validator" con metodos estatico: dos middlewares con sus respectivas funciones de ayuda (helpers).
- 1: Metodo`validateJug`:
Esta función verifica que los inputs `x_capacity, y_capacity` y `z_amount_wanted` estén presentes en el body de la request, ademas valida que sea un integer y si por error el integer llega como un string lo convierte para su uso. 

- 2: Metodo  `checkFeasibility`:
Esta función se encarga de verificar que la operación se pueda llevar a cabo, la idea de esta implementación es que los errores no lleguen al controller, de modo que si la operacion se realiza tenga la mayor posibilidad de éxito.

Se implementó tambien node-cache para respuestas muy comunes, la misma está configurada en 10 minutos de conservación. 
En caso de ser una solucion nueva el status será `201`, en el caso de que pida otra vez la misma solucion la respuesta vendrá de la cache: status `203`.


// ...existing code...
# waterJugChallenge

Rest API para resolver el problema de medir exactamente Z unidades usando dos jarras X e Y.

Cambios relevantes
- Los middlewares de validación ahora son parte de una clase estática [`Validator.validateJug`](src/middlewares/Validator.js) y [`Validator.checkFeasibility`](src/middlewares/Validator.js). Ver [src/middlewares/Validator.js](src/middlewares/Validator.js).
- El servicio principal usa cola BFS y cache: [`jugService.createJugCases`](src/services/jugService.js). Ver [src/services/jugService.js](src/services/jugService.js).
- El formateo final de la solución se realiza con [`formatSolution`](src/services/helpers/jugServHelper.js). Ver [src/services/helpers/jugServHelper.js](src/services/helpers/jugServHelper.js).
- La cola está implementada en [`Queuejs`](src/services/helpers/Queuejs.js). Ver [src/services/helpers/Queuejs.js](src/services/helpers/Queuejs.js).

Endpoints
- POST /api/jugs/create
  - Body (json):
    {
      "x_capacity": 2,
      "y_capacity": 10,
      "z_amount_wanted": 4
    }
  - Respuesta (JSON):
    - Si la solución es nueva: status 201 y body con objeto { solution: [...] }
    - Si la solución viene de la cache: status 203 y body con objeto { solution: [...] }

Ejemplo de respuesta:
{
  "solution": [
    { "step": 1, "action": "Fill bucket X", "bucketX": 2, "bucketY": 0 },
    { "step": 2, "action": "Transfer from bucket X to Y", "bucketX": 0, "bucketY": 2 },
    { "step": 3, "action": "Fill bucket X", "bucketX": 2, "bucketY": 2 },
    { "step": 4, "action": "Transfer from bucket X to Y", "bucketX": 0, "bucketY": 4, "status": "Solved" }
  ]
}

Validaciones
- [`Validator.validateJug`](src/middlewares/Validator.js): comprueba presencia de campos, convierte strings numéricos a enteros y valida formato (enteros no negativos, longitud máxima).
- [`Validator.checkFeasibility`](src/middlewares/Validator.js): valida factibilidad usando el MCD (GCD). Devuelve error 400 si no es factible.

Lógica del servicio
- [`jugService.createJugCases`](src/services/jugService.js) realiza una búsqueda BFS de estados (usa [`Queuejs`](src/services/helpers/Queuejs.js)), marca visitados y genera pasos. Guarda la solución en cache (`node-cache`) con TTL 600s. Si no encuentra solución lanza error con status 404.
- [`formatSolution`](src/services/helpers/jugServHelper.js) ajusta el arreglo final de pasos para asegurar que el estado "Solved" quede en el último paso reportado.

Errores y respuestas
- Rutas no encontradas devuelven 404 con { error: 'Not Found' }.
- Errores del servidor pasan por el middleware de errores y devuelven el mensaje del error con su status (p. ej. 500).

Tests
- Unit y de integración con Jest + Supertest.
  - [test/01.test.js](test/01.test.js): tests de validaciones usando la clase `Validator`.
  - [test/02.test.js](test/02.test.js): tests de [`jugService.createJugCases`](src/services/jugService.js).
  - [test/03.test.js](test/03.test.js): integración HTTP; verifica 201/203 y manejo de ruta de error (/api/jugs-error).

Comandos
- Instalar dependencias:
  npm install
- Ejecutar servidor:
  npm start
- Ejecutar tests:
  npm test

// ...existing code...