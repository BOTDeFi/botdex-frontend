/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, VFC } from 'react';
import ApexCharts from 'apexcharts';

import './Graph.scss';

interface IGraphProps {
  id: string;
  series?: any;
  options?: any;
  onHovered?: (event: any, chartContext: any, config: any) => void;
  className?: string;
}

const initOptions = {
  chart: {
    height: '100%',
    type: 'area',
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
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
    style: {
      color: '#f4f4f4',
      fontSize: '16px',
    },
  },
};

const Graph: VFC<IGraphProps> = ({ id, series, options, onHovered, className }) => {
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
        chart: {
          ...initOptions.chart,
          events: {
            mouseMove: onHovered,
          },
        },
        noData: initOptions.noData,
      });
    }
  }, [options, onHovered]);

  // update series (data)
  useEffect(() => {
    if (chart.current) {
      chart.current.updateSeries([
        {
          name: 'Price',
          data: series[0],
        },
      ]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series.length]);

  return (
    <section className={`graph-wrapper ${className}`}>
      <div className="graph-wrapper__body" id={id} />
    </section>
  );
};

export default Graph;
