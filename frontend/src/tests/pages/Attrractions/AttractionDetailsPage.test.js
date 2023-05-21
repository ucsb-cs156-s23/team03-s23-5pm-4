import { render, screen } from "@testing-library/react";
import AttractionDetailsPage from "main/pages/Attractions/AttractionDetailsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

// for mocking /api/currentUser and /api/systemInfo
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 3,
            name: "Standard Kart",
            description: "Kart",
            address: "0"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("AttractionDetailsPage tests", () => {

    // mock /api/currentUser and /api/systemInfo
    const axiosMock =new AxiosMockAdapter(axios);
    /*
    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/attractions", { params: { id: 3 } }).reply(200, {
            id: 3,
            name: 'Standard Kart',
            description: "Kart",
            address: "0"
        });
    });*/

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/attractions", { params: { id: 3 } }).reply(200, {
            id: 3,
            name: 'Standard Kart',
            description: "Kart",
            address: "0"
        });
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/attractions", { params: { id: 3 } }).reply(200, {
            id: 3,
            name: 'Standard Kart',
            description: "Kart",
            address: "0"
        });
    };
    

    const queryClient = new QueryClient();
    test("renders without crashing for regular user", () => {
        setupUserOnly()
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AttractionDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for admin", () => {
        setupAdminUser()
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AttractionDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons for regular user", async () => {
        setupUserOnly()
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AttractionDetailsPage />
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

    test("loads the correct fields, and no buttons for admin", async () => {
        setupAdminUser()
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AttractionDetailsPage />
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

