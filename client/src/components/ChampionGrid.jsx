import React from 'react';

function ChampionGrid({
  champions,
  selectedRole,
  setSelectedChampion,
  selectedChampions,
  bannedChampions,
  finished,
}) {
  const filteredChampions = champions.filter((champ) => {
    selectedRole === 'All' || champ.roles.includes(selectedRole);
  });

  return (
    <>
      <div className='champion-grid'>
        {champions.map((champ) => {
          const isDisabled =
            selectedChampions.includes(champ) ||
            bannedChampions.includes(champ);

          return (
            <button
              key={champ.name}
              onClick={() => !isDisabled && setSelectedChampion(champ)}
              className={`champion-button ${
                isDisabled ? 'champion-disabled' : ''
              }`}
              disabled={isDisabled || finished}
            >
              <img
                src={champ.image}
                alt={champ.name}
                className='champion-image'
              />
              <p className='champion-name'>{champ.name}</p>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default ChampionGrid;
