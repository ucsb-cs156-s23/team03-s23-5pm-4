import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import AttractionCreatePage from "main/pages/Attractions/AttractionCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

const mockAdd = jest.fn();
jest.mock('main/utils/attractionUtils', () => {
    return {
        __esModule: true,
        attractionUtils: {
            add: () => { return mockAdd(); }
        }
    }
});

describe("AttractionCreatePage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AttractionCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("redirects to /attractions on submit", async () => {

        const restoreConsole = mockConsole();

        mockAdd.mockReturnValue({
            "attraction": {
                id: 3,
                name: "South Coast Deli",
                description: "Sandwiches and Salads",
                address: "123"
            }
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AttractionCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();


        const descriptionInput = screen.getByLabelText("Description");
        expect(descriptionInput).toBeInTheDocument();

        const addressInput = screen.getByLabelText("Address");
        expect(descriptionInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        
        fireEvent.change(nameInput, { target: { value: 'South Coast Deli' } })
        fireEvent.change(descriptionInput, { target: { value: 'Sandwiches and Salads' } })
        fireEvent.change(addressInput, { target: { value: '123' } })
        fireEvent.click(createButton);
        

        await waitFor(() => expect(mockAdd).toHaveBeenCalled());
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/attractions"));

        // assert - check that the console.log was called with the expected message
        expect(console.log).toHaveBeenCalled();
        const message = console.log.mock.calls[0][0];
        const expectedMessage =  `createdAttraction: {"attraction":{"id":3,"name":"South Coast Deli","description":"Sandwiches and Salads","address":"123"}}`

        expect(message).toMatch(expectedMessage);
        restoreConsole();

    });

});


