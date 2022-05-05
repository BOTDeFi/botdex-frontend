import { useMemo } from 'react';
import moment from 'moment';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useGetOptions = (currentStamp: any): any => {
  const options = useMemo(
    () => ({
      chart: {
        width: '100%',
      },
      colors: ['rgba(255, 255, 255, 0.1)'], // color of the border
      markers: {
        size: [0],
        colors: ['#F4F4F4'], // color of the marker
        strokeWidth: 3,
        hover: {
          size: 4,
          sizeOffset: 6,
        },
      },
      legend: {
        show: false,
      },
      fill: {
        type: 'solid',
        colors: ['#000000'],
        opacity: 0.3,
      },
      tooltip: {
        marker: {
          show: false,
        },
        // eslint-disable-next-line func-names
        custom() {
          return ``;
        },
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 6,
        hideOverlappingLabels: true,
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          rotate: 0,
          style: {
            fontFamily: 'Poppins',
            cssClass: 'xaxis-label',
            colors: '#f4f4f4',
          },
          // eslint-disable-next-line func-names
          formatter(_value: any, timestamp: number) {
            let format: string;
            switch (currentStamp) {
              case 1: {
                format = 'MMM DD YY';
                break;
              }
              case 2: {
                format = 'MMM DD YY';
                break;
              }
              case 3: {
                format = 'MMM DD YY';
                break;
              }
              default: {
                format = 'HH:mm a';
                break;
              }
            }
            return moment(timestamp).format(format);
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        show: false,
      },
      grid: {
        show: false,
        padding: {
          right: -26,
          top: -20,
          left: 0,
          bottom: 0,
        },
      },
    }),
    [currentStamp],
  );
  return options;
};

export default useGetOptions;
