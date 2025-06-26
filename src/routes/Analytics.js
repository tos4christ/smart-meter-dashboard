import React, { Component, createRef } from 'react';
import { Chart as ChartJS } from 'chart.js';

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.chartInstance = null;
    this.renderChart = this.renderChart.bind(this);
    this.loadAnalyticsData = this.loadAnalyticsData.bind(this);
    this.chartRef = createRef();
    this.state = {
      timeRange: 'daily',
      selectedCustomer: 'all',
      customers: [],
      consumption: [],
      payments: [],
      chartRef: null
    };
  }

  componentDidMount() {
    this.loadAnalyticsData();
  }
  componentWillUnmount() {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
    }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timeRange !== this.state.timeRange || prevState.selectedCustomer !== this.state.selectedCustomer) {
      this.renderChart();
    }
  }

  loadAnalyticsData = async () => {
    try {
      // Mock data for demo
      const mockCustomers = [
        { objectId: '1', objectData: { customer_id: 'CUST001', name: 'Ahmed Musa', zone: 'Bukuru', meter_type: 'MD' }},
        { objectId: '2', objectData: { customer_id: 'CUST002', name: 'Grace Johnson', zone: 'Rayfield', meter_type: 'MD' }},
        { objectId: '3', objectData: { customer_id: 'CUST003', name: 'Fatima Hassan', zone: 'Jos Main', meter_type: 'Prepaid' }}
      ];

      const mockConsumption = [
        { objectData: { customer_id: 'CUST001', consumption_kwh: 1250, hours_supplied: 20 }},
        { objectData: { customer_id: 'CUST002', consumption_kwh: 890, hours_supplied: 18 }},
        { objectData: { customer_id: 'CUST003', consumption_kwh: 180, hours_supplied: 16 }}
      ];

      const mockPayments = [
        { objectData: { customer_id: 'CUST001', payment_amount: 81250 }},
        { objectData: { customer_id: 'CUST002', payment_amount: 60520 }},
        { objectData: { customer_id: 'CUST003', payment_amount: 8100 }}
      ];
      
      this.setState({
        customers: mockCustomers,
        consumption: mockConsumption,
        payments: mockPayments
      }, () => {
        this.renderChart();
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  renderChart = () => {
    const canvas = this.chartRef.current;
    if (!canvas)  { 
        console.error('Chart canvas reference is null'); 
        return;
    }

    if (canvas) {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        const ctx = canvas.getContext('2d');
        if(!ctx) {  
            console.error('Failed to acquire canvas context');
            return;
        }
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const consumptionData = [1250, 1180, 1320, 1400];
        const paymentData = [85000, 78000, 92000, 98000];

         this.chartInstance = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                {
                    label: 'Energy Consumption (kWh)',
                    data: consumptionData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    yAxisID: 'y'
                },
                {
                    label: 'Payments (₦)',
                    data: paymentData,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    yAxisID: 'y1'
                }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
                },
                scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                    display: true,
                    text: 'Energy Consumption (kWh)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                    display: true,
                    text: 'Payments (₦)'
                    },
                    grid: {
                    drawOnChartArea: false,
                    },
                }
                }
            }
            });
    }   
  };

  getCustomerAnalytics = () => {
    const { customers, consumption, payments } = this.state;
    
    return customers.map(customer => {
      const customerConsumption = consumption.filter(c => c.objectData.customer_id === customer.objectData.customer_id);
      const customerPayments = payments.filter(p => p.objectData.customer_id === customer.objectData.customer_id);
      
      const totalConsumption = customerConsumption.reduce((sum, c) => sum + (c.objectData.consumption_kwh || 0), 0);
      const totalPayments = customerPayments.reduce((sum, p) => sum + (p.objectData.payment_amount || 0), 0);
      const avgHoursSupplied = customerConsumption.length > 0 
        ? customerConsumption.reduce((sum, c) => sum + (c.objectData.hours_supplied || 0), 0) / customerConsumption.length 
        : 0;

      return {
        ...customer,
        totalConsumption,
        totalPayments,
        avgHoursSupplied,
        efficiency: totalConsumption > 0 ? (totalPayments / totalConsumption).toFixed(2) : 0
      };
    });
  };

  render() {
    const { timeRange, selectedCustomer, customers } = this.state;
    const customerAnalytics = this.getCustomerAnalytics();

    try {
      return (
        <div className="p-6" data-name="analytics" data-file="src/pages/Analytics/Analytics.js">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Compare energy usage against payments for performance insights</p>
          </div>

          <div className="mb-6 flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <select 
                value={timeRange}
                onChange={(e) => this.setState({ timeRange: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
              <select 
                value={selectedCustomer}
                onChange={(e) => this.setState({ selectedCustomer: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Customers</option>
                {customers.map(customer => (
                  <option key={customer.objectId} value={customer.objectData.customer_id}>
                    {customer.objectData.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card mb-8">
            <h3 className="text-lg font-semibold mb-4">Energy Usage vs Payments Trend</h3>
            <div className="h-96">
                <canvas ref={this.chartRef} data-name="energy-canvas"></canvas>       
              {/* <canvas id="analyticsChart"></canvas> */}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Customer Performance Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Zone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Meter Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Consumption</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Payments</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Hours</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {customerAnalytics.map(customer => (
                    <tr key={customer.objectId} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{customer.objectData.name}</p>
                          <p className="text-sm text-gray-600">{customer.objectData.customer_id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{customer.objectData.zone}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          customer.objectData.meter_type === 'MD' ? 'bg-blue-100 text-blue-800' :
                          customer.objectData.meter_type === 'Prepaid' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {customer.objectData.meter_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">{customer.totalConsumption.toLocaleString()} kWh</td>
                      <td className="py-3 px-4 font-medium text-gray-900">₦{customer.totalPayments.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">{customer.avgHoursSupplied.toFixed(1)}h</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          customer.efficiency > 50 ? 'bg-green-100 text-green-800' :
                          customer.efficiency > 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          ₦{customer.efficiency}/kWh
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Analytics component error:', error);
      return null;
    }
  }
}

export default Analytics;