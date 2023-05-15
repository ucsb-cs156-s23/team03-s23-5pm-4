import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import AttractionEditPage from "main/pages/Attractions/AttractionEditPage";
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
jest.mock('main/utils/attractionUtils', () => {
    return {
        __esModule: true,
        attractionUtils: {
            update: (_attraction) => {return mockUpdate();},
            getById: (_id) => {
                return {
                    attraction: {
                        id: 3,
                        name: "Freebirds",
                        description: "Burritos",
                        address: "123"
                    }
                }
            }
        }
    }
});


describe("AttractionEditPage tests", () => {

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

    test("loads the correct fields", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AttractionEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByTestId("AttractionForm-name")).toBeInTheDocument();
        expect(screen.getByDisplayValue('Freebirds')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Burritos')).toBeInTheDocument();
        expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    });

    test("redirects to /attractions on submit", async () => {

        const restoreConsole = mockConsole();

        mockUpdate.mockReturnValue({
            "attraction": {
                id: 3,
                name: "South Coast Deli (Goleta)",
                description: "Sandwiches, Salads and more",
                address: "456"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AttractionEditPage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const addressInput = screen.getByLabelText("Address");
        expect(addressInput).toBeInTheDocument();

        const updateButton = screen.getByText("Update");
        expect(updateButton).toBeInTheDocument();

        await act(async () => {
            fireEvent.change(nameInput, { target: { value: 'South Coast Deli (Goleta)' } })
            fireEvent.change(descriptionInput, { target: { value: 'Sandwiches, Salads and more' } })
            fireEvent.change(addressInput, { target: { value: '456' } })
            fireEvent.click(updateButton);
        });

        await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/attractions"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `updatedAttraction: {"attraction":{"id":3,"name":"South Coast Deli (Goleta)","description":"Sandwiches, Salads and more","address":"456"}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


