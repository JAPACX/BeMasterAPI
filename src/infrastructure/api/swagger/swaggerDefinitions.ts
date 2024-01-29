/**
 * @swagger
 * tags:
 *  name: Videos
 *  description: Endpoints related to videos and users
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 */

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Get all videos
 *     description: |
 *       GET method to retrieve a list of all public videos from the API. No authentication required.
 *       Response includes videos, associated likes, and comments. Pagination implemented using a cursor.
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               videos: []
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /videos/me:
 *   get:
 *     summary: Get my videos
 *     description: |
 *       GET method to retrieve a list of videos owned by the authenticated user.
 *       Only the user's own videos are included in the response.
 *       If a video is marked as private, it won't appear in the public list, but the owner can still view it.
 *       The response includes videos, along with information on likes and comments. Pagination is implemented using a cursor.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               videos: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
/**
 * @swagger
 * /videos/upload:
 *   post:
 *     summary: Upload a video
 *     description: |
 *       POST method to upload a video.
 *       Requires authentication.
 *       The request body must include the video title, description, credits, and whether it's public or private.
 *       The response includes the URL of the uploaded video.
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               credits:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               file:
 *                 type: file
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               urlVideo: "https://example.com/videos/video123"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid file format or size"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid token"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: |
 *       POST method to login.
 *       The system validates the user's existence, correct password, and other conditions.
 *       - If the user does not exist, a corresponding error is returned.
 *       - If the password is incorrect, a corresponding error is returned.
 *       - If the login is successful, the response includes an Authorization header with a JWT token.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         headers:
 *           Authorization:
 *             schema:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         content:
 *           application/json:
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               message: "Login successful"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       POST method to register a new user.
 *       The request body must include the user's information such as name, last name, username, password, and email.
 *       The system performs type validation on each field:
 *       - The fields (name, last name) must have a minimum length of three characters.
 *       - The email must have a valid format.
 *       - The password must include at least one uppercase letter, one digit, and have a length between 5 and 15 characters.
 *       - The username can only contain alphanumeric characters.
 *       - The email cannot exceed 30 characters.
 *       If the user is successfully registered, boolean true is returned.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /videos/{videoId}:
 *   delete:
 *     summary: Delete a user's video
 *     description: |
 *       DELETE method to remove a user's own video.
 *       Providing the videoId is required.
 *       Only the owner of the video can delete it.
 *       If a non-owner tries to delete the video, the system will deny the request.
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /videos/comments/{videoId}:
 *   post:
 *     summary: Add a comment to a video
 *     description: |
 *       POST method to add a comment to a video.
 *       Providing the videoId is required.
 *       The request body should include the content of the comment.
 *       Any authenticated user can add a comment to any video.
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /videos/likes/{videoId}:
 *   post:
 *     summary: Like or dislike a video
 *     description: |
 *       POST method to like or dislike a video.
 *       Providing the videoId is required.
 *       If the same user likes the same video again, the system will toggle the like to dislike.
 *       Likes are not deleted; users can like or dislike a video.
 *       Any authenticated user can give a like to any video.
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /videos/comments/{commentId}:
 *   delete:
 *     summary: Delete a user's comment on a video
 *     description: |
 *       DELETE method to remove a comment on a video.
 *       Only the owner of the video can delete their own comments.
 *       Authentication and providing the commentId are required.
 *       The system ensures that only the user who submitted the comment can delete it.
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */

/**
 * @swagger
 * /videos/getLikes/{videoId}:
 *   get:
 *     summary: Get likes for a video
 *     description: |
 *       GET method to retrieve likes for a specific video.
 *       Requires authentication.
 *       Providing the videoId is required.
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               likes: []
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid token"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */

/**
 * @swagger
 * /videos/comments/{videoId}:
 *   get:
 *     summary: Get comments for a video
 *     description: |
 *       GET method to retrieve comments for a specific video.
 *       Requires authentication.
 *       Providing the videoId is required.
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               comments: []
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid token"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 */
