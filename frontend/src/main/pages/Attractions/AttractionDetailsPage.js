import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import AttractionTable from 'main/components/Attractions/AttractionTable';
import { attractionUtils } from 'main/utils/attractionUtils';

export default function AttractionDetailsPage() {
  let { id } = useParams();

  const response = attractionUtils.getById(id);

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Attraction Details</h1>
        <AttractionTable attractions={[response.attraction]} showButtons={false} />
      </div>
    </BasicLayout>
  )
}
