import { DrillCard } from '../../types';

interface EditableParameterTableProps {
  drill: DrillCard;
  onUpdate: (updatedDrill: DrillCard) => void;
}

export function EditableParameterTable({ drill, onUpdate }: EditableParameterTableProps) {
  const handleParamChange = (ballIndex: number, field: string, value: string | number) => {
    if (!drill.ball_sequence) return;
    const updatedBalls = [...drill.ball_sequence];
    updatedBalls[ballIndex] = {
      ...updatedBalls[ballIndex],
      [field]: value
    };
    onUpdate({ ...drill, ball_sequence: updatedBalls });
  };

  if (!drill.ball_sequence || drill.ball_sequence.length === 0) {
    return <div className="p-4 text-gray-500">No ball sequence data</div>;
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
        <h3 className="font-semibold text-sm md:text-lg">Ball Parameters</h3>
        <span className="text-xs text-gray-500">
          Drag balls on court or edit values below
        </span>
      </div>

      <div className="overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
        <table className="min-w-full text-xs border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 md:px-3 py-1.5 md:py-2 text-left font-semibold text-gray-700 border-b border-r border-gray-200 sticky left-0 bg-gray-50 z-10">
                Parameter
              </th>
              {drill.ball_sequence.map((ball) => (
                <th
                  key={ball.ball_number}
                  className="px-2 md:px-3 py-1.5 md:py-2 text-center font-semibold text-gray-900 border-b border-gray-200 min-w-[70px] md:min-w-[80px]"
                >
                  Ball {ball.ball_number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Spin Type - editable dropdown */}
            <tr>
              <td className="px-2 md:px-3 py-1.5 md:py-2 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                Spin Type
              </td>
              {drill.ball_sequence.map((ball, idx) => (
                <td key={ball.ball_number} className="px-1 md:px-2 py-1 md:py-1.5 text-center">
                  <select
                    value={ball.spin_type}
                    onChange={(e) => handleParamChange(idx, 'spin_type', e.target.value)}
                    className="w-full px-1 md:px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Topspin</option>
                    <option>No Spin</option>
                    <option>Underspin</option>
                  </select>
                </td>
              ))}
            </tr>

            {/* Spin Strength - editable input */}
            <tr>
              <td className="px-2 md:px-3 py-1.5 md:py-2 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                Spin Strength
              </td>
              {drill.ball_sequence.map((ball, idx) => (
                <td key={ball.ball_number} className="px-1 md:px-2 py-1 md:py-1.5 text-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={ball.spin_strength}
                    onChange={(e) => handleParamChange(idx, 'spin_strength', parseInt(e.target.value) || 0)}
                    className="w-full px-1 md:px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              ))}
            </tr>

            {/* Speed - editable input */}
            <tr>
              <td className="px-2 md:px-3 py-1.5 md:py-2 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                Speed
              </td>
              {drill.ball_sequence.map((ball, idx) => (
                <td key={ball.ball_number} className="px-1 md:px-2 py-1 md:py-1.5 text-center">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={ball.speed}
                    onChange={(e) => handleParamChange(idx, 'speed', parseInt(e.target.value) || 0)}
                    className="w-full px-1 md:px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              ))}
            </tr>

            {/* Drop Point - READ-ONLY (updated by dragging) */}
            <tr>
              <td className="px-2 md:px-3 py-1.5 md:py-2 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                Drop Point
              </td>
              {drill.ball_sequence.map((ball) => (
                <td
                  key={ball.ball_number}
                  className="px-1 md:px-2 py-1 md:py-1.5 text-center text-gray-900 bg-blue-50 font-medium"
                  title="Drag ball on court to change"
                >
                  {ball.drop_point}
                </td>
              ))}
            </tr>

            {/* Depth - READ-ONLY (updated by dragging) */}
            <tr>
              <td className="px-2 md:px-3 py-1.5 md:py-2 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                Depth
              </td>
              {drill.ball_sequence.map((ball) => (
                <td
                  key={ball.ball_number}
                  className="px-1 md:px-2 py-1 md:py-1.5 text-center text-gray-900 bg-blue-50 font-medium"
                  title="Drag ball on court to change"
                >
                  {ball.depth}/20
                </td>
              ))}
            </tr>

            {/* Feed Interval - editable input */}
            <tr>
              <td className="px-2 md:px-3 py-1.5 md:py-2 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                Feed (s)
              </td>
              {drill.ball_sequence.map((ball, idx) => (
                <td key={ball.ball_number} className="px-1 md:px-2 py-1 md:py-1.5 text-center">
                  <input
                    type="number"
                    min="0.8"
                    max="5.0"
                    step="0.1"
                    value={ball.feed}
                    onChange={(e) => handleParamChange(idx, 'feed', parseFloat(e.target.value) || 0.8)}
                    className="w-full px-1 md:px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 space-y-1 hidden sm:block">
        <p>💡 <strong>Tip:</strong> Blue highlighted fields (Drop Point, Depth) are updated by dragging balls on the court.</p>
        <p>✏️ Other fields can be edited directly in the table.</p>
      </div>
    </div>
  );
}
