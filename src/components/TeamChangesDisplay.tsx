import { Time, TimeChange } from '@/types';

interface TeamChangesDisplayProps {
  timeChanges: TimeChange[];
  times: Time[];
  onRemove: (index: number) => void;
}

export function TeamChangesDisplay({ timeChanges, times, onRemove }: TeamChangesDisplayProps) {
  if (timeChanges.length === 0) return null;
  
  return (
    <div className="mt-4 bg-[#272731] p-6 rounded-lg">
      <h3 className="text-lg font-bold text-white mb-2">Alterações Adicionadas</h3>
      <div className="space-y-2">
        {timeChanges.map((change, index) => {
          const time = times.find(t => t.id === change.timeId);
          return (
            <div key={index} className="bg-[#1C1C24] p-3 rounded-lg flex justify-between items-center">
              <div>
                <span className="text-white font-medium">{time?.nome}</span>
                <ul className="text-gray-400 text-sm mt-1">
                  {(change as any).nome && <li>Nome: {(change as any).nome}</li>}
                  {(change as any).sigla && <li>Sigla: {(change as any).sigla}</li>}
                  {(change as any).cor && <li>Cor: {(change as any).cor}</li>}
                  {(change as any).instagram && <li>Instagram: {(change as any).instagram}</li>}
                  {(change as any).instagram2 && <li>@:: {(change as any).instagram2}</li>}
                  {(change as any).logo && <li>Logo: {(change as any).logo}</li>}
                  {(change as any).presidente && <li>Presidente: {(change as any).presidente}</li>}
                  {(change as any).head_coach && <li>Head Coach: {(change as any).head_coach}</li>}
                  {(change as any).coord_ofen && <li>Coord. Ofensivo: {(change as any).coord_ofen}</li>}
                  {(change as any).coord_defen && <li>Coord. Defensivo: {(change as any).coord_defen}</li>}
                </ul>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
              >
                Remover
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}