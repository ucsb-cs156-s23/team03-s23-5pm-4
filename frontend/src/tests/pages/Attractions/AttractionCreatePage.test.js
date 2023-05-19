import { render, waitFor, fireEvent } from "@testing-library/react";
import AttractionCreatePage from "main/pages/Attractions/AttractionCreatePage";
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

describe("AttractionCreatePage tests", () => {

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
                    <AttractionCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const attraction = {
            id: 17,
            name: "Inkstriker",
            description: "kart",
            address: "1000"
        };

        axiosMock.onPost("/api/attractions/post").reply( 202, attraction );

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AttractionCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(getByTestId("AttractionForm-address")).toBeInTheDocument();
        });

        const addressField = getByTestId("AttractionForm-address");
        const nameField = getByTestId("AttractionForm-name");
        const descriptionField = getByTestId("AttractionForm-description");
        const submitButton = getByTestId("AttractionForm-submit");

        fireEvent.change(addressField, { target: { value: '1000' } });
        fireEvent.change(nameField, { target: { value: 'Inkstriker' } });
        fireEvent.change(descriptionField, { target: { value: 'kart' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "name": "Inkstriker",
            "description": "kart",
            "address": "1000"
        });

        expect(mockToast).toBeCalledWith("New attractions Created - id: 17 name: Inkstriker");
        expect(mockNavigate).toBeCalledWith({ "to": "/attractions/" });
    });


});