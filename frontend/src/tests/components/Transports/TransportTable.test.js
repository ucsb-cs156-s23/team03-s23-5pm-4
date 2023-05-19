// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import { MemoryRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "react-query";
// import TransportTable, { showCell } from "main/components/Transports/TransportTable";
// import { transportFixtures } from "fixtures/transportFixtures";
// import mockConsole from "jest-mock-console";

// const mockedNavigate = jest.fn();

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockedNavigate
// }));

// describe("TransportTable tests", () => {
//   const queryClient = new QueryClient();

//   const expectedHeaders = ["id", "Name", "Mode", "Cost"];
//   const expectedFields = ["id", "name", "mode", "cost"];
//   const testId = "TransportTable";

//   test("showCell function works properly", () => {
//     const cell = {
//       row: {
//         values: { a: 1, b: 2, c: 3 }
//       },
//     };
//     expect(showCell(cell)).toBe(`{"a":1,"b":2,"c":3}`);
//   });

//   test("renders without crashing for empty table", () => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <TransportTable transports={[]} />
//         </MemoryRouter>
//       </QueryClientProvider>
//     );
//   });



//   test("Has the expected column headers, content and buttons", () => {

//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <TransportTable transports={transportFixtures.threeTransports} />
//         </MemoryRouter>
//       </QueryClientProvider>
//     );

//     expectedHeaders.forEach((headerText) => {
//       const header = screen.getByText(headerText);
//       expect(header).toBeInTheDocument();
//     });

//     expectedFields.forEach((field) => {
//       const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
//       expect(header).toBeInTheDocument();
//     });

//     expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
//     expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Biddybuggy");

//     expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
//     expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Inkstriker");

//     const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
//     expect(detailsButton).toBeInTheDocument();
//     expect(detailsButton).toHaveClass("btn-primary");

//     const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
//     expect(editButton).toBeInTheDocument();
//     expect(editButton).toHaveClass("btn-primary");

//     const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
//     expect(deleteButton).toBeInTheDocument();
//     expect(deleteButton).toHaveClass("btn-danger");

//   });

//   test("Has the expected column headers, content and no buttons when showButtons=false", () => {

//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <TransportTable transports={transportFixtures.threeTransports} showButtons={false} />
//         </MemoryRouter>
//       </QueryClientProvider>
//     );

//     expectedHeaders.forEach((headerText) => {
//       const header = screen.getByText(headerText);
//       expect(header).toBeInTheDocument();
//     });

//     expectedFields.forEach((field) => {
//       const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
//       expect(header).toBeInTheDocument();
//     });

//     expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
//     expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Biddybuggy");

//     expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
//     expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Inkstriker");

//     expect(screen.queryByText("Delete")).not.toBeInTheDocument();
//     expect(screen.queryByText("Edit")).not.toBeInTheDocument();
//     expect(screen.queryByText("Details")).not.toBeInTheDocument();
//   });


//   test("Edit button navigates to the edit page", async () => {
//     // arrange
//     const restoreConsole = mockConsole();

//     // act - render the component
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <TransportTable transports={transportFixtures.threeTransports} />
//         </MemoryRouter>
//       </QueryClientProvider>
//     );

//     // assert - check that the expected content is rendered
//     expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
//     expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Biddybuggy");

//     const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
//     expect(editButton).toBeInTheDocument();

//     // act - click the edit button
//     fireEvent.click(editButton);

//     // assert - check that the navigate function was called with the expected path
//     await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/transports/edit/2'));

//     // assert - check that the console.log was called with the expected message
//     expect(console.log).toHaveBeenCalled();
//     const message = console.log.mock.calls[0][0];
//     const expectedMessage = `editCallback: {"id":2,"name":"Biddybuggy","mode":"kart","cost":"1000"})`;
//     expect(message).toMatch(expectedMessage);
//     restoreConsole();
//   });

//   test("Details button navigates to the details page", async () => {
//     // arrange
//     const restoreConsole = mockConsole();

//     // act - render the component
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <TransportTable transports={transportFixtures.threeTransports} />
//         </MemoryRouter>
//       </QueryClientProvider>
//     );

//     // assert - check that the expected content is rendered
//     expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
//     expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Biddybuggy");

