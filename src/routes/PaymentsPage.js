import React, { Component } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { BoltIcon } from '@heroicons/react/24/outline';
import { CreditCardIcon } from '@heroicons/react/24/outline';

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      customers: [],
      filterMeterType: 'all',
      filterCustomer: 'all',
      dateRange: '7'
    };
  }

  componentDidMount() {
    this.loadPaymentData();
  }

  loadPaymentData = async () => {
    try {
      // Mock data for demo
      const mockPayments = [
        { objectId: '1', objectData: { customer_id: 'CUST001', payment_amount: 81250, units_purchased: 1250, meter_type: 'MD', payment_method: 'Bank Transfer', payment_date: '2024-12-20T14:30:00Z' }},
        { objectId: '2', objectData: { customer_id: 'CUST002', payment_amount: 60520, units_purchased: 890, meter_type: 'MD', payment_method: 'Online', payment_date: '2024-12-22T10:15:00Z' }},
        { objectId: '3', objectData: { customer_id: 'CUST003', payment_amount: 8100, units_purchased: 180, meter_type: 'Prepaid', payment_method: 'POS', payment_date: '2024-12-23T16:45:00Z' }},
        { objectId: '4', objectData: { customer_id: 'CUST004', payment_amount: 9900, units_purchased: 220, meter_type: 'Prepaid', payment_method: 'Mobile Money', payment_date: '2024-12-21T09:20:00Z' }},
        { objectId: '5', objectData: { customer_id: 'CUST005', payment_amount: 24750, units_purchased: 450, meter_type: 'Postpaid', payment_method: 'Bank Transfer', payment_date: '2024-12-19T12:00:00Z' }},
        { objectId: '6', objectData: { customer_id: 'CUST006', payment_amount: 16000, units_purchased: 320, meter_type: 'Postpaid', payment_method: 'Online', payment_date: '2024-12-24T11:30:00Z' }}
      ];

      const mockCustomers = [
        { objectId: '1', objectData: { customer_id: 'CUST001', name: 'Ahmed Musa' }},
        { objectId: '2', objectData: { customer_id: 'CUST002', name: 'Grace Johnson' }},
        { objectId: '3', objectData: { customer_id: 'CUST003', name: 'Fatima Hassan' }},
        { objectId: '4', objectData: { customer_id: 'CUST004', name: 'David Gyang' }},
        { objectId: '5', objectData: { customer_id: 'CUST005', name: 'Sarah Audu' }},
        { objectId: '6', objectData: { customer_id: 'CUST006', name: 'Emmanuel Dung' }}
      ];
      
      this.setState({
        payments: mockPayments,
        customers: mockCustomers
      });
    } catch (error) {
      console.error('Error loading payment data:', error);
    }
  };

  getCustomerName = (customerId) => {
    const customer = this.state.customers.find(c => c.objectData.customer_id === customerId);
    return customer?.objectData.name || 'Unknown Customer';
  };

  getFilteredPayments = () => {
    const { payments, filterMeterType, filterCustomer } = this.state;
    return payments.filter(payment => {
      const matchesMeterType = filterMeterType === 'all' || payment.objectData.meter_type === filterMeterType;
      const matchesCustomer = filterCustomer === 'all' || payment.objectData.customer_id === filterCustomer;
      return matchesMeterType && matchesCustomer;
    });
  };

  render() {
    const { filterMeterType } = this.state;
    const filteredPayments = this.getFilteredPayments();
    const totalRevenue = filteredPayments.reduce((sum, p) => sum + (p.objectData.payment_amount || 0), 0);
    const totalUnits = filteredPayments.reduce((sum, p) => sum + (p.objectData.units_purchased || 0), 0);

    try {
      return (
        <div className="p-6" data-name="payments" data-file="src/pages/Payments/Payments.js">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-2">Track customer payments across all meter types</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₦{totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">All payments</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  {/* <div className="icon-banknote text-xl text-green-600"></div> */}
                  <BanknotesIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Units Sold</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUnits.toLocaleString()}</p>
                  <p className="text-sm text-blue-600">kWh</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {/* <div className="icon-zap text-xl text-blue-600"></div> */}
                  <BoltIcon className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredPayments.length}</p>
                  <p className="text-sm text-purple-600">This period</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  {/* <div className="icon-credit-card text-xl text-purple-600"></div> */}
                  <CreditCardIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Meter Type</label>
              <select 
                value={filterMeterType}
                onChange={(e) => this.setState({ filterMeterType: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Meter Types</option>
                <option value="MD">MD Customers</option>
                <option value="Prepaid">Prepaid Customers</option>
                <option value="Postpaid">Postpaid Customers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Customer</label>
              <select 
                value={this.state.filterCustomer}
                onChange={(e) => this.setState({ filterCustomer: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Customers</option>
                {this.state.customers.map(customer => (
                  <option key={customer.objectId} value={customer.objectData.customer_id}>
                    {customer.objectData.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Units</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Meter Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <tr key={payment.objectId} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{this.getCustomerName(payment.objectData.customer_id)}</p>
                          <p className="text-sm text-gray-600">{payment.objectData.customer_id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">₦{payment.objectData.payment_amount?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">{payment.objectData.units_purchased?.toLocaleString()} kWh</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.objectData.meter_type === 'MD' ? 'bg-blue-100 text-blue-800' :
                          payment.objectData.meter_type === 'Prepaid' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {payment.objectData.meter_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{payment.objectData.payment_method}</td>
                      <td className="py-3 px-4 text-gray-600">{new Date(payment.objectData.payment_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Payments component error:', error);
      return null;
    }
  }
}

export default Payments;