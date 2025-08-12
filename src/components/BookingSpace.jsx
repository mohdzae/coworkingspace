import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, MapPin, User, CheckCircle } from 'lucide-react';

const CoworkingBookingSystem = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState({});
  const [bookings, setBookings] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [currentBooking, setCurrentBooking] = useState(null);

  // Time slots from 9 AM to 6 PM
  const timeSlots = [
    { id: '09-10', time: '9:00 AM - 10:00 AM', price: 25 },
    { id: '10-11', time: '10:00 AM - 11:00 AM', price: 25 },
    { id: '11-12', time: '11:00 AM - 12:00 PM', price: 25 },
    { id: '12-13', time: '12:00 PM - 1:00 PM', price: 30 },
    { id: '13-14', time: '1:00 PM - 2:00 PM', price: 30 },
    { id: '14-15', time: '2:00 PM - 3:00 PM', price: 30 },
    { id: '15-16', time: '3:00 PM - 4:00 PM', price: 25 },
    { id: '16-17', time: '4:00 PM - 5:00 PM', price: 25 },
    { id: '17-18', time: '5:00 PM - 6:00 PM', price: 25 }
  ];

  // Generate date range between start and end dates
  const getDateRange = (start, end) => {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    return dates;
  };

  // Check if a slot is already booked
  const isSlotBooked = (date, slotId) => {
    return bookings.some(booking => 
      booking.date === date && booking.slots.includes(slotId)
    );
  };

  // Handle slot selection
  const handleSlotSelect = (date, slotId) => {
    if (isSlotBooked(date, slotId)) return;

    setSelectedSlots(prev => {
      const key = `${date}-${slotId}`;
      const newSlots = { ...prev };
      
      if (newSlots[key]) {
        delete newSlots[key];
      } else {
        newSlots[key] = { date, slotId };
      }
      
      return newSlots;
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    return Object.values(selectedSlots).reduce((total, slot) => {
      const timeSlot = timeSlots.find(ts => ts.id === slot.slotId);
      return total + (timeSlot?.price || 0);
    }, 0);
  };

  // Handle booking submission
  const handleBooking = () => {
    if (Object.keys(selectedSlots).length === 0) {
      alert('Please select at least one time slot');
      return;
    }
    
    setCurrentBooking({
      slots: selectedSlots,
      total: calculateTotal(),
      customer: { ...customerInfo }
    });
    setShowBookingForm(true);
  };

  // Confirm booking
  const confirmBooking = () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Group slots by date
    const slotsByDate = {};
    Object.values(selectedSlots).forEach(slot => {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push(slot.slotId);
    });

    // Create bookings for each date
    const newBookings = Object.entries(slotsByDate).map(([date, slots]) => ({
      id: Date.now() + Math.random(),
      date,
      slots,
      customer: { ...customerInfo },
      total: slots.reduce((sum, slotId) => {
        const timeSlot = timeSlots.find(ts => ts.id === slotId);
        return sum + (timeSlot?.price || 0);
      }, 0),
      bookedAt: new Date().toLocaleString()
    }));

    setBookings(prev => [...prev, ...newBookings]);
    setSelectedSlots({});
    setShowBookingForm(false);
    setCurrentBooking(null);
    setCustomerInfo({ name: '', email: '', phone: '' });
    alert('Booking confirmed successfully!');
  };

  const dateRange = startDate && endDate ? getDateRange(startDate, endDate) : [];
  const totalPrice = calculateTotal();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="text-blue-600" size={24} />
          <h1 className="text-3xl font-bold text-gray-800">Co-working Space Booking</h1>
        </div>

        {/* Date Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Time Slots Grid */}
        {dateRange.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Time Slots</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Time Slot</th>
                    <th className="border border-gray-200 px-4 py-2 text-center">Price</th>
                    {dateRange.map(date => (
                      <th key={date} className="border border-gray-200 px-4 py-2 text-center min-w-[120px]">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(slot => (
                    <tr key={slot.id}>
                      <td className="border border-gray-200 px-4 py-2 font-medium">
                        <Clock className="inline w-4 h-4 mr-1 text-gray-600" />
                        {slot.time}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center font-semibold text-green-600">
                        <DollarSign className="inline w-4 h-4" />{slot.price}
                      </td>
                      {dateRange.map(date => {
                        const isBooked = isSlotBooked(date, slot.id);
                        const isSelected = selectedSlots[`${date}-${slot.id}`];
                        
                        return (
                          <td key={`${date}-${slot.id}`} className="border border-gray-200 px-2 py-2 text-center">
                            <button
                              onClick={() => handleSlotSelect(date, slot.id)}
                              disabled={isBooked}
                              className={`w-full py-2 px-3 rounded text-sm font-medium transition-colors ${
                                isBooked
                                  ? 'bg-red-100 text-red-600 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected Slots Summary */}
        {Object.keys(selectedSlots).length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Selected Slots</h3>
            <div className="space-y-1 text-sm">
              {Object.values(selectedSlots).map((slot, index) => {
                const timeSlot = timeSlots.find(ts => ts.id === slot.slotId);
                return (
                  <div key={index} className="flex justify-between">
                    <span>{new Date(slot.date + 'T00:00:00').toLocaleDateString()} - {timeSlot?.time}</span>
                    <span className="font-medium">${timeSlot?.price}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-blue-200 mt-2 pt-2">
              <div className="flex justify-between font-bold text-lg text-blue-800">
                <span>Total: ${totalPrice}</span>
                <button
                  onClick={handleBooking}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Complete Your Booking</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline w-4 h-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-lg font-bold text-center">
                    Total: ${currentBooking?.total}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Bookings</h2>
            <div className="space-y-3">
              {bookings.slice(-5).reverse().map(booking => (
                <div key={booking.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="text-green-600 w-4 h-4" />
                        <span className="font-medium text-green-800">{booking.customer.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(booking.date + 'T00:00:00').toLocaleDateString()} - {booking.slots.length} slot(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        Booked: {booking.bookedAt}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-700">${booking.total}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoworkingBookingSystem;