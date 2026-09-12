"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawQuotation = exports.updateQuotationStatus = exports.getMyQuotations = exports.createOrUpdateQuotation = void 0;
const prisma_1 = require("../prisma");
const quotationSchemas_1 = require("../validations/quotationSchemas");
const errorHandler_1 = require("../middleware/errorHandler");
// Submit or update quotation
const createOrUpdateQuotation = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'SUPPLIER') {
            throw new errorHandler_1.AppError('Only suppliers can submit quotations', 403);
        }
        const validatedData = quotationSchemas_1.createQuotationSchema.parse(req.body);
        const supplierId = req.user.userId;
        const rfq = await prisma_1.prisma.rFQ.findUnique({
            where: { id: validatedData.rfqId },
        });
        if (!rfq) {
            throw new errorHandler_1.AppError('RFQ requirement not found', 404);
        }
        if (rfq.status !== 'OPEN' || new Date(rfq.deadline) < new Date()) {
            throw new errorHandler_1.AppError('Quotations are closed for this RFQ', 400);
        }
        const quotation = await prisma_1.prisma.quotation.upsert({
            where: {
                rfqId_supplierId: {
                    rfqId: validatedData.rfqId,
                    supplierId,
                },
            },
            update: {
                price: validatedData.price,
                deliveryDays: validatedData.deliveryDays,
                notes: validatedData.notes,
                status: 'PENDING',
            },
            create: {
                rfqId: validatedData.rfqId,
                supplierId,
                price: validatedData.price,
                deliveryDays: validatedData.deliveryDays,
                notes: validatedData.notes,
                status: 'PENDING',
            },
            include: {
                rfq: true,
                supplier: {
                    select: { id: true, name: true, email: true, companyName: true },
                },
            },
        });
        res.status(200).json({ success: true, data: quotation });
    }
    catch (error) {
        next(error);
    }
};
exports.createOrUpdateQuotation = createOrUpdateQuotation;
// Supplier view submitted quotations
const getMyQuotations = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'SUPPLIER') {
            throw new errorHandler_1.AppError('Only suppliers can view submitted quotations', 403);
        }
        const supplierId = req.user.userId;
        const quotations = await prisma_1.prisma.quotation.findMany({
            where: { supplierId },
            include: {
                rfq: {
                    include: {
                        buyer: {
                            select: { id: true, name: true, email: true, companyName: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ success: true, data: quotations });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyQuotations = getMyQuotations;
// Buyer update quotation status (ACCEPT / REJECT)
const updateQuotationStatus = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'BUYER') {
            throw new errorHandler_1.AppError('Only buyers can update quotation status', 403);
        }
        const { id } = req.params;
        const validatedData = quotationSchemas_1.updateQuotationStatusSchema.parse(req.body);
        const buyerId = req.user.userId;
        const quotation = await prisma_1.prisma.quotation.findUnique({
            where: { id },
            include: { rfq: true },
        });
        if (!quotation) {
            throw new errorHandler_1.AppError('Quotation not found', 404);
        }
        if (quotation.rfq.buyerId !== buyerId) {
            throw new errorHandler_1.AppError('Unauthorized to update this quotation', 403);
        }
        const updatedQuotation = await prisma_1.prisma.quotation.update({
            where: { id },
            data: { status: validatedData.status },
            include: {
                rfq: true,
                supplier: {
                    select: { id: true, name: true, email: true, companyName: true },
                },
            },
        });
        res.status(200).json({ success: true, data: updatedQuotation });
    }
    catch (error) {
        next(error);
    }
};
exports.updateQuotationStatus = updateQuotationStatus;
// Supplier withdraw / cancel pending quotation
const withdrawQuotation = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'SUPPLIER') {
            throw new errorHandler_1.AppError('Only suppliers can withdraw quotations', 403);
        }
        const { id } = req.params;
        const supplierId = req.user.userId;
        const quotation = await prisma_1.prisma.quotation.findUnique({
            where: { id },
        });
        if (!quotation) {
            throw new errorHandler_1.AppError('Quotation not found', 404);
        }
        if (quotation.supplierId !== supplierId) {
            throw new errorHandler_1.AppError('Unauthorized to withdraw this quotation', 403);
        }
        if (quotation.status !== 'PENDING') {
            throw new errorHandler_1.AppError('Only pending quotations can be withdrawn', 400);
        }
        await prisma_1.prisma.quotation.delete({
            where: { id },
        });
        res.status(200).json({ success: true, message: 'Quotation withdrawn successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.withdrawQuotation = withdrawQuotation;
