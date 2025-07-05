import React, { useState, useEffect } from 'react';

interface ChartData {
  index: number;
  value: number;
  headshotPercentage: number;
  rawDate: string;
}

interface AccuracyChartProps {
  data: ChartData[];
}

interface TooltipData {
  x: number;
  y: number;
  value: number;
  visible: boolean;
}

export default function AccuracyChart({ data }: AccuracyChartProps) {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    value: 0,
    visible: false
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-48 w-full bg-dark-600 rounded-lg p-4 flex items-center justify-center">
        <div className="text-light-400">Loading Chart...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 w-full bg-dark-600 rounded-lg p-4 flex items-center justify-center">
        <div className="text-light-400">No data available</div>
      </div>
    );
  }

  // 計算SVG座標 - 壓縮尺寸
  const svgWidth = 450; // 增加寬度
  const svgHeight = 110; // 增加高度
  const padding = 18; // 稍微增加上下邊距
  const leftPadding = 40; // 增加左邊距，為Y軸label留更多空間
  const chartWidth = svgWidth - leftPadding - padding;
  const chartHeight = svgHeight - padding * 2;
  
  // 動態計算Y軸範圍
  const dataValues = data.map(d => d.headshotPercentage);
  const dataMin = Math.min(...dataValues);
  const dataMax = Math.max(...dataValues);
  
  // 智能計算Y軸邊界值
  const calculateYBounds = (min: number, max: number) => {
    // 向下圓整到10的倍數，並留一點空間
    const minBound = Math.max(0, Math.floor((min - 2) / 10) * 10);
    
    // 向上圓整到10的倍數，確保有足夠空間
    let maxBound;
    if (max <= 30) {
      maxBound = Math.ceil(max / 10) * 10 + 10; // 如果≤30%，圓整到10的倍數再+10
    } else if (max <= 45) {
      maxBound = 50; // 如果在30-45%之間，設為50%
    } else {
      maxBound = Math.ceil(max / 10) * 10 + 10; // 如果>45%，圓整到10的倍數再+10
    }
    
    return { minBound, maxBound };
  };
  
  const { minBound: minY, maxBound: maxY } = calculateYBounds(dataMin, dataMax);
  const yRange = maxY - minY;
  
  // 動態生成Y軸刻度 (每10%一個刻度)
  const generateYTicks = () => {
    const ticks = [];
    const tickInterval = 10;
    const startTick = Math.ceil(minY / tickInterval) * tickInterval;
    
    for (let tick = startTick; tick <= maxY; tick += tickInterval) {
      ticks.push(tick);
    }
    return ticks;
  };
  
  const yTicks = generateYTicks();
  
  // 轉換數據點為SVG座標
  const points = data.map((d, i) => {
    const x = leftPadding + (i / (data.length - 1)) * chartWidth;
    const y = svgHeight - padding - ((d.headshotPercentage - minY) / yRange) * chartHeight;
    return { x, y, value: d.headshotPercentage, date: d.rawDate };
  });

  // 生成折線路徑
  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // 滑鼠事件處理函數
  const handleMouseEnter = (point: any, index: number, event: React.MouseEvent) => {
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
    const containerRect = (event.currentTarget as SVGElement).closest('.relative')?.getBoundingClientRect();
    
    if (containerRect) {
      setTooltip({
        x: rect.left - containerRect.left + 10,
        y: rect.top - containerRect.top - 10,
        value: point.value,
        visible: true
      });
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
    setHoveredIndex(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip.visible) {
      const containerRect = (event.currentTarget as SVGElement).closest('.relative')?.getBoundingClientRect();
      if (containerRect) {
        setTooltip(prev => ({
          ...prev,
          x: event.clientX - containerRect.left + 10,
          y: event.clientY - containerRect.top - 10
        }));
      }
    }
  };

  const handlePointClick = (point: any, index: number) => {
    // 點擊處理邏輯可以在此添加
  };

      return (
      <div className="h-32 w-full bg-dark-600 rounded-lg p-2">
        <div className="w-full h-full relative">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-full"
          onMouseMove={handleMouseMove}
        >
          <defs>
            {/* 簡潔設計 - 只保留必要元素 */}
          </defs>
          
          {/* Y軸刻度線和標籤 */}
          {yTicks.map((tick) => {
            const y = svgHeight - padding - ((tick - minY) / yRange) * chartHeight;
            return (
              <g key={tick}>
                {/* 簡潔的標籤 */}
                <text
                  x={leftPadding - 10}
                  y={y + 3}
                  fill="#9CA3AF"
                  fontSize="14"
                  fontWeight="400"
                  textAnchor="end"
                  className="font-sans"
                >
                  {tick}
                </text>
              </g>
            );
          })}
          
          {/* 簡潔的主折線 */}
          <path
            d={pathData}
            fill="none"
            stroke="#EF4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* 垂直指示線 */}
          {hoveredIndex !== null && (
            <line
              x1={points[hoveredIndex].x}
              y1={points[hoveredIndex].y}
              x2={points[hoveredIndex].x}
              y2={svgHeight - padding}
              stroke="#FFFFFF"
              strokeWidth="1"
              opacity="0.8"
            />
          )}
          
          {/* 懸停時的圓形點 */}
          {hoveredIndex !== null && (
            <circle
              cx={points[hoveredIndex].x}
              cy={points[hoveredIndex].y}
              r="3"
              fill="#FFFFFF"
              stroke="#EF4444"
              strokeWidth="1"
            />
          )}
          
          {/* 滑鼠事件處理區域 - 不可見 */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="8"
              fill="transparent"
              className="cursor-default"
              onMouseEnter={(e) => handleMouseEnter(point, i, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handlePointClick(point, i)}
            />
          ))}
        </svg>
        
        {/* 簡潔的 Tooltip - 放大版 */}
        {tooltip.visible && hoveredIndex !== null && (
          <div
            className="absolute z-20 bg-gray-800/95 text-white px-4 py-3 rounded-lg shadow-lg border border-gray-600/30 pointer-events-none"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translate(-50%, -100%)',
              height: '50px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 'max-content'
            }}
          >
            <div className="text-sm font-semibold text-white text-center">
              {tooltip.value}% HS
            </div>
            <div className="text-sm text-gray-300 text-center whitespace-nowrap">
              {new Date(data[hoveredIndex].rawDate).toLocaleDateString('zh-TW', {
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 