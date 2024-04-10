/**
 * @swagger
 * /product/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Product
 *     parameters:
 *       - name: keyword
 *         in: query
 *       - name: category
 *         in: query
 *       - name: price[gt]
 *         in: query
 *       - name: price[gte]
 *         in: query
 *       - name: price[lt]
 *         in: query
 *       - name: price[lte]
 *         in: query
 *       - name: page
 *         in: query
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /product/admin/new:
 *   post:
 *     summary: Add new product
 *     security:
 *       - jwt: []
 *     consumes:
 *       - multipart/form-data
 *     tags:
 *       - Product
 *     parameters:
 *       - name: name
 *         in: formData
 *         type: string
 *         description: Product name
 *       - name: price
 *         in: formData
 *         type: number
 *         description: Product price
 *       - name: description
 *         in: formData
 *         type: string
 *         description: Product description
 *       - name: productImageFiles
 *         in: formData
 *         type: array
 *         items: 
 *           type: file
 *           format: binary
 *       - name : category
 *         in: formData
 *         type: string
 *         description: Product category
 *       - name: seller
 *         in: formData
 *         type: string
 *         description: Product provider
 *       - name: stock
 *         in: formData
 *         type: number
 *         description: Product quantity
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: Get single product
 *     tags:
 *       - Product
 *     parameters:
 *       - name: productId
 *         in: path
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /product/admin/{productId}:
 *   put:
 *     summary: Update a product
 *     security:
 *       - jwt: []
 *     consumes:
 *       - multipart/form-data
 *     tags:
 *       - Product
 *     parameters:
 *       - name: name
 *         in: formData
 *         type: string
 *         description: Product name
 *       - name: price
 *         in: formData
 *         type: number
 *         description: Product price
 *       - name: description
 *         in: formData
 *         type: string
 *         description: Product description
 *       - name: productImageFiles
 *         in: formData
 *         type: array
 *         items: 
 *           type: file
 *           format: binary
 *       - name : category
 *         in: formData
 *         type: string
 *         description: Product category
 *       - name: seller
 *         in: formData
 *         type: string
 *         description: Product provider
 *       - name: stock
 *         in: formData
 *         type: number
 *         description: Product quantity
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /product/admin/{productId}:
 *   delete:
 *     summary: Delete a product
 *     security:
 *       - jwt: []
 *     tags:
 *       - Product
 *     parameters:
 *       - name: productId
 *         in: path
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /product/review:
 *   put:
 *     summary: create review product
 *     security:
 *       - jwt: []
 *     tags:
 *       - Product
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           productId:
 *             type: String
 *           rating:
 *             type: String
 *           comment:
 *             type: String
 *         example: {
 *           "productId": "6597c10d00555b9bb84f5314",
 *           "rating": "5",
 *           "comment": "beautiful"
 *         }
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /product/review/reviews:
 *   get:
 *     summary: get product reviews
 *     security:
 *       - jwt: []
 *     tags:
 *       - Product
 *     parameters:
 *       - name: productId
 *         in: query
 *         type: String
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /product/review/reviews:
 *   delete:
 *     summary: delete product review
 *     security:
 *       - jwt: []
 *     tags:
 *       - Product
 *     parameters:
 *       - name: productId
 *         in: query
 *         type: String
 *       - name: reviewId
 *         in: query
 *         type: String
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /product/restore-deleted-product:
 *   post:
 *     summary: Restore deleted product
 *     security:
 *       - jwt: []
 *     tags:
 *       - Product
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           keyword:
 *             type: String
 *         example: {
 *           "keyword": ""
 *         }
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

/**
 * @swagger
 * /product/restore-deleted-reviews:
 *   post:
 *     summary: Restore deleted reviews
 *     security:
 *       - jwt: []
 *     tags:
 *       - Product
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           keyword:
 *             type: String
 *         example: {
 *           "keyword": ""
 *         }
 *     responses:
 *       200:
 *         name: body
 *         in: body
 *         required: true
 *         description: data report
 *         schema:
 *           type: object
 *           properties:
 *             $ref: '#/definitions/dashboard'
 *           example: {
 *              success: true
 *           }
 *       404:
 *         description: When data cannot be process
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: {
 *                 "param": "EXISTS",
 *               }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
