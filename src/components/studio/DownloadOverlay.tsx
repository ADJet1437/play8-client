import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toPng } from 'html-to-image';
import { TrainingPlanCard, DrillCard } from '../../types';
import TrainingPlanSnapshot from './TrainingPlanSnapshot';
import DrillCardSnapshot from './DrillCardSnapshot';

interface DownloadOverlayProps {
  plan: TrainingPlanCard;
  drills: DrillCard[];
  onProgress: (current: number, total: number) => void;
  onDone: () => void;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export default function DownloadOverlay({ plan, drills, onProgress, onDone }: DownloadOverlayProps) {
  const sorted = [...drills].sort((a, b) => a.drill_number - b.drill_number);
  const total = 1 + sorted.length;
  const base = sanitizeFilename(plan.title);

  const planRef = useRef<HTMLDivElement>(null);
  const drillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const didCapture = useRef(false);

  useEffect(() => {
    if (didCapture.current) return;
    didCapture.current = true;

    const capture = async () => {
      onProgress(0, total);

      // Plan card
      if (planRef.current) {
        const png = await toPng(planRef.current, { pixelRatio: 2, backgroundColor: '#ffffff' });
        triggerDownload(png, `${base}_plan.png`);
      }
      onProgress(1, total);

      // Drill cards
      for (let i = 0; i < sorted.length; i++) {
        const el = drillRefs.current[i];
        if (el) {
          await new Promise<void>((r) => setTimeout(r, 150));
          const png = await toPng(el, { pixelRatio: 2, backgroundColor: '#ffffff' });
          triggerDownload(png, `${base}_drill_${sorted[i].drill_number}.png`);
        }
        onProgress(2 + i, total);
      }

      onDone();
    };

    capture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
      }}
    >
      <div ref={planRef}>
        <TrainingPlanSnapshot card={plan} />
      </div>
      {sorted.map((drill, i) => (
        <div key={drill.drill_number} ref={(el) => { drillRefs.current[i] = el; }}>
          <DrillCardSnapshot card={drill} totalDrills={sorted.length} />
        </div>
      ))}
    </div>,
    document.body
  );
}
