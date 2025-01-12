const axios = require("axios");
const Appointment = require("../models/appointment.model");
const { default: slugify } = require("slugify");

const ZOOM_API_KEY = "your_zoom_api_key";
const ZOOM_API_SECRET = "your_zoom_api_secret";
const ZOOM_USER_ID = "your_zoom_user_id";
const ZOOM_API_URL = "https://api.zoom.us/v2/users/";

class AppointmentService {
  async createZoomMeeting(topic, startTime) {
    const response = await axios.post(
      `${ZOOM_API_URL}${ZOOM_USER_ID}/meetings`,
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: 30, // Default duration 30 minutes
        timezone: "UTC",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ZOOM_API_KEY}:${ZOOM_API_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  async generateMeetingLink(topic) {
    const roomId = slugify(`${topic}`, {
      lower: true,
    });

    return {
      zoomMeetingId: roomId,
      zoomJoinUrl: `https://meet.jit.si/${roomId}`,
    };
  }

  async createAppointment(date, patient, doctor, price, transactionId) {
    const appointment = new Appointment({
      date,
      patient,
      doctor,
      price,
      transactionId,
    });

    await appointment.save();
    return appointment;
  }

  async getAppointments(query) {
    const { page = 1, limit = 10, status, patient, doctor } = query;
    const filters = {};

    if (status) filters.status = status;
    if (patient) filters.patient = patient;
    if (doctor) filters.doctor = doctor;

    const appointments = await Appointment.find(filters)
      .populate("patient doctor")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(filters);

    return { appointments, total, page, limit };
  }

  async getAppointmentById(id) {
    return Appointment.findById(id).populate("patient doctor");
  }

  async updateAppointment(id, data) {
    const appointment = await Appointment.findByIdAndUpdate(id, data, {
      new: true,
    });
    return appointment;
  }

  async deleteAppointment(id) {
    return Appointment.findByIdAndDelete(id);
  }

  async getPaitents(doctorId) {
    try {
      return Appointment.find({ doctor: doctorId }).populate("patient");
    } catch (error) {
      throw new Error(`Error fetching paitents: ${error.message}`);
    }
  }
}

module.exports = new AppointmentService();
