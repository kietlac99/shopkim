/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: register user
 *     consumes:
 *       - multipart/form-data
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: avatarImageFile
 *         in: formData
 *         type: file
 *         description: Avatar image
 *       - name: name
 *         in: formData
 *         type: string
 *         description: Name of the user
 *       - name: email
 *         in: formData
 *         type: string
 *         description: Email of the user
 *       - name: password
 *         in: formData
 *         type: string
 *         description: Password of the user
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
 * /auth/login:
 *   post:
 *     summary: login user
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           email:
 *             type: String
 *           password:
 *             type: String
 *         example: {
 *           "email": "kiet130599@gmail.com",
 *           "password": "130599KietLac."
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
 * /auth/logout:
 *   get:
 *     summary: logout user
 *     tags:
 *       - Auth
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
 * /auth/password/forgot:
 *   post:
 *     summary: forgot user password
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           email:
 *             type: String
 *         example: {
 *           "email": "kiet130599@gmail.com",
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
 * /auth/password/reset/{token}:
 *   put:
 *     summary: reset user password
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: token
 *         in: path
 *         type: String
 *         description: reset password token
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           password:
 *             type: String
 *           confirmPassword:
 *             type: String
 *         example: {
 *           "password": "130599KietLac.",
 *           "confirmPassword": "130599KietLac."
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
 * /auth/me:
 *   get:
 *     summary: get user profile
 *     security:
 *       - jwt: []
 *     tags:
 *       - Auth
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
 * /auth/password/update:
 *   put:
 *     summary: update user password
 *     security:
 *       - jwt: []
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           oldPassword:
 *             type: String
 *           password:
 *             type: String
 *           confirmPassword:
 *             type: String
 *         example: {
 *           "oldPassword": "130599KietLac.",
 *           "password": "130599KietTran.",
 *           "confirmPassword": "130599KietTran."
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
 * /auth/me/update:
 *   put:
 *     summary: update user profile
 *     security:
 *       - jwt: []
 *     consumes:
 *       - multipart/form-data
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: avatarImageFile
 *         in: formData
 *         type: file
 *         description: Avatar image
 *       - name: name
 *         in: formData
 *         type: string
 *         description: Name of the user
 *       - name: email
 *         in: formData
 *         type: string
 *         description: Email of the user
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
 * /auth/admin/users:
 *   get:
 *     summary: get all users
 *     security:
 *       - jwt: []
 *     tags:
 *       - Auth
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
 * /auth/admin/user/{id}:
 *   get:
 *     summary: get user details
 *     security:
 *       - jwt: []
 *     tags:
 *       - Auth
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
 * /auth/admin/user/{id}:
 *   put:
 *     summary: update user by admin role
 *     security:
 *       - jwt: []
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: id
 *         in: path
 *         type: String
 *       - name: body
 *         in: body
 *         required: true
 *         properties:
 *           name:
 *             type: String
 *           email:
 *             type: String
 *           role :
 *             type: String
 *         example: {
 *           "name": "Trần Tuấn Kiệt",
 *           "email": "kiet130599@gmail.com",
 *           "role": "admin/user"
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
 * /auth/admin/user/{id}:
 *   delete:
 *     summary: delete user by admin role
 *     security:
 *       - jwt: []
 *     tags:
 *       - Auth
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
 * /auth/admin/restore-deleted-users:
 *   post:
 *     summary: Restore deleted users
 *     security:
 *       - jwt: []
 *     tags:
 *       - Auth
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
 * /auth/register/email-confirm/{email}:
 *   post:
 *     summary: Email confirm
 *     tags:
 *       - Auth
 *     parameters:
 *       - name: email
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
