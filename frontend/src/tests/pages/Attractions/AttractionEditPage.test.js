import { fireEvent, /* queryByTestId, */ render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import AttractionEditPage from "main/pages/Attractions/AttractionEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("AttractionEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/attractions", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AttractionEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Attraction");
            expect(queryByTestId("AttractionForm-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/attractions", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: 'Empire State',
                address: "California",
                description: "Building"
            });
            axiosMock.onPut('/api/attractions').reply(200, {
                id: "17",
                name: 'Empire State Building',
                address: "New York",
                description: "Big Building"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AttractionEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AttractionEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("AttractionForm-name");

            const idField = getByTestId("AttractionForm-id");
            const nameField = getByTestId("AttractionForm-name");
            const addressField = getByTestId("AttractionForm-address");
            const descriptionField = getByTestId("AttractionForm-description");
            const submitButton = getByTestId("AttractionForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Empire State");
            expect(addressField).toHaveValue("California");
            expect(descriptionField).toHaveValue("Building");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <AttractionEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("AttractionForm-name");

            const idField = getByTestId("AttractionForm-id");
            const nameField = getByTestId("AttractionForm-name");
            const addressField = getByTestId("AttractionForm-address");
            const descriptionField = getByTestId("AttractionForm-description");
            const submitButton = getByTestId("AttractionForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Empire State");
            expect(addressField).toHaveValue("California");
            expect(descriptionField).toHaveValue("Building");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'Empire State Building' } })
            fireEvent.change(addressField, { target: { value: 'New York' } })
            fireEvent.change(descriptionField, { target: { value: "Big Building" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Attraction Updated - id: 17 name: Empire State Building");
            expect(mockNavigate).toBeCalledWith({ "to": "/attractions/" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'Empire State Building',
                address: "New York",
                description: "Big Building"
            })); // posted object

        });

       
    });
});

// import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
// import AttractionEditPage from "main/pages/Attractions/AttractionEditPage";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { MemoryRouter } from "react-router-dom";
// import mockConsole from "jest-mock-console";

// const mockNavigate = jest.fn();

// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useParams: () => ({
//         id: 3
//     }),
//     useNavigate: () => mockNavigate
// }));

// const mockUpdate = jest.fn();
// jest.mock('main/utils/attractionUtils', () => {
//     return {
//         __esModule: true,
//         attractionUtils: {
//             update: (_attraction) => {return mockUpdate();},
//             getById: (_id) => {
//                 return {
//                     attraction: {
//                         id: 3,
//                         name: "Freebirds",
//                         description: "Burritos",
//                         address: "123"
//                     }
//                 }
//             }
//         }
//     }
// });


// describe("AttractionEditPage tests", () => {

//     const queryClient = new QueryClient();

//     test("renders without crashing", () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <AttractionEditPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//     });

//     test("loads the correct fields", async () => {

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <AttractionEditPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );

//         expect(screen.getByTestId("AttractionForm-name")).toBeInTheDocument();
//         expect(screen.getByDisplayValue('Freebirds')).toBeInTheDocument();
//         expect(screen.getByDisplayValue('Burritos')).toBeInTheDocument();
//         expect(screen.getByDisplayValue('123')).toBeInTheDocument();
//     });

//     test("redirects to /attractions on submit", async () => {

//         const restoreConsole = mockConsole();

//         mockUpdate.mockReturnValue({
//             "attraction": {
//                 id: 3,
//                 name: "South Coast Deli (Goleta)",
//                 description: "Sandwiches, Salads and more",
//                 address: "456"
//             }
//         });

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <AttractionEditPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         )

//         const nameInput = screen.getByLabelText("Name");
//         expect(nameInput).toBeInTheDocument();


//         const descriptionInput = screen.getByLabelText("Description");
//         expect(descriptionInput).toBeInTheDocument();

//         const addressInput = screen.getByLabelText("Address");
//         expect(addressInput).toBeInTheDocument();

//         const updateButton = screen.getByText("Update");
//         expect(updateButton).toBeInTheDocument();

        
//         fireEvent.change(nameInput, { target: { value: 'South Coast Deli (Goleta)' } })
//         fireEvent.change(descriptionInput, { target: { value: 'Sandwiches, Salads and more' } })
//         fireEvent.change(addressInput, { target: { value: '456' } })
//         fireEvent.click(updateButton);
    

//         await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
//         await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/attractions"));

//         // assert - check that the console.log was called with the expected message
//         expect(console.log).toHaveBeenCalled();
//         const message = console.log.mock.calls[0][0];
//         const expectedMessage =  `updatedAttraction: {"attraction":{"id":3,"name":"South Coast Deli (Goleta)","description":"Sandwiches, Salads and more","address":"456"}`

//         expect(message).toMatch(expectedMessage);
//         restoreConsole();

//     });

// });

