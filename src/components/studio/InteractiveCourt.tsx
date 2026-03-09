import { useRef, useState, useEffect } from 'react';
import { DrillCard } from '../../types';

interface InteractiveCourtProps {
  drill: DrillCard;
  onDrillUpdate: (updatedDrill: DrillCard) => void;
}

export function InteractiveCourt({ drill, onDrillUpdate }: InteractiveCourtProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggedBallIndex, setDraggedBallIndex] = useState<number | null>(null);

  // SVG dimensions - horizontal layout (landscape)
  const width = 600;
  const height = 300;
  const courtWidth = 550;
  const courtHeight = 260;
  const courtX = (width - courtWidth) / 2;
  const courtY = (height - courtHeight) / 2;

  // Map machine position to coordinates
  const getMachinePosition = (position: string): { x: number; y: number } => {
    const baselineX = courtX + 20;
    const centerY = courtY + courtHeight / 2;

    switch (position) {
      case 'Baseline Left Corner':
        return { x: baselineX, y: courtY + courtHeight * 0.85 };
      case 'Baseline Right Corner':
        return { x: baselineX, y: courtY + courtHeight * 0.15 };
      case 'Baseline Center':
      default:
        return { x: baselineX, y: centerY };
    }
  };

  // Map drop point and depth to SVG coordinates
  const mapParamsToCoords = (dropPoint: number, depth: number): { x: number; y: number } => {
    const netX = courtX + courtWidth / 2;
    const oppositeBaselineX = courtX + courtWidth - 20;
    const depthRatio = depth / 20;
    const x = netX + (oppositeBaselineX - netX) * depthRatio;

    const horizontalRatio = (dropPoint + 10) / 20;
    const y = courtY + courtHeight * (1 - horizontalRatio);

    return { x, y };
  };

  // Map SVG coordinates to drop point and depth
  const mapCoordsToParams = (x: number, y: number): { dropPoint: number; depth: number } => {
    const netX = courtX + courtWidth / 2;
    const oppositeBaselineX = courtX + courtWidth - 20;

    // Calculate depth (0-20)
    const depthRatio = (x - netX) / (oppositeBaselineX - netX);
    const depth = Math.round(depthRatio * 20);

    // Calculate drop_point (-10 to +10)
    const horizontalRatio = (courtY + courtHeight - y) / courtHeight;
    const dropPoint = Math.round(horizontalRatio * 20 - 10);

    return { dropPoint, depth };
  };

  // Handle machine click (cycle through positions)
  const handleMachineClick = () => {
    const positions = ['Baseline Center', 'Baseline Left Corner', 'Baseline Right Corner'];
    const currentIndex = positions.indexOf(drill.machine_position || 'Baseline Center');
    const nextPos = positions[(currentIndex + 1) % 3];
    onDrillUpdate({ ...drill, machine_position: nextPos });
  };

  // Handle ball drag start (mouse)
  const handleBallDragStart = (ballIndex: number, e: React.MouseEvent<SVGCircleElement>) => {
    e.preventDefault();
    setDraggedBallIndex(ballIndex);
  };

  // Handle ball drag start (touch)
  const handleBallTouchStart = (ballIndex: number, e: React.TouchEvent<SVGCircleElement>) => {
    e.preventDefault();
    setDraggedBallIndex(ballIndex);
  };

  // Update ball position from client coordinates
  const updateBallPosition = (clientX: number, clientY: number) => {
    if (draggedBallIndex === null || !svgRef.current || !drill.ball_sequence) return;

    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const svgCoords = point.matrixTransform(svg.getScreenCTM()!.inverse());

    // Constrain to court bounds
    const constrainedX = Math.max(courtX, Math.min(courtX + courtWidth, svgCoords.x));
    const constrainedY = Math.max(courtY, Math.min(courtY + courtHeight, svgCoords.y));

    const { dropPoint, depth } = mapCoordsToParams(constrainedX, constrainedY);

    // Update ball parameters
    const updatedBalls = [...drill.ball_sequence];
    updatedBalls[draggedBallIndex] = {
      ...updatedBalls[draggedBallIndex],
      drop_point: Math.max(-10, Math.min(10, dropPoint)),
      depth: Math.max(0, Math.min(20, depth))
    };

    onDrillUpdate({ ...drill, ball_sequence: updatedBalls });
  };

  // Handle ball drag (mouse)
  const handleMouseMove = (e: MouseEvent) => {
    updateBallPosition(e.clientX, e.clientY);
  };

  // Handle ball drag (touch)
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      updateBallPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Handle ball drag end
  const handleDragEnd = () => {
    setDraggedBallIndex(null);
  };

  // Attach/detach event listeners
  useEffect(() => {
    if (draggedBallIndex !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [draggedBallIndex, drill]);

  const machinePos = getMachinePosition(drill.machine_position || 'Baseline Center');

  if (!drill.ball_sequence || drill.ball_sequence.length === 0) {
    return <div className="flex items-center justify-center p-8 text-gray-500">No ball sequence data</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="border-2 border-gray-300 rounded-lg bg-white max-w-full max-h-full"
        style={{ width: '100%', height: 'auto', maxWidth: `${width}px` }}
      >
        {/* Court surface */}
        <rect
          x={courtX}
          y={courtY}
          width={courtWidth}
          height={courtHeight}
          fill="#4ade80"
          stroke="white"
          strokeWidth="4"
        />

        {/* Center line (net) */}
        <line
          x1={courtX + courtWidth / 2}
          y1={courtY}
          x2={courtX + courtWidth / 2}
          y2={courtY + courtHeight}
          stroke="white"
          strokeWidth="3"
        />

        {/* Service lines */}
        <line
          x1={courtX + courtWidth * 0.25}
          y1={courtY}
          x2={courtX + courtWidth * 0.25}
          y2={courtY + courtHeight}
          stroke="white"
          strokeWidth="2"
        />
        <line
          x1={courtX + courtWidth * 0.75}
          y1={courtY}
          x2={courtX + courtWidth * 0.75}
          y2={courtY + courtHeight}
          stroke="white"
          strokeWidth="2"
        />

        {/* Center service line */}
        <line
          x1={courtX + courtWidth * 0.25}
          y1={courtY + courtHeight / 2}
          x2={courtX + courtWidth * 0.75}
          y2={courtY + courtHeight / 2}
          stroke="white"
          strokeWidth="2"
        />

        {/* Singles sidelines */}
        <line
          x1={courtX}
          y1={courtY + courtHeight * 0.15}
          x2={courtX + courtWidth}
          y2={courtY + courtHeight * 0.15}
          stroke="white"
          strokeWidth="2"
          strokeDasharray="8,8"
          opacity="0.6"
        />
        <line
          x1={courtX}
          y1={courtY + courtHeight * 0.85}
          x2={courtX + courtWidth}
          y2={courtY + courtHeight * 0.85}
          stroke="white"
          strokeWidth="2"
          strokeDasharray="8,8"
          opacity="0.6"
        />

        {/* Ball trajectories and drop points */}
        {drill.ball_sequence.map((ball, index) => {
          const dropPos = mapParamsToCoords(ball.drop_point, ball.depth);
          const isBeingDragged = draggedBallIndex === index;

          return (
            <g key={index}>
              {/* Trajectory line */}
              <line
                x1={machinePos.x}
                y1={machinePos.y}
                x2={dropPos.x}
                y2={dropPos.y}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="6,6"
                opacity={isBeingDragged ? "0.8" : "0.5"}
              />

              {/* Drop point marker (draggable) */}
              <circle
                cx={dropPos.x}
                cy={dropPos.y}
                r={isBeingDragged ? "16" : "14"}
                fill="#dc2626"
                stroke="white"
                strokeWidth="2"
                className="cursor-move hover:opacity-80 transition-all"
                onMouseDown={(e) => handleBallDragStart(index, e)}
                onTouchStart={(e) => handleBallTouchStart(index, e)}
                style={{ cursor: 'move', touchAction: 'none' }}
              />
              <text
                x={dropPos.x}
                y={dropPos.y + 5}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontWeight="600"
                pointerEvents="none"
              >
                {ball.ball_number}
              </text>
            </g>
          );
        })}

        {/* Machine position (clickable to cycle) */}
        <g onClick={handleMachineClick} className="cursor-pointer" style={{ cursor: 'pointer', touchAction: 'manipulation' }}>
          <circle
            cx={machinePos.x}
            cy={machinePos.y}
            r="12"
            fill="#f59e0b"
            stroke="white"
            strokeWidth="2"
            style={{ touchAction: 'manipulation' }}
          />
          <text
            x={machinePos.x}
            y={machinePos.y + 4}
            textAnchor="middle"
            fontSize="11"
            fill="white"
            fontWeight="600"
            pointerEvents="none"
          >
            M
          </text>
        </g>
      </svg>
    </div>
  );
}
