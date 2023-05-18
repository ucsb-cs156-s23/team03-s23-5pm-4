import { transportFixtures } from "fixtures/transportFixtures";
import { transportUtils } from "main/utils/transportUtils";

describe("transportUtils tests", () => {
    // return a function that can be used as a mock implementation of getItem
    // the value passed in will be converted to JSON and returned as the value
    // for the key "transport".  Any other key results in an error
    const createGetItemMock = (returnValue) => (key) => {
        if (key === "transport") {
            return JSON.stringify(returnValue);
        } else {
            throw new Error("Unexpected key: " + key);
        }
    };

    describe("get", () => {

        test("When transport is undefined in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(undefined));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = transportUtils.get();

            // assert
            const expected = { nextId: 1, transports: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("transport", expectedJSON);
        });

        test("When transport is null in local storage, should set to empty list", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(null));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = transportUtils.get();

            // assert
            const expected = { nextId: 1, transports: [] } ;
            expect(result).toEqual(expected);

            const expectedJSON = JSON.stringify(expected);
            expect(setItemSpy).toHaveBeenCalledWith("transport", expectedJSON);
        });

        test("When transports is [] in local storage, should return []", () => {

            // arrange
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, transports: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = transportUtils.get();

            // assert
            const expected = { nextId: 1, transports: [] };
            expect(result).toEqual(expected);

            expect(setItemSpy).not.toHaveBeenCalled();
        });

        test("When transports is JSON of three transport services, should return that JSON", () => {

            // arrange
            const threeTransports = transportFixtures.threeTransports;
            const mockTransportCollection = { nextId: 10, transports: threeTransports };

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock(mockTransportCollection));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = transportUtils.get();

            // assert
            expect(result).toEqual(mockTransportCollection);
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });


    describe("getById", () => {
        test("Check that getting a transportation service by id works", () => {

            // arrange
            const threeTransports = transportFixtures.threeTransports;
            const idToGet = threeTransports[1].id;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, transports: threeTransports }));

            // act
            const result = transportUtils.getById(idToGet);

            // assert

            const expected = { transport: threeTransports[1] };
            expect(result).toEqual(expected);
        });

        test("Check that getting a non-existant transportation service returns an error", () => {

            // arrange
            const threeTransports = transportFixtures.threeTransports;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, transports: threeTransports }));

            // act
            const result = transportUtils.getById(99);

            // assert
            const expectedError = `transportation service with id 99 not found`
            expect(result).toEqual({ error: expectedError });
        });

        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeTransports = transportFixtures.threeTransports;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, transports: threeTransports }));

            // act
            const result = transportUtils.getById();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });

    });
    describe("add", () => {
        test("Starting from [], check that adding one transportation service works", () => {

            // arrange
            const transport = transportFixtures.oneTransport[0];
            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 1, transports: [] }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = transportUtils.add(transport);

            // assert
            expect(result).toEqual(transport);
            expect(setItemSpy).toHaveBeenCalledWith("transport",
                JSON.stringify({ nextId: 2, transports: transportFixtures.oneTransport }));
        });
    });

    describe("update", () => {
        test("Check that updating an existing transportation service works", () => {

            // arrange
            const threeTransports = transportFixtures.threeTransports;
            const updatedTransport = {
                ...threeTransports[0],
                name: "Updated Name"
            };
            const threeTransportsUpdated = [
                updatedTransport,
                threeTransports[1],
                threeTransports[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, transports: threeTransports }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = transportUtils.update(updatedTransport);

            // assert
            const expected = { transportCollection: { nextId: 5, transports: threeTransportsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("transport", JSON.stringify(expected.transportCollection));
        });
        test("Check that updating an non-existing transportation service returns an error", () => {

            // arrange
            const threeTransports = transportFixtures.threeTransports;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, transports: threeTransports }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            const updatedTransport = {
                id: 99,
                name: "Fake Name",
                mode: "Fake Mode",
                cost: "Fake Cost"
            }

            // act
            const result = transportUtils.update(updatedTransport);

            // assert
            const expectedError = `transportation service with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("del", () => {
        test("Check that deleting a transportation service by id works", () => {

            // arrange
            const threeTransports = transportFixtures.threeTransports;
            const idToDelete = threeTransports[1].id;
            const threeTransportsUpdated = [
                threeTransports[0],
                threeTransports[2]
            ];

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, transports: threeTransports }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = transportUtils.del(idToDelete);

            // assert

            const expected = { transportCollection: { nextId: 5, transports: threeTransportsUpdated } };
            expect(result).toEqual(expected);
            expect(setItemSpy).toHaveBeenCalledWith("transport", JSON.stringify(expected.transportCollection));
        });
        test("Check that deleting a non-existing transportation service returns an error", () => {

            // arrange
            const threeTransports = transportFixtures.threeTransports;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, transports: threeTransports }));

            const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
            setItemSpy.mockImplementation((_key, _value) => null);

            // act
            const result = transportUtils.del(99);

            // assert
            const expectedError = `transportation service with id 99 not found`
            expect(result).toEqual({ error: expectedError });
            expect(setItemSpy).not.toHaveBeenCalled();
        });
        test("Check that an error is returned when id not passed", () => {

            // arrange
            const threeTransports = transportFixtures.threeTransports;

            const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
            getItemSpy.mockImplementation(createGetItemMock({ nextId: 5, transports: threeTransports }));

            // act
            const result = transportUtils.del();

            // assert
            const expectedError = `id is a required parameter`
            expect(result).toEqual({ error: expectedError });
        });
    });
});

