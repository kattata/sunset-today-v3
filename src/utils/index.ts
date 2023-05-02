export const getRemainingTime = (sunsetTime: string) => {
  const now = new Date().getTime();
  const sunset = new Date(sunsetTime).getTime();
  
  const distance = sunset - 1683027639;
  console.log(distance);

  if (distance < 0) {
    return {
      hours: "00",
      minutes: "00",
      seconds: "00",
      hasPassed: true,
    };
  }

  const countdown = {
    hours: getHours(distance),
    minutes: getMinutes(distance),
    seconds: getSeconds(distance),
    hasPassed: false,
  };

  return countdown;
};

const getSeconds = (distance: number) => {
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  return prefixZero(seconds);
};

const getMinutes = (distance: number) => {
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  return prefixZero(minutes);
};

const getHours = (distance: number) => {
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return prefixZero(hours);
};

const prefixZero = (value: number): string => {
  if (value >= 10) {
    return String(value);
  }

  return String('0' + value);
};