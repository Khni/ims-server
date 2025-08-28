import { z, ZodType } from 'zod'
import validateSchemaMiddleware from './validateSchemaMiddleware.js'

export const validateFindManyQuerySchemaMiddleware = (parsedFields: ZodType) => {
	return validateSchemaMiddleware(
		z.object({
			findManyQuery: parsedFields,
		}),
	)
}
