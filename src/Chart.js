import React from 'react';

import { scaleTime } from 'd3-scale';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

import { ChartCanvas, Chart } from 'react-stockcharts';
import { BarSeries, CandlestickSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates';

import { OHLCTooltip } from 'react-stockcharts/lib/tooltip';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last } from 'react-stockcharts/lib/utils';

const COLOR_DOWN = '#D13913',
  COLOR_UP = '#29A634',
  AXIS_SIDE_Y = 'right';

// cf. prototype https://codesandbox.io/s/5mzv5588l
class MyChart extends React.Component {
  render() {
    const { type, seriesName, data, width, height = 400, ratio } = this.props;
    const margin = { left: 0, right: 80, top: 0, bottom: 0 };

    const xAccessor = d => d.date;
    const start = xAccessor(last(data));
    const end = xAccessor(data[0]);
    const xExtents = [start, end];

    return (
      <ChartCanvas
        seriesName={seriesName}
        height={height}
        ratio={ratio}
        width={width}
        margin={margin}
        type={type}
        data={data}
        xScale={scaleTime()}
        xAccessor={xAccessor}
        xExtents={xExtents}>
        <Chart
          id={2}
          yExtents={[d => d.volume]}
          height={75}
          padding={{ top: 10, bottom: 0 }}
          origin={(w, h) => [0, h - 100]}
          yPan={false}>
          <YAxis axisAt={AXIS_SIDE_Y} orient={AXIS_SIDE_Y} ticks={4} tickFormat={format('.2s')} />
          <XAxis axisAt="bottom" orient="bottom" />

          <MouseCoordinateY at={AXIS_SIDE_Y} orient={AXIS_SIDE_Y} displayFormat={format('.4s')} />

          <BarSeries
            yAccessor={d => d.volume}
            fill={d => (d.close > d.open ? COLOR_UP : COLOR_DOWN)}
          />

          <CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />
        </Chart>
        <Chart
          id={1}
          height={265}
          padding={{ top: 15, bottom: 20 }}
          origin={(w, h) => [0, 0]}
          yExtents={[d => [d.high, d.low]]}
          yPan={false}>
          <XAxis axisAt="bottom" orient="bottom" ticks={0} stroke="#CCCCCC" strokeWidth={0.5} />
          <YAxis axisAt={AXIS_SIDE_Y} orient={AXIS_SIDE_Y} ticks={5} tickFormat={format('.4f')} />

          <MouseCoordinateX
            rectWidth={60}
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat('%H:%M')}
          />
          <MouseCoordinateY at={AXIS_SIDE_Y} orient={AXIS_SIDE_Y} displayFormat={format('.8f')} />

          <CandlestickSeries fill={d => (d.close > d.open ? COLOR_UP : COLOR_DOWN)} clip={false} />

          <EdgeIndicator
            itemType="last"
            orient={AXIS_SIDE_Y}
            edgeAt={AXIS_SIDE_Y}
            yAccessor={d => d.close}
            displayFormat={format('.8f')}
            fill={d => (d.close > d.open ? COLOR_UP : COLOR_DOWN)}
          />

          <OHLCTooltip
            origin={[0, 5]}
            ohlcFormat={format('.8f')}
            xDisplayFormat={timeFormat('%x %H:%M')}
          />
        </Chart>
        <CrossHairCursor />
      </ChartCanvas>
    );
  }
}

MyChart = fitWidth(MyChart);

export default MyChart;
