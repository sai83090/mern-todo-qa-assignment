const calculateTaskCompletionPercentage = require('../../utils/calculateTaskCompletionPercentage');

describe('calculateTaskCompletionPercentage', () => {
  test('returns 0 for an empty task list', () => {
    expect(calculateTaskCompletionPercentage([])).toBe(0);
  });

  test('returns 0 when no tasks are completed', () => {
    const tasks = [{ completed: false }, { completed: false }];
    expect(calculateTaskCompletionPercentage(tasks)).toBe(0);
  });

  test('returns 100 when all tasks are completed', () => {
    const tasks = [{ completed: true }, { completed: true }];
    expect(calculateTaskCompletionPercentage(tasks)).toBe(100);
  });

  test('returns correct rounded percentage for partial completion', () => {
    const tasks = [{ completed: true }, { completed: false }, { completed: false }];
    // 1/3 = 33.33... -> rounds to 33
    expect(calculateTaskCompletionPercentage(tasks)).toBe(33);
  });

  test('returns 50 for half completed tasks', () => {
    const tasks = [{ completed: true }, { completed: false }];
    expect(calculateTaskCompletionPercentage(tasks)).toBe(50);
  });

  test('returns 0 for non-array input', () => {
    expect(calculateTaskCompletionPercentage(null)).toBe(0);
    expect(calculateTaskCompletionPercentage(undefined)).toBe(0);
    expect(calculateTaskCompletionPercentage('not an array')).toBe(0);
  });

  test('ignores malformed task entries gracefully', () => {
    const tasks = [{ completed: true }, null, { completed: true }];
    expect(calculateTaskCompletionPercentage(tasks)).toBe(67);
  });
});