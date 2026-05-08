import React, { useMemo } from 'react';

interface MiniChartProps {
  data: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  positive,
  width = 200,
  height = 60,
}) => {
  const pathData = useMemo(() => {
    if (data.length < 2) return { path: '', area: '' };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 0.001;
    const padding = 4;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const areaPath = path + 
      ` L ${points[points.length - 1].x} ${height}` +
      ` L ${points[0].x} ${height} Z`;

    return { path, areaPath };
  }, [data, width, height]);


  const color = positive ? '#00d4aa' : '#ff4757';

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${positive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <path
        d={pathData.area}
        fill={`url(#gradient-${positive})`}
        className="transition-opacity duration-300"
      />
      
      {/* Line */}
      <path
        d={pathData.path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height / 2}
          r="3"
          fill={color}
          className="animate-pulse"
        />
      )}
    </svg>
  );
};