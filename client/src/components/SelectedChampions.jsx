import React from 'react';
import { useState } from 'react';

function SelectedChampions({ team, champions, turnIndex }) {
  return (
    <>
      <div className={`selected-team ${team}-team`}>
        <h2 className='team-title'>{team.toUpperCase()} Team</h2>
      </div>
      <div className='champion-slots'>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`champion-slot`} // Highlight next slot
          >
            {champions[index] ? (
              <img
                src={champions[index].image}
                alt={champions[index].name}
                className='champion-selected'
              />
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

export default SelectedChampions;
