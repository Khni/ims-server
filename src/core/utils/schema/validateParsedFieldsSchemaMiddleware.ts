import { z, ZodType } from 'zod'
import validateSchemaMiddleware from './validateSchemaMiddleware.js'

export const validateParsedFieldsSchemaMiddleware = (parsedFields: ZodType) => {
	return validateSchemaMiddleware(
		z.object({
			parsedFields,
		}),
	)
}
