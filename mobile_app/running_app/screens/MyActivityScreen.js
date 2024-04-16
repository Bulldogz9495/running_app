import React, { useRef, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { UserContext } from '../navigation/UserProvider';

const MyActivityScreen = () => {
  const { userData, setUserData } = UserContext();
  return (
    <MapComponent />
  );
};

export default MyActivityScreen;