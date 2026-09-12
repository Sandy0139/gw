"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rfqQuerySchema = exports.updateRfqSchema = exports.createRfqSchema = void 0;
const zod_1 = require("zod");
exports.createRfqSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title/Product name must be at least 3 characters'),
    description: zod_1.z.string().min(10, 'Requirement description must be at least 10 characters'),
    quantity: zod_1.z.number({ invalid_type_error: 'Quantity must be a number' }).positive('Quantity must be greater than 0'),
    unit: zod_1.z.string().min(1, 'Unit is required').default('units'),
    deliveryLocation: zod_1.z.string().min(2, 'Delivery location is required'),
    deadline: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid deadline date format',
    }),
});
exports.updateRfqSchema = exports.createRfqSchema.partial().extend({
    status: zod_1.z.enum(['OPEN', 'CLOSED', 'CANCELLED']).optional(),
});
exports.rfqQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    status: zod_1.z.enum(['OPEN', 'CLOSED', 'CANCELLED', 'ALL']).optional(),
    location: zod_1.z.string().optional(),
});
