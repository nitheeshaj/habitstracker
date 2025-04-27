const Habit = require("../models/habitsModel");
const User = require("../models/userModel");
const { Op } = require("sequelize");
exports.createHabit = async (req, res) => {
    try {
        const { title, time, type, status } = req.body;
        const userId = req.params.userId;

        // Validate user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const habit = await Habit.create({ title, time, type, status, userId });
        res.status(201).json({ message: "Habit created", habit });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserHabits = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const habits = await Habit.findAll({ where: { userId } });
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHabitsByDate = async (req, res) => {
    try {
      const { userId } = req.params; // userId from URL params
      const { date } = req.query; // date from query params
  
      if (!userId || !date) {
        return res.status(400).json({ message: 'userId and date are required' });
      }
  
      // Convert 'dd-mm-yyyy' to JS Date (start and end of the day)
      const [day, month, year] = date.split('-');
      const startDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
      const endDate = new Date(`${year}-${month}-${day}T23:59:59.999Z`);
  
      // Fetch habits for the specific date and specific user
      const habits = await Habit.findAll({
        where: {
          userId: userId, // Ensuring the habits belong to the specific user
          createdAt: {
            [Op.between]: [startDate, endDate], // Habits created within this date range
          },
        },
      });
  
      // If no habits found for this user on the given date
      if (habits.length === 0) {
        return res.status(404).json({ message: 'No habits found for the given user on this date' });
      }
  
      res.json({ habits });
    } catch (err) {
      console.error('Error fetching habits by date:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  // Update Habit
exports.updateHabit = async (req, res) => {
  try {
      const { habitId } = req.params;
      const { title, time, type, status } = req.body;

      const habit = await Habit.findByPk(habitId);
      if (!habit) {
          return res.status(404).json({ message: "Habit not found" });
      }

      // Update habit fields
      habit.title = title ?? habit.title;
      habit.time = time ?? habit.time;
      habit.type = type ?? habit.type;
      habit.status = status ?? habit.status;

      await habit.save();

      res.status(200).json({ message: "Habit updated", habit });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Delete Habit
exports.deleteHabit = async (req, res) => {
  try {
      const { habitId } = req.params;

      const habit = await Habit.findByPk(habitId);
      if (!habit) {
          return res.status(404).json({ message: "Habit not found" });
      }

      await habit.destroy();

      res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
exports.getTaskCompletionPercentage = async (req, res) => {
  try {
    const { userId } = req.params;   // User ID from URL
    const { date } = req.query;       // Date from query parameter (dd-mm-yyyy)

    if (!date) {
      return res.status(400).json({ message: "Date is required in dd-mm-yyyy format" });
    }

    // Convert 'dd-mm-yyyy' to a JS Date (yyyy-mm-dd format)
    const [day, month, year] = date.split("-");
    const formattedDate = new Date(`${year}-${month}-${day}`);

    // Calculate start and end of the day
    const startOfDay = new Date(formattedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(formattedDate.setHours(23, 59, 59, 999));

    // Fetch habits for that user created on that day
    const habits = await Habit.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    if (!habits || habits.length === 0) {
      return res.status(404).json({ message: "No tasks found for the given date" });
    }

    // Count tasks where status === true (completed)
    const completedTasks = habits.filter(habit => habit.status === true).length;

    // Calculate percentage
    const percentage = (completedTasks / habits.length) * 100;

    res.status(200).json({
      success: true,
      date: date,
      totalTasks: habits.length,
      completedTasks: completedTasks,
      completionPercentage: `${percentage.toFixed(2)}%`
    });

  } catch (error) {
    console.error("Error calculating task completion:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getWeeklyCompletionPercentages = async (req, res) => {
  try {
    const { userId } = req.params;    // userId from URL
    const { month, year } = req.query; // month and year from query params

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required (format: month=04&year=2025)" });
    }

    const monthInt = parseInt(month); // eg: "04" → 4
    const yearInt = parseInt(year);   // eg: "2025" → 2025

    // First day of month
    const startOfMonth = new Date(yearInt, monthInt - 1, 1);
    // Last day of month
    const endOfMonth = new Date(yearInt, monthInt, 0, 23, 59, 59, 999);

    // Fetch all habits in the month
    const habits = await Habit.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.between]: [startOfMonth, endOfMonth]
        }
      }
    });

    if (!habits || habits.length === 0) {
      return res.status(404).json({ message: "No tasks found for the given month" });
    }

    // Group tasks by weeks
    const weeks = [[], [], [], [], []]; // max 5 weeks in a month
    habits.forEach(habit => {
      const habitDate = new Date(habit.createdAt);
      const weekNumber = Math.floor((habitDate.getDate() - 1) / 7); // 0,1,2,3,4 for weeks
      weeks[weekNumber].push(habit);
    });

    // Calculate completion percentage for each week
    const percentages = weeks.map(weekHabits => {
      if (weekHabits.length === 0) return 0.00;

      const completed = weekHabits.filter(habit => habit.status === true).length;
      return parseFloat(((completed / weekHabits.length) * 100).toFixed(2));
    });

    res.status(200).json({
      success: true,
      month: `${month}-${year}`,
      weeklyCompletionPercentages: percentages.slice(0, 4)  // only 4 weeks returned
    });

  } catch (error) {
    console.error("Error calculating weekly percentages:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMostCommonHabits = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Find all habits for the given user
    const habits = await Habit.findAll({
      where: {
        userId: userId,
      }
    });

    if (!habits || habits.length === 0) {
      return res.status(200).json([]);  // Return an empty array if no habits
    }

    // Count the occurrences of each habit name
    const habitCount = habits.reduce((acc, habit) => {
      acc[habit.title] = (acc[habit.title] || 0) + 1;
      return acc;
    }, {});

    // Sort habits by the count in descending order
    const sortedHabits = Object.entries(habitCount)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count);

    // Get top 3 habits, or less if there are not enough
    const topHabits = sortedHabits.slice(0, 3).map(habit => habit.title);

    return res.status(200).json(topHabits);
  } catch (err) {
    console.error('Error getting most common habits:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};