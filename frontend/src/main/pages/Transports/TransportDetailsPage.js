import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import TransportTable from 'main/components/Transports/TransportTable';
import { transportUtils } from 'main/utils/transportUtils';

export default function TransportDetailsPage() {
  let { id } = useParams();

  const response = transportUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Transport Details</h1>
        <TransportTable transports={[response.transport]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
