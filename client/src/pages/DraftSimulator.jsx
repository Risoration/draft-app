import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SelectedChampions from '../components/SelectedChampions';
import ChampionGrid from '../components/ChampionGrid';

const API_URL =
  'https://ddragon.leagueoflegends.com/cdn/15.5.1/data/en_US/champion.json';

const PHASES = ['Ban Phase 1', 'Pick Phase 1', 'Ban Phase 2', 'Pick Phase 2'];

const ROLES = [
  'All',
  'Fighter',
  'Mage',
  'Assassin',
  'Tank',
  'Support',
  'Marksman',
];

const BAN_ORDER = ['blue', 'red', 'blue', 'red', 'blue', 'red'];

const PICK_ORDER = [
  'blue', // Pick Phase 1 ends
  'red',
  'red',
  'blue',
  'blue',
  'red', // Pick Phase 2 ends
  'red',
  'blue',
  'blue',
  'red',
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
  const [nextPick, setNextPick] = useState({ team: 'blue', index: 0 });

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

    setNextPick({ team: TURNS[0].team, action: 0 });
  }, []);

  useEffect(() => {
    setTimer(30); // Reset timer when turn changes

    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 0) {
          clearInterval(interval);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount or turn change
  }, [turnIndex]);

  const filteredChampions = champions.filter((champ) =>
    champ.name.toLowerCase().includes(search.toLowerCase())
  );

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
    setFinished(true);
  };

  const handleResetDraft = () => {
    setBlueTeam([]);
    setRedTeam([]);
    setTurnIndex(0); // Reset turnIndex
    setBlueBans([]); // Clear blue bans
    setRedBans([]); // Clear red bans
    setSelectedChampion(null); // Clear selected champion
    setNextPick({ team: TURNS[0].team, index: 0 });
    setPhase('ban'); // Reset phase to ban
    setStarted(true); // Reset started to false
    setFinished(false); // Reset finished to false
    setSearch(''); // Clear search bar
    setTimer(30); // Reset timer
  };

  const handleLockIn = () => {
    if (!selectedChampion) return;

    const isBanPhase = TURNS[turnIndex].action.toLowerCase().includes('ban');
    if (isBanPhase) {
      if (TURNS[turnIndex].team.toLowerCase() === 'blue') {
        setBlueBans([...blueBans, selectedChampion]);
      } else {
        setRedBans([...redBans, selectedChampion]);
      }
    } else {
      if (TURNS[turnIndex].team.toLowerCase() === 'blue') {
        setBlueTeam([...blueTeam, selectedChampion]);
      } else {
        setRedTeam([...redTeam, selectedChampion]);
      }
    }

    // if (turnIndex === 'blue' && blueTeam.length < 5) {
    //   setBlueTeam([...blueTeam, selectedChampion]);
    //   ('red');
    // } else if (turnIndex == 'red' && redTeam.length < 5) {
    //   setRedTeam([...redTeam, selectedChampion]);
    //   setTurnIndex('blue');
    // }
    // console.log('Blue Team:', blueTeam);
    // console.log('Red Team:', redTeam);

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
            <div className='ban-team'>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className='ban-slot'
                >
                  {blueBans[index] ? (
                    <img
                      src={blueBans[index].image}
                      alt={blueBans[index].name}
                      className='champion-selected'
                    />
                  ) : null}
                </div>
              ))}
            </div>
            <input
              type='text'
              placeholder='Search...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='search-bar'
            />
            <div className='ban-team'>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className='ban-slot'
                >
                  {redBans[index] ? (
                    <img
                      src={redBans[index].image}
                      alt={redBans[index].name}
                      className='champion-selected'
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className='phase-container'>
            <div className='blue-side'>
              <SelectedChampions
                team='blue'
                champions={blueTeam}
                turnIndex={turnIndex}
              />
            </div>

            <div className='grid-container'>
              {loading ? (
                <p>Loading champions...</p>
              ) : (
                <>
                  <div className='timer'>
                    <h2>{timer}</h2>
                  </div>
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
                turnIndex={turnIndex}
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
