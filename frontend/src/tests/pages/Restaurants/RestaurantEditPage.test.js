// import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
// import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
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
// jest.mock('main/utils/restaurantUtils', () => {
//     return {
//         __esModule: true,
//         restaurantUtils: {
//             update: (_restaurant) => {return mockUpdate();},
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


// describe("RestaurantEditPage tests", () => {

//     const queryClient = new QueryClient();

//     test("renders without crashing", () => {
//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantEditPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );
//     });

//     test("loads the correct fields", async () => {

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantEditPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         );

//         expect(screen.getByTestId("RestaurantForm-name")).toBeInTheDocument();
//         expect(screen.getByDisplayValue('Freebirds')).toBeInTheDocument();
//         expect(screen.getByDisplayValue('Burritos')).toBeInTheDocument();
//     });

//     test("redirects to /restaurants on submit", async () => {

//         const restoreConsole = mockConsole();

//         mockUpdate.mockReturnValue({
//             "restaurant": {
//                 id: 3,
//                 name: "South Coast Deli (Goleta)",
//                 description: "Sandwiches, Salads and more"
//             }
//         });

//         render(
//             <QueryClientProvider client={queryClient}>
//                 <MemoryRouter>
//                     <RestaurantEditPage />
//                 </MemoryRouter>
//             </QueryClientProvider>
//         )

//         const nameInput = screen.getByLabelText("Name");
//         expect(nameInput).toBeInTheDocument();


//         const descriptionInput = screen.getByLabelText("Description");
//         expect(descriptionInput).toBeInTheDocument();

//         const updateButton = screen.getByText("Update");
//         expect(updateButton).toBeInTheDocument();

        
//         fireEvent.change(nameInput, { target: { value: 'South Coast Deli (Goleta)' } })
//         fireEvent.change(descriptionInput, { target: { value: 'Sandwiches, Salads and more' } })
//         fireEvent.click(updateButton);
        

//         await waitFor(() => expect(mockUpdate).toHaveBeenCalled());
//         await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/restaurants"));

//         // assert - check that the console.log was called with the expected message
//         expect(console.log).toHaveBeenCalled();
//         const message = console.log.mock.calls[0][0];
//         const expectedMessage =  `updatedRestaurant: {"restaurant":{"id":3,"name":"South Coast Deli (Goleta)","description":"Sandwiches, Salads and more"}`

//         expect(message).toMatch(expectedMessage);
//         restoreConsole();

//     });

// });



import { fireEvent, /* queryByTestId, */ render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

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

describe("RestaurantEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/restaurant", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {getByText, queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Restaurant");
            expect(queryByTestId("RestaurantForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/restaurant", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "Freebirds",
                description: "Burritos"
            });
            axiosMock.onPut('/api/restaurant').reply(200, {
                id: "17",
                name: "South Coast Deli (Goleta)",
                description: "Sandwiches, Salads and more"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const descriptionField = getByTestId("RestaurantForm-description");
            const submitButton = getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Freebirds");
            expect(descriptionField).toHaveValue("Burritos");
        });

        test("Changes when you click Update", async () => {



            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RestaurantEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RestaurantForm-name");

            const idField = getByTestId("RestaurantForm-id");
            const nameField = getByTestId("RestaurantForm-name");
            const descriptionField = getByTestId("RestaurantForm-description");
            const submitButton = getByTestId("RestaurantForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("Freebirds");
            expect(descriptionField).toHaveValue("Burritos");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: "South Coast Deli (Goleta)" } })
            fireEvent.change(descriptionField, { target: { value: "Sandwiches, Salads and more" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled);
            expect(mockToast).toBeCalledWith("Restaurant Updated - id: 17 name: South Coast Deli (Goleta)");
            expect(mockNavigate).toBeCalledWith({ "to": "/restaurants" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "South Coast Deli (Goleta)",
                description: "Sandwiches, Salads and more"
            })); // posted object

        });

       
    });
});
