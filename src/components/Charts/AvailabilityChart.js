import React, { Component, createRef } from 'react';
import { withRouter } from '../../utils/withRouter';
import {
    Chart,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js/auto';

// Register all needed elements
Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

class AvailabilityChart extends Component {
    constructor(props) {
        super(props);
        this.chartRef = createRef();
        this.chartInstance = null;
        this.updateChart = this.updateChart.bind(this);
        this.getCurrentZoneDataByName = this.getCurrentZoneDataByName.bind(this);
        this.state = {
            pathname: '/',
            chartTitle: '',
            currentZoneIndex: 0,
            currentZoneData: {labels:[], uptime_dataset: [], downtime_dataset: []}
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.initializeChart();
        }, 0);
        const pathname = this.props.location.pathname
        this.setState({pathname});
    }
    componentDidUpdate(prevProps, prevState) {
        if ((prevState.currentZoneIndex !== this.state.currentZoneIndex) || (prevState.currentZoneData !== this.state.currentZoneData)) {
            this.updateChart();
        }
        if(prevProps.selectedZone !== this.props.selectedZone) {
            this.getCurrentZoneDataByName();
        }
    }
    componentWillUnmount() {
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
    }
    navigateToZone = (link) => {
        this.props.navigate(link);
    }
    updateChart() {        
        // complete_chart_data
        const {currentZoneIndex} = this.state;
        const ccd_array = Object.keys(this.props.complete_chart_data);
        const zoneData = this.props.complete_chart_data[ccd_array[currentZoneIndex]];
        // Filter the data needed, name === for Labels, uptime == to compute the uptime
        // Build this in label arrays, datasets array for the values and set the chart 
        // title to be equals to this zone name
        let labels = [], uptime_dataset = [], downtime_dataset = [];
        zoneData.forEach(element => {
            labels.push(element.name);
            uptime_dataset.push(element.uptime);
            downtime_dataset.push(new Date().getHours() - element.uptime);
        });
        this.chartInstance.data.labels = labels;
        this.chartInstance.data.datasets[0].data = uptime_dataset;
        this.chartInstance.data.datasets[1].data = downtime_dataset;
        this.chartInstance.options.plugins.title.text = `${ccd_array[currentZoneIndex]} - Availability`
        this.chartInstance.update();
    }
    getCurrentZoneDataByName() {
        const { selectedZone } = this.props;
        const ccd_array = Object.keys(this.props.complete_chart_data);
        const indexOfZoneSelected = ccd_array.indexOf(selectedZone);
        if(indexOfZoneSelected > -1) {
            this.setState({currentZoneIndex: indexOfZoneSelected});
        }
    }
    initializeChart() {
        const { complete_chart_data } = this.props;
        const ccd_array = Object.keys(complete_chart_data);
        const zoneData = complete_chart_data[ccd_array[0]];
        let labels = [], uptime_dataset = [], downtime_dataset = [];
        zoneData.forEach(element => {
            labels.push(element.name);
            uptime_dataset.push(element.uptime);
            downtime_dataset.push(new Date().getHours() - element.uptime);
        });
        // Build the datasets and label here using pagination by zones
        const canvas = this.chartRef.current;
        if (!canvas || !zoneData) {
            console.error('Chart canvas reference is null');
            return;
        }
        if (canvas && zoneData) {
            if (this.chartInstance) {
                this.chartInstance.destroy();
            }
            const ctx = canvas.getContext('2d');
            if(!ctx) {  
                console.error('Failed to acquire canvas context');
                return;
            }
            this.chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    // Use pagination for the labels and datasets data
                    // Just send the array of labels and datasets to this components
                    // from overview and use state to shift the data
                    labels: labels,
                    datasets:[
                        {
                            label: 'Uptime',
                            data: uptime_dataset,
                            backgroundColor: '#3b82f6'
                        },
                        {
                            label: 'Downtime',
                            data: downtime_dataset,
                            backgroundColor: '#3b34f6'
                        }
                    ],
                    borderColor: '#000',
                    borderWidth: 1
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: {
                        bar: {
                            borderWidth: 2
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: `${ccd_array[0]} - Availability`,
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Hours (hrs)"
                            },
                            grid: {
                                color: '#e5e7eb',
                                lineWidth: 1
                            },
                            stacked: true
                        },
                        x: {
                            title: {
                                display: true,
                                text: "Zones"
                            },
                            grid: {
                                color: '#e5e7eb',
                                lineWidth: 1
                            },
                             stacked: true
                        }                        
                    },
                    onClick: (event, elements, chart) => {
                        // Handle click event
                        if (elements.length > 0) {
                            const element = elements[0];
                            const datasetIndex = element.datasetIndex;
                            const dataIndex = element.index;
                            const categoryLabel = chart.data.labels[dataIndex];
                            const location = categoryLabel.toLowerCase().replace(/ /g, "-");                            
                            const { pathname } = this.state;
                            // console.log(location, pathname)
                            if(pathname == '/availability' && location !== pathname) {
                                const newLocation = (pathname+'/'+location);
                                // alert("This is the new location  ", newLocation);
                                // this.navigateToZone(newLocation);
                            }
                        }
                    }
                }
            });
        }
    }
    handlePageChange(action) {        
        const zoneLength = Object.keys(this.props.complete_chart_data).length;
        let {currentZoneIndex} = this.state;
        if(action == "next") {
            if(currentZoneIndex < zoneLength -1)  {
                this.setState({currentZoneIndex: currentZoneIndex + 1});
            }
        }
        if(action == "prev") {
            if(currentZoneIndex > 0) {
                this.setState({currentZoneIndex: currentZoneIndex - 1});
            }
        } 
    }
    render() {
        const {currentZoneIndex} = this.state;
        const totalPages = Object.keys(this.props.complete_chart_data).length;
        try {
            return (
                <>
                <div style={{ maxWidth: "100%", height: "auto" }} className="grid grid-col-1 card ml-3 overflow-x-auto w-full" data-name="zone-comparison-chart">
                    <canvas ref={this.chartRef} data-name="zone-comparison-canvas"></canvas>                    
                </div>
                <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            Zone {currentZoneIndex+1} of {totalPages}
                        </span>
                        <div className="space-x-2">
                            <button
                            onClick={() => this.handlePageChange("prev")}
                            disabled={currentZoneIndex+1 === 1}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                            >
                            Prev
                            </button>
                            <button
                            onClick={() => this.handlePageChange("next")}
                            disabled={currentZoneIndex+1 === totalPages}
                            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                            >
                            Next
                            </button>
                        </div>
                    </div>
                </>
            );
        } catch (error) {
            console.error('ZoneComparisonChart component error:', error);
            reportError(error);
            return null;
        }
    }
}

export default withRouter(AvailabilityChart);