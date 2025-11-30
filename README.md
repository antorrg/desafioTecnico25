# waterJugChallenge
Rest API design for a technical challenge refactorized on 2025-10-25

[You can also read this document in Spanish](./data/spanish.md)

This API solves the problem of measuring exactly Z gallons using two jugs of X and Y gallons. The API is built with Express.js and uses the following libraries: helmet, morgan, cors, node-cache, nodemon for development, and for testing jest and supertest.

## Endpoints

### 1. Create a solution
- **Endpoint:**: `/api/jugs/create`
- **Method:**: `POST`
- **Description:**: Creates a solution to measure exactly Z gallons with jugs of X and Y gallons.
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

## Configuration and Execution:
### Requirements:
- Node.js version 18 or higher
### Initializing the application:
- Clone the repository to a folder on your computer.
- In the bash or powershell terminal, navigate to the root directory (where the `package.json` file is located): 
```bash
> cd waterJugChallenge
```
- Install dependencies
```bash
> npm install
```
You can choose between declaring an environment variable or initializing the server directly, by default it will start on port 3001.
- Start the server:
```bash
> npm start
```
- To run the tests the command is: 
```bash
> npm test
```
### You can run unit tests or an integration test

#### Unit tests:
There are three unit tests:

- 01 : validateJug, checkFeasibility
- 02 : jugService

To run the unit tests the command is `npm test-xx`. For example: for test No. 1:
```bash
> npm test 01
```

The integration test (03) can be executed individually:

```bash
> npm test 03
```
All tests can be run simply with the command `npm test`

## Explanation of the Algorithm
The algorithm to solve the water jug problem is based on the following steps:

Calculate the GCD (Greatest Common Divisor) of X and Y:
The GCD of two numbers is the largest number that can divide both without leaving a remainder.

Check that Z is a multiple of the GCD of X and Y:
If Z is not a multiple of the GCD, it is impossible to measure Z gallons with the jugs.

Ensure that Z is less than or equal to the maximum capacity of the jugs:
If Z is greater than the capacity of both jugs, it is impossible to measure Z gallons.

Simulation of the process:
Fill and empty the jugs in a sequence of steps until one of the jugs contains exactly Z gallons.

The algorithm uses an iterative approach to fill and transfer water between the jugs, recording each step until the desired amount is reached or determining that it is not possible.

### Implemented in the application:

Validation through middlewares:
Validations are handled by "Validator" class with static methods: two middlewares with their respective helper functions.
- 1: Method `validateJug`:
This function verifies that the inputs `x_capacity, y_capacity` and `z_amount_wanted` are present in the request body, it also validates that it is an integer and if an integer arrives as a string by mistake, it converts it for use.

- 2: Method  `checkFeasibility`:
This function verifies that the operation can be carried out, the idea of ​​this implementation is that errors do not reach the controller, so if the operation is performed, it has the highest chance of success.

Node-cache was also implemented for very common responses, it is configured to be kept for 10 minutes.
If it is a new solution the status will be `201`, if it requests the same solution again the response will come from the cache: status `203`.


// ...existing code...
# waterJugChallenge — English

REST API to solve the classic water jugs problem: measure exactly Z units using two jugs of capacities X and Y.

This project is built with Express.js and uses helmet, morgan, cors, node-cache. Dev: nodemon. Tests: jest + supertest.

Quick links in the codebase
- Validator middlewares (now a static class): src/middlewares/Validator.js
  - Validator.validateJug — validates and parses inputs
  - Validator.checkFeasibility — checks feasibility using GCD
- Main service: src/services/jugService.js — createJugCases uses BFS, a Queue implementation and node-cache
- Solution formatter: src/services/helpers/jugServHelper.js
- Queue implementation: src/services/helpers/Queuejs.js
- Tests: test/01.test.js, test/02.test.js, test/03.test.js

Endpoints

1) Create a solution
- Endpoint: POST /api/jugs/create
- Body (JSON):
  {
    "x_capacity": 2,
    "y_capacity": 10,
    "z_amount_wanted": 4
  }
- Responses:
  - New solution: status 201, body { solution: [...] }
  - Cached solution: status 203, body { solution: [...] }
  - Validation or feasibility errors: appropriate 4xx with message

Example response:
{
  "solution": [
    { "step": 1, "action": "Fill bucket X", "bucketX": 2, "bucketY": 0 },
    { "step": 2, "action": "Transfer from bucket X to Y", "bucketX": 0, "bucketY": 2 },
    { "step": 3, "action": "Fill bucket X", "bucketX": 2, "bucketY": 2 },
    { "step": 4, "action": "Transfer from bucket X to Y", "bucketX": 0, "bucketY": 4, "status": "Solved" }
  ]
}

Validation rules (Validator class)
- validateJug: ensures x_capacity, y_capacity and z_amount_wanted exist; accepts numeric strings, converts to integers; rejects negative numbers and overly long inputs.
- checkFeasibility: computes GCD(x, y) and verifies z is a multiple of GCD and z <= max(x, y). Returns 400 if not feasible.

Service behaviour
- jugService.createJugCases(x, y, z) performs BFS over states (x,y) using Queuejs and tracks visited states.
- Each enqueued state contains the step history; when a state matches z in either jug, the steps are formatted with the helper and returned.
- Solutions are cached with node-cache (TTL 600s). If no solution is found, an error with status 404 is thrown.

Tests
- Unit tests:
  - test/01.test.js — Validator class (validateJug, checkFeasibility)
  - test/02.test.js — jugService.createJugCases
- Integration:
  - test/03.test.js — API end-to-end checks (201/203 and error routes)
- Run tests with Jest. See package.json for individual test scripts.

Run locally
- Requirements: Node.js 18+
- Install:
  npm install
- Start:
  npm start
- Run tests:
  npm test

Notes
- Error handling uses a centralized error middleware returning error.message and status.
- Cache returns cached results with a different HTTP status to indicate a cached response.
- See source files referenced above for implementation details.
  
// ...existing code...