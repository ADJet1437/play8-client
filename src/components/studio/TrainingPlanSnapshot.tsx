import { TrainingPlanCard } from '../../types';

interface TrainingPlanSnapshotProps {
  card: TrainingPlanCard;
}

export default function TrainingPlanSnapshot({ card }: TrainingPlanSnapshotProps) {
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
          background: 'linear-gradient(to right, #16a34a, #15803d)',
          color: 'white',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, flex: 1 }}>{card.title}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '16px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '4px 12px',
                fontSize: '13px',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              {card.total_duration}
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '4px 12px',
                fontSize: '13px',
                fontWeight: 500,
                textAlign: 'center',
                textTransform: 'capitalize',
              }}
            >
              {card.difficulty}
            </div>
          </div>
        </div>
        <p style={{ color: '#bbf7d0', margin: 0, fontSize: '14px' }}>{card.description}</p>
      </div>

      {/* Drill List */}
      <div style={{ padding: '24px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#111827',
            marginTop: 0,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Training Drills
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {card.drills.map((drill, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: '30px',
                  height: '30px',
                  background: '#dcfce7',
                  color: '#15803d',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                  marginRight: '14px',
                }}
              >
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>{drill.name}</span>
                  <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '8px', whiteSpace: 'nowrap' }}>
                    {drill.duration}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>{drill.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 24px',
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
