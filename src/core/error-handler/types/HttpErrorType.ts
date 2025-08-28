import { CustomErrorType } from './CustomErrorType.js'

export type HttpErrorType = CustomErrorType<unknown> & {
	responseMessage?: string
	name: string
}
