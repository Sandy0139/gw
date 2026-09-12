"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rfqController_1 = require("../controllers/rfqController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public / optional auth for browsing
router.get('/', rfqController_1.getAllRfqs);
router.get('/detail/:id', auth_1.authenticateToken, rfqController_1.getRfqById);
// Buyer protected routes
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('BUYER'), rfqController_1.createRfq);
router.get('/my', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('BUYER'), rfqController_1.getMyRfqs);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('BUYER'), rfqController_1.updateRfq);
router.patch('/:id/close', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('BUYER'), rfqController_1.closeRfq);
exports.default = router;
