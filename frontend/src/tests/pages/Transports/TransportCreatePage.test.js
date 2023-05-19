// import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
// import TransportCreatePage from "main/pages/Transports/TransportCreatePage";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { MemoryRouter } from "react-router-dom";
// import mockConsole from "jest-mock-console";

// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockNavigate
// }));

// const mockAdd = jest.fn();
// jest.mock('main/utils/transportUtils', () => {
//     return {
//         __esModule: true,
//         transportUtils: {
//             add: () => { return mockAdd(); }
//         }
//     }
// });

// describe("TransportCreatePage tests", () => {

//     const queryClient = new QueryClient();
//     test("renders without crashing", () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <TransportCreatePage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//     });

//     test("redirects to /transports on submit", async () => {

//         const restoreConsole = mockConsole();

//         mockAdd.mockReturnValue({
//             "transport": {
//                 id: 3,
//                 name: "Inkstriker",
//                 mode: "kart",
//                 cost: "1000"
//             }
//         });

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <TransportCreatePage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         )

//         const nameInput = screen.getByTestId("TransportForm-name");
//         expect(nameInput).toBeInTheDocument();


//         const modeInput = screen.getByTestId("TransportForm-mode");
//         expect(modeInput).toBeInTheDocument();

//         const costInput = screen.getByTestId("TransportForm-cost");
//         expect(costInput).toBeInTheDocument();

//         const createButton = screen.getByTestId("TransportForm-submit");
//         expect(createButton).toBeInTheDocument();

//         fireEvent.change(nameInput, { target: { value: 'Inkstriker' } })
//         fireEvent.change(modeInput, { target: { value: 'kart' } })
//         fireEvent.change(costInput, { target: { value: '1000' } })
//         fireEvent.click(createButton);

//         await waitFor(() => expect(mockAdd).toHaveBeenCalled());
//         await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/transports"));

//         // assert - check that the console.log was called with the expected message
//         expect(console.log).toHaveBeenCalled();
//         const message = console.log.mock.calls[0][0];
//         const expectedMessage =  `createdTransport: {"transport":{"id":3,"name":"Inkstriker","mode":"kart","cost":"1000"}`

//         expect(message).toMatch(expectedMessage);
//         restoreConsole();

//     });

// });

import { render, waitFor, fireEvent } from "@testing-library/react";
import TransportCreatePage from "main/pages/Transports/TransportCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("TransportCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const transport = {
            id: 17,
            name: "Inkstriker",
            mode: "kart",
            cost: "1000"
        };

        axiosMock.onPost("/api/transport/post").reply( 202, transport );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("TransportForm-cost")).toBeInTheDocument();
        });

        const costField = getByTestId("TransportForm-cost");
        const nameField = getByTestId("TransportForm-name");
        const modeField = getByTestId("TransportForm-mode");
        const submitButton = getByTestId("TransportForm-submit");

        fireEvent.change(costField, { target: { value: '1000' } });
        fireEvent.change(nameField, { target: { value: 'Inkstriker' } });
        fireEvent.change(modeField, { target: { value: 'kart' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "name": "Inkstriker",
            "mode": "kart",
            "cost": "1000"
        });

        expect(mockToast).toBeCalledWith("New transport Created - id: 17 name: Inkstriker");
        expect(mockNavigate).toBeCalledWith({ "to": "/transport/list" });
    });


});





