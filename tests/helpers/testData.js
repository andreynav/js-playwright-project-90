export const loginCredentials = {
    username: 'username',
    password: 'password',
};

export const invalidEmail = '1111google.com';

export const Status = Object.freeze({
    PUBLISHED: 'Published',
    TO_PUBLISH: 'To Publish',
    TO_BE_FIXED: 'To Be Fixed',
    TO_REVIEW: 'To Review',
    DRAFT: 'Draft'
});

export const Label = Object.freeze({
    CRITICAL: 'critical',
    TASK: 'task',
    ENHANCEMENT: 'enhancement',
    FEATURE: 'feature',
    BUG: 'bug'
});

export const Filter = Object.freeze({
    ASSIGNEE: 'Assignee',
    STATUS: 'Status',
    LABEL: 'Label'
});

export const taskOne = {
    title: 'Task 1',
    description: 'Description of task 1',
    index: 3140,
}
