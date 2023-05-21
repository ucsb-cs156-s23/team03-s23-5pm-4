// import { render, screen, waitFor } from "@testing-library/react";
// import TransportIndexPage from "main/pages/Transports/TransportIndexPage";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { MemoryRouter } from "react-router-dom";
// import mockConsole from "jest-mock-console";

// // for mocking /api/currentUser and /api/systemInfo
// import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import axios from "axios";
// import AxiosMockAdapter from "axios-mock-adapter";

// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockNavigate
// }));

// const mockDelete = jest.fn();
// jest.mock('main/utils/transportUtils', () => {
//     return {
//         __esModule: true,
//         transportUtils: {
//             del: (id) => {
//                 return mockDelete(id);
//             },
//             get: () => {
//                 return {
//                     nextId: 5,
//                     transports: [
//                         {
//                             "id": 3,
//                             "name": "Mr. Scooty",
//                             "mode": "Kart",
//                             "cost": "1000"
//                         },
//                     ]
//                 }
//             }
//         }
//     }
// });


// describe("TransportIndexPage tests", () => {

//     // mock /api/currentUser and /api/systemInfo
//     const axiosMock =new AxiosMockAdapter(axios);
//     axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
//     axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

//     const queryClient = new QueryClient();
//     test("renders without crashing", () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <TransportIndexPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//     });

//     test("renders correct fields", () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <TransportIndexPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );

//         const createTransportButton = screen.getByText("Create Transport");
//         expect(createTransportButton).toBeInTheDocument();
//         expect(createTransportButton).toHaveAttribute("style", "float: right;");

//         const name = screen.getByText("Mr. Scooty");
//         expect(name).toBeInTheDocument();

//         const mode = screen.getByText("Kart");
//         expect(mode).toBeInTheDocument();

//         expect(screen.getByTestId("TransportTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
//         expect(screen.getByTestId("TransportTable-cell-row-0-col-Details-button")).toBeInTheDocument();
//         expect(screen.getByTestId("TransportTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
//     });

//     test("delete button calls delete and reloads page", async () => {

//         const restoreConsole = mockConsole();

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <TransportIndexPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );

//         const name = screen.getByText("Mr. Scooty");
//         expect(name).toBeInTheDocument();

//         const mode = screen.getByText("Kart");
//         expect(mode).toBeInTheDocument();

//         const deleteButton = screen.getByTestId("TransportTable-cell-row-0-col-Delete-button");
//         expect(deleteButton).toBeInTheDocument();

//         deleteButton.click();

//         expect(mockDelete).toHaveBeenCalledTimes(1);
//         expect(mockDelete).toHaveBeenCalledWith(3);

//         await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/transports"));


//         // assert - check that the console.log was called with the expected message
//         expect(console.log).toHaveBeenCalled();
//         const message = console.log.mock.calls[0][0];
//         const expectedMessage = `TransportIndexPage deleteCallback: {"id":3,"name":"Mr. Scooty","mode":"Kart","cost":"1000"}`;
//         expect(message).toMatch(expectedMessage);
//         restoreConsole();

//     });

// });

import { fireEvent, screen, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import TransportIndexPage from "main/pages/Transports/TransportIndexPage";


import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { transportFixtures } from "fixtures/transportFixtures";
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

describe("TransportIndexPage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    const testId = "TransportTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    test("renders without crashing for regular user", () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/transport/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createTransportButton = screen.getByText("Create Transport");
        expect(createTransportButton).toBeInTheDocument();
        expect(createTransportButton).toHaveAttribute("style", "float: right;");
    });

    test("renders without crashing for admin user", () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/transport/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const createTransportButton = screen.getByText("Create Transport");
        expect(createTransportButton).toBeInTheDocument();
        expect(createTransportButton).toHaveAttribute("style", "float: right;");
    });

    test("renders three transports without crashing for regular user", async () => {
        setupUserOnly();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/transport/all").reply(200, transportFixtures.threeTransports);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
    });

    test("renders three transports without crashing for admin user", async () => {
        setupAdminUser();
        const queryClient = new QueryClient();
        axiosMock.onGet("/api/transport/all").reply(200, transportFixtures.threeTransports);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/transport/all").timeout();

        const restoreConsole = mockConsole();

        const { queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/transport/all");
        restoreConsole();

        expect(queryByTestId(`${testId}-cell-row-0-col-id`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        const queryClient = new QueryClient();
        axiosMock.onGet("/api/transport/all").reply(200, transportFixtures.threeTransports);
        axiosMock.onDelete("/api/transport").reply(200, "Transport with id 2 was deleted");


        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

       expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); 


        const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
       
        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("Transport with id 2 was deleted") });

    });

});


