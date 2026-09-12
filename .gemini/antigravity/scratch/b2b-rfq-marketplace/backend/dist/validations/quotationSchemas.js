"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuotationStatusSchema = exports.createQuotationSchema = void 0;
const zod_1 = require("zod");
exports.createQuotationSchema = zod_1.z.object({
    rfqId: zod_1.z.string().uuid('Invalid RFQ ID'),
    price: zod_1.z.number({ invalid_type_error: 'Price must be a number' }).positive('Quoted price must be positive'),
    deliveryDays: zod_1.z.number({ invalid_type_error: 'Delivery days must be a number' }).int().positive('Delivery time in days must be at least 1'),
    notes: zod_1.z.string().optional(),
});
exports.updateQuotationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACCEPTED', 'REJECTED'], {
        errorMap: () => ({ message: 'Status must be ACCEPTED or REJECTED' }),
    }),
});
