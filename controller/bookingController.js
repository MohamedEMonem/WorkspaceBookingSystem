const { Booking } = require("../models/bookingModel");
const { UserModel } = require("../models/userModel");
const {workspacesModel} = require("../models/workspacesModel");

// User Routes - Book workspace
const createBooking = async (req, res) => {
  try {
    const { space, date, from, to } = req.body;
    const userId = req.user.userId;

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      space,
      date: new Date(date),
      $or: [
        { from: { $lt: to }, to: { $gt: from } }
      ],
      status: { $ne: "cancelled" }
    });

    if (conflictingBooking) {
      return res.status(400).json({ 
        error: "Time slot already booked for this workspace" 
      });
    }

    const booking = new Booking({
      user: userId,
      space,
      date: new Date(date),
      from,
      to,
      status: "pending"
    });

    await booking.save();
    await booking.populate([
      { path: 'user', select: 'name email' },
      { path: 'space', select: 'name location' }
    ]);

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Routes - Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user: userId };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('space', 'name location capacity')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Routes - Edit booking (only pending bookings)
const editBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, from, to } = req.body;
    const userId = req.user.userId;

    const booking = await Booking.findOne({ _id: id, user: userId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ 
        error: "Only pending bookings can be edited" 
      });
    }

    // Check for conflicts if time/date changed
    if (date || from || to) {
      const checkDate = date ? new Date(date) : booking.date;
      const checkFrom = from || booking.from;
      const checkTo = to || booking.to;

      const conflictingBooking = await Booking.findOne({
        _id: { $ne: id },
        space: booking.space,
        date: checkDate,
        $or: [
          { from: { $lt: checkTo }, to: { $gt: checkFrom } }
        ],
        status: { $ne: "cancelled" }
      });

      if (conflictingBooking) {
        return res.status(400).json({ 
          error: "Time slot already booked for this workspace" 
        });
      }
    }

    // Update booking
    if (date) booking.date = new Date(date);
    if (from) booking.from = from;
    if (to) booking.to = to;

    await booking.save();
    await booking.populate([
      { path: 'user', select: 'name email' },
      { path: 'space', select: 'name location' }
    ]);

    res.json({
      message: "Booking updated successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Routes - Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await Booking.findOne({ _id: id, user: userId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Owner Routes - View all bookings
const getAllBookings = async (req, res) => {
  try {
    const { status, date, space, page = 1, limit = 20 } = req.query;
    const ownerId = req.user.userId;

    // First, get all workspaces owned by this owner
    const ownerWorkspaces = await workspacesModel.find({ owner: ownerId }).select('_id');
    const workspaceIds = ownerWorkspaces.map(workspace => workspace._id);

    // Build the filter
    const filter = {
      space: { $in: workspaceIds } // Only include bookings for owner's workspaces
    };

    if (status) filter.status = status;
    if (date) filter.date = new Date(date);
    if (space) filter.space = space;

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('space', 'name location capacity')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Owner Routes - Confirm booking
const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ 
        error: "Only pending bookings can be confirmed" 
      });
    }

    booking.status = "confirmed";
    await booking.save();
    await booking.populate([
      { path: 'user', select: 'name email' },
      { path: 'space', select: 'name location' }
    ]);

    res.json({
      message: "Booking confirmed successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Owner Routes - Cancel any booking
const cancelAnyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ error: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    if (reason) booking.cancellationReason = reason;
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Routes - Get booking analytics for dashboard
const getBookingAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Total bookings by status
    const statusStats = await Booking.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Bookings per day
    const dailyBookings = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Most booked workspaces
    const popularSpaces = await Booking.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$space", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "workspaces",
          localField: "_id",
          foreignField: "_id",
          as: "spaceInfo"
        }
      }
    ]);

    // Total revenue (if pricing exists)
    const totalBookings = await Booking.countDocuments(dateFilter);
    const confirmedBookings = await Booking.countDocuments({
      ...dateFilter,
      status: "confirmed"
    });

    res.json({
      statusStats,
      dailyBookings,
      popularSpaces,
      totalBookings,
      confirmedBookings,
      cancellationRate: totalBookings > 0 ? 
        ((totalBookings - confirmedBookings) / totalBookings * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Routes - Modify any booking
const modifyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check for conflicts if time/date/space changed
    if (updateData.date || updateData.from || updateData.to || updateData.space) {
      const checkDate = updateData.date ? new Date(updateData.date) : booking.date;
      const checkFrom = updateData.from || booking.from;
      const checkTo = updateData.to || booking.to;
      const checkSpace = updateData.space || booking.space;

      const conflictingBooking = await Booking.findOne({
        _id: { $ne: id },
        space: checkSpace,
        date: checkDate,
        $or: [
          { from: { $lt: checkTo }, to: { $gt: checkFrom } }
        ],
        status: { $ne: "cancelled" }
      });

      if (conflictingBooking) {
        return res.status(400).json({ 
          error: "Time slot already booked for this workspace" 
        });
      }
    }

    Object.keys(updateData).forEach(key => {
      if (key === 'date') {
        booking[key] = new Date(updateData[key]);
      } else {
        booking[key] = updateData[key];
      }
    });

    await booking.save();
    await booking.populate([
      { path: 'user', select: 'name email' },
      { path: 'space', select: 'name location' }
    ]);

    res.json({
      message: "Booking modified successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Routes - Delete booking permanently
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      message: "Booking deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
};
