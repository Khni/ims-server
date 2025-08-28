//this wull be replaced with any type of request, response and next function <WIP>
//import { NextFunction, Request, Response } from 'express'
import { Schema, ZodError } from 'zod'

const validateSchemaMiddleware =
	(schema: Schema) => (req: any, res: any, next: any) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			})
			next()
		} catch (err: unknown) {
			throw err
		}
	}

export default validateSchemaMiddleware
