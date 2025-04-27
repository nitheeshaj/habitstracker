const express = require("express");
const router = express.Router();
const habitController = require("../controllers/habitsController");

/**
 * @swagger
 * /users/{userId}/habits:
 *   post:
 *     summary: Add a new habit for a user
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - time
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *               time:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Habit created
 *       404:
 *         description: User not found
 */
router.post("/users/:userId/habits", habitController.createHabit);

/**
 * @swagger
 * /users/{userId}/habits:
 *   get:
 *     summary: Get all habits for a user
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of user's habits
 *       404:
 *         description: User not found
 */
router.get("/users/:userId/habits", habitController.getUserHabits);
/**
 * @swagger
 * /users/{userId}/get-by-date:
 *   get:
 *     summary: Get habits by date for a user
 *     description: Fetch habits created by a specific user on a given date.
 *     tags:
 *       - Habits
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The date in dd-mm-yyyy format
 *     responses:
 *       200:
 *         description: List of habits for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 habits:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       userId:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Bad request if userId or date are missing
 *       500:
 *         description: Server error
 */
router.get('/users/:userId/get-by-date', habitController.getHabitsByDate);

/**
 * @swagger
 * /habits/{habitId}:
 *   put:
 *     summary: Update a habit
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the habit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               time:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *       404:
 *         description: Habit not found
 */
router.put("/habits/:habitId", habitController.updateHabit);

/**
 * @swagger
 * /habits/{habitId}:
 *   delete:
 *     summary: Delete a habit
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: habitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the habit
 *     responses:
 *       200:
 *         description: Habit deleted successfully
 *       404:
 *         description: Habit not found
 */
router.delete("/habits/:habitId", habitController.deleteHabit);

/**
 * @swagger
 * /api/users/{userId}/completion-percentage:
 *   get:
 *     summary: Get percentage of tasks completed by the user on a specific day
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 26-04-2025
 *         description: Date to check tasks (format: dd-mm-yyyy)
 *     responses:
 *       200:
 *         description: Task completion percentage retrieved
 *       400:
 *         description: Missing date
 *       404:
 *         description: No tasks found for the date
 *       500:
 *         description: Server error
 */
router.get("/users/:userId/completion-percentage", habitController.getTaskCompletionPercentage);
/**
 * @swagger
 * /api/users/{userId}/weekly-completion:
 *   get:
 *     summary: Get user's weekly task completion percentages
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "04"
 *         description: Month for which to calculate (format: "04" for April)
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025"
 *         description: Year for which to calculate (e.g., "2025")
 *     responses:
 *       200:
 *         description: Weekly task completion percentages retrieved
 *       400:
 *         description: Missing month or year
 *       404:
 *         description: No tasks found for the given month
 *       500:
 *         description: Server error
 */
router.get("/users/:userId/weekly-completion", habitController.getWeeklyCompletionPercentages);


/**
 * @swagger
 * /api/users/{userId}/habits/most-common:
 *   get:
 *     summary: Get the top 3 most common habits for a specific user
 *     description: Returns the most common habits based on repetition for a given user. It returns the top 3 habits, or an empty array if no habits are found.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The ID of the user for whom we are fetching the common habits.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of the most common habits for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Internal server error if something goes wrong.
 *       404:
 *         description: User not found or no habits found.
 */
router.get('/users/:userId/habits/most-common', habitController.getMostCommonHabits);

module.exports = router;
