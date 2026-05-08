// Calculate distance between two coordinates in km using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate speed in km/h given two points and timestamps
export const calculateSpeed = (pos1, pos2) => {
  if (!pos1 || !pos2) return 0;
  
  const distance = calculateDistance(pos1.lat, pos1.lng, pos2.lat, pos2.lng);
  
  // Timestamps from Open Notify are Unix timestamps in seconds
  // Convert difference to hours
  const timeDiffHours = Math.abs(pos2.timestamp - pos1.timestamp) / 3600;
  
  if (timeDiffHours === 0) return 0; // Avoid division by zero
  
  return Math.round(distance / timeDiffHours);
};
