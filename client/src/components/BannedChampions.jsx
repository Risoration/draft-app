import React from 'react';
import nochamp from '../assets/nochamp.jpg';

const BannedChampions = ({ team, bans, turns, turnIndex, isBanPhase }) => {
  const nextSlotIndex = bans.length;

  const banTeam = turns[turnIndex].team;
  const isActiveTurn = isBanPhase && (banTeam === 'blue' || banTeam === 'red');
  return (
    <>
      <div className='flex flex-row gap-2 m-3'>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`flex justify-center items-center bg-black/30 w-20 h-20 rounded-lg border-solid border-black ${index === nextSlotIndex && isActiveTurn && banTeam === team ? (banTeam === 'blue' ? 'border-blue-500 shadow-md shadow-blue-500' : 'border-red-500 shadow-md shadow-red-500') : 'border-black'}`}
          >
            {bans[index] && bans[index] != 'none' ? (
              <img
                src={`${bans[index] === 'none' ? nochamp : bans[index].image}`}
                alt={`${bans[index] === 'none' ? bans[index] : bans[index].name}`}
                className='max-w-full max-h-full object-contain'
              />
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
};

export default BannedChampions;
