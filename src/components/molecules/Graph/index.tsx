/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, VFC } from 'react';
import ApexCharts from 'apexcharts';
import './Graph.scss';

interface IGraphProps {
  id: string;
  series?: any;
  options?: any;
}

const initOptions = {
  chart: {
    height: '200px',
    type: 'area',
    toolbar: {
      offsetX: -40,
    },
    width: '109%',
    stroke: {
      width: 2,
      curve: 'straight',
    },
  },
  dataLabels: {
    enabled: false,
  },
  series: [],
  noData: {
    text: 'Loading...',
  },
};

const Graph: VFC<IGraphProps> = ({ id, series, options }) => {
  const chart = useRef<ApexCharts | null>(null);

  // initialize chart
  useEffect(() => {
    if (!chart.current) {
      chart.current = new ApexCharts(document.getElementById(id), initOptions);
      chart.current.render();
    }
  }, [chart, id]);

  // set options
  useEffect(() => {
    if (chart.current) {
      chart.current.updateOptions({
        ...options,
        dataLabels: initOptions.dataLabels,
        chart: initOptions.chart,
        noData: initOptions.noData,
      });
    }
  }, [options]);

  // update series (data)
  useEffect(() => {
    if (chart.current) {
      chart.current.updateSeries([
        {
          name: 'main',
          data: series,
        },
      ]);
    }
  }, [series]);

  return (
    <section className='graph-wrapper'>
      <div className='graph-wrapper__body' id={id} />
    </section>
  );
};

export default Graph;
