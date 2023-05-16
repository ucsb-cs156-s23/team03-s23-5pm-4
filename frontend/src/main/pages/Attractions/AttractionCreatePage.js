import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import AttractionForm from "main/components/Attractions/AttractionForm";
import { useNavigate } from 'react-router-dom'
import { attractionUtils } from 'main/utils/attractionUtils';

export default function AttractionCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (attraction) => {
    const createdAttraction = attractionUtils.add(attraction);
    console.log("createdAttraction: " + JSON.stringify(createdAttraction));
    navigate("/attractions");
  }  

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Attraction</h1>
        <AttractionForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
