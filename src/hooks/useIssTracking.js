import { useState, useEffect, useCallback, useRef } from 'react';
import { getIssLocation, getAstronauts } from '../services/issService';
import { getNearestPlace } from '../services/geocodeService';
import { calculateSpeed } from '../utils/haversine';
import { safeGetStorage, safeSetStorage } from '../utils/storage';

export const useIssTracking = () => {
  const [position, setPosition] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [path, setPath] = useState(() => safeGetStorage('issPath', []));
  const [speedHistory, setSpeedHistory] = useState(() => safeGetStorage('issSpeedHistory', []));
  const [place, setPlace] = useState("Loading...");
  const [astronauts, setAstronauts] = useState({ count: 0, people: [] });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevPositionRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch ISS location
      const newPos = await getIssLocation();
      setPosition(newPos);
      setLastUpdate(newPos.timestamp);

      // Update path (last 15 positions)
      setPath(prevPath => {
        const updated = [...prevPath, [newPos.lat, newPos.lng]].slice(-15);
        safeSetStorage('issPath', updated);
        return updated;
      });

      // Calculate speed
      if (prevPositionRef.current) {
        const currentSpeed = calculateSpeed(prevPositionRef.current, newPos);
        setSpeed(currentSpeed);
        
        // Update speed history (last 30 measurements)
        setSpeedHistory(prevHistory => {
          const updated = [...prevHistory, { 
            time: new Date(newPos.timestamp * 1000).toLocaleTimeString(), 
            speed: currentSpeed 
          }].slice(-30);
          safeSetStorage('issSpeedHistory', updated);
          return updated;
        });
      }
      prevPositionRef.current = newPos;

      // Fetch nearest place
      const nearest = await getNearestPlace(newPos.lat, newPos.lng);
      setPlace(nearest);

      // Fetch astronauts
      const astros = await getAstronauts();
      setAstronauts(astros);

    } catch (err) {
      console.error(err);
      setError("Failed to update ISS data. Retrying...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(); // Initial fetch
    
    // Poll every 15 seconds
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    position,
    speed,
    path,
    speedHistory,
    place,
    astronauts,
    lastUpdate,
    loading,
    error,
    refreshData: fetchData
  };
};
