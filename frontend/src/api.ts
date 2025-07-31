import axios from "axios";

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  id_proof_type?: string;
  id_proof_number?: string;
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  specialRequests?: string;
  amount_paid: number;
}

const apiClient = function () {
  const api = axios.create({
    baseURL: "http://localhost:5001/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    createBooking: async (customer: CustomerData, booking: BookingData) => {
      return api.post("/bookings/create", { customer, booking });
    },
    getAllCustomers: async () => {
      return api.get("/customers/all");
    },
    searchCustomers: async (term: string) => {
      return api.get(`/customers/search?term=${term}`);
    },
  };
};

export default apiClient();
export const api = apiClient();
