import React from 'react';

const BannedChampions = ({
  team,
  bans,
  turns,
  turnIndex,
  isBanPhase,
  selectedChampion,
}) => {
  const nextSlotIndex = bans.length;

  const banTeam = turns[turnIndex].team;
  const isActiveTurn = isBanPhase && (banTeam === 'blue' || banTeam === 'red');
  return (
    <>
      <div className='flex flex-row gap-2 m-3'>
        {[...Array(5)].map((_, index) => {
          const ban = bans[index];
          return (
            <div
              key={index}
              className={`flex justify-center items-center bg-black/30 w-20 h-20 rounded-lg border-solid border-black ${index === nextSlotIndex && isActiveTurn && banTeam === team ? (banTeam === 'blue' ? 'border-blue-600 border-4 animate-pulse' : 'border-red-600 border-4 animate-pulse') : 'border-black'}`}
            >
              {ban ? (
                <img
                  src={`${index === nextSlotIndex ? selectedChampion.image : bans[index].image}`}
                  alt={`${bans[index].name}`}
                  className='max-w-full max-h-full object-contain'
                />
              ) : index == nextSlotIndex && selectedChampion ? (
                <img
                  src={selectedChampion.image}
                  alt={selectedChampion.name}
                  className='max-w-full max-h-full object-contain opacity-50'
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BannedChampions;
