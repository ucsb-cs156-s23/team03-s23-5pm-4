// import { render, screen } from "@testing-library/react";
// import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";
// import { QueryClient, QueryClientProvider } from "react-query";
// import { MemoryRouter } from "react-router-dom";

// // for mocking /api/currentUser and /api/systemInfo
// import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";
// import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import axios from "axios";
// import AxiosMockAdapter from "axios-mock-adapter";

// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useParams: () => ({
//         id: 3
//     }),
//     useNavigate: () => mockNavigate
// }));

// jest.mock('main/utils/restaurantUtils', () => {
//     return {
//         __esModule: true,
//         restaurantUtils: {
//             getById: (_id) => {
//                 return {
//                     restaurant: {
//                         id: 3,
//                         name: "Freebirds",
//                         description: "Burritos"
//                     }
//                 }
//             }
//         }
//     }
// });

// describe("RestaurantDetailsPage tests", () => {
//     // mock /api/currentUser and /api/systemInfo
//     const axiosMock =new AxiosMockAdapter(axios);
//     axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
//     axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

//     const queryClient = new QueryClient();
//     test("renders without crashing", () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantDetailsPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//     });

//     test("loads the correct fields, and no buttons", async () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantDetailsPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//         expect(screen.getByText("Freebirds")).toBeInTheDocument();
//         expect(screen.getByText("Burritos")).toBeInTheDocument();

//         expect(screen.queryByText("Delete")).not.toBeInTheDocument();
//         expect(screen.queryByText("Edit")).not.toBeInTheDocument();
//         expect(screen.queryByText("Details")).not.toBeInTheDocument();
//     });

// });


import { render, screen } from "@testing-library/react";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";
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
            name: "Freebirds",
            description: "Burritos"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RestaurantDetailsPage tests", () => {

    // mock /api/currentUser and /api/systemInfo
    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/restaurant", { params: { id: 3 } }).reply(200, {
            id: 3,
            name: "Freebirds",
            description: "Burritos"
        });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("loads the correct fields, and no buttons", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RestaurantDetailsPage />
                </MemoryRouter>
            </QueryClientProvider>
        );
        expect(screen.getByText("Freebirds")).toBeInTheDocument();
        expect(screen.getByText("Burritos")).toBeInTheDocument();

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
        expect(screen.queryByText("Details")).not.toBeInTheDocument();
    });

});


