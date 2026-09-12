import { z } from 'zod';

export const createRfqSchema = z.object({
  title: z.string().min(3, 'Title/Product name must be at least 3 characters'),
  description: z.string().min(10, 'Requirement description must be at least 10 characters'),
  quantity: z.number({ invalid_type_error: 'Quantity must be a number' }).positive('Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required').default('units'),
  deliveryLocation: z.string().min(2, 'Delivery location is required'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid deadline date format',
  }),
});

export const updateRfqSchema = createRfqSchema.partial().extend({
  status: z.enum(['OPEN', 'CLOSED', 'CANCELLED']).optional(),
});

export const rfqQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'CANCELLED', 'ALL']).optional(),
  location: z.string().optional(),
});
