import React, { useRef, useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import { useUser } from '../navigation/userContext'

const MyActivityScreen = () => {
  const { userData, setUserData } = useUser();
  console.log(userData);
  return (
    <MapComponent />
  );
};

export default MyActivityScreen;