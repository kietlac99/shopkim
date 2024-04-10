/**
 * @swagger
 * /order/new:
 *   post:
 *     summary: Add new order
 *     security:
 *       - jwt: []
 *     tags:
 *       - Order
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           orderItems:
 *             type: Array
 *           shippingInfo:
 *             type: Object
 *           itemsPrice:
 *             type: String
 *           taxPrice:
 *             type: String
 *           shippingPrice:
 *             type: String
 *           totalPrice:
 *             type: String
 *           paymentInfo:
 *             type: Object
 *         example: {
 *           "orderItems": [
 *             {
 *               "name": "Đầm trắng",
 *               "quantity": "4",
 *               "image": "https://res.cloudinary.com/dbbwvijcl/image/upload/v1704440214/product/dress/CelestMaxiDressinCream1_yjxheb.jpg",
 *               "price": "1000000",
 *               "product": "6597c10d00555b9bb84f5312"
 *             }
 *           ],
 *           "shippingInfo": {
 *             "address": "770/7 Bình Giã",
 *             "location": {
 *               "province": "Tỉnh Bà Rịa Vũng Tàu",
 *               "district": "Thành phố Vũng Tàu",
 *               "ward": "Phường 10"
 *             },
 *             "phoneNo": "0899755408"
 *           },
 *           "itemsPrice": "4000000",
 *           "taxPrice": "0.1",
 *           "shippingPrice": "20000",
 *           "totalPrice": "4420000",
 *           "paymentInfo": {
 *             "id": "pi_65a89bbb98a4f980b60359f6",
 *             "status": "succeeded"
 *           }
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
 * /order/{id}:
 *   get:
 *     summary: get single order info by order id
 *     security:
 *       - jwt: []
 *     tags:
 *       - Order
 *     parameters:
 *       - name: id
 *         in: path
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
 * /order/orders/me:
 *   get:
 *     summary: get orders info of user
 *     security:
 *       - jwt: []
 *     tags:
 *       - Order
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
 * /order/admin/orders:
 *   get:
 *     summary: get all orders by admin
 *     security:
 *       - jwt: []
 *     tags:
 *       - Order
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
 * /order/admin/order/{id}:
 *   put:
 *     summary: update order by admin
 *     security:
 *       - jwt: []
 *     tags:
 *       - Order
 *     parameters:
 *       - name: id
 *         in: path
 *         type: String
 *       - name: body
 *         in: body
 *         properties:
 *           orderStatus:
 *             type: String
 *         example: {
 *           "orderStatus": "Đã giao"
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
 * /order/admin/order/{id}:
 *   delete:
 *     summary: delete order by admin
 *     security:
 *       - jwt: []
 *     tags:
 *       - Order
 *     parameters:
 *       - name: id
 *         in: path
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
 * /order/location:
 *   post:
 *     summary: get districts by province
 *     tags:
 *       - Order
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           province:
 *             type: String
 *           district:
 *             type: String
 *         example: {
 *           'province': 'Thành phố Hà Nội',
 *           'district': 'Quận Ba Đình'
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
 * /order/restore-deleted-orders:
 *   post:
 *     summary: Restore deleted orders
 *     security:
 *       - jwt: []
 *     tags:
 *       - Order
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           keyword:
 *             type: String
 *         example: {
 *           'keyword': '',
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