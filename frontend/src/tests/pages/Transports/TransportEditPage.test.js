import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import TransportEditPage from "main/pages/Transports/TransportEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

const mockUpdate = jest.fn();
jest.mock('main/utils/transportUtils', () => {
    return {
        __esModule: true,
        transportUtils: {
            update: (_transport) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    transport: {
                        id: 3,
                        name: "Inkstriker",
                        mode: "kart",
                        cost: "10000"
                    }
                }
            }
        }
    }
});


describe("TransportEditPage tests", () => {

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

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("TransportForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Inkstriker')).toBeInTheDocument();
        expect(screen.getByDisplayValue('kart')).toBeInTheDocument();
        expect(screen.getByDisplayValue('10000')).toBeInTheDocument();
    });

    test("redirects to /transports on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "transport": {
                id: 3,
                name: "Mr. Scooty",
                mode: "scooter",
                cost: "100000"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const modeInput = screen.getByLabelText("Mode");
        expect(modeInput).toBeInTheDocument();

        const costInput = screen.getByLabelText("Cost");
        expect(costInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'Mr. Scooty' } })
            fireEvent.change(modeInput, { target: { value: 'scooter' } })
            fireEvent.change(costInput, { target: { value: '100000' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/transports"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedTransport: {"transport":{"id":3,"name":"Mr. Scooty","mode":"scooter","cost":"100000"}}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


