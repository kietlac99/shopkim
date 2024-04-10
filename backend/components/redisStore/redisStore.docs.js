/**
 * @swagger
 * /redis/scan:
 *   post:
 *     summary: scan redis data
 *     security:
 *       - jwt: []
 *     tags:
 *       - Redis
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           scanType:
 *             type: String
 *           keyword:
 *             type: String
 *         example: {
 *           "scanType": "",
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