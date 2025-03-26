import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import SelectedChampions from '../components/SelectedChampions';
import ChampionGrid from '../components/ChampionGrid';
import BannedChampions from '../components/BannedChampions';
import Filterbar from '../components/Filterbar';

const API_URL =
  'https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json';

const TURNS = [
  { team: 'blue', action: 'Ban 1' },
  { team: 'red', action: 'Ban 1' },
  { team: 'blue', action: 'Ban 2' },
  { team: 'red', action: 'Ban 2' },
  { team: 'blue', action: 'Ban 3' },
  { team: 'red', action: 'Ban 3' },
  { team: 'blue', action: 'Pick 1' },
  { team: 'red', action: 'Pick 1' },
  { team: 'red', action: 'Pick 2' },
  { team: 'blue', action: 'Pick 2' },
  { team: 'blue', action: 'Pick 3' },
  { team: 'red', action: 'Pick 3' },
  { team: 'blue', action: 'Ban 4' },
  { team: 'red', action: 'Ban 4' },
  { team: 'blue', action: 'Ban 5' },
  { team: 'red', action: 'Ban 5' },
  { team: 'red', action: 'Pick 4' },
  { team: 'blue', action: 'Pick 4' },
  { team: 'blue', action: 'Pick 5' },
  { team: 'red', action: 'Pick 5' },
];

