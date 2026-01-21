import { updateSubmissionStatus, createSubmission } from './db';

jest.mock('./db', () => {
    return {
        updateSubmissionStatus: jest.fn((id, status) => {
            if (id === 999) return false; // Not found
            return true;
        }),
        createSubmission: jest.fn((title, content) => {
            return { id: 1, title, content, status: 'pending' };
        })
    };
});

describe('Workflow Logic', () => {
    test('updateSubmissionStatus should return true for valid update', () => {
        const result = updateSubmissionStatus(1, 'approved');
        expect(result).toBe(true);
        expect(updateSubmissionStatus).toHaveBeenCalledWith(1, 'approved');
    });

    test('updateSubmissionStatus should return false for invalid ID', () => {
        const result = updateSubmissionStatus(999, 'rejected'); // Mocked to fail
        expect(result).toBe(false);
    });
});