//     const detailsButton = screen.getByTestId(`${testId}-cell-row-0-col-Details-button`);
//     expect(detailsButton).toBeInTheDocument();

//     // act - click the details button
//     fireEvent.click(detailsButton);

//     // assert - check that the navigate function was called with the expected path
//     await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/transports/details/2'));

//     // assert - check that the console.log was called with the expected message
//     expect(console.log).toHaveBeenCalled();
//     const message = console.log.mock.calls[0][0];
//     const expectedMessage = `detailsCallback: {"id":2,"name":"Biddybuggy","mode":"kart","cost":"1000"})`;
//     expect(message).toMatch(expectedMessage);
//     restoreConsole();
//   });

//   test("Delete button calls delete callback", async () => {
//     // arrange
//     const restoreConsole = mockConsole();

//     // act - render the component
//     render(
//       <QueryClientProvider client={queryClient}>
//         <MemoryRouter>
//           <TransportTable transports={transportFixtures.threeTransports} />
//         </MemoryRouter>
//       </QueryClientProvider>
//     );

//     // assert - check that the expected content is rendered
//     expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
//     expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Biddybuggy");

//     const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
//     expect(deleteButton).toBeInTheDocument();

//      // act - click the delete button
//     fireEvent.click(deleteButton);

//      // assert - check that the console.log was called with the expected message
//      await(waitFor(() => expect(console.log).toHaveBeenCalled()));
//      const message = console.log.mock.calls[0][0];
//      const expectedMessage = `deleteCallback: {"id":2,"name":"Biddybuggy","mode":"kart","cost":"1000"})`;
//      expect(message).toMatch(expectedMessage);
//      restoreConsole();
//   });
// });

import { fireEvent, render, waitFor } from "@testing-library/react";
import { transportFixtures } from "fixtures/transportFixtures";
import TransportTable from "main/components/Transports/TransportTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("TransportTable tests", () => {
  const queryClient = new QueryClient();


  test("renders without crashing for empty table with user not logged in", () => {
    const currentUser = null;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransportTable transports={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });
  test("renders without crashing for empty table for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransportTable transports={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("renders without crashing for empty table for admin", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransportTable transports={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );
  });

  test("Has the expected column headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransportTable transports={transportFixtures.threeTransports} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Name", "Mode", "Cost"];
    const expectedFields = ["id", "name", "mode", "cost"];
    const testId = "TransportTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");

    const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers and content for ordinary User", () => {

    const currentUser = currentUserFixtures.userOnly;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransportTable transports={transportFixtures.threeTransports} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Name", "Mode", "Cost"];
    const expectedFields = ["id", "name", "mode", "cost"];
    const testId = "TransportTable";

    expectedHeaders.forEach((headerText) => {
      const header = getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");

    const editButton = getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransportTable transports={transportFixtures.threeTransports} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`TransportTable-cell-row-0-col-id`)).toHaveTextContent("2"); });

    const editButton = getByTestId(`TransportTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/transport/edit/2'));

  });

  test("Edit button navigates to the edit page for ordinary user", async () => {

    const currentUser = currentUserFixtures.userOnly;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransportTable transports={transportFixtures.threeTransports} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`TransportTable-cell-row-0-col-id`)).toHaveTextContent("2"); });

    const editButton = getByTestId(`TransportTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/transport/edit/2'));

  });

  test("Details button navigates to the details page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransportTable transports={transportFixtures.threeTransports} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`TransportTable-cell-row-0-col-id`)).toHaveTextContent("2"); });

    const detailsButton = getByTestId(`TransportTable-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();
    
    fireEvent.click(detailsButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/transport/details/2'));

  });

  test("Details button navigates to the details page for ordinary user", async () => {

    const currentUser = currentUserFixtures.userOnly;

    const { getByText, getByTestId } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <TransportTable transports={transportFixtures.threeTransports} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(getByTestId(`TransportTable-cell-row-0-col-id`)).toHaveTextContent("2"); });

    const detailsButton = getByTestId(`TransportTable-cell-row-0-col-Details-button`);
    expect(detailsButton).toBeInTheDocument();
    
    fireEvent.click(detailsButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/transport/details/2'));

  });

});

