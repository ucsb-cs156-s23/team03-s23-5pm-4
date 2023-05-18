import { render, screen, waitFor } from "@testing-library/react";
import TransportIndexPage from "main/pages/Transports/TransportIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockDelete = jest.fn();
jest.mock('main/utils/transportUtils', () => {
    return {
        __esModule: true,
        transportUtils: {
            del: (id) => {
                return mockDelete(id);
            },
            get: () => {
                return {
                    nextId: 5,
                    transports: [
                        {
                            "id": 3,
                            "name": "Mr. Scooty",
                            "mode": "Kart",
                            "cost": "1000"
                        },
                    ]
                }
            }
        }
    }
});


describe("TransportIndexPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders correct fields", () => {
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

        const name = screen.getByText("Mr. Scooty");
        expect(name).toBeInTheDocument();

        const mode = screen.getByText("Kart");
        expect(mode).toBeInTheDocument();

        expect(screen.getByTestId("TransportTable-cell-row-0-col-Delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("TransportTable-cell-row-0-col-Details-button")).toBeInTheDocument();
        expect(screen.getByTestId("TransportTable-cell-row-0-col-Edit-button")).toBeInTheDocument();
    });

    test("delete button calls delete and reloads page", async () => {

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const name = screen.getByText("Mr. Scooty");
        expect(name).toBeInTheDocument();

        const mode = screen.getByText("Kart");
        expect(mode).toBeInTheDocument();

        const deleteButton = screen.getByTestId("TransportTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();

        deleteButton.click();

        expect(mockDelete).toHaveBeenCalledTimes(1);
        expect(mockDelete).toHaveBeenCalledWith(3);

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/transports"));


        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage = `TransportIndexPage deleteCallback: {"id":3,"name":"Mr. Scooty","mode":"Kart","cost":"1000"}`;
        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


