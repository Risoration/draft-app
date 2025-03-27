import React from 'react';
import { useState } from 'react';

const ROLES = [
  'All',
  'Fighter',
  'Mage',
  'Assassin',
  'Tank',
  'Support',
  'Marksman',
];

const RoleFilter = ({ selectedRole, setSelectedRole }) => {
  return (
    <div className=''>
      {' '}
      {ROLES.map((role) => {
        <button
          key={role}
          onClick={() => setSelectedRole(role)}
          className={`${selectedRole === role ? 'active' : ''}`}
        >
          {role}
        </button>;
      })}
    </div>
  );
};

const Filterbar = ({ search, setSearch, selectedRole, setSelectedRole }) => {
  return (
    <>
      <RoleFilter
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />
      <input
        type='text'
        placeholder='Search...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='flex gap-2.5 justify-end self-end mb-2.5 bg-black/50 border-none rounded-tr-md text-center h-7 '
      />
    </>
  );
};

export default Filterbar;
