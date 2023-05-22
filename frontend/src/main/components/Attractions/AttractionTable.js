import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/attractionUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function AttractionTable({
        attractions,
        currentUser,
        showButtons = true}) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/attractions/edit/${cell.row.values.id}`)
    }

    const detailsCallback = (cell) => {
        navigate(`/attractions/details/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/attractions/all"]
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
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Address',
            accessor: 'address',
        }
    ];

    const buttonColumns = [
        ...columns,
        ButtonColumn("Details", "primary", detailsCallback, "AttractionTable"),
        ButtonColumn("Edit", "primary", editCallback, "AttractionTable"),
        ButtonColumn("Delete", "danger", deleteCallback, "AttractionTable"),
    ]

    const columnsToDisplay = (showButtons && hasRole(currentUser, "ROLE_USER")) ? buttonColumns : columns;

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columnsToDisplay, [columnsToDisplay]);
    const memoizedAttractions = React.useMemo(() => attractions, [attractions]);

    return <OurTable
        data={memoizedAttractions}
        columns={memoizedColumns}
        testid={"AttractionTable"}
    />;
};