/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, VFC } from 'react';
import ApexCharts from 'apexcharts';

import './Graph.scss';

interface IGraphProps {
  id: string;
  series?: any;
  options?: any;
  onHovered?: (event: any, chartContext: any, config: any) => void;
}

const initOptions = {
  chart: {
    height: '200px',
    type: 'area',
    toolbar: {
      offsetX: -40,
    },
    width: '105%',
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

const Graph: VFC<IGraphProps> = ({ id, series, options, onHovered }) => {
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
          name: 'main',
          data: series,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series.length]);

  return (
    <section className="graph-wrapper">
      <div className="graph-wrapper__body" id={id} />
    </section>
  );
};

export default Graph;
