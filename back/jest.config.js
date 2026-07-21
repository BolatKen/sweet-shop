module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['src/__tests__'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
}