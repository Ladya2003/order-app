import { z } from 'zod';

const productSchema = z.object({
  name: z.string().trim().min(1, 'Выберите название товара'),
  article: z.string().trim().min(1, 'Выберите название артикула'),
  count: z.number().min(1, 'Цена должна быть больше нуля'),
  cost: z.number().min(1, 'Кол-во должно быть больше нуля'),
  comment: z.string().trim().optional(),
});

const clientSchema = z.object({
  name: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .min(1, 'Введите телефон клиента')
    .regex(
      /(^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$)/,
      'Введите телефон в формате +7 (999) 999-99-99',
    ),
  address: z.string().trim().min(1, 'Введите адрес клиента'),
});

export const orderSchema = z.object({
  client: clientSchema,
  comments: z.string().trim().optional(),
  deliveryDate: z.date(),
  shippingCost: z.number().optional(),
  products: z.array(productSchema),
});

export type OrderSchema = z.infer<typeof orderSchema>;
