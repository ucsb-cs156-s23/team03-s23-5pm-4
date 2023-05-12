import React from 'react'
import Button from 'react-bootstrap/Button';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import AttractionTable from 'main/components/Attractions/AttractionTable';
import { attractionUtils } from 'main/utils/attractionUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function AttractionIndexPage() {

    const navigate = useNavigate();

    const attractionCollection = attractionUtils.get();
    const attractions = attractionCollection.attractions;

    const showCell = (cell) => JSON.stringify(cell.row.values);

    const deleteCallback = async (cell) => {
        console.log(`AttractionIndexPage deleteCallback: ${showCell(cell)})`);
        attractionUtils.del(cell.row.values.id);
        navigate("/attractions");
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <Button style={{ float: "right" }} as={Link} to="/attractions/create">
                    Create Attraction
                </Button>
                <h1>Attractions</h1>
                <AttractionTable attractions={attractions} deleteCallback={deleteCallback} />
            </div>
        </BasicLayout>
    )
}