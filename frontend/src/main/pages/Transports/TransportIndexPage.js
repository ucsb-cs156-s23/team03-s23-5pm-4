// import React from 'react'
// import Button from 'react-bootstrap/Button';
// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import TransportTable from 'main/components/Transports/TransportTable';
// import { transportUtils } from 'main/utils/transportUtils';
// import { useNavigate, Link } from 'react-router-dom';

// export default function TransportIndexPage() {

//     const navigate = useNavigate();

//     const transportCollection = transportUtils.get();
//     const transports = transportCollection.transports;

//     const showCell = (cell) => JSON.stringify(cell.row.values);

//     const deleteCallback = async (cell) => {
//         console.log(`TransportIndexPage deleteCallback: ${showCell(cell)})`);
//         transportUtils.del(cell.row.values.id);
//         navigate("/transports");
//     }

//     return (
//         <BasicLayout>
//             <div className="pt-2">
//                 <Button style={{ float: "right" }} as={Link} to="/transports/create">
//                     Create Transport
//                 </Button>
//                 <h1>Transports</h1>
//                 <TransportTable transports={transports} deleteCallback={deleteCallback} />
//             </div>
//         </BasicLayout>
//     )
// }

import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import TransportTable from 'main/components/Transports/TransportTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function TransportIndexPage() {

  const currentUser = useCurrentUser();

  const { data: transports, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/transport/all"],
      { method: "GET", url: "/api/transport/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Transports</h1>
        <TransportTable transports={transports} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}