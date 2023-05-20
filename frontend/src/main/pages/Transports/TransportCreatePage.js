import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import TransportForm from "main/components/Transports/TransportForm";
import { Navigate/*, useNavigate */ } from 'react-router-dom'
// import { transportUtils } from 'main/utils/transportUtils';
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function TransportCreatePage() {

  const objectToAxiosParams = (transport) => ({
    url: "/api/transport/post",
    method: "POST",
    params: {
      name: transport.name,
      mode: transport.mode,
      cost: transport.cost
    }
  });

  const onSuccess = (transport) => {
    toast(`New transport Created - id: ${transport.id} name: ${transport.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/transport/all"]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/transport" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Transport</h1>
        <TransportForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
