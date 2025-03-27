import React from 'react';

const SelectedChampions = ({
  team,
  champions,
  turns,
  turnIndex,
  isPickPhase,
  selectedChampion,
}) => {
  const nextSlotIndex = champions.length;
  const pickTeam = turns[turnIndex].team;
  const isActiveTurn =
    isPickPhase && (pickTeam === 'blue' || pickTeam === 'red');

  return (
    <>
      <div
        className={`flex rounded-lg border-2 flex-col justify-start h-[30px] w-full ${team === 'blue' ? 'bg-blue-600 border-blue-600/50' : 'bg-red-600 border-red-600/50'}`}
      >
        <h2 className='team-title text-xl font-bold text-white -mb-3 text-center first-letter:capitalize'>
          {team} Team
        </h2>
      </div>
      <div className='flex flex-col items-center mb-3 gap-3'>
        {[...Array(5)].map((_, index) => {
          const champion = champions[index];
          return (
            <div
              key={index}
              className={`flex justify-center rounded-lg w-24 h-24 bg-black/30 ${index === nextSlotIndex && isActiveTurn && pickTeam === team ? (pickTeam === 'blue' ? 'border-blue-600/50 border-4 animate-pulse' : 'border-red-600 border-4 animate-spin') : 'border-gray-500'}`}
            >
              {champion ? (
                <img
                  src={champion.image}
                  alt={champion.name}
                  className='max-w-full max-h-full object-cover rounded-md'
                />
              ) : index === nextSlotIndex && selectedChampion ? (
                <img
                  src={selectedChampion.image}
                  alt={selectedChampion.name}
                  className='max-w-full max-h-full object-cover rounded-md opacity-50'
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SelectedChampions;
