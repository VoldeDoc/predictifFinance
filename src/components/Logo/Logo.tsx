import React from 'react';
import { Link } from 'react-router-dom';
import { logo } from '../../../public';

const Logo: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <Link to="/">
        <img
          className="w-24 h-24 xl:w-32 xl:h-32"
          src={logo}
          alt="Logo"
        />
      </Link>
    </div>
  );
};

export default Logo;
