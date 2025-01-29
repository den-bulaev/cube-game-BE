import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  STAGE: Joi.string().required(),
  PGHOST: Joi.string().required(),
  PGPORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
