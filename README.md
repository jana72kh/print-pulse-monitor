
# 3D Printer Monitoring Dashboard

A real-time web-based dashboard for monitoring and controlling a 3D printer. This project uses a simulated backend to generate realistic printer data, providing a fully interactive experience without requiring actual hardware.

![Dashboard Preview](https://place-hold.it/800x450/000/fff&text=3D%20Printer%20Dashboard)

## Features

- **Real-time monitoring** of extruder and bed temperatures
- **Print job progress tracking** with percentage and elapsed time
- **Interactive printer controls** (Start, Pause/Resume, Stop)
- **Error simulation and recovery**
- **Temperature history graph** showing changes over time
- **Responsive design** that works on desktop and mobile devices
- **Dark theme interface** optimized for workshop environments

## Setup Instructions

### Prerequisites

- Node.js (v16 or later recommended)
- npm or bun

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd 3d-printer-dashboard
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   bun install
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

The dashboard provides a simulated 3D printer interface with the following controls:

- **Start Print**: Begins a simulated print job with randomized temperature targets
- **Pause/Resume**: Toggles between pausing and resuming an active print job
- **Stop Print**: Cancels the current print job
- **Simulate Error/Reset Error**: Toggles between error state and resetting to normal operation

The temperature graph displays the history of both extruder and bed temperatures over time.

## Design Decisions

### Technology Stack

- **React + TypeScript**: For building a robust, type-safe UI
- **Tailwind CSS**: For responsive, utility-first styling
- **shadcn/ui**: For consistent, accessible UI components
- **recharts**: For interactive, real-time data visualization
- **Lucide Icons**: For clean, consistent iconography

### Architecture Decisions

1. **Singleton Simulator**: The printer simulator is implemented as a singleton service that maintains state and broadcasts updates to subscribers, mimicking a real device API.

2. **Reactive UI**: Components subscribe to data changes and update automatically, ensuring real-time UI updates without additional user actions.

3. **Dark Theme**: The interface uses a dark theme to reduce eye strain in workshop environments where 3D printers are typically used.

4. **Compact Layout**: The dashboard prioritizes essential information while maintaining access to controls, optimizing for at-a-glance monitoring.

### Data Simulation

- Temperature simulation includes realistic heating and cooling curves
- Random fluctuations around target temperatures mimic real-world behavior
- Print progress advances at variable rates to simulate different parts of the printing process

## Challenges and Solutions

### Challenge: Realistic Data Simulation

**Problem**: Creating realistic temperature data that mimics actual 3D printer behavior.

**Solution**: Implemented temperature simulation with variable heating/cooling rates and small random fluctuations around target values. This creates more realistic temperature curves compared to linear changes.

### Challenge: Responsive Design for Various Screen Sizes

**Problem**: Creating an interface that works well on both desktop monitors and mobile devices.

**Solution**: Used a responsive grid layout with Tailwind CSS that adjusts breakpoints for different screen sizes. Components reorganize from a side-by-side layout on desktop to a stacked layout on mobile.

### Challenge: Real-time Updates Without Performance Issues

**Problem**: Updating the UI in real-time without causing performance bottlenecks.

**Solution**: Implemented an efficient subscription model where components only re-render when relevant data changes. The temperature history is also limited to a fixed number of data points to prevent memory issues.

## Future Improvements

- Add file upload capability for simulating specific print jobs
- Implement print time estimation based on progress
- Add camera view simulation
- Create printer profiles to simulate different printer models
- Add network latency simulation for more realistic remote monitoring

## License

[MIT License](LICENSE)

## Acknowledgments

- Inspired by actual 3D printer interfaces like OctoPrint and Prusa Connect
- Design pattern influenced by modern IoT dashboards
