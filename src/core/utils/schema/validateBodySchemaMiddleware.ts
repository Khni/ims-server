import { z, ZodType } from 'zod'
import validateSchemaMiddleware from './validateSchemaMiddleware.js'

export const validateBodySchema = (body: ZodType<any, any, any>) => {
	return validateSchemaMiddleware(
		z.object({
			body,
		}),
	)
}
