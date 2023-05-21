import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/restaurantUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function RestaurantTable({ restaurants, currentUser, showButtons = true}) {

    const navigate = useNavigate();
 
    const editCallback = (cell) => {
        navigate(`/restaurants/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/restaurants/details/${cell.row.values.id}`)
    }

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        []                                  //  was previously ["/api/restaurant/all"] but page refetches either way.
    );

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
            Header: 'Description',
            accessor: 'description',
        }
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, "RestaurantTable"),
        ButtonColumn("Edit", "primary", editCallback, "RestaurantTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "RestaurantTable")
    ]

    const columnsToDisplay = (showButtons && hasRole(currentUser, "ROLE_USER")) ? buttonColumns : columns;

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columnsToDisplay, [columnsToDisplay]);
    const memoizedRestaurants = React.useMemo(() => restaurants, [restaurants]);


    return <OurTable
        data={memoizedRestaurants}
        columns={memoizedColumns}
        testid={"RestaurantTable"}
    />;
};