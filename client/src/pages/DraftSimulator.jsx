import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SelectedChampions from '../components/SelectedChampions';
import ChampionGrid from '../components/ChampionGrid';
import BannedChampions from '../components/BannedChampions';

const API_URL =
  'https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json';

const ROLES = [
  'All',
  'Fighter',
  'Mage',
  'Assassin',
  'Tank',
  'Support',
  'Marksman',
];

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
  const [turnIndex, setTurnIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const [selectedRole, setSelectedRole] = useState('All');

  const [timer, setTimer] = useState(30);

  const [search, setSearch] = useState('');

  const [selectedChampion, setSelectedChampion] = useState(null);

  const isBanPhase = TURNS[turnIndex].action.toLowerCase().includes('ban');

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
    setTimer(5); // Reset timer when turn changes

    console.log(selectedChampion);

    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 1) {
          clearInterval(interval);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount or turn change
  }, [turnIndex, started]);

  useEffect(() => {
    if (timer === 0) {
      setTimeout(() => {
        if (selectedChampion) {
          console.log(
            'Timer expired with a selected champion, locking in:',
            selectedChampion.name
          );
          handleLockIn(); // Lock in the selected champion
        } else {
          console.log(
            'Timer expired with NO selected champion, auto-picking...'
          );
          handleAutoPick(); // Auto-pick and lock in
        }
      }, 5000); // 2-second timeout before switching turns
    }
  }, [timer]);

  const filteredChampions = champions.filter((champ) =>
    champ.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAutoPick = () => {
    console.log('AutoPick started, current selection:', selectedChampion?.name);

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

      console.log('Auto-picked:', randomChamp.name);

      setSelectedChampion(randomChamp);

      // Ensure the selected champion is locked in immediately after setting state
      setTimeout(() => {
        handleLockIn(randomChamp);
      }, 500);
    } else {
      handleLockIn(selectedChampion);
    }
  };

  const roleFilter = () => {
    return (
      <div className='role-filter'>
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`role-button ${selectedRole === role ? 'active' : ''}`}
          >
            {role}
          </button>
        ))}
      </div>
    );
  };

  const handleStartDraft = () => {
    setStarted(true);
    setFinished(false);
  };

  const handleEndDraft = () => {
    // setFinished(true);
  };

  const handleResetDraft = () => {
    setBlueTeam([]);
    setRedTeam([]);
    setTurnIndex(0); // Reset turnIndex
    setBlueBans([]); // Clear blue bans
    setRedBans([]); // Clear red bans
    setSelectedChampion(null); // Clear selected champion
    setPhase('ban'); // Reset phase to ban
    setStarted(true); // Reset started to false
    setFinished(false); // Reset finished to false
    setSearch(''); // Clear search bar
    setTimer(30); // Reset timer
  };

  const handleLockIn = () => {
    if (!selectedChampion) return;

    if (isBanPhase) {
      if (TURNS[turnIndex].team.toLowerCase() === 'blue') {
        setBlueBans([...blueBans, selectedChampion]);
      } else {
        setRedBans([...redBans, selectedChampion]);
      }
    } else {
      if (TURNS[turnIndex].team.toLowerCase() === 'blue') {
        console.log(selectedChampion);
        setBlueTeam([...blueTeam, selectedChampion]);
      } else {
        console.log(selectedChampion);
        setRedTeam([...redTeam, selectedChampion]);
      }
    }

    if (turnIndex + 1 < TURNS.length) {
      setTurnIndex(turnIndex + 1);
    } else {
      setTurnIndex(0);
      setPhase(phase + 1);
    }

    if (blueTeam.length == 5 && redTeam.length == 5) {
      handleEndDraft();
    }

    setSelectedChampion(null);
    setTurnIndex(turnIndex + 1);
  };

  return (
    <div>
      <Navbar handleResetDraft={handleResetDraft} />
      {!started ? (
        <div className='start-container'>
          <button
            className='start-button'
            onClick={handleStartDraft}
          >
            Start Draft
          </button>
        </div>
      ) : (
        <div className='draft-container'>
          <div className='ban-container'>
            <BannedChampions
              team={'blue'}
              bans={blueBans}
              turns={TURNS}
              turnIndex={turnIndex}
              isBanPhase={isBanPhase}
            />
            <div className='flex justify-end flex-col'>
              <div className='font-bold text-4xl'>
                <h2>{timer}</h2>
              </div>
              <input
                type='text'
                placeholder='Search...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='search-bar'
              />
            </div>
            <BannedChampions
              team={'red'}
              bans={redBans}
              turns={TURNS}
              turnIndex={turnIndex}
              isBanPhase={isBanPhase}
            />
          </div>
          <div className='phase-container'>
            <div className='blue-side'>
              <SelectedChampions
                team='blue'
                champions={blueTeam}
                turns={TURNS}
                turnIndex={turnIndex}
                isPickPhase={!isBanPhase}
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
                    selectedChampions={[...blueTeam, ...redTeam]}
                    bannedChampions={[...blueBans, ...redBans]}
                    filteredChampions={filteredChampions}
                    finished={finished}
                    selectedRole={selectedRole}
                  />
                </>
              )}
            </div>
            <div className='red-side'>
              <SelectedChampions
                team='red'
                champions={redTeam}
                turns={TURNS}
                turnIndex={turnIndex}
                isPickPhase={!isBanPhase}
              />
            </div>
            {/* Lock In Button - Appears when a champion is selected */}

            {selectedChampion && (
              <div className='lock-in-container'>
                <button
                  className='lock-in-button'
                  onClick={handleLockIn}
                >
                  {TURNS[turnIndex].action.toLowerCase().includes('ban')
                    ? 'Ban'
                    : 'Pick'}{' '}
                  {selectedChampion.name}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
