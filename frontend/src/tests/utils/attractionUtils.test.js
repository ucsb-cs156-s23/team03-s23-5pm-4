import { attractionFixtures } from "fixtures/attractionFixtures";
import { attractionUtils } from "main/utils/attractionUtils";

describe("attractionUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be convertd to JSON and returned as the value
    // for the key "attractions".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "attractions") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When attractions is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = attractionUtils.get();

            // assert
            const expected = { nextId: 1, attractions: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("attractions", expectedJSON);
        });

        test("When attractions is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = attractionUtils.get();

            // assert
            const expected = { nextId: 1, attractions: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("attractions", expectedJSON);
        });

        test("When attractions is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, attractions: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = attractionUtils.get();

            // assert
            const expected = { nextId: 1, attractions: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When attractions is JSON of three attractions, should return that JSON", () => {

            // arrange
            const threeAttractions = attractionFixtures.threeAttractions;
            const mockAttractionCollection = { nextId: 10, attractions: threeAttractions };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockAttractionCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = attractionUtils.get();

            // assert
            expect(result).toEqual(mockAttractionCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a attraction by id works", () => {

            // arrange
            const threeAttractions = attractionFixtures.threeAttractions;
            const idToGet = threeAttractions[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, attractions: threeAttractions }));

            // act
            const result = attractionUtils.getById(idToGet);

            // assert

            const expected = { attraction: threeAttractions[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existing attraction returns an error", () => {

            // arrange
            const threeAttractions = attractionFixtures.threeAttractions;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, attractions: threeAttractions }));

            // act
            const result = attractionUtils.getById(99);

            // assert
            const expectedError = `attraction with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeAttractions = attractionFixtures.threeAttractions;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, attractions: threeAttractions }));

            // act
            const result = attractionUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one attraction works", () => {

            // arrange
            const attraction = attractionFixtures.oneAttraction[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, attractions: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = attractionUtils.add(attraction);

            // assert
            expect(result).toEqual(attraction);
            expect(setItemSpy).toHaveBeenCalledWith("attractions",
                JSON.stringify({ nextId: 2, attractions: attractionFixtures.oneAttraction }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing attraction works", () => {

            // arrange
            const threeAttractions = attractionFixtures.threeAttractions;
            const updatedAttraction = {
                ...threeAttractions[0],
                name: "Updated Name"
            };
            const threeAttractionsUpdated = [
                updatedAttraction,
                threeAttractions[1],
                threeAttractions[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, attractions: threeAttractions }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = attractionUtils.update(updatedAttraction);

            // assert
            const expected = { attractionCollection: { nextId: 5, attractions: threeAttractionsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("attractions", JSON.stringify(expected.attractionCollection));
        });
        test("Check that updating an non-existing attraction returns an error", () => {

            // arrange
            const threeAttractions = attractionFixtures.threeAttractions;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, attractions: threeAttractions }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedAttraction = {
                id: 99,
                name: "Fake Name",
                description: "Fake Description"
            }

            // act
            const result = attractionUtils.update(updatedAttraction);

            // assert
            const expectedError = `attraction with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a attraction by id works", () => {

            // arrange
            const threeAttractions = attractionFixtures.threeAttractions;
            const idToDelete = threeAttractions[1].id;
            const threeAttractionsUpdated = [
                threeAttractions[0],
                threeAttractions[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, attractions: threeAttractions }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = attractionUtils.del(idToDelete);

            // assert

            const expected = { attractionCollection: { nextId: 5, attractions: threeAttractionsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("attractions", JSON.stringify(expected.attractionCollection));
        });
        test("Check that deleting a non-existing attraction returns an error", () => {

            // arrange
            const threeAttractions = attractionFixtures.threeAttractions;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, attractions: threeAttractions }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = attractionUtils.del(99);

            // assert
            const expectedError = `attraction with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeAttractions = attractionFixtures.threeAttractions;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, attractions: threeAttractions }));

            // act
            const result = attractionUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});

