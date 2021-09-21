import Joi from 'joi';

export const createProductSchema = Joi.object({
  id: Joi
    .string()
    .uuid()
    .optional(),
  title: Joi
    .string()
    .min(3),
  description: Joi
    .string()
    .min(8),
  count: Joi
    .number()
    .min(0),
  price: Joi
    .number()
    .min(0.01)
}).options({
  presence: 'required',
  abortEarly: false
});

export const uuidSchema = Joi.string().uuid();
