// import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
// import TransportEditPage from "main/pages/Transports/TransportEditPage";
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
// jest.mock('main/utils/transportUtils', () => {
//     return {
//         __esModule: true,
//         transportUtils: {
//             update: (_transport) => {return mockUpdate();},
//             getById: (_id) => {
//                 return {
//                     transport: {
//                         id: 3,
//                         name: "Inkstriker",
//                         mode: "kart",
//                         cost: "10000"
//                     }
//                 }
//             }
//         }
//     }
// });


// describe("TransportEditPage tests", () => {

//     const queryClient = new QueryClient();

//     test("renders without crashing", () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <TransportEditPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//     });

//     test("loads the correct fields", async () => {

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <TransportEditPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );

//         expect(screen.getByTestId("TransportForm-name")).toBeInTheDocument();
//         expect(screen.getByDisplayValue('Inkstriker')).toBeInTheDocument();
//         expect(screen.getByDisplayValue('kart')).toBeInTheDocument();
//         expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
//     });

//     test("redirects to /transports on submit", async () => {

//         const restoreConsole = mockConsole();

//         mockUpdate.mockReturnValue({
//             "transport": {
//                 id: 3,
//                 name: "Mr. Scooty",
//                 mode: "scooter",
//                 cost: "100000"
//             }
//         });

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <TransportEditPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         )

//         const nameInput = screen.getByLabelText("Name");
//         expect(nameInput).toBeInTheDocument();

//         const modeInput = screen.getByLabelText("Mode");
//         expect(modeInput).toBeInTheDocument();

//         const costInput = screen.getByLabelText("Cost");
//         expect(costInput).toBeInTheDocument();

//         const updateButton = screen.getByText("Update");
//         expect(updateButton).toBeInTheDocument();

//         fireEvent.change(nameInput, { target: { value: 'Mr. Scooty' } })
//         fireEvent.change(modeInput, { target: { value: 'scooter' } })
//         fireEvent.change(costInput, { target: { value: '100000' } })
//         fireEvent.click(updateButton);

//         await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
//         await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/transports"));

//         // assert - check that the console.log was called with the expected message
//         expect(console.log).toHaveBeenCalled();
//         const message = console.log.mock.calls[0][0];
//         const expectedMessage =  `updatedTransport: {"transport":{"id":3,"name":"Mr. Scooty","mode":"scooter","cost":"100000"}}`

//         expect(message).toMatch(expectedMessage);
//         restoreConsole();

//     });

// });


import { fireEvent, /* queryByTestId, */ render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import TransportEditPage from "main/pages/Transports/TransportEditPage";

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

describe("TransportEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/transport", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <TransportEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Transport");
            expect(queryByTestId("TransportForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/transport", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: 'Biddybuggy',
                mode: "Kart",
                cost: "1000"
            });
            axiosMock.onPut('/api/transport').reply(200, {
                id: "17",
                name: 'Mr. Scooty',
                mode: "Bike",
                cost: "100"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <TransportEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <TransportEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("TransportForm-name");

            const idField = getByTestId("TransportForm-id");
            const nameField = getByTestId("TransportForm-name");
            const modeField = getByTestId("TransportForm-mode");
            const costField = getByTestId("TransportForm-cost");
            const submitButton = getByTestId("TransportForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Biddybuggy");
            expect(modeField).toHaveValue("Kart");
            expect(costField).toHaveValue("1000");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <TransportEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("TransportForm-name");

            const idField = getByTestId("TransportForm-id");
            const nameField = getByTestId("TransportForm-name");
            const modeField = getByTestId("TransportForm-mode");
            const costField = getByTestId("TransportForm-cost");
            const submitButton = getByTestId("TransportForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Biddybuggy");
            expect(modeField).toHaveValue("Kart");
            expect(costField).toHaveValue("1000");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'Mr. Scooty' } })
            fireEvent.change(modeField, { target: { value: 'Bike' } })
            fireEvent.change(costField, { target: { value: "100" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Transport Updated - id: 17 name: Mr. Scooty");
            expect(mockNavigate).toBeCalledWith({ "to": "/transport/" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'Mr. Scooty',
                mode: "Bike",
                cost: "100"
            })); // posted object

        });

       
    });
});


