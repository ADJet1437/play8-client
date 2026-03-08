import { BallSettings } from '../../types';

interface CourtDiagramProps {
  machinePosition?: string; // "Baseline Center", "Baseline Left Corner", "Baseline Right Corner"
  ballSequence?: BallSettings[];
}

export function CourtDiagram({ machinePosition = 'Baseline Center', ballSequence = [] }: CourtDiagramProps) {
  // SVG dimensions - horizontal layout (landscape) - compact
  const width = 420;
  const height = 160;

  // Court dimensions - horizontal (length x width)
  const courtWidth = 390; // Court length (baseline to baseline)
  const courtHeight = 140; // Court width
  const courtX = (width - courtWidth) / 2;
  const courtY = (height - courtHeight) / 2;

  // Map machine position to coordinates (on left baseline)
  const getMachinePosition = (): { x: number; y: number } => {
    const baselineX = courtX + 10; // Left baseline
    const centerY = courtY + courtHeight / 2;

    switch (machinePosition) {
      case 'Baseline Left Corner':
        return { x: baselineX, y: courtY + courtHeight * 0.85 }; // Near bottom corner
      case 'Baseline Right Corner':
        return { x: baselineX, y: courtY + courtHeight * 0.15 }; // Near top corner
      case 'Baseline Center':
      default:
        return { x: baselineX, y: centerY };
    }
  };

  // Map drop point coordinates to court position
  const getDropPointPosition = (dropPoint: number, depth: number): { x: number; y: number } => {
    // dropPoint: -10 to +10 → map to court HEIGHT (vertical position in horizontal court)
    // depth: 0 to 20 → map to court WIDTH (horizontal position from net to baseline)

    // depth: 0 = net (center), 20 = opposite baseline (right side)
    const netX = courtX + courtWidth / 2;
    const oppositeBaselineX = courtX + courtWidth - 10;
    const depthRatio = depth / 20; // 0..20 to 0..1
    const x = netX + (oppositeBaselineX - netX) * depthRatio;

    // dropPoint: -10 (top/far) to +10 (bottom/near) when viewing horizontally
    const horizontalRatio = (dropPoint + 10) / 20; // Convert -10..10 to 0..1
    const y = courtY + courtHeight * (1 - horizontalRatio); // Inverted so -10 is top

    return { x, y };
  };

  const machinePos = getMachinePosition();

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* Court surface */}
      <rect
        x={courtX}
        y={courtY}
        width={courtWidth}
        height={courtHeight}
        fill="#4ade80"
        stroke="white"
        strokeWidth="3"
      />

      {/* Center line (net) - vertical in horizontal court */}
      <line
        x1={courtX + courtWidth / 2}
        y1={courtY}
        x2={courtX + courtWidth / 2}
        y2={courtY + courtHeight}
        stroke="white"
        strokeWidth="2"
      />

      {/* Service lines - vertical lines */}
      <line
        x1={courtX + courtWidth * 0.25}
        y1={courtY}
        x2={courtX + courtWidth * 0.25}
        y2={courtY + courtHeight}
        stroke="white"
        strokeWidth="1.5"
      />
      <line
        x1={courtX + courtWidth * 0.75}
        y1={courtY}
        x2={courtX + courtWidth * 0.75}
        y2={courtY + courtHeight}
        stroke="white"
        strokeWidth="1.5"
      />

      {/* Center service line - horizontal */}
      <line
        x1={courtX + courtWidth * 0.25}
        y1={courtY + courtHeight / 2}
        x2={courtX + courtWidth * 0.75}
        y2={courtY + courtHeight / 2}
        stroke="white"
        strokeWidth="1.5"
      />

      {/* Singles sidelines (inner lines) - horizontal */}
      <line
        x1={courtX}
        y1={courtY + courtHeight * 0.15}
        x2={courtX + courtWidth}
        y2={courtY + courtHeight * 0.15}
        stroke="white"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        opacity="0.6"
      />
      <line
        x1={courtX}
        y1={courtY + courtHeight * 0.85}
        x2={courtX + courtWidth}
        y2={courtY + courtHeight * 0.85}
        stroke="white"
        strokeWidth="1.5"
        strokeDasharray="5,5"
        opacity="0.6"
      />

      {/* Ball machine position */}
      <g>
        <circle
          cx={machinePos.x}
          cy={machinePos.y}
          r="6"
          fill="#f59e0b"
          stroke="white"
          strokeWidth="2"
        />
        <text
          x={machinePos.x - 15}
          y={machinePos.y + 4}
          textAnchor="middle"
          fontSize="10"
          fill="#1f2937"
          fontWeight="600"
        >
          M
        </text>
      </g>

      {/* Ball drop points and trajectories */}
      {ballSequence.map((ball, index) => {
        const dropPos = getDropPointPosition(ball.drop_point, ball.depth);

        return (
          <g key={index}>
            {/* Trajectory line */}
            <line
              x1={machinePos.x}
              y1={machinePos.y}
              x2={dropPos.x}
              y2={dropPos.y}
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              opacity="0.6"
            />

            {/* Drop point marker - Circle with ball number */}
            <g>
              <circle
                cx={dropPos.x}
                cy={dropPos.y}
                r="8"
                fill="#dc2626"
                stroke="white"
                strokeWidth="1.5"
              />
              <text
                x={dropPos.x}
                y={dropPos.y + 3.5}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="600"
              >
                {ball.ball_number}
              </text>
            </g>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${courtX + courtWidth - 85}, ${courtY + 10})`}>
        <rect x="0" y="0" width="75" height="30" fill="white" opacity="0.95" rx="4" />
        <circle cx="8" cy="10" r="3" fill="#f59e0b" stroke="white" strokeWidth="1" />
        <text x="15" y="13" fontSize="9" fill="#1f2937">Machine</text>
        <g transform="translate(0, 16)">
          <circle cx="8" cy="3" r="4" fill="#dc2626" stroke="white" strokeWidth="1" />
          <text x="8" y="5.5" textAnchor="middle" fontSize="7" fill="white" fontWeight="600">1-6</text>
          <text x="15" y="6" fontSize="9" fill="#1f2937">Balls</text>
        </g>
      </g>
    </svg>
  );
}
