import { Router } from "express"
import { body, param} from "express-validator"
import { createProduct, deleteProduct, getProducts, getProductsById, updatedAvailability, updatedProduct } from "./handlers/product"
import { handleInputErrors } from "./middleware"

const router = Router()

/**
 * @swagger 
 * components: 
 *      schemas:
 *          Product:
 *              type: object
 *              properties: 
 *                  id:
 *                      type: interger
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                       type: string
 *                       description: The Product Name
 *                       example: PC - Gaming
 *                  price:
 *                      type: number
 *                      description: The Product Price
 *                      example: 700 
 *                  availability:
 *                      type: booleam
 *                      description: The Product Availavility
 *                      example: true
*/

/**
 * @swagger
 * /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags: 
 *              - Products
 *          description: Return a list of products
 *          responses: 
 *              200:
 *                  description: SuccessFull Response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Product'
*/
router.get('/', getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: SuccessFull Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not found
 *          400:
 *              description: Bad Request - Invalid ID
*/
router.get('/:id',
    param('id').isInt().withMessage('ID No Válido'),
    handleInputErrors,
    getProductsById
)

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Return a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object 
 *                      properties: 
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo de 49 Pulgadas FHD"
 *                          price:
 *                              type: number
 *                              example: 500
 *      responses:
 *          201: 
 *              description: SuccessFul Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid input data
*/
router.post('/',
    
    // Validación
    body('name')
        .notEmpty().withMessage('El Nombre del Producto No Puede ir Vacío'),
    body('price')
        .isNumeric().withMessage('Valor No Valido')
        .notEmpty().withMessage('El Precio del Producto No Puede ir Vacío')
        .custom(value => value > 0).withMessage('Valor Negativo - No Valido'),
    handleInputErrors,
    createProduct 
)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input      
 *      tags:
 *          - Products
 *      description: Returs the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object 
 *                      properties: 
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo de 49 Pulgadas FHD"
 *                          price:
 *                              type: number
 *                              example: 500
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200: 
 *              description: SuccessFul Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID or Invalid Input Data
 *          404:
 *              description: Product Not Found      
*/
router.put('/:id', 
    
    param('id').isInt().withMessage('ID No Válido'),
    body('name')
        .notEmpty().withMessage('El Nombre del Producto No Puede ir Vacío'),
    body('price')
        .isNumeric().withMessage('Valor No Valido')
        .notEmpty().withMessage('El Precio del Producto No Puede ir Vacío')
        .custom(value => value > 0).withMessage('Valor Negativo - Valor Nulo - No Valido'),
    body('availability')
        .isBoolean().withMessage('Valor Para Disponibilidad No Válido'),
    handleInputErrors,
    updatedProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer 
 *      responses:
 *          200: 
 *              description: SuccessFul Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found            
 */
router.patch('/:id', 
    param('id').isInt().withMessage('ID No Válido'),
    handleInputErrors,
    updatedAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Deletes a product by a givem ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to delete
 *          required: true
 *          schema:
 *              type: integer 
 *      responses:
 *          200: 
 *              description: SuccessFul Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: "Producto Eliminado Correctamente"
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product Not Found            
 */
router.delete('/:id', 
    param('id').isInt().withMessage('ID No Válido'),
    handleInputErrors,
    deleteProduct
)

export default router

