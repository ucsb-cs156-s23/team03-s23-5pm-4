import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import TransportForm from "main/components/Transports/TransportForm";
import { useNavigate } from 'react-router-dom'
import { transportUtils } from 'main/utils/transportUtils';

export default function TransportCreatePage() {

  let navigate = useNavigate(); 

  const onSubmit = async (transport) => {
    const createdTransport = transportUtils.add(transport);
    console.log("createdTransport: " + JSON.stringify(createdTransport));
    navigate("/transports");
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
