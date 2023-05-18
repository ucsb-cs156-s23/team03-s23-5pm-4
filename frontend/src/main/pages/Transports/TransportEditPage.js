
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import { transportUtils }  from 'main/utils/transportUtils';
import TransportForm from 'main/components/Transports/TransportForm';
import { useNavigate } from 'react-router-dom'


export default function TransportEditPage() {
    let { id } = useParams();

    let navigate = useNavigate(); 

    const response = transportUtils.getById(id);

    const onSubmit = async (transport) => {
        const updatedTransport = transportUtils.update(transport);
        console.log("updatedTransport: " + JSON.stringify(updatedTransport));
        navigate("/transports");
    }  

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Transport</h1>
                <TransportForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={response.transport}/>
            </div>
        </BasicLayout>
    )
}