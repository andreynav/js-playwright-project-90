const loginCredentials = {
    username: 'username',
    password: 'password',
};

const Status = Object.freeze({
    PUBLISHED: 'Published',
    TO_PUBLISH: 'To Publish',
    TO_BE_FIXED: 'To Be Fixed',
    TO_REVIEW: 'To Review',
    DRAFT: 'Draft'
});

const Label = Object.freeze({
    CRITICAL: 'critical',
    TASK: 'task',
    ENHANCEMENT: 'enhancement',
    FEATURE: 'feature',
    BUG: 'bug'
});

const Filter = Object.freeze({
    ASSIGNEE: 'Assignee',
    STATUS: 'Status',
    LABEL: 'Label'
});

const taskOne = {
    title: 'Task 1',
    description: 'Description of task 1',
    index: 3140,
}

export default {
    loginCredentials,
    Status,
    Label,
    Filter,
    taskOne
};
