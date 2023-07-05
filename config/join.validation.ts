import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGO_URI: Joi.required(),
  PORT: Joi.number().default(4000),
  JWT_SECRET: Joi.string().required(),
});
