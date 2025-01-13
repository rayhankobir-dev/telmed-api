const axios = require("axios");
const Appointment = require("../models/appointment.model");
const { default: slugify } = require("slugify");


class AppointmentService {
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
