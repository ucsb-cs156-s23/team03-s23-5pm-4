import { render, screen } from "@testing-library/react";
import TransportDetailsPage from "main/pages/Transports/TransportDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 3
    }),
    useNavigate: () => mockNavigate
}));

jest.mock('main/utils/transportUtils', () => {
    return {
        __esModule: true,
        transportUtils: {
            getById: (_id) => {
                return {
                    transport: {
                        id: 3,
                        name: "Standard Kart",
                        mode: "Kart",
                        cost: "0"
                    }
                }
            }
        }
    }
});

describe("TransportDetailsPage tests", () => {

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <TransportDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("Standard Kart")).toBeInTheDocument();
        expect(screen.getByText("Kart")).toBeInTheDocument();
        expect(screen.getByText("0")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


