// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import { useParams } from "react-router-dom";
// import TransportTable from 'main/components/Transports/TransportTable';
// import { transportUtils } from 'main/utils/transportUtils';

// export default function TransportDetailsPage() {
//   let { id } = useParams();

//   const response = transportUtils.getById(id);

//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         <h1>Transport Details</h1>
//         <TransportTable transports={[response.transport]} showButtons={false} />
//       </div>
//     </BasicLayout>
//   )
// }



import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import TransportTable from 'main/components/Transports/TransportTable';
import { useBackend } from "main/utils/useBackend";
import { useCurrentUser } from 'main/utils/currentUser'

export default function TransportDetailsPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: transport, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/transport?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/transport`,
        params: {
          id
        }
      }
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Transport Details</h1>
        {
          transport && <TransportTable transports={[transport]} currentUser={currentUser} showButtons={false} />
        }
      </div>
    </BasicLayout>
  )
}