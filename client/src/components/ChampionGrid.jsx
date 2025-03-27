import React from 'react';

function ChampionGrid({
  champions,
  selectedRole,
  setSelectedChampion,
  selectedChampions,
  bannedChampions,
  search,
  champRef,
  finished,
}) {
  const filteredChampions = champions.filter((champ) =>
    champ.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className='grid grid-cols-6 w-full max-w-screen-lg max-h-180 overflow-y-scroll justify-center'>
        {filteredChampions.map((champ) => {
          const isDisabled =
            selectedChampions.includes(champ) ||
            bannedChampions.includes(champ);

          return (
            <button
              ref={champRef}
              key={champ.name}
              onClick={() => setSelectedChampion(champ)}
              className={`champion-button bg-transparent border-none cursor-pointer transition-transform duration-200 ease-in-out hover:scale-108 ${
                isDisabled
                  ? `grayscale-100 brightness-75 scale-95 pointer-events-none opacity-75`
                  : ''
              }`}
              disabled={isDisabled || finished}
            >
              <img
                src={champ.image}
                alt={champ.name}
                className='champion-image'
              />
              <p className='champion-name text-center text-white'>
                {champ.name}
              </p>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default ChampionGrid;
