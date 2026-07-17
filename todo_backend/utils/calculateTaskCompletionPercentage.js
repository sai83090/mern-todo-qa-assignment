/**
 * Calculates the percentage of completed tasks.
 * @param {Array<{completed: boolean}>} tasks
 * @returns {number} percentage rounded to nearest whole number (0-100)
 */

function calculateTaskCompletionPercentage(tasks) {
  if (!Array.isArray(tasks) || tasks.length === 0) return 0;

  const completedCount = tasks.filter((t) => t && t.completed === true).length;
  return Math.round((completedCount / tasks.length) * 100);
}

module.exports = calculateTaskCompletionPercentage;