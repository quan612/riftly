import dynamic from 'next/dynamic'
import React from 'react'
// import ReactApexChart from "react-apexcharts";
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ApexLineChart = ({ chartData, chartOptions }) => {
  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type="line"
      width="100%"
      height="100%"
    />
  )
}

export default ApexLineChart
