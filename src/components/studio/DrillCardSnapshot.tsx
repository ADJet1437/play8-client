import { DrillCard, BallSettings } from '../../types';
import { CourtDiagram } from './CourtDiagram';

interface DrillCardSnapshotProps {
  card: DrillCard;
  totalDrills?: number;
}

export default function DrillCardSnapshot({ card, totalDrills }: DrillCardSnapshotProps) {
  const hasNewFormat = card.ball_sequence && card.ball_sequence.length > 0;

  const paramRows: { label: string; getValue: (b: BallSettings) => string }[] = [
    { label: 'Spin Type', getValue: (b) => b.spin_type },
    { label: 'Spin Strength', getValue: (b) => `${b.spin_strength}/10` },
    { label: 'Speed', getValue: (b) => `${b.speed}/10` },
    { label: 'Drop Point', getValue: (b) => String(b.drop_point) },
    { label: 'Depth', getValue: (b) => `${b.depth}/20` },
    { label: 'Feed (s)', getValue: (b) => String(b.feed) },
  ];

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        width: '600px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
          color: 'white',
          padding: '18px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 500, opacity: 0.9, marginBottom: '2px' }}>
              Drill {card.drill_number}
              {totalDrills ? ` (${card.drill_number}/${totalDrills})` : ''}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{card.title}</h2>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '4px 12px',
              fontSize: '13px',
              fontWeight: 500,
              marginLeft: '12px',
              whiteSpace: 'nowrap',
            }}
          >
            {card.duration}
          </div>
        </div>

        <p style={{ color: '#bfdbfe', margin: '4px 0 8px', fontSize: '13px' }}>{card.description}</p>

        {/* Focus Points */}
        {card.focus_points.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {card.focus_points.map((point, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ color: '#86efac', fontSize: '12px', marginTop: '1px', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '12px', color: '#eff6ff' }}>{point}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PongBot Settings label */}
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>
          PongBot Settings
        </div>
        {card.machine_position && (
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Machine Position: <strong>{card.machine_position}</strong>
          </div>
        )}
      </div>

      {/* Court Diagram */}
      {hasNewFormat && (
        <div style={{ padding: '10px 20px', background: '#f9fafb', margin: '10px 20px', borderRadius: '8px' }}>
          <CourtDiagram
            machinePosition={card.machine_position}
            ballSequence={card.ball_sequence}
          />
        </div>
      )}

      {/* Ball Sequence Table - New Format */}
      {hasNewFormat && (
        <div style={{ padding: '0 20px 16px', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th
                  style={{
                    padding: '8px 10px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    borderRight: '1px solid #e5e7eb',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Parameter
                </th>
                {card.ball_sequence!.map((ball) => (
                  <th
                    key={ball.ball_number}
                    style={{
                      padding: '8px 10px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: '#111827',
                      borderBottom: '1px solid #e5e7eb',
                      minWidth: '72px',
                    }}
                  >
                    Ball {ball.ball_number}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paramRows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? 'white' : '#f9fafb' }}>
                  <td
                    style={{
                      padding: '7px 10px',
                      fontWeight: 500,
                      color: '#374151',
                      borderRight: '1px solid #e5e7eb',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.label}
                  </td>
                  {card.ball_sequence!.map((ball) => (
                    <td
                      key={ball.ball_number}
                      style={{ padding: '7px 10px', textAlign: 'center', color: '#111827' }}
                    >
                      {row.getValue(ball)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legacy Format */}
      {!hasNewFormat && card.parameters && (
        <div style={{ padding: '16px 20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' }}>Parameter</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: '#6b7280', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' }}>Setting</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Spin', card.parameters.spin],
                ['Height', card.parameters.height],
                ['Distance', card.parameters.distance],
                ['Repetitions', `${card.parameters.repetitions} balls`],
                ['Location', card.parameters.location],
                ['Speed', card.parameters.speed],
              ].map(([label, value], i) => (
                <tr key={i} style={{ borderBottom: i < 5 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 500, color: '#111827' }}>{label}</td>
                  <td style={{ padding: '10px 16px', color: '#374151' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes */}
      {card.notes && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', padding: '10px 14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#854d0e', marginBottom: '4px' }}>Notes</div>
            <p style={{ margin: 0, fontSize: '13px', color: '#713f12' }}>{card.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          padding: '10px 20px',
          borderTop: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>play8</span>
      </div>
    </div>
  );
}
