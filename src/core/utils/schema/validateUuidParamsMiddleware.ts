import { z } from 'zod'
import validateSchemaMiddleware from './validateSchemaMiddleware.js'

export const validateUuidParams = (idFields: string[]) => {
	const schema = z.object({
		params: z.object(
			idFields.reduce(
				(acc, field) => {
					acc[field] = z.string().uuid()
					return acc
				},
				{} as Record<string, z.ZodString>,
			),
		),
	})

	return validateSchemaMiddleware(schema)
}
