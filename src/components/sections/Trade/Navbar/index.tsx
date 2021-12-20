import React from 'react';
import nextId from 'react-id-generator';
import { NavLink } from 'react-router-dom';

import './Navbar.scss';

const navItems = ['Swap', 'Liquidity', 'Bridge'];

const TradeNavbar: React.FC = () => {
  return (
    <div className="trade__nav box-shadow box-f-ai-c">
      {navItems.map((item) => (
        <NavLink
          to={`/trade/${item.toLocaleLowerCase()}`}
          className="trade__nav-item text-white text-500"
          key={nextId()}
        >
          {item}
        </NavLink>
      ))}
    </div>
  );
};

export default TradeNavbar;
