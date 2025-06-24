import React, { Component } from "react";

export class PowerDataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
        currentPage: 1,
        itemsPerPage: 23,
        filter: "All",
        };
    }
    handlePageChange = (direction) => {
        this.setState((prevState) => ({
        currentPage: direction === "next" ? prevState.currentPage + 1 : prevState.currentPage - 1,
        }));
    };
    handleFilterChange = (event) => {
        this.setState({ filter: event.target.value, currentPage: 1 });
    };
    exportToCSV = () => {
        const { data } = this.props;
        const header = "Date,Time,Megawatts,Voltage,Amperes,Feeder Status\n";
        const rows = data.map(
        (r) => `${r.date},${r.time},${r.megawatts},${r.voltage},${r.amperes},${r.feederStatus}`
        );
        const csv = header + rows.join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "power_data.csv";
        a.click();
    };
    renderStatusBadge(status) {
        const style =
        status.toLowerCase() === "on"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
        return (
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${style}`}>
            {status}
        </span>
        );
    }

    render() {
        const { data, selectedZone } = this.props;
        const { currentPage, itemsPerPage, filter } = this.state;
        let filteredData;
        if(selectedZone === 'All' || !selectedZone) {
            filteredData = data;
        } else {
            filteredData = selectedZone ? data.filter((d) => d.zone === selectedZone) : data;
        }
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const visibleData = filteredData.slice(start, start + itemsPerPage);

        return (
        <>
            <div className="overflow-x-auto w-full">
                <table className="min-w-full table-auto border-0 border-gray-200 rounded-xl shadow-sm">
                <thead className="bg-white text-gray-700 uppercase text-sm border-b-2 border-gray-200">
                    <tr>
                    <th className="px-4 py-3 text-center border-2 rounded">Date</th>
                    <th className="px-4 py-3 text-center border-2 rounded">Time</th>
                    <th className="px-4 py-3 text-center border-2 rounded">Zone</th>
                    <th className="px-4 py-3 text-center border-2 rounded">Trading Point</th>
                    <th className="px-4 py-3 text-center border-2 rounded">Name</th>
                    <th style={{color: "#FF6B6B"}} className="px-4 py-3 text-center border-2 rounded">MW</th>
                    <th style={{color: "#FFD93D"}} className="px-4 py-3 text-center border-2 rounded">KV</th>
                    <th style={{color: "#4ECDC4"}} className="px-4 py-3 text-center border-2 rounded">AMP</th>
                    <th className="px-4 py-3 text-center border-2 rounded">Status</th>
                    <th className="px-4 py-3 text-center border-2 rounded">Uptime</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800 text-sm">
                    {visibleData.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 text-center border-2 rounded">{r.date}</td>
                        <td className="px-1 py-2 text-center border-2 rounded">{r.time}</td>
                        <td className="px-1 py-2 text-center border-2 rounded">{r.zone}</td>
                        <td className="px-1 py-2 text-center border-2 rounded">{r.trading_point}</td>
                        <td className="px-1 py-2 text-center border-2 rounded">{r.name}</td>
                        <td style={{color: "#FF6B6B"}} className="px-1 py-2 text-center border-2 rounded">{r.megawatts}</td>
                        <td style={{color: "#FFD93D"}} className="px-1 py-2 text-center border-2 rounded">{r.voltage}</td>
                        <td style={{color: "#4ECDC4"}} className="px-1 py-2 text-center border-2 rounded">{r.amperes}</td>
                        <td className="px-1 py-2 text-center border-2 rounded">{this.renderStatusBadge(r.feederStatus)}</td>
                        <td className="px-1 py-2 text-center border-2 rounded">{r.uptime}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <div className="space-x-2">
                    <button
                    onClick={() => this.handlePageChange("prev")}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    >
                    Prev
                    </button>
                    <button
                    onClick={() => this.handlePageChange("next")}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    >
                    Next
                    </button>
                </div>
            </div>
        </>
        );
    }
}
