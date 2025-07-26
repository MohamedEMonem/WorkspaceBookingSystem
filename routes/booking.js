const express = require("express");
const router = express.Router();
const {
  // User functions
  createBooking,
  getUserBookings,
  editBooking,
  cancelBooking,
  
  // Owner functions
  getAllBookings,
  confirmBooking,
  cancelAnyBooking,
  
  // Admin functions
  getBookingAnalytics,
  modifyBooking,
  deleteBooking
} = require("../controllers/bookingController");
const { auth, authAdmin, authOwner } = require("../middleware/auth");

// ========== USER ROUTES ==========
// Create a new booking (authenticated users)
router.post("/", auth, createBooking);

// Get current user's bookings
router.get("/my-bookings", auth, getUserBookings);

// Edit user's own booking (only pending bookings)
router.put("/:id", auth, editBooking);

// Cancel user's own booking
router.delete("/:id", auth, cancelBooking);

// ========== OWNER ROUTES ==========
// Get all bookings (owners and admins)
router.get("/all", auth, authOwner, getAllBookings);

// Confirm a pending booking
router.patch("/:id/confirm", auth, authOwner, confirmBooking);

// Cancel any booking with reason
router.patch("/:id/cancel", auth, authOwner, cancelAnyBooking);

// ========== ADMIN ROUTES ==========
// Get booking analytics for dashboard monitoring
router.get("/analytics", auth, authAdmin, getBookingAnalytics);

// Modify any booking (full edit access)
router.patch("/:id/modify", auth, authAdmin, modifyBooking);

// Delete booking permanently
router.delete("/:id/admin-delete", auth, authAdmin, deleteBooking);

module.exports = router;
