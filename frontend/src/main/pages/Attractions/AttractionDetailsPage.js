import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import AttractionTable from "main/components/Attractions/AttractionTable";
import { useBackend } from "main/utils/useBackend";

import { useCurrentUser } from 'main/utils/currentUser'

export default function AttractionDetailsPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: attraction, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/attractions?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/attractions`,
        params: {
          id
        }
      }
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Attraction Details</h1>
        {
          attraction && <AttractionTable attractions={[attraction]} currentUser={currentUser} showButtons={false} />
        }
      </div>
    </BasicLayout>
  )
}