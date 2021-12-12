import React from 'react';
import { Slider as AntdSlider, SliderSingleProps } from 'antd';

import 'antd/lib/slider/style/css';

import './Slider.scss';

// interface ISlider extends SliderSingleProps {}

const Slider: React.FC<SliderSingleProps> = (props) => {
  return <AntdSlider {...props} className="slider" />;
};

export default Slider;
