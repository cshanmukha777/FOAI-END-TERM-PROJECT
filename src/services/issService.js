export const getIssLocation = async () => {
  try {
    const response = await fetch('http://api.open-notify.org/iss-now.json');
    if (!response.ok) throw new Error('Failed to fetch ISS location');
    const data = await response.json();
    return {
      lat: parseFloat(data.iss_position.latitude),
      lng: parseFloat(data.iss_position.longitude),
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('ISS Location Error:', error);
    throw error;
  }
};

export const getAstronauts = async () => {
  try {
    const response = await fetch('http://api.open-notify.org/astros.json');
    if (!response.ok) throw new Error('Failed to fetch astronauts');
    const data = await response.json();
    return {
      count: data.number,
      people: data.people
    };
  } catch (error) {
    console.error('Astronauts Error:', error);
    throw error;
  }
};
