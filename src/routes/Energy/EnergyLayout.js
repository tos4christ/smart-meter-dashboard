import React, { Component } from 'react';

class EnergyMetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSubstation: 'all',
      feeders: [],
      customers: [],
      consumptionData: []
    };
  }

  componentDidMount() {
    this.loadEnergyData();
  }

  loadEnergyData = async () => {
    try {
      // Mock data for demo
      const mockFeeders = [
        { objectId: '1', objectData: { feeder_name: 'Jos Main F1', feeder_id: 'JOS_MAIN_11KV_F1', substation: 'Jos Main 33/11kV', voltage_level: '11kV', capacity_mw: 5, status: 'Online' }},
        { objectId: '2', objectData: { feeder_name: 'Jos Main F2', feeder_id: 'JOS_MAIN_11KV_F2', substation: 'Jos Main 33/11kV', voltage_level: '11kV', capacity_mw: 5, status: 'Online' }},
        { objectId: '3', objectData: { feeder_name: 'Bukuru F1', feeder_id: 'BUKURU_11KV_F1', substation: 'Bukuru 33/11kV', voltage_level: '11kV', capacity_mw: 7, status: 'Online' }},
        { objectId: '4', objectData: { feeder_name: 'Bukuru F2', feeder_id: 'BUKURU_11KV_F2', substation: 'Bukuru 33/11kV', voltage_level: '11kV', capacity_mw: 7, status: 'Offline' }},
        { objectId: '5', objectData: { feeder_name: 'Rayfield F1', feeder_id: 'RAYFIELD_11KV_F1', substation: 'Rayfield 33/11kV', voltage_level: '11kV', capacity_mw: 4, status: 'Online' }},
        { objectId: '6', objectData: { feeder_name: 'Rayfield F2', feeder_id: 'RAYFIELD_11KV_F2', substation: 'Rayfield 33/11kV', voltage_level: '11kV', capacity_mw: 4, status: 'Online' }}
      ];

      const mockCustomers = [
        { objectId: '1', objectData: { customer_id: 'CUST001', name: 'Ahmed Musa', feeder: 'BUKURU_11KV_F1' }},
        { objectId: '2', objectData: { customer_id: 'CUST002', name: 'Grace Johnson', feeder: 'RAYFIELD_11KV_F2' }},
        { objectId: '3', objectData: { customer_id: 'CUST003', name: 'Fatima Hassan', feeder: 'JOS_MAIN_11KV_F1' }}
      ];

      const mockConsumption = [
        { objectData: { feeder_id: 'JOS_MAIN_11KV_F1', consumption_kwh: 1250, hours_supplied: 20 }},
        { objectData: { feeder_id: 'BUKURU_11KV_F1', consumption_kwh: 890, hours_supplied: 18 }},
        { objectData: { feeder_id: 'RAYFIELD_11KV_F2', consumption_kwh: 450, hours_supplied: 19 }}
      ];

      this.setState({
        feeders: mockFeeders,
        customers: mockCustomers,
        consumptionData: mockConsumption
      });
    } catch (error) {
      console.error('Error loading energy data:', error);
    }
  };

  getSubstations = () => {
    return [...new Set(this.state.feeders.map(f => f.objectData.substation))];
  };

  getFilteredFeeders = () => {
    const { selectedSubstation, feeders } = this.state;
    return selectedSubstation === 'all' 
      ? feeders 
      : feeders.filter(f => f.objectData.substation === selectedSubstation);
  };

  getCustomersByFeeder = (feederId) => {
    return this.state.customers.filter(c => c.objectData.feeder === feederId);
  };

  getFeederConsumption = (feederId) => {
    const consumption = this.state.consumptionData.filter(c => c.objectData.feeder_id === feederId);
    return consumption.reduce((sum, c) => sum + (c.objectData.consumption_kwh || 0), 0);
  };

  getFeederHours = (feederId) => {
    const consumption = this.state.consumptionData.filter(c => c.objectData.feeder_id === feederId);
    return consumption.reduce((sum, c) => sum + (c.objectData.hours_supplied || 0), 0);
  };

  render() {
    const { selectedSubstation } = this.state;
    const substations = this.getSubstations();
    const filteredFeeders = this.getFilteredFeeders();

    try {
      return (
        <div className="p-6" data-name="energy-metrics" data-file="src/pages/EnergyMetrics/EnergyMetrics.js">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Energy Metrics</h1>
            <p className="text-gray-600 mt-2">Monitor feeder performance and customer consumption</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Substation</label>
            <select 
              value={selectedSubstation}
              onChange={(e) => this.setState({ selectedSubstation: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Substations</option>
              {substations.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Feeder Status Overview</h3>
              <div className="space-y-3">
                {filteredFeeders.map(feeder => (
                  <div key={feeder.objectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{feeder.objectData.feeder_name}</h4>
                      <p className="text-sm text-gray-600">{feeder.objectData.voltage_level} • {feeder.objectData.capacity_mw}MW</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        feeder.objectData.status === 'Online' ? 'bg-green-100 text-green-800' :
                        feeder.objectData.status === 'Offline' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {feeder.objectData.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Energy Consumption by Feeder</h3>
              <div className="space-y-3">
                {filteredFeeders.map(feeder => {
                  const consumption = this.getFeederConsumption(feeder.objectData.feeder_id);
                  const hours = this.getFeederHours(feeder.objectData.feeder_id);
                  return (
                    <div key={feeder.objectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{feeder.objectData.feeder_name}</h4>
                        <p className="text-sm text-gray-600">{consumption.toLocaleString()} kWh consumed</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{hours}h</p>
                        <p className="text-xs text-gray-600">supplied</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('EnergyMetrics component error:', error);
      return null;
    }
  }
}

export default EnergyMetrics;