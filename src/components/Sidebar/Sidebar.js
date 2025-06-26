import React from 'react';
import MenuItem from './MenuItem';
import withRouter from '../../utils/withRouter';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: '',
        };
    }
    componentDidCatch(error, info) {
        console.error('Error caught in Sidebar:', error, info);
        reportError(error);
    }
    navigateToZone = (link) => {
        this.props.navigate(link);
    };

    render() {
        const { activeItem } = this.state;
        const {
            collapsed,
            onToggleCollapse,
            side_bar_width,
            overflow,
            onSelectZone,
        } = this.props;
        
        return (
            <div
                // style={{width: collapsed ? "4rem" : "15rem"}}
                style={{width: side_bar_width, zIndex: 2}}
                data-name="sidebar"
                className={`sidebar bg-red ${overflow} border-r border-gray-200 p-4 transition-all duration-300 ${
                collapsed ? "w-16" : "w-64"
                }`}
            >
                <button
                    style={{ position: "fixed", top: 4, left: 4 }}
                    onClick={onToggleCollapse}
                    className="mb-4 text-sm bg-gray-300 px-2 py-1 rounded"
                    >
                    {collapsed ? "▶" : "◀"}
                </button>

                {!collapsed && (<div className="" data-name="sidebar">
                    <div 
                        className="sidebar-header mt-4" data-name="sidebar-header"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                            this.navigateToZone('/');
                        }}
                    >
                        <h1 className="text-xl font-bold" data-name="sidebar-title">
                            Onction Energy Performance Dashboard
                        </h1>
                    </div>
                    
                    <MenuItem 
                        icon="fa-chart-line" 
                        label="Dashboard"
                        isActive={activeItem === 'dashboard'}
                        onClick={() => {
                            onSelectZone('dashboard');
                            this.setState({ activeItem: 'dashboard' }); 
                            this.navigateToZone('/dashboard')
                        }}
                    />
                    <MenuItem 
                        icon="fa-bolt" 
                        label="Energy Zones"
                        isActive={activeItem === 'energy_zones'}
                        onClick={() => {
                            onSelectZone('energy_zones');
                            this.navigateToZone('energy_zones');
                            this.setState({ activeItem: 'energy_zones' })
                        }}
                    >
                        {/* <MenuItem 
                            icon="fa-circle" 
                            label="Bauchi"
                            isActive={activeItem === 'zone-a'}
                            onClick={() => {
                                onSelectZone('zones/zone-a');
                                this.setState({ activeItem: 'zone-a' }); 
                                // this.navigateToZone('zones/:zone-a/energy')
                            }}
                        />
                        <MenuItem 
                            icon="fa-circle" 
                            label="Gombe"
                            isActive={activeItem === 'zone-b'}
                            onClick={() => {
                                onSelectZone('zones/zone-b');
                                this.setState({ activeItem: 'zone-b' }); 
                                // this.navigateToZone('zones/:zone-b/energy')
                            }}
                        /> */}
                    </MenuItem>
                    <MenuItem 
                        icon="fa-clock" 
                        label="Availability"
                        isActive={activeItem === 'availability'}
                        onClick={() => {
                            onSelectZone('availability');
                            this.setState({ activeItem: 'availability' });   
                            this.navigateToZone('availability');
                        }}
                    >
                        {/* <MenuItem 
                            icon="fa-circle" 
                            label="Bauchi"
                            isActive={activeItem === 'bauchi'}
                            onClick={() => {
                                onSelectZone('availability/bauchi');
                                this.setState({ activeItem: 'bauchi' }); 
                                // this.navigateToZone('availability/zone-a/');
                            }}
                        />
                        <MenuItem 
                            icon="fa-circle" 
                            label="Gombe"
                            isActive={activeItem === 'gombe'}
                            onClick={() => {
                                onSelectZone('availability/gombe');
                                this.setState({ activeItem: 'gombe' }); 
                                // this.navigateToZone('availability/zone-b/');
                            }}
                        />
                        <MenuItem 
                            icon="fa-circle" 
                            label="Makari Jos"
                            isActive={activeItem === 'makari jos'}
                            onClick={() => {
                                onSelectZone('availability/makari jos');
                                this.setState({ activeItem: 'makari jos' }); 
                                // this.navigateToZone('availability/zone-c/');
                            }}
                        />
                        <MenuItem 
                            icon="fa-circle" 
                            label="Zaria Road Jos"
                            isActive={activeItem === 'zaria road jos'}
                            onClick={() => {
                                onSelectZone('availability/zaria road jos');
                                this.setState({ activeItem: 'zaria road jos' }); 
                                // this.navigateToZone('availability/zone-c/');
                            }}
                        />
                        <MenuItem 
                            icon="fa-circle" 
                            label="Yandev Gboko"
                            isActive={activeItem === 'yandev gboko'}
                            onClick={() => {
                                onSelectZone('availability/yandev gboko');
                                this.setState({ activeItem: 'yandev gboko' }); 
                                // this.navigateToZone('availability/zone-c/');
                            }}
                        /> */}
                    </MenuItem>
                    <MenuItem 
                        icon="fa-credit-card" 
                        label="Payments"
                        isActive={activeItem === 'payments'}
                        onClick={() => {
                            this.setState({ activeItem: 'payments' });
                            this.navigateToZone('payments');
                        }}
                    >
                        {/* <MenuItem 
                            icon="fa-circle" 
                            label="Zone A"
                            isActive={activeItem === 'zone-a'}
                            onClick={() => {
                                this.setState({ activeItem: 'zone-a' }); 
                                // this.navigateToZone('zones/:zone-a/payments')
                            }}
                        />
                        <MenuItem 
                            icon="fa-circle" 
                            label="Zone B"
                            isActive={activeItem === 'zone-b'}
                            onClick={() => {
                                this.setState({ activeItem: 'zone-b' }); 
                                // this.navigateToZone('zones/:zone-b/payments')
                            }}
                        /> */}
                    </MenuItem>
                    <MenuItem 
                        icon="fa-battery-full" 
                        label="Energy Usage"
                        isActive={activeItem === 'consumption'}
                        onClick={() => this.setState({ activeItem: 'consumption' })}
                    >
                        {/* <MenuItem 
                            icon="fa-circle" 
                            label="Zone A"
                            isActive={activeItem === 'zone-a'}
                            onClick={() => {
                                this.setState({ activeItem: 'zone-a' }); 
                                // this.navigateToZone('zones/:zone-a/energy_consumption')
                            }}
                        />
                        <MenuItem 
                            icon="fa-circle" 
                            label="Zone B"
                            isActive={activeItem === 'zone-b'}
                            onClick={() => {
                                this.setState({ activeItem: 'zone-b' }); 
                                // this.navigateToZone('zones/:zone-b/energy_consumption')
                            }}
                        /> */}
                    </MenuItem>
                    <MenuItem 
                        icon="fa-chart-line" 
                        label="Analytics"
                        isActive={activeItem === 'analytics'}
                        onClick={() => {
                            this.setState({ activeItem: 'analytics' });
                            this.navigateToZone('analytics')
                        }}
                    />
                    <MenuItem 
                        icon="fa-bell" 
                        label="Alerts"
                        isActive={activeItem === 'alerts'}
                        onClick={() => {
                            this.setState({ activeItem: 'alerts'}); 
                            this.navigateToZone('alerts')
                        }}
                    />                
                    <MenuItem 
                        icon="fa-gear" 
                        label="Settings"
                        isActive={activeItem === 'settings'}
                        onClick={() => this.setState({ activeItem: 'settings' })}
                    />
                </div>)}
            </div>
        );
    }
}

export default withRouter(Sidebar);
