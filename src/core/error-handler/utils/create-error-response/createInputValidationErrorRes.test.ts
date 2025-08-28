import { describe, it, expect } from 'vitest'
import { createInputValidationErrorRes } from './createInputValidationErrorRes.js'

describe('createErrorResponse', () => {
	it('should return error with single message', () => {
		const result = createInputValidationErrorRes('TestError', 'Something went wrong')

		expect(result).toEqual({
			name: 'TestError',
			errors: [{ messages: ['Something went wrong'] }],
		})
	})

	it('should return error with multiple messages', () => {
		const result = createInputValidationErrorRes('TestError', ['A', 'B'])

		expect(result).toEqual({
			name: 'TestError',
			errors: [{ messages: ['A', 'B'] }],
		})
	})
})
