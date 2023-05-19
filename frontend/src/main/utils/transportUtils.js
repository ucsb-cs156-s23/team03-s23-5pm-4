// // get transportation services from local storage
// const get = () => {
//     const transportValue = localStorage.getItem("transport");
//     if (transportValue === undefined) {
//         const transportCollection = { nextId: 1, transports: [] }
//         return set(transportCollection);
//     }
//     const transportCollection = JSON.parse(transportValue);
//     if (transportCollection === null) {
//         const transportCollection = { nextId: 1, transports: [] }
//         return set(transportCollection);
//     }
//     return transportCollection;
// };

// const getById = (id) => {
//     if (id === undefined) {
//         return { "error": "id is a required parameter" };
//     }
//     const transportCollection = get();
//     const transports = transportCollection.transports;

//     /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
//     const index = transports.findIndex((r) => r.id == id);
//     if (index === -1) {
//         return { "error": `transportation service with id ${id} not found` };
//     }
//     return { transport: transports[index] };
// }

// // set transportation services in local storage
// const set = (transportCollection) => {
//     localStorage.setItem("transport", JSON.stringify(transportCollection));
//     return transportCollection;
// };

// // add a transportation service to local storage
// const add = (transport) => {
//     const transportCollection = get();
//     transport = { ...transport, id: transportCollection.nextId++ };
//     transportCollection.transports.push(transport);
//     set(transportCollection);
//     return transport;
// };

// // update a transportation service in local storage
// const update = (transport) => {
//     const transportCollection = get();

//     const transports = transportCollection.transports;

//     /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
//     const index = transports.findIndex((r) => r.id == transport.id);
//     if (index === -1) {
//         return { "error": `transportation service with id ${transport.id} not found` };
//     }
//     transports[index] = transport;
//     set(transportCollection);
//     return { transportCollection: transportCollection };
// };

// // delete a transportation service from local storage
// const del = (id) => {
//     if (id === undefined) {
//         return { "error": "id is a required parameter" };
//     }
//     const transportCollection = get();
//     const transports = transportCollection.transports;

//     /* eslint-disable-next-line eqeqeq */ // we really do want == here, not ===
//     const index = transports.findIndex((r) => r.id == id);
//     if (index === -1) {
//         return { "error": `transportation service with id ${id} not found` };
//     }
//     transports.splice(index, 1);
//     set(transportCollection);
//     return { transportCollection: transportCollection };
// };

// const transportUtils = {
//     get,
//     getById,
//     add,
//     update,
//     del
// };

// export { transportUtils };

import { toast } from "react-toastify";

export function onDeleteSuccess(message) {
    console.log(message);
    toast(message);
}

export function cellToAxiosParamsDelete(cell) {
    return {
        url: "/api/transport",
        method: "DELETE",
        params: {
            id: cell.row.values.id
        }
    }
}



