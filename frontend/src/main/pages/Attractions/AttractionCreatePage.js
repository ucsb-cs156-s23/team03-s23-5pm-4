import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import AttractionForm from "main/components/Attractions/AttractionForm";
import { Navigate/*, useNavigate */ } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";
//import { useNavigate } from 'react-router-dom'
//import { attractionUtils } from 'main/utils/attractionUtils';

export default function AttractionCreatePage() {


  const objectToAxiosParams = (attraction) => ({
    url: "/api/attractions/post",
    method: "POST",
    params: {
      name: attraction.name,
      description: attraction.description,
      address: attraction.address
    }
  });

  const onSuccess = (attraction) => {
    toast(`New attractions Created - id: ${attraction.id} name: ${attraction.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/attractions/all"]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/attractions/list" />
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
