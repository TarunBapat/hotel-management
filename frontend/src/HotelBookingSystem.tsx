import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Users,
  Bed,
  Sparkles,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "./api";

const HotelBookingSystem = () => {
  const [formData, setFormData] = useState({
    // Customer fields
    customerId: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",

    // Booking fields
    checkIn: "",
    checkOut: "",
    roomType: "",
    guests: 1,
    specialRequests: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [showCustomerFields, setShowCustomerFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = async () => {
    const customers = await api.getAllCustomers();
    console.log("Fetched Customers:", customers.data);
  };
  useEffect(() => {
    fetchCustomers();
  }, []);
  // Mock customer data - replace with actual database queries
  const mockCustomers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1-555-0123",
      address: "123 Main St, City",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@email.com",
      phone: "+1-555-0124",
      address: "456 Oak Ave, Town",
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.j@email.com",
      phone: "+1-555-0125",
      address: "789 Pine Rd, Village",
    },
  ];

  const roomTypes = [
    {
      value: "standard",
      label: "Standard Room",
      price: 120,
      description: "Comfortable room with essential amenities",
    },
    {
      value: "deluxe",
      label: "Deluxe Room",
      price: 180,
      description: "Spacious room with premium features",
    },
    {
      value: "suite",
      label: "Executive Suite",
      price: 300,
      description: "Luxury suite with separate living area",
    },
    {
      value: "presidential",
      label: "Presidential Suite",
      price: 500,
      description: "Ultimate luxury with panoramic views",
    },
  ];

  // Search customers function
  const searchInputString = async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    const customersData = await api.searchCustomers(term);
    const results = customersData?.data?.data?.filter(
      (customer: any) =>
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.email.toLowerCase().includes(term.toLowerCase()) ||
        customer.phone.includes(term)
    );
    setSearchResults(results);
  };

  // Handle customer search
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchInputString(term);

    if (term === "") {
      setFormData((prev) => ({
        ...prev,
        customerId: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
      }));
      setShowCustomerFields(false);
      setIsNewCustomer(false);
    }
  };

  // Select existing customer
  const selectCustomer = (customer) => {
    setFormData((prev) => ({
      ...prev,
      customerId: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    }));
    setSearchTerm(`${customer.firstName} ${customer.lastName}`);
    setSearchResults([]);
    setShowCustomerFields(true);
    setIsNewCustomer(false);
  };

  // Handle new customer
  const handleNewCustomer = () => {
    setIsNewCustomer(true);
    setShowCustomerFields(true);
    setSearchResults([]);
    setFormData((prev) => ({
      ...prev,
      customerId: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate total nights and price
  const calculateBooking = () => {
    if (formData.checkIn && formData.checkOut && formData.roomType) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const roomPrice =
        roomTypes.find((room) => room.value === formData.roomType)?.price || 0;
      const subtotal = nights * roomPrice;
      const tax = subtotal * 0.12; // 12% tax
      const total = subtotal + tax;
      return { nights, roomPrice, subtotal, tax, total };
    }
    return { nights: 0, roomPrice: 0, subtotal: 0, tax: 0, total: 0 };
  };

  const { nights, roomPrice, subtotal, tax, total } = calculateBooking();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Booking Data:", {
        customer: {
          id: formData.customerId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          isNew: isNewCustomer,
        },
        booking: {
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          roomType: formData.roomType,
          guests: formData.guests,
          specialRequests: formData.specialRequests,
          nights,
          totalAmount: total,
        },
      });

      alert(
        `🎉 Booking ${
          isNewCustomer
            ? "created with new customer"
            : "created for existing customer"
        }!`
      );
    } catch (error) {
      alert("Error creating booking: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Bed className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Hotel Booking System
                </h1>
                <p className="text-sm text-gray-500">
                  Create seamless reservations
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Search Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Customer Information
                </h2>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Find or Create Customer
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by name, email, or phone number..."
                    className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="relative z-20 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-2xl max-h-60 overflow-auto">
                    {searchResults.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => selectCustomer(customer)}
                        className="p-4 hover:bg-blue-50/80 cursor-pointer border-b border-gray-100/50 last:border-b-0 transition-colors duration-150"
                      >
                        <div className="font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {customer.email} • {customer.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* New Customer Button */}
              {searchTerm &&
                searchResults.length === 0 &&
                searchTerm.length >= 2 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                    <p className="text-sm text-green-700 mb-3">
                      No existing customer found
                    </p>
                    <button
                      type="button"
                      onClick={handleNewCustomer}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg shadow-green-500/25"
                    >
                      Create New Customer
                    </button>
                  </div>
                )}
            </div>

            {/* Customer Details Form */}
            {showCustomerFields && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isNewCustomer
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {isNewCustomer
                      ? "New Customer Details"
                      : "Customer Details"}
                  </h3>
                  {!isNewCustomer && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      Existing Customer
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      disabled={!isNewCustomer}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 disabled:bg-gray-50/80 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      disabled={!isNewCustomer}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 disabled:bg-gray-50/80 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-1.5 text-gray-500" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={!isNewCustomer}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 disabled:bg-gray-50/80 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline w-4 h-4 mr-1.5 text-gray-500" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      disabled={!isNewCustomer}
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 disabled:bg-gray-50/80 disabled:text-gray-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1.5 text-gray-500" />
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isNewCustomer}
                      rows="3"
                      className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 disabled:bg-gray-50/80 disabled:text-gray-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Booking Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    required
                    min={
                      formData.checkIn || new Date().toISOString().split("T")[0]
                    }
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type *
                  </label>
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map((room) => (
                      <option key={room.value} value={room.value}>
                        {room.label} - ${room.price}/night
                      </option>
                    ))}
                  </select>
                  {formData.roomType && (
                    <p className="text-xs text-gray-500 mt-2">
                      {
                        roomTypes.find((r) => r.value === formData.roomType)
                          ?.description
                      }
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline w-4 h-4 mr-1.5 text-gray-500" />
                    Number of Guests *
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Guest{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Any special requirements, dietary restrictions, or preferences..."
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Booking Summary */}
              {nights > 0 && total > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-indigo-500/5 p-8 mb-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Booking Summary
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">
                        {nights} night{nights > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Room Type</span>
                      <span className="font-medium">
                        {
                          roomTypes.find((r) => r.value === formData.roomType)
                            ?.label
                        }
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rate per night</span>
                      <span className="font-medium">${roomPrice}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium">{formData.guests}</span>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (12%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-800">Total Amount</span>
                      <span className="text-indigo-600">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-indigo-500/5 p-6">
                <div className="space-y-4">
                  {isNewCustomer ? (
                    <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span>New customer will be created</span>
                    </div>
                  ) : formData.customerId ? (
                    <div className="flex items-center space-x-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        Booking for {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      !showCustomerFields ||
                      !formData.checkIn ||
                      !formData.checkOut ||
                      !formData.roomType ||
                      isSubmitting
                    }
                    className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Booking...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>
                          {isNewCustomer
                            ? "Create Customer & Booking"
                            : "Create Booking"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingSystem;
