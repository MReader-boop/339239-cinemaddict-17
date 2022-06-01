const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloatingPoint = (a = 0, b = 1, userPrec = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const precision = 10**userPrec;

  return Math.floor((lower + Math.random() * (upper - lower))*precision)/precision;
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length-1)];

const removeArrayElement = (array, valueToRemove) => array.filter((element) => valueToRemove !== element);

const getRandomArrayElements = (elements, elementAmount) => {
  const result = [];
  for (let i = 0; i < elementAmount; i++) {
    result.push(getRandomArrayElement(elements));
    elements = removeArrayElement(elements, result[result.length - 1]);
  }

  return result;
};

export {getRandomInteger, getRandomFloatingPoint, getRandomArrayElement, getRandomArrayElements};
