import React from 'react';

const SelectedChampions = ({
  team,
  champions,
  turns,
  turnIndex,
  isPickPhase,
}) => {
  const nextSlotIndex = champions.length;
  const pickTeam = turns[turnIndex].team;
  const isActiveTurn =
    isPickPhase && (pickTeam === 'blue' || pickTeam === 'red');

  return (
    <>
      <div
        className={`selected-team flex justify-center items-center text-center p-2 rounded-lg border-2 w-[200px] ${team === 'blue' ? 'bg-blue-500 border-blue-500/50' : 'bg-red-500 border-red-500'}`}
      >
        <h2 className='team-titletext-xl font-bold text-white -mb-3 text-center'>
          {team.toUpperCase()} Team
        </h2>
      </div>
      <div className='flex flex-col items-center mb-3 gap-3'>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`flex justify-center rounded-lg w-24 h-24 bg-black/30 ${index === nextSlotIndex && isActiveTurn && pickTeam === team ? (pickTeam === 'blue' ? 'border-blue-500 shadow-lg shadow-blue-500' : 'border-red-500 shadow-lg shadow-red-500') : 'border-gray-500'}`}
          >
            {champions[index] ? (
              <img
                src={champions[index].image}
                alt={champions[index].name}
                className='max-w-full max-h-full object-cover rounded-md'
              />
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
};

export default SelectedChampions;
