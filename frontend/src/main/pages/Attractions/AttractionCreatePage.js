import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import AttractionForm from "main/components/Attractions/AttractionForm";
import { useNavigate } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

//import { attractionUtils } from 'main/utils/attractionUtils';

export default function AttractionCreatePage() {

  const objectToAxiosParams = (attractions) => ({
    url: "/api/attractions/post",
    method: "POST",
    params: {
      name: attractions.name,
      address: attractions.address,
      description: attractions.description
    }
  });

  const onSuccess = (attractions) => {
    toast(`New attraction Created - id: ${attractions.id} name: ${attractions.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/attractions/all"]
     );

  let navigate = useNavigate(); 

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  } 

  if (isSuccess) {
    return <Navigate to="/attractions/" />
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
