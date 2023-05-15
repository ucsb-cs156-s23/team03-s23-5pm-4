// get attractions from local storage
const get = () => {
  const attractionValue = localStorage.getItem("attractions");
  if (attractionValue === undefined) {
      const attractionCollection = { nextId: 1, attractions: [] }
      return set(attractionCollection);
  }
  const attractionCollection = JSON.parse(attractionValue);
  if (attractionCollection === null) {
      const attractionCollection = { nextId: 1, attractions: [] }
      return set(attractionCollection);
  }
  return attractionCollection;
};

const getById = (id) => {
  if (id === undefined) {
      return { "error": "id is a required parameter" };
  }
  const attractionCollection = get();
  const attractions = attractionCollection.attractions;

  /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
  const index = attractions.findIndex((r) => r.id == id);
  if (index === -1) {
      return { "error": `attraction with id ${id} not found` };
  }
  return { attraction: attractions[index] };
}

// set attractions in local storage
const set = (attractionCollection) => {
  localStorage.setItem("attractions", JSON.stringify(attractionCollection));
  return attractionCollection;
};

// add a attraction to local storage
const add = (attraction) => {
  const attractionCollection = get();
  attraction = { ...attraction, id: attractionCollection.nextId };
  attractionCollection.nextId++;
  attractionCollection.attractions.push(attraction);
  set(attractionCollection);
  return attraction;
};

// update a attraction in local storage
const update = (attraction) => {
  const attractionCollection = get();

  const attractions = attractionCollection.attractions;

  /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
  const index = attractions.findIndex((r) => r.id == attraction.id);
  if (index === -1) {
      return { "error": `attraction with id ${attraction.id} not found` };
  }
  attractions[index] = attraction;
  set(attractionCollection);
  return { attractionCollection: attractionCollection };
};

// delete a attraction from local storage
const del = (id) => {
  if (id === undefined) {
      return { "error": "id is a required parameter" };
  }
  const attractionCollection = get();
  const attractions = attractionCollection.attractions;

  /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
  const index = attractions.findIndex((r) => r.id == id);
  if (index === -1) {
      return { "error": `attraction with id ${id} not found` };
  }
  attractions.splice(index, 1);
  set(attractionCollection);
  return { attractionCollection: attractionCollection };
};

const attractionUtils = {
  get,
  getById,
  add,
  update,
  del
};

export { attractionUtils };



