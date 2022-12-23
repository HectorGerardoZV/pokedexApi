import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    DATABASE_URL: Joi.required(),
    PORT: Joi.number(),
    DEFAULT_LIMIT: Joi.number()
});