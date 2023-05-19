
// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import { useParams } from "react-router-dom";
// import { transportUtils }  from 'main/utils/transportUtils';
// import TransportForm from 'main/components/Transports/TransportForm';
// import { useNavigate } from 'react-router-dom'


// export default function TransportEditPage() {
//     let { id } = useParams();

//     let navigate = useNavigate(); 

//     const response = transportUtils.getById(id);

//     const onSubmit = async (transport) => {
//         const updatedTransport = transportUtils.update(transport);
//         console.log("updatedTransport: " + JSON.stringify(updatedTransport));
//         navigate("/transports");
//     }  

//     return (
//         <BasicLayout>
//             <div className="pt-2">
//                 <h1>Edit Transport</h1>
//                 <TransportForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.transport}/>
//             </div>
//         </BasicLayout>
//     )
// }

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import TransportForm from "main/components/Transports/TransportForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function TransportEditPage() {
  let { id } = useParams();

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


  const objectToAxiosPutParams = (transport) => ({
    url: "/api/transport",
    method: "PUT",
    params: {
      id: transport.id,
    },
    data: {
      name: transport.name,
      mode: transport.mode,
      cost: transport.cost
    }
  });

  const onSuccess = (transport) => {
    toast(`Transport Updated - id: ${transport.id} name: ${transport.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/transport?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/transport/" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Transport</h1>
        {transport &&
          <TransportForm initialContents={transport} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