export default function DraftSimulator() {
  const [champions, setChampions] = useState([]);
  const [blueBans, setBlueBans] = useState([]);
  const [redBans, setRedBans] = useState([]);
  const [blueTeam, setBlueTeam] = useState([]);
  const [redTeam, setRedTeam] = useState([]);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const [selectedRole, setSelectedRole] = useState('All');

  const [timer, setTimer] = useState('30');

  const [search, setSearch] = useState('');

  const [selectedChampion, setSelectedChampion] = useState(null);

  const champRef = useRef(null);
  const indexRef = useRef(0);
  const isBanPhase = TURNS[indexRef.current].action
    .toLowerCase()
    .includes('ban')
    ? true
    : finished === true
      ? false
      : false;

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const champs = Object.values(data.data).map((champ) => ({
          name: champ.name,
          image: `https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champ.image.full}`,
          roles: champ.tags,
        }));
        setChampions(champs);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching champions:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (finished) {
      return;
    }

    setTimer('10'); // Reset timer when turn changes
    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 1) {
          clearInterval(interval);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount or turn change
  }, [indexRef.current, started]);

  useEffect(() => {
    while (loading) {
      return;
    }
    if (timer === 0) {
      setTimeout(() => {
        if (selectedChampion) {
          handleLockIn(); // Lock in the selected champion
        } else {
          handleAutoPick(); // Auto-pick and lock in
        }
      }, 2000); // 2-second timeout before switching turns
    }
  }, [timer]);

  const handleEndTurn = () => {
    console.log(indexRef.current + 1, TURNS.length);
    console.log(indexRef.current + 1 < TURNS.length);
    if (indexRef.current + 1 < TURNS.length) {
      indexRef.current += 1;
    } else if (indexRef.current + 1 === TURNS.length) {
      console.log('end draft');
      handleEndDraft();
    } else {
      setPhase(phase + 1);
    }

    setSelectedChampion(null);
    champRef.current = null;
  };

  const handleAutoPick = () => {
    if (!selectedChampion) {
      const availableChamps = champions.filter(
        (champ) =>
          !blueTeam.includes(champ) &&
          !redTeam.includes(champ) &&
          !blueBans.includes(champ) &&
          !redBans.includes(champ)
      );

      if (availableChamps.length === 0) return;

      const randomChamp =
        availableChamps[Math.floor(Math.random() * availableChamps.length)];

      champRef.current = randomChamp;
    }
    // Ensure the selected champion is locked in immediately after setting state
    handleAutoLockIn();
  };

  const handleAutoLockIn = () => {
    console.log(champRef.current);
    if (isBanPhase) {
      if (TURNS[indexRef.current].team.toLowerCase() === 'blue') {
        setBlueBans([...blueBans, champRef.current]);
      } else {
        setRedBans([...redBans, champRef.current]);
      }
    } else {
      if (TURNS[indexRef.current].team.toLowerCase() === 'blue') {
        setBlueTeam([...blueTeam, champRef.current]);
      } else {
        setRedTeam([...redTeam, champRef.current]);
      }
    }
    handleEndTurn();
  };

  const handleStartDraft = () => {
    setBlueTeam([]);
    setRedTeam([]);
    indexRef.current = 0; // Reset indexRef
    setBlueBans([]); // Clear blue bans
    setRedBans([]); // Clear red bans
    setSelectedChampion(null); // Clear selected champion
    setPhase('ban'); // Reset phase to ban
    setStarted(true); // Reset started to false
    setFinished(false); // Reset finished to false
    setSearch(''); // Clear search bar
    setTimer('10'); // Reset timer
  };

  const handleResetDraft = () => {
    setBlueTeam([]);
    setRedTeam([]);
    indexRef.current = 0; // Reset indexRef
    setBlueBans([]); // Clear blue bans
    setRedBans([]); // Clear red bans
    setSelectedChampion(null); // Clear selected champion
    setPhase('ban'); // Reset phase to ban
    setStarted(true); // Reset started to false
    setFinished(false); // Reset finished to false
    setSearch(''); // Clear search bar
    setTimer('10'); // Reset timer
  };

  const handleEndDraft = () => {
    setFinished(true);
    setTimer('Finished');
  };

  const handleLockIn = () => {
    if (isBanPhase) {
      if (TURNS[indexRef.current].team.toLowerCase() === 'blue') {
        setBlueBans([...blueBans, selectedChampion]);
      } else {
        setRedBans([...redBans, selectedChampion]);
      }
    } else {
      if (TURNS[indexRef.current].team.toLowerCase() === 'blue') {
        setBlueTeam([...blueTeam, selectedChampion]);
      } else {
        setRedTeam([...redTeam, selectedChampion]);
      }
    }
    handleEndTurn();
  };

  return (
    <div>
      <Navbar
        handleResetDraft={handleResetDraft}
        handleStartDraft={handleStartDraft}
        started={started}
      />
      {started && (
        <div className='flex flex-col justify-between'>
          <div className='flex w-full justify-between flex-row gap-2.5'>
            <BannedChampions
              team={'blue'}
              bans={blueBans}
              turns={TURNS}
              turnIndex={indexRef.current}
              isBanPhase={isBanPhase}
              selectedChampion={
                TURNS[indexRef.current].team.toLowerCase() === 'blue' &&
                isBanPhase
                  ? selectedChampion
                  : null
              }
            />
            <div className='flex justify-between flex-col'>
              <h2 className='font-bold text-4xl'>{timer}</h2>
              <Filterbar search={search} setSearch={setSearch} />
            </div>
            <BannedChampions
              team={'red'}
              bans={redBans}
              turns={TURNS}
              turnIndex={indexRef.current}
              isBanPhase={isBanPhase}
              selectedChampion={
                TURNS[indexRef.current].team.toLowerCase() === 'red' &&
                isBanPhase
                  ? selectedChampion
                  : null
              }
            />
          </div>
          <div className='flex flex-row justify-between'>
            <div className='flex flex-col w-60 gap-2.5 m-2.5 h-fit sticky items-start'>
              <SelectedChampions
                team='blue'
                champions={blueTeam}
                turns={TURNS}
                turnIndex={indexRef.current}
                isPickPhase={!isBanPhase}
                selectedChampion={
                  TURNS[indexRef.current].team.toLowerCase() === 'blue' &&
                  !isBanPhase
                    ? selectedChampion
                    : null
                }
              />
            </div>

            <div className='flex justify-center items-center flex-col w-full max-w-full'>
              {loading ? (
                <p>Loading champions...</p>
              ) : (
                <>
                  <ChampionGrid
                    champions={champions}
                    setSelectedChampion={setSelectedChampion}
                    champRef={champRef}
                    selectedChampions={[...blueTeam, ...redTeam]}
                    bannedChampions={[...blueBans, ...redBans]}
                    search={search}
                    setSearch={setSearch}
                    finished={finished}
                    selectedRole={selectedRole}
                  />
                </>
              )}
            </div>
            <div className='flex flex-col w-60 gap-2.5 m-2.5 h-fit sticky items-end'>
              <SelectedChampions
                team='red'
                champions={redTeam}
                turns={TURNS}
                turnIndex={indexRef.current}
                isPickPhase={!isBanPhase}
                selectedChampion={
                  TURNS[indexRef.current].team.toLowerCase() === 'red' &&
                  !isBanPhase
                    ? selectedChampion
                    : null
                }
              />
            </div>
            {selectedChampion && (
              <div>
                <button
                  className='fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#ffffff] p-2.5 px-10 w-52 h-13 text-2xl rounded-b-md cursor-pointer transition hover:scale-110'
                  onClick={handleLockIn}
                >
                  {TURNS[indexRef.current].action.toLowerCase().includes('ban')
                    ? 'Ban'
                    : 'Pick'}{' '}
                  {selectedChampion.name}
                </button>
              </div>
            )}
            <button onClick={handleEndDraft}></button>
          </div>
        </div>
      )}
    </div>
  );
}
