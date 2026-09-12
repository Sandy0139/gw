import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { createRfqSchema, updateRfqSchema } from '../validations/rfqSchemas';
import { AppError } from '../middleware/errorHandler';

export const createRfq = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'BUYER') {
      throw new AppError('Only buyers can create RFQs', 403);
    }

    const validatedData = createRfqSchema.parse(req.body);

    const rfq = await prisma.rFQ.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        quantity: validatedData.quantity,
        unit: validatedData.unit,
        deliveryLocation: validatedData.deliveryLocation,
        deadline: new Date(validatedData.deadline),
        buyerId: req.user.userId,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'RFQ created successfully',
      data: rfq,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRfq = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'BUYER') {
      throw new AppError('Only buyers can update RFQs', 403);
    }

    const { id } = req.params;
    const validatedData = updateRfqSchema.parse(req.body);

    const existingRfq = await prisma.rFQ.findUnique({
      where: { id },
    });

    if (!existingRfq) {
      throw new AppError('RFQ not found', 404);
    }

    if (existingRfq.buyerId !== req.user.userId) {
      throw new AppError('Forbidden: You can only edit your own RFQs', 403);
    }

    const updatedRfq = await prisma.rFQ.update({
      where: { id },
      data: {
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.description && { description: validatedData.description }),
        ...(validatedData.quantity && { quantity: validatedData.quantity }),
        ...(validatedData.unit && { unit: validatedData.unit }),
        ...(validatedData.deliveryLocation && { deliveryLocation: validatedData.deliveryLocation }),
        ...(validatedData.deadline && { deadline: new Date(validatedData.deadline) }),
        ...(validatedData.status && { status: validatedData.status }),
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'RFQ updated successfully',
      data: updatedRfq,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRfqs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, status, location } = req.query;

    const whereClause: any = {};

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (location) {
      whereClause.deliveryLocation = {
        contains: String(location),
      };
    }

    if (search) {
      const searchStr = String(search);
      whereClause.OR = [
        { title: { contains: searchStr } },
        { description: { contains: searchStr } },
        { deliveryLocation: { contains: searchStr } },
      ];
    }

    const rfqs = await prisma.rFQ.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
        _count: {
          select: { quotations: true },
        },
      },
    });

    // Check if supplier has already submitted a quotation for each RFQ
    let supplierQuotationsMap: Record<string, boolean> = {};
    if (req.user && req.user.role === 'SUPPLIER') {
      const myQuotes = await prisma.quotation.findMany({
        where: { supplierId: req.user.userId },
        select: { rfqId: true, id: true, price: true, status: true },
      });
      myQuotes.forEach((q) => {
        supplierQuotationsMap[q.rfqId] = true;
      });
    }

    const formattedRfqs = rfqs.map((rfq) => {
      const isExpired = new Date(rfq.deadline) < new Date();
      return {
        ...rfq,
        isExpired,
        quotationCount: rfq._count.quotations,
        hasSubmittedQuote: req.user?.role === 'SUPPLIER' ? !!supplierQuotationsMap[rfq.id] : false,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedRfqs,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRfqs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'BUYER') {
      throw new AppError('Only buyers can view their posted RFQs', 403);
    }

    const rfqs = await prisma.rFQ.findMany({
      where: { buyerId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { quotations: true },
        },
        quotations: {
          select: {
            id: true,
            price: true,
            status: true,
          },
        },
      },
    });

    const formattedRfqs = rfqs.map((rfq) => {
      const isExpired = new Date(rfq.deadline) < new Date();
      return {
        ...rfq,
        isExpired,
        quotationCount: rfq._count.quotations,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedRfqs,
    });
  } catch (error) {
    next(error);
  }
};

export const getRfqById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
          },
        },
        quotations: {
          include: {
            supplier: {
              select: {
                id: true,
                name: true,
                companyName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!rfq) {
      throw new AppError('RFQ not found', 404);
    }

    const isExpired = new Date(rfq.deadline) < new Date();
    const isOwner = req.user?.userId === rfq.buyerId;

    // Filter quotations visibility: Buyer sees all quotations; Supplier sees only their own quotation if submitted
    let visibleQuotations = rfq.quotations;
    let myQuotation = null;

    if (req.user?.role === 'SUPPLIER') {
      myQuotation = rfq.quotations.find((q) => q.supplierId === req.user?.userId) || null;
      visibleQuotations = myQuotation ? [myQuotation] : [];
    }

    res.status(200).json({
      success: true,
      data: {
        ...rfq,
        isExpired,
        isOwner,
        quotations: isOwner ? rfq.quotations : visibleQuotations,
        myQuotation,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const closeRfq = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'BUYER') {
      throw new AppError('Only buyers can close RFQs', 403);
    }

    const { id } = req.params;

    const existingRfq = await prisma.rFQ.findUnique({
      where: { id },
    });

    if (!existingRfq) {
      throw new AppError('RFQ not found', 404);
    }

    if (existingRfq.buyerId !== req.user.userId) {
      throw new AppError('Forbidden: You can only close your own RFQs', 403);
    }

    const updatedRfq = await prisma.rFQ.update({
      where: { id },
      data: { status: 'CLOSED' },
    });

    res.status(200).json({
      success: true,
      message: 'RFQ closed successfully',
      data: updatedRfq,
    });
  } catch (error) {
    next(error);
  }
};
