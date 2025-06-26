import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import './tailwind.css';
import './styles/App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/styles/sidebar.css';
import '../src/styles/index.css';
import '../src/styles/main.css';
import AlertPanelLayout from './routes/AlertsPanelLayout';
import AlertPanelDetails from './routes/AlertsPanelDetails'
import AppLayout from './routes/AppLayout';
import DashboardLayout from './routes/DashboardLayout';
import DashboardOverview from './routes/DashboardOverview'; 
import AvailabilityLayout from './routes/AvailabilityLayout';
import AvailabilityOverview from './routes/AvailabilityOverview';
import AvailabilityDetail from './routes/AvailabilityDetail';
import DashboardZoneDetails from './routes/DashboardZoneDetails';
import IndexPage from './routes/IndexPage';
import PaymentsLayout from './routes/PaymentsLayout';
import Payments from './routes/PaymentsPage';
import Analytics from './routes/Analytics';
import EnergyMetrics from './routes/Energy/EnergyLayout';
import socket from './utils/socketIO';

library.add(faCoffee, faUser);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setSideBarWidth = this.setSideBarWidth.bind(this);
    this.state = {      
      serverData: null,
      error: null,  
      side_bar_width: window.innerWidth >= 768 ? "250px" : "60px",      
    };
  }
  componentDidMount() {
    // Set the Local storage value for all the computed values for the first time here
    // This will persist the data during the session
    socket.on('new connection', serverdata => {
      const { data } = serverdata;
      const returnObject = {}
      if(data) {
        if(!this.state.serverData || !localStorage.getItem("serverData")) {
          this.setState(prevState => {
            prevState["serverData"] = data;
            returnObject["serverData"] = prevState["serverData"]
            return returnObject;
          });
          localStorage.setItem('serverData', JSON.stringify(data));
          window.dispatchEvent(new Event("serverData")); // Notify child component
        }        
      }
    });
    socket.on("feeder-update", serverdata => {
      const { data } = serverdata;
      const returnObject = {}
      if(data) {
        this.setState(prevState => {
          prevState["serverData"] = data;
          returnObject["serverData"] = prevState["serverData"]
          return returnObject;
        });
        localStorage.setItem('serverData', JSON.stringify(data));
        window.dispatchEvent(new Event("serverData")); // Notify child component
      }
    });

    // Global error handler
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('Global error:', error);
      this.setState({ error });
      this.reportError(error);
    };
  }
  componentWillUnmount() {
    // localStorage.removeItem('serverData');
    socket.off('feeder-update');
    socket.off('new connection');
  }
  componentDidCatch(error, info) {
    this.setState({ error });
    console.error('Error caught in App:', error, info);
    this.reportError(error);
  }
  setSideBarWidth(width) {
      this.setState({side_bar_width: width});
  }
   reportError(err) {
    console.error('App error:', err);
  };

  render() {
    const { side_bar_width } = this.state;
    //  Dashboard Overview End
    return (
      <Router>
        <div className="app" data-name="app">  
          <Routes>
              <Route exact path="/" element={<AppLayout setSideBarWidth={this.setSideBarWidth} />} >
                {/* Home Route */}
                <Route index element={<IndexPage />} />
                {/* Alert Panel Route */}
                {/* Dashboard Route */}
                <Route path="dashboard" element={<DashboardLayout side_bar_width={side_bar_width} />} >
                  <Route index element={<DashboardOverview 
                    side_bar_width={side_bar_width} 
                  />} />
                  <Route path=":zoneId" element={<DashboardZoneDetails 
                    side_bar_width={side_bar_width}
                  />} />
                </Route>
                {/* Availability Route */}
                <Route path="availability" element={<AvailabilityLayout side_bar_width={side_bar_width} />} >
                  <Route index element={<AvailabilityOverview 
                    side_bar_width={side_bar_width} 
                  />} />
                  <Route path=":zoneId" element={<AvailabilityDetail />} />
                </Route>
                {/* Alerts Route */}
                <Route path="alerts" element={<AlertPanelLayout />} >
                  <Route index element={<AlertPanelDetails />} />
                </Route>
                {/* Payments Route */}
                <Route path="payments" element={<PaymentsLayout />} >
                  <Route index element={<Payments />} />
                </Route>
                {/* Analytics */}
                <Route path="analytics" element={<Analytics />} >
                  {/* <Route index element={<Payments />} /> */}
                </Route>
                {/* Settings */}
                {/* Energy Usage */}
                <Route path="energy_zones" element={<EnergyMetrics />} >
                  {/* <Route index element={<Payments />} /> */}
                </Route>
              </Route>              
          </Routes>
         </div>
      </Router>
      
    );
  }
}

export default App;
