
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { attractionUtils }  from 'main/utils/attractionUtils';
import AttractionForm from 'main/components/Attractions/AttractionForm';
import { useNavigate } from 'react-router-dom'


export default function AttractionEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = attractionUtils.getById(id);

    const onSubmit = async (attraction) => {
        const updatedAttraction = attractionUtils.update(attraction);
        console.log("updatedAttraction: " + JSON.stringify(updatedAttraction));
        navigate("/attractions");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Attraction</h1>
                <AttractionForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.attraction}/>
            </div>
        </BasicLayout>
    )
}