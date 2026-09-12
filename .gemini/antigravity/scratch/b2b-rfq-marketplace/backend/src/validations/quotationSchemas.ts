import { z } from 'zod';

export const createQuotationSchema = z.object({
  rfqId: z.string().uuid('Invalid RFQ ID'),
  price: z.number({ invalid_type_error: 'Price must be a number' }).positive('Quoted price must be positive'),
  deliveryDays: z.number({ invalid_type_error: 'Delivery days must be a number' }).int().positive('Delivery time in days must be at least 1'),
  notes: z.string().optional(),
});

export const updateQuotationStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED'], {
    errorMap: () => ({ message: 'Status must be ACCEPTED or REJECTED' }),
  }),
});
