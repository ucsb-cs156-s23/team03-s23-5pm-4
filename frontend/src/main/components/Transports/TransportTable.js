// import React from "react";
// import OurTable, { ButtonColumn } from "main/components/OurTable";
// import { useNavigate } from "react-router-dom";
// import { transportUtils } from "main/utils/transportUtils";

// const showCell = (cell) => JSON.stringify(cell.row.values);


// const defaultDeleteCallback = async (cell) => {
//     console.log(`deleteCallback: ${showCell(cell)})`);
//     transportUtils.del(cell.row.values.id);
// }

// export default function TransportTable({
//     transports,
//     deleteCallback = defaultDeleteCallback,
//     showButtons = true,
//     testIdPrefix = "TransportTable" }) {

//     const navigate = useNavigate();

//     const editCallback = (cell) => {
//         console.log(`editCallback: ${showCell(cell)})`);
//         navigate(`/transports/edit/${cell.row.values.id}`)
//     }

//     const detailsCallback = (cell) => {
//         console.log(`detailsCallback: ${showCell(cell)})`);
//         navigate(`/transports/details/${cell.row.values.id}`)
//     }

//     const columns = [
//         {
//             Header: 'id',
//             accessor: 'id', // accessor is the "key" in the data
//         },

//         {
//             Header: 'Name',
//             accessor: 'name',
//         },
//         {
//             Header: 'Mode',
//             accessor: 'mode',
//         },
//         {
//             Header: 'Cost',
//             accessor: 'cost',
//         }
//     ];

//     const buttonColumns = [
//         ...columns,
//         ButtonColumn("Details", "primary", detailsCallback, testIdPrefix),
//         ButtonColumn("Edit", "primary", editCallback, testIdPrefix),
//         ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
//     ]

//     const columnsToDisplay = showButtons ? buttonColumns : columns;

//     return <OurTable
//         data={transports}
//         columns={columnsToDisplay}
//         testid={testIdPrefix}
//     />;
// };

// export { showCell };

import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/transportUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function TransportTable({
        transports,
        currentUser,
        showButtons = true}) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/transport/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/transport/details/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/transport/all"]
    );
    // Stryker enable all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Mode',
            accessor: 'mode',
        },
        {
            Header: 'Cost',
            accessor: 'cost',
        }
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, "TransportTable"),
        ButtonColumn("Edit", "primary", editCallback, "TransportTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "TransportTable"),
    ]

    const columnsToDisplay = (showButtons && hasRole(currentUser, "ROLE_USER")) ? buttonColumns : columns;

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columnsToDisplay, [columnsToDisplay]);
    const memoizedTransports = React.useMemo(() => transports, [transports]);

    return <OurTable
        data={memoizedTransports}
        columns={memoizedColumns}
        testid={"TransportTable"}
    />;
};