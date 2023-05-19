import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import AttractionForm from "main/components/Attractions/AttractionForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";


export default function AttractionEditPage() {
    let { id } = useParams();

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

    const objectToAxiosPutParams = (attraction) => ({
        url: "/api/attractions",
        method: "PUT",
        params: {
          id: attraction.id,
        },
        data: {
          name: attraction.name,
          address: attraction.address,
          description: attraction.description
        }
      });
      const onSuccess = (attraction) => {
        toast(`Attraction Updated - id: ${attraction.id} name: ${attraction.name}`);
      }
    
      const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/attractions?id=${id}`]
      );
    
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
            <h1>Edit Attraction</h1>
            {attraction &&
              <AttractionForm initialAttraction={attraction} submitAction={onSubmit} buttonLabel="Update" />
            }
          </div>
        </BasicLayout>
      )
}

// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import { useParams } from "react-router-dom";
// import { attractionUtils }  from 'main/utils/attractionUtils';
// import AttractionForm from 'main/components/Attractions/AttractionForm';
// import { useNavigate } from 'react-router-dom'


// export default function AttractionEditPage() {
//     let { id } = useParams();

//     let navigate = useNavigate(); 

//     const response = attractionUtils.getById(id);

//     const onSubmit = async (attraction) => {
//         const updatedAttraction = attractionUtils.update(attraction);
//         console.log("updatedAttraction: " + JSON.stringify(updatedAttraction));
//         navigate("/attractions");
//     }  

//     return (
//         <BasicLayout>
//             <div className="pt-2">
//                 <h1>Edit Attraction</h1>
//                 <AttractionForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.attraction}/>
//             </div>
//         </BasicLayout>
//     )
// }