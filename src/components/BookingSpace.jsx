import React, { useState, useEffect } from 'react';
import { Calendar, Clock, IndianRupee, MapPin, User, CheckCircle } from 'lucide-react';

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
    { id: '09-10', time: '9:00 AM - 10:00 AM', price: 250 },
    { id: '10-11', time: '10:00 AM - 11:00 AM', price: 250 },
    { id: '11-12', time: '11:00 AM - 12:00 PM', price: 250},
    { id: '12-13', time: '12:00 PM - 1:00 PM', price: 300 },
    { id: '13-14', time: '1:00 PM - 2:00 PM', price: 300 },
    { id: '14-15', time: '2:00 PM - 3:00 PM', price: 300 },
    { id: '15-16', time: '3:00 PM - 4:00 PM', price: 800},
    { id: '16-17', time: '4:00 PM - 5:00 PM', price: 1000},
    { id: '17-18', time: '5:00 PM - 6:00 PM', price: 8000 }
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
         <img  className="w-50 h-25 mx-auto "src='src/assets/giglab logo.jpg'/>
        <div className="flex items-center gap-2 mb-6">
           
          {/* <MapPin className="text-blue-600" size={24} /> */}
          { <h1 className="text-3xl font-bold text-gray-800">Co-working Space Booking</h1> }
          {/* <img className="w-full h-30" src='data:image/jpeg;base64,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'></img> */}
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
                        <IndianRupee className="inline w-4 h-4" />{slot.price}
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
                    <span className="font-medium"> <IndianRupee className="inline w-4 h-4" />{timeSlot?.price}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-blue-200 mt-2 pt-2">
              <div className="flex justify-between font-bold text-lg text-blue-800">
                <span>Total:  <IndianRupee className="inline w-4 h-4" />{totalPrice}</span>
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