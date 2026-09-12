import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { createQuotationSchema, updateQuotationStatusSchema } from '../validations/quotationSchemas';
import { AppError } from '../middleware/errorHandler';

// Submit or update quotation
export const createOrUpdateQuotation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'SUPPLIER') {
      throw new AppError('Only suppliers can submit quotations', 403);
    }

    const validatedData = createQuotationSchema.parse(req.body);
    const supplierId = req.user.userId;

    const rfq = await prisma.rFQ.findUnique({
      where: { id: validatedData.rfqId },
    });

    if (!rfq) {
      throw new AppError('RFQ requirement not found', 404);
    }

    if (rfq.status !== 'OPEN' || new Date(rfq.deadline) < new Date()) {
      throw new AppError('Quotations are closed for this RFQ', 400);
    }

    const quotation = await prisma.quotation.upsert({
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
  } catch (error) {
    next(error);
  }
};

// Supplier view submitted quotations
export const getMyQuotations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'SUPPLIER') {
      throw new AppError('Only suppliers can view submitted quotations', 403);
    }

    const supplierId = req.user.userId;
    const quotations = await prisma.quotation.findMany({
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
  } catch (error) {
    next(error);
  }
};

// Buyer update quotation status (ACCEPT / REJECT)
export const updateQuotationStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'BUYER') {
      throw new AppError('Only buyers can update quotation status', 403);
    }

    const { id } = req.params;
    const validatedData = updateQuotationStatusSchema.parse(req.body);
    const buyerId = req.user.userId;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { rfq: true },
    });

    if (!quotation) {
      throw new AppError('Quotation not found', 404);
    }

    if (quotation.rfq.buyerId !== buyerId) {
      throw new AppError('Unauthorized to update this quotation', 403);
    }

    const updatedQuotation = await prisma.quotation.update({
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
  } catch (error) {
    next(error);
  }
};

// Supplier withdraw / cancel pending quotation
export const withdrawQuotation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'SUPPLIER') {
      throw new AppError('Only suppliers can withdraw quotations', 403);
    }

    const { id } = req.params;
    const supplierId = req.user.userId;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
    });

    if (!quotation) {
      throw new AppError('Quotation not found', 404);
    }

    if (quotation.supplierId !== supplierId) {
      throw new AppError('Unauthorized to withdraw this quotation', 403);
    }

    if (quotation.status !== 'PENDING') {
      throw new AppError('Only pending quotations can be withdrawn', 400);
    }

    await prisma.quotation.delete({
      where: { id },
    });

    res.status(200).json({ success: true, message: 'Quotation withdrawn successfully' });
  } catch (error) {
    next(error);
  }
};
