import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StatsProps {
  data: {
    totalCenters: number;
    availableCapacity: number;
    healthCenters: number;
    shelterCenters: number;
    occupancyRate: number;
  };
}

export function Stats({ data }: StatsProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    // Create occupancy gauge chart
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2);

    // Background arc
    svg.append('path')
      .datum({ endAngle: Math.PI / 2 })
      .style('fill', '#374151')
      .attr('d', arc as any);

    // Foreground arc
    svg.append('path')
      .datum({ endAngle: (-Math.PI / 2) + (Math.PI * data.occupancyRate) })
      .style('fill', data.occupancyRate > 0.9 ? '#ef4444' : data.occupancyRate > 0.7 ? '#eab308' : '#22c55e')
      .attr('d', arc as any);

    // Add text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .style('font-size', '2em')
      .style('fill', 'currentColor')
      .text(`${Math.round(data.occupancyRate * 100)}%`);
  }, [data.occupancyRate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-200">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Total Centers</h3>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.totalCenters}</p>
      </div>
      
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Available Capacity</h3>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{data.availableCapacity}</p>
      </div>
      
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Center Types</h3>
        <div className="flex justify-between mt-2">
          <div>
            <p className="text-sm text-purple-700 dark:text-purple-300">Health</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.healthCenters}</p>
          </div>
          <div>
            <p className="text-sm text-purple-700 dark:text-purple-300">Shelter</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.shelterCenters}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Occupancy Rate</h3>
        <svg ref={chartRef} className="w-full h-auto text-gray-900 dark:text-white" />
      </div>
    </div>
  );
}